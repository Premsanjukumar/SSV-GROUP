import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma, BookingStatus, PaymentStatus, CouponType, CouponStatus } from "@/lib/prisma";
import { generateTicketToken, generateBookingRef } from "@/lib/utils";
import { validateCoupon } from "@/services/coupon";
import { generateCouponCode } from "@/services/digitalCoupon";

// ============================================================
// CANONICAL PAYMENT & BOOKING SERVICE
// Authoritative service for Razorpay integration, booking
// state transitions, and ticket issuance.
// ============================================================

export const PAYMENT_MODES = {
  DEMO: "demo",
  RAZORPAY: "razorpay",
} as const;

export type PaymentModeType = (typeof PAYMENT_MODES)[keyof typeof PAYMENT_MODES];

/**
 * Returns current payment mode.
 * In production, default must be razorpay.
 */
export function getPaymentMode(): PaymentModeType {
  const envMode = process.env.PAYMENT_MODE?.toLowerCase();
  if (process.env.NODE_ENV === "production") {
    return envMode === "razorpay" ? "razorpay" : "razorpay";
  }
  return envMode === "razorpay" ? "razorpay" : "demo";
}

/**
 * Validates whether demo payments are allowed in the current environment.
 */
export function isDemoPaymentAllowed(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }
  return (process.env.PAYMENT_MODE || "demo") === "demo";
}

// ============================================================
// RAZORPAY API INTEGRATION
// ============================================================

export interface CreateOrderParams {
  amountInPaise: number;
  bookingRef: string;
  currency?: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

/**
 * Creates an authoritative Razorpay order on Razorpay servers.
 * Amount MUST be calculated on the server in integer paise.
 */
export async function createRazorpayOrder(
  params: CreateOrderParams
): Promise<CreateOrderResult> {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured on the server");
  }

  if (!params.amountInPaise || params.amountInPaise <= 0) {
    throw new Error("Invalid order amount: must be greater than 0");
  }

  const currency = params.currency || "INR";
  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(params.amountInPaise),
      currency,
      receipt: params.bookingRef,
      notes: {
        booking_ref: params.bookingRef,
        ...params.notes,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Razorpay API Error]", response.status, errorText);
    throw new Error(`Razorpay order creation failed: ${response.statusText}`);
  }

  const orderData = await response.json();

  return {
    orderId: orderData.id,
    amount: orderData.amount,
    currency: orderData.currency,
    keyId,
  };
}

/**
 * Timing-safe HMAC SHA-256 verification of Razorpay checkout signature.
 * Verifies: HMAC_SHA256(orderId + "|" + paymentId, keySecret) === signature
 */
export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret?: string;
}): boolean {
  const secret = params.secret || process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !params.orderId || !params.paymentId || !params.signature) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${params.orderId}|${params.paymentId}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const providedBuffer = Buffer.from(params.signature, "utf8");

    if (expectedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
  } catch {
    return false;
  }
}

