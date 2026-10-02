import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature, confirmBooking } from "@/services/payment";
import { sendBookingConfirmation } from "@/services/email";
import { buildVerifyUrl } from "@/lib/utils";
import { PaymentVerifySchema } from "@/validators";
import { prisma, BookingStatus } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = PaymentVerifySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
  }

  const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    result.data;

  // CRITICAL: Verify Razorpay signature server-side
  const isValid = verifyRazorpaySignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isValid) {
    console.error("[VERIFY] Invalid Razorpay signature for booking:", bookingId);
    return NextResponse.json(
      { error: "Payment verification failed. Invalid signature." },
      { status: 400 }
    );
  }

  // Verify the order ID matches our database record
  const payment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (!payment || payment.razorpayOrderId !== razorpayOrderId) {
    console.error("[VERIFY] Order ID mismatch for booking:", bookingId);
    return NextResponse.json(
      { error: "Payment verification failed. Order mismatch." },
      { status: 400 }
    );
  }

  try {
    const { success, tickets } = await confirmBooking({
      bookingId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      isDemoPayment: false,
    });

    if (!success) throw new Error("Booking confirmation failed");

    // Send confirmation email (non-blocking)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { bookingItems: { include: { ticketType: true } } },
    });

    if (booking) {
      const item = booking.bookingItems[0];
      const firstToken = tickets[0];
      const ticketUrl = firstToken
        ? buildVerifyUrl(firstToken)
        : `${process.env.NEXT_PUBLIC_APP_URL}/ticket/${bookingId}`;

      sendBookingConfirmation({
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        bookingRef: booking.bookingRef,
        ticketType: item?.ticketType.name || "Unknown",
        quantity: item?.quantity || 1,
        totalInPaise: booking.grandTotal,
        eventDate: "14 October 2026, Wednesday",
        eventTime: "5:00 PM Onwards",
        venue: "Beside Beladale Petrol Pump, Gumpa, Bidar",
        ticketUrl,
      }).catch((err) => {
        console.warn("[EMAIL] Non-critical send failure:", err.message);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Verification error";
    console.error("[VERIFY]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
