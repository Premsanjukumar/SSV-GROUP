import { NextRequest, NextResponse } from "next/server";
import { prisma, BookingStatus } from "@/lib/prisma";
import { createRazorpayOrder } from "@/services/payment";

export async function POST(req: NextRequest) {
  const paymentMode = process.env.PAYMENT_MODE || "demo";
  if (paymentMode !== "razorpay") {
    return NextResponse.json(
      { error: "Razorpay not configured. Set PAYMENT_MODE=razorpay." },
      { status: 400 }
    );
  }

  let body: { bookingId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body.bookingId) {
    return NextResponse.json({ error: "bookingId required" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: body.bookingId },
    include: { payment: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status === BookingStatus.CONFIRMED) {
    return NextResponse.json({ error: "Booking already paid" }, { status: 400 });
  }

  if (booking.status !== BookingStatus.PENDING) {
    return NextResponse.json(
      { error: `Cannot create order for booking in status: ${booking.status}` },
      { status: 400 }
    );
  }

  try {
    // Use amount from DATABASE — never trust frontend
    const order = await createRazorpayOrder({
      amountInPaise: booking.grandTotal,
      bookingRef: booking.bookingRef,
      notes: {
        customer_name: booking.customerName,
        customerEmail: booking.customerEmail,
      },
    });

    // Store order ID
    await prisma.payment.update({
      where: { bookingId: booking.id },
      data: { razorpayOrderId: order.orderId },
    });

    return NextResponse.json({
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: order.keyId,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Order creation failed";
    console.error("[CREATE ORDER]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
