import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma, BookingStatus, PaymentStatus } from "@/lib/prisma";
import {
  generateTicketToken,
  generateBookingRef,
} from "@/lib/utils";

// ============================================================
// RAZORPAY / PAYMENT SERVICE
// ============================================================

const PAYMENT_MODE = process.env.PAYMENT_MODE || "demo";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Validate the payment mode is safe
 */
export function validatePaymentMode(): void {
  if (IS_PRODUCTION && PAYMENT_MODE === "demo") {
    console.error(
      "⚠️  CRITICAL: PAYMENT_MODE=demo in production! Real payments will NOT be processed."
    );
  }
}

export function isDemoMode(): boolean {
  return PAYMENT_MODE === "demo";
}

/**
 * Create a Razorpay order via their API
 */
export async function createRazorpayOrder(params: {
  amountInPaise: number;
  bookingRef: string;
  notes?: Record<string, string>;
}): Promise<{
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amountInPaise,
      currency: "INR",
      receipt: params.bookingRef,
      notes: {
        booking_ref: params.bookingRef,
        ...params.notes,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Razorpay order creation failed: ${error}`);
  }

  const order = await response.json();
  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
  };
}

/**
 * Verify Razorpay payment signature server-side
 */
export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf8"),
      Buffer.from(params.signature, "utf8")
    );
  } catch {
    return false;
  }
}

/**
 * Verify Razorpay webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}

// ============================================================
// BOOKING CREATION
// ============================================================

export interface CreateBookingParams {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity?: string;
  attendeeNames?: string[];
}

export interface CreateBookingResult {
  bookingId: string;
  bookingRef: string;
  totalInPaise: number;
}

export async function createBooking(
  params: CreateBookingParams
): Promise<CreateBookingResult> {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Fetch ticket type
    const ticketType = await tx.ticketType.findUnique({
      where: { id: params.ticketTypeId },
      include: { event: true },
    });

    if (!ticketType) {
      throw new Error("Ticket type not found");
    }

    if (!ticketType.isActive) {
      throw new Error("Ticket sales are currently closed");
    }

    if (ticketType.eventId !== params.eventId) {
      throw new Error("Invalid ticket type for this event");
    }

    const now = new Date();
    if (ticketType.salesStart && now < ticketType.salesStart) {
      throw new Error("Ticket sales have not started yet");
    }
    if (ticketType.salesEnd && now > ticketType.salesEnd) {
      throw new Error("Ticket sales have ended");
    }

    if (params.quantity > ticketType.maxPerOrder) {
      throw new Error(`Maximum ${ticketType.maxPerOrder} tickets per order`);
    }

    // 2. Count existing sold tickets (CONFIRMED bookings)
    const soldCount = await tx.bookingItem.aggregate({
      where: {
        ticketTypeId: params.ticketTypeId,
        booking: { status: BookingStatus.CONFIRMED },
      },
      _sum: { quantity: true },
    });

    const currentSold = soldCount._sum.quantity || 0;
    const available = ticketType.capacity - currentSold;

    if (available < params.quantity) {
      if (available <= 0) {
        throw new Error("SOLD_OUT");
      }
      throw new Error(`Only ${available} tickets remaining`);
    }

    // 3. Calculate subtotal & grandTotal in paise
    const subtotal = ticketType.price * params.quantity;
    const platformFee = 0;
    const grandTotal = subtotal + platformFee;

    // 4. Generate unique booking reference
    let bookingRef = generateBookingRef();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await tx.booking.findUnique({
        where: { bookingRef },
      });
      if (!existing) break;
      bookingRef = generateBookingRef();
      attempts++;
    }

    // 5. Create booking record
    const booking = await tx.booking.create({
      data: {
        bookingRef,
        eventId: params.eventId,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        customerPhone: params.customerPhone,
        customerCity: params.customerCity,
        totalAmount: subtotal,
        platformFee,
        grandTotal,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMode: isDemoMode() ? "demo" : "razorpay",
        bookingItems: {
          create: {
            ticketTypeId: params.ticketTypeId,
            quantity: params.quantity,
            unitPrice: ticketType.price,
            subtotal,
            attendeeNames: params.attendeeNames
              ? { names: params.attendeeNames }
              : undefined,
          },
        },
      },
    });

    // 6. Create pending payment record
    await tx.payment.create({
      data: {
        bookingId: booking.id,
        amount: grandTotal,
        paymentMode: isDemoMode() ? "demo" : "razorpay",
        status: PaymentStatus.PENDING,
      },
    });

    return {
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
      totalInPaise: grandTotal,
    };
  });
}

// ============================================================
// CONFIRM BOOKING
// ============================================================

export async function confirmBooking(params: {
  bookingId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  isDemoPayment?: boolean;
}): Promise<{ success: boolean; tickets: string[] }> {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const booking = await tx.booking.findUnique({
      where: { id: params.bookingId },
      include: {
        payment: true,
        bookingItems: { include: { ticketType: true } },
        event: true,
      },
    });

    if (!booking) throw new Error("Booking not found");
    if (booking.status === BookingStatus.CONFIRMED) {
      const tickets = await tx.ticket.findMany({
        where: { bookingId: booking.id },
      });
      return { success: true, tickets: tickets.map((t: { token: string }) => t.token) };
    }
    if (booking.status !== BookingStatus.PENDING) {
      throw new Error(`Cannot confirm booking in status: ${booking.status}`);
    }

    // Update booking status to CONFIRMED and paymentStatus to PAID
    await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        razorpayOrderId: params.razorpayOrderId,
        razorpayPaymentId: params.razorpayPaymentId,
        razorpaySignature: params.razorpaySignature,
        confirmedAt: new Date(),
      },
    });

    // Update payment record
    await tx.payment.update({
      where: { bookingId: booking.id },
      data: {
        status: PaymentStatus.PAID,
        razorpayOrderId: params.razorpayOrderId,
        razorpayPaymentId: params.razorpayPaymentId,
        razorpaySignature: params.razorpaySignature,
        webhookVerified: !params.isDemoPayment,
      },
    });

    // Generate tickets (one ticket token per quantity or item)
    const ticketTokens: string[] = [];
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    for (const item of booking.bookingItems) {
      for (let i = 0; i < item.quantity; i++) {
        const token = generateTicketToken();
        const verifyUrl = `${baseUrl}/verify/${token}`;

        await tx.ticket.create({
          data: {
            bookingId: booking.id,
            token,
            qrData: verifyUrl,
            isValid: true,
            checkedIn: false,
          },
        });

        ticketTokens.push(token);
      }
    }

    return { success: true, tickets: ticketTokens };
  });
}

// ============================================================
// TICKET VERIFICATION (QR Scanner)
// ============================================================

export interface VerifyTicketResult {
  valid: boolean;
  status: "SUCCESS" | "ALREADY_USED" | "INVALID" | "CANCELLED" | "NOT_FOUND";
  message: string;
  ticketInfo?: {
    bookingRef: string;
    customerName: string;
    ticketType: string;
    quantity: number;
    checkedInAt?: Date;
  };
}

export async function verifyAndCheckInTicket(
  token: string,
  adminId?: string
): Promise<VerifyTicketResult> {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const ticket = await tx.ticket.findUnique({
      where: { token },
      include: {
        booking: {
          include: {
            bookingItems: { include: { ticketType: true } },
          },
        },
      },
    });

    if (!ticket) {
      return {
        valid: false,
        status: "NOT_FOUND",
        message: "Ticket not found. Invalid QR code.",
      };
    }

    const booking = ticket.booking;
    const ticketItem = booking.bookingItems[0];

    const baseInfo = {
      bookingRef: booking.bookingRef,
      customerName: booking.customerName,
      ticketType: ticketItem?.ticketType.name || "Unknown",
      quantity: ticketItem?.quantity || 1,
    };

    if (booking.status !== BookingStatus.CONFIRMED || booking.paymentStatus !== PaymentStatus.PAID) {
      await tx.ticketScan.create({
        data: {
          ticketId: ticket.id,
          adminId: adminId || null,
          result: "CANCELLED",
          deviceInfo: `Booking status: ${booking.status}`,
        },
      });
      return {
        valid: false,
        status: "CANCELLED",
        message: `Booking is ${booking.status}. Entry not permitted.`,
        ticketInfo: baseInfo,
      };
    }

    if (ticket.checkedIn) {
      await tx.ticketScan.create({
        data: {
          ticketId: ticket.id,
          adminId: adminId || null,
          result: "ALREADY_USED",
        },
      });
      return {
        valid: false,
        status: "ALREADY_USED",
        message: "This ticket has already been used for entry.",
        ticketInfo: { ...baseInfo, checkedInAt: ticket.checkedInAt || undefined },
      };
    }

    if (!ticket.isValid) {
      await tx.ticketScan.create({
        data: {
          ticketId: ticket.id,
          adminId: adminId || null,
          result: "CANCELLED",
        },
      });
      return {
        valid: false,
        status: "CANCELLED",
        message: "This ticket is not valid for entry.",
        ticketInfo: baseInfo,
      };
    }

    // SUCCESS — mark as checkedIn
    const checkedInAt = new Date();
    await tx.ticket.update({
      where: { id: ticket.id },
      data: {
        checkedIn: true,
        checkedInAt,
      },
    });

    await tx.ticketScan.create({
      data: {
        ticketId: ticket.id,
        adminId: adminId || null,
        result: "SUCCESS",
      },
    });

    return {
      valid: true,
      status: "SUCCESS",
      message: "Entry allowed!",
      ticketInfo: { ...baseInfo, checkedInAt },
    };
  });
}