/**
 * Timing-safe HMAC SHA-256 verification of Razorpay webhook signature.
 * Verifies: HMAC_SHA256(rawRequestBody, webhookSecret) === signature
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret?: string
): boolean {
  const secret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !rawBody || !signature) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const providedBuffer = Buffer.from(signature, "utf8");

    if (expectedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
  } catch {
    return false;
  }
}

// ============================================================
// TRANSACTIONAL BOOKING CREATION
// ============================================================

export interface CreateBookingInput {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity?: string;
  attendeeNames?: string[];
  ipAddress?: string;
  userAgent?: string;
  whatsappOptIn?: boolean;
  shoppingBenefitOptIn?: boolean;
  couponCode?: string;
}

export interface CreateBookingOutput {
  bookingId: string;
  bookingRef: string;
  totalInPaise: number;
  ticketTypeName: string;
  unitPrice: number;
}

/**
 * Creates a pending booking and pending payment record within a database transaction.
 * Validates capacity, ticket availability, and calculates amount strictly from database.
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingOutput> {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Fetch ticket type and event from database
    let ticketType = await tx.ticketType.findUnique({
      where: { id: input.ticketTypeId },
      include: { event: true },
    });

    // Resilient lookup if client submitted a fallback slug (e.g., couple-pass-default or single-pass-default)
    if (!ticketType) {
      const isSingle = input.ticketTypeId.toLowerCase().includes("single");
      const isCouple = input.ticketTypeId.toLowerCase().includes("couple");
      if (isSingle || isCouple) {
        ticketType = await tx.ticketType.findFirst({
          where: {
            name: { contains: isSingle ? "Single" : "Couple", mode: "insensitive" },
            isActive: true,
          },
          include: { event: true },
        });
      }
    }

    if (!ticketType) {
      throw new Error("Ticket type not found");
    }

    if (!ticketType.isActive || !ticketType.event.isPublished) {
      throw new Error("Ticket sales are currently not available for this event");
    }

    const now = new Date();
    if (ticketType.salesStart && now < ticketType.salesStart) {
      throw new Error("Ticket sales have not opened yet");
    }
    if (ticketType.salesEnd && now > ticketType.salesEnd) {
      throw new Error("Ticket sales have closed");
    }

    if (input.quantity <= 0) {
      throw new Error("Quantity must be at least 1");
    }

    if (input.quantity > ticketType.maxPerOrder) {
      throw new Error(`Maximum ${ticketType.maxPerOrder} tickets allowed per booking`);
    }

    // 2. Atomic capacity check
    const soldAggregate = await tx.bookingItem.aggregate({
      where: {
        ticketTypeId: input.ticketTypeId,
        booking: { status: BookingStatus.CONFIRMED },
      },
      _sum: { quantity: true },
    });

    const currentSold = soldAggregate._sum.quantity || 0;
    const available = ticketType.capacity - currentSold;

    if (available < input.quantity) {
      if (available <= 0) {
        throw new Error("SOLD_OUT");
      }
      throw new Error(`Only ${available} tickets remaining`);
    }

    // 3. Server-side price calculation (NEVER trust frontend price)
    const unitPrice = ticketType.price;
    const subtotal = unitPrice * input.quantity;
    const platformFee = 0;

    let discountInPaise = 0;
    let couponNote: string | undefined = undefined;

    if (input.couponCode) {
      const couponValidation = validateCoupon({
        couponCode: input.couponCode,
        ticketTypeId: ticketType.id,
        ticketTypeName: ticketType.name,
        ticketPriceInPaise: unitPrice,
        quantity: input.quantity,
        isFemaleOnly: ticketType.womenOnly,
      });

      if (!couponValidation.isValid) {
        throw new Error(couponValidation.error || "Invalid coupon code");
      }

      discountInPaise = couponValidation.discountInPaise;
      couponNote = `COUPON:${couponValidation.code}:DISCOUNT_${couponValidation.discountInPaise}`;
    }

    const grandTotal = Math.max(0, subtotal - discountInPaise + platformFee);

    // 4. Generate unique reference code
    let bookingRef = generateBookingRef();
    let collisionCheck = await tx.booking.findUnique({ where: { bookingRef } });
    let attempts = 0;
    while (collisionCheck && attempts < 5) {
      bookingRef = generateBookingRef();
      collisionCheck = await tx.booking.findUnique({ where: { bookingRef } });
      attempts++;
    }

    // 5. Link or create customer record
    let customer = await tx.customer.findFirst({
      where: {
        OR: [
          { phone: input.customerPhone },
          { email: input.customerEmail.toLowerCase().trim() },
        ],
      },
    });

    if (!customer) {
      customer = await tx.customer.create({
        data: {
          name: input.customerName.trim(),
          email: input.customerEmail.toLowerCase().trim(),
          phone: input.customerPhone.trim(),
        },
      });
    }

    // 6. Create Booking in PENDING state
    const paymentMode = isDemoPaymentAllowed() ? "demo" : "razorpay";

    const booking = await tx.booking.create({
      data: {
        bookingRef,
        eventId: ticketType.eventId,
        customerId: customer.id,
        customerName: input.customerName.trim(),
        customerEmail: input.customerEmail.toLowerCase().trim(),
        customerPhone: input.customerPhone.trim(),
        customerCity: input.customerCity?.trim(),
        notes: couponNote,
        totalAmount: subtotal,
        platformFee,
        grandTotal,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMode,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        whatsappOptIn: Boolean(input.whatsappOptIn),
        shoppingBenefitOptIn: input.shoppingBenefitOptIn !== false,
        bookingItems: {
          create: {
            ticketTypeId: ticketType.id,
            quantity: input.quantity,
            unitPrice,
            subtotal,
            attendeeNames: input.attendeeNames
              ? { names: input.attendeeNames }
              : undefined,
          },
        },
      },
    });

    // 7. Create Payment record in PENDING state
    await tx.payment.create({
      data: {
        bookingId: booking.id,
        amount: grandTotal,
        currency: "INR",
        paymentMode,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
      totalInPaise: grandTotal,
      ticketTypeName: ticketType.name,
      unitPrice,
    };
  });
}

// ============================================================
// TRANSACTIONAL & IDEMPOTENT BOOKING CONFIRMATION
// ============================================================

export interface ConfirmBookingParams {
  bookingId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  isDemoPayment?: boolean;
  webhookVerified?: boolean;
}

export interface ConfirmBookingResult {
  success: boolean;
  bookingId: string;
  bookingRef: string;
  tickets: string[];
  couponCode?: string | null;
  alreadyConfirmed?: boolean;
}

/**
 * Idempotently confirms a booking after payment verification.
 * Guarantees:
 * - If already CONFIRMED: returns existing tickets without creating duplicates.
 * - If PENDING: transitions booking to CONFIRMED, payment to PAID.
 * - Issues cryptographically unique tickets exactly once.
 * - Generates ₹200 Foreign Fits coupon if customer opted in (shoppingBenefitOptIn: true).
 */
