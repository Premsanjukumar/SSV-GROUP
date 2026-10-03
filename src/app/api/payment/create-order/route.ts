import { NextRequest, NextResponse } from "next/server";
import { prisma, BookingStatus } from "@/lib/prisma";
import { createRazorpayOrder, isDemoPaymentAllowed } from "@/services/payment";
import { getClientIp, checkRateLimit } from "@/lib/utils";

// ============================================================
// POST /api/payment/create-order
// Creates authoritative Razorpay order on gateway servers.
// Amount is strictly fetched from database. Never trusts client.
// ============================================================

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);

  // Rate limit: 20 order creations per 10 minutes per IP
  if (!checkRateLimit(`create-order:${ip}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many payment attempts. Please try again later." },
      { status: 429 }
    );
  }

  // Safety check in production
  if (process.env.NODE_ENV === "production" && isDemoPaymentAllowed()) {
    console.error("[CRITICAL] Production server configured with demo payment mode!");
    return NextResponse.json(
      { error: "Payment gateway is not properly configured. Please contact support." },
      { status: 503 }
    );
  }

  let body: { bookingId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  if (!body.bookingId || typeof body.bookingId !== "string") {
    return NextResponse.json(
      { error: "Valid bookingId is required" },
      { status: 400 }
    );
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: body.bookingId },
      include: {
        payment: true,
        bookingItems: { include: { ticketType: true } },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking record not found" },
        { status: 404 }
      );
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      return NextResponse.json(
        { error: "Booking is already paid and confirmed." },
        { status: 400 }
      );
    }

    if (booking.status !== BookingStatus.PENDING) {
      return NextResponse.json(
        { error: `Cannot process payment for booking with status: ${booking.status}` },
        { status: 400 }
      );
    }

    // Authoritative Server-side Amount Calculation
    const amountInPaise = booking.grandTotal;
    if (amountInPaise <= 0) {
      return NextResponse.json(
        { error: "Invalid booking amount calculated by server" },
        { status: 400 }
      );
    }

    // Call Razorpay API
    const order = await createRazorpayOrder({
      amountInPaise,
      bookingRef: booking.bookingRef,
      notes: {
        bookingId: booking.id,
        bookingRef: booking.bookingRef,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
      },
    });

    // Save order ID against booking and payment records
    await prisma.$transaction([
      prisma.booking.update({
        where: { id: booking.id },
        data: { razorpayOrderId: order.orderId },
      }),
      prisma.payment.update({
        where: { bookingId: booking.id },
        data: {
          razorpayOrderId: order.orderId,
          currency: order.currency,
        },
      }),
    ]);

    return NextResponse.json({
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: order.keyId,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Order creation failed";
    console.error("[CREATE_ORDER_ERROR]", errorMsg);

    return NextResponse.json(
      { error: "Unable to initiate payment with gateway. Please try again." },
      { status: 500 }
    );
  }
}