export async function confirmBooking(
  params: ConfirmBookingParams
): Promise<ConfirmBookingResult> {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const booking = await tx.booking.findUnique({
      where: { id: params.bookingId },
      include: {
        payment: true,
        bookingItems: { include: { ticketType: true } },
        tickets: true,
      },
    });

    if (!booking) {
      throw new Error(`Booking not found: ${params.bookingId}`);
    }

    // IDEMPOTENCY CHECK: If already confirmed, return existing tickets safely
    if (booking.status === BookingStatus.CONFIRMED && booking.paymentStatus === PaymentStatus.PAID) {
      const existingTokens = booking.tickets.map((t: { token: string }) => t.token);
      const existingCoupon = await tx.coupon.findFirst({
        where: { bookingId: booking.id, type: CouponType.SHOPPING_BENEFIT_200 },
      });
      return {
        success: true,
        bookingId: booking.id,
        bookingRef: booking.bookingRef,
        tickets: existingTokens,
        couponCode: existingCoupon?.code || null,
        alreadyConfirmed: true,
      };
    }

    // State machine check
    if (booking.status !== BookingStatus.PENDING) {
      throw new Error(`Cannot confirm booking in status: ${booking.status}`);
    }

    // Update Booking to CONFIRMED
    const confirmedAt = new Date();
    await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        razorpayOrderId: params.razorpayOrderId || booking.razorpayOrderId,
        razorpayPaymentId: params.razorpayPaymentId || booking.razorpayPaymentId,
        razorpaySignature: params.razorpaySignature || booking.razorpaySignature,
        confirmedAt,
      },
    });

    // Update Payment record to PAID
    await tx.payment.update({
      where: { bookingId: booking.id },
      data: {
        status: PaymentStatus.PAID,
        razorpayOrderId: params.razorpayOrderId || booking.payment?.razorpayOrderId,
        razorpayPaymentId: params.razorpayPaymentId,
        razorpaySignature: params.razorpaySignature,
        webhookVerified: Boolean(params.webhookVerified),
      },
    });

    // Issue Tickets exactly once
    const issuedTokens: string[] = [];
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    for (const item of booking.bookingItems) {
      for (let i = 0; i < item.quantity; i++) {
        const token = generateTicketToken();
        const qrData = `${baseUrl}/verify/${token}`;

        await tx.ticket.create({
          data: {
            bookingId: booking.id,
            token,
            qrData,
            isValid: true,
            checkedIn: false,
          },
        });

        issuedTokens.push(token);
      }
    }

    // Issue ₹200 Shopping Benefit coupon ONLY if customer opted in
    let issuedCouponCode: string | null = null;
    if (booking.shoppingBenefitOptIn) {
      let code = generateCouponCode(CouponType.SHOPPING_BENEFIT_200);
      let collision = await tx.coupon.findUnique({ where: { code } });
      let attempts = 0;
      while (collision && attempts < 5) {
        code = generateCouponCode(CouponType.SHOPPING_BENEFIT_200);
        collision = await tx.coupon.findUnique({ where: { code } });
        attempts++;
      }

      const newCoupon = await tx.coupon.create({
        data: {
          code,
          type: CouponType.SHOPPING_BENEFIT_200,
          benefitAmount: 200,
          bookingId: booking.id,
          customerId: booking.customerId,
          status: CouponStatus.ACTIVE,
          issuedAt: new Date(),
          expiresAt: new Date("2026-10-31T23:59:59.000Z"),
        },
      });

      issuedCouponCode = newCoupon.code;
    }

    return {
      success: true,
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
      tickets: issuedTokens,
      couponCode: issuedCouponCode,
    };
  });
}

/**
 * Confirms a booking in development demo mode.
 * STRICT SECURITY: Rejects immediately in production.
 */
export async function confirmDemoPayment(bookingId: string): Promise<ConfirmBookingResult> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("FORBIDDEN: Demo payments are strictly disabled in production.");
  }

  if (process.env.PAYMENT_MODE !== "demo" && process.env.PAYMENT_MODE !== undefined) {
    throw new Error("FORBIDDEN: Payment mode is not set to demo.");
  }

  return await confirmBooking({
    bookingId,
    isDemoPayment: true,
    webhookVerified: false,
  });
}

/**
 * Fails/Cancels a pending booking and its payment.
 */
export async function failBooking(bookingId: string, reason?: string): Promise<void> {
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.status !== BookingStatus.PENDING) {
      return;
    }

    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        paymentStatus: PaymentStatus.FAILED,
      },
    });

    await tx.payment.update({
      where: { bookingId },
      data: {
        status: PaymentStatus.FAILED,
        failureReason: reason || "Payment failed or cancelled",
      },
    });
  });
}

// ============================================================
// QR SCANNER / TICKET GATE VERIFICATION
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

/**
 * Verifies a ticket by QR token and atomically checks in the attendee.
 * Prevents multiple entries on the same ticket.
 */
export async function verifyAndCheckInTicket(
  token: string,
  adminId?: string
): Promise<VerifyTicketResult> {
  // Strip verification URL if full URL is scanned
  const cleanToken = token.includes("/verify/") ? token.split("/verify/").pop() || token : token;

  return await prisma.$transaction(async (tx: Prisma.TransactionClient): Promise<VerifyTicketResult> => {
    const ticket = await tx.ticket.findUnique({
      where: { token: cleanToken },
      include: {
        booking: {
          include: {
            bookingItems: { include: { ticketType: true } },
          },
        },
      },
    });

    if (!ticket) {
      if (adminId) {
        await tx.auditLog.create({
          data: {
            adminId,
            action: "SCAN_INVALID",
            details: { rawToken: cleanToken },
          },
        });
      }
      return {
        valid: false,
        status: "NOT_FOUND",
        message: "Invalid ticket QR code. Ticket not found.",
      };
    }

    const booking = ticket.booking;
    const ticketItem = booking.bookingItems[0];
    const baseInfo = {
      bookingRef: booking.bookingRef,
      customerName: booking.customerName,
      ticketType: ticketItem?.ticketType?.name || "Pass",
      quantity: ticketItem?.quantity || 1,
    };

    if (booking.status !== BookingStatus.CONFIRMED || booking.paymentStatus !== PaymentStatus.PAID) {
      await tx.ticketScan.create({
        data: {
          ticketId: ticket.id,
          adminId: adminId || null,
          result: "CANCELLED",
          deviceInfo: `Booking Status: ${booking.status}`,
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
        message: "This ticket has already been checked in.",
        ticketInfo: {
          ...baseInfo,
          checkedInAt: ticket.checkedInAt || undefined,
        },
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
        message: "This ticket has been marked invalid.",
        ticketInfo: baseInfo,
      };
    }

    // Atomic Check-In
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
      message: "Valid ticket! Entry allowed.",
      ticketInfo: {
        ...baseInfo,
        checkedInAt,
      },
    };
  });
}
