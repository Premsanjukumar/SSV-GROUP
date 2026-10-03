import { NextRequest, NextResponse } from "next/server";
import { prisma, BookingStatus, PaymentStatus } from "@/lib/prisma";
import { verifyRazorpaySignature, confirmBooking } from "@/services/payment";
import { afterPayment } from "@/services/postConfirm";
import { PaymentVerifySchema } from "@/validators";
import { getClientIp, checkRateLimit } from "@/lib/utils";

// ============================================================
// POST /api/payment/verify
// Authoritative payment verification endpoint.
// Validates signature, order ID, DB amount, and confirms booking.
// ============================================================

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);

  // Rate limit: 30 verifications per 10 minutes per IP
  if (!checkRateLimit(`verify-payment:${ip}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many verification requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  const parseResult = PaymentVerifySchema.safeParse(body);
  if (!parseResult.success) {
    const issue = parseResult.error.errors[0]?.message || "Invalid payment payload";
    return NextResponse.json({ error: issue }, { status: 400 });
  }

  const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    parseResult.data;

  // 1. TIMING-SAFE HMAC SIGNATURE VERIFICATION
  const isSignatureValid = verifyRazorpaySignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isSignatureValid) {
    console.error(`[PAYMENT_TAMPER_DETECTED] Invalid signature for booking ${bookingId}`);
    return NextResponse.json(
      { error: "Payment verification failed. Invalid cryptographic signature." },
      { status: 400 }
    );
  }

  try {
    // 2. DATABASE RECORD VALIDATION
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking record not found." },
        { status: 404 }
      );
    }

    // IDEMPOTENCY CHECK: If already confirmed, return success immediately
    if (booking.status === BookingStatus.CONFIRMED && booking.paymentStatus === PaymentStatus.PAID) {
      return NextResponse.json({
        success: true,
        bookingId: booking.id,
        alreadyConfirmed: true,
      });
    }

    // Ensure order ID matches our database record
    if (
      (booking.razorpayOrderId && booking.razorpayOrderId !== razorpayOrderId) ||
      (booking.payment?.razorpayOrderId && booking.payment.razorpayOrderId !== razorpayOrderId)
    ) {
      console.error(
        `[ORDER_MISMATCH] Expected ${booking.razorpayOrderId || booking.payment?.razorpayOrderId}, got ${razorpayOrderId}`
      );
      return NextResponse.json(
        { error: "Payment order mismatch. Verification failed." },
        { status: 400 }
      );
    }

    // 3. CONFIRM BOOKING & ISSUE TICKETS (TRANSACTIONAL & IDEMPOTENT)
    const confirmation = await confirmBooking({
      bookingId: booking.id,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      isDemoPayment: false,
      webhookVerified: false,
    });

    if (!confirmation.success) {
      throw new Error("Failed to confirm booking record in database.");
    }

    // 4. DECOUPLED POST-PAYMENT PROCESSING (EMAIL, SMS, WHATSAPP)
    // Runs in background: failures do not block or fail the customer confirmation
    afterPayment(booking.id).catch((err) => {
      console.error("[postConfirm Async Failure]", err?.message || err);
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Verification error";
    console.error("[VERIFY_ERROR]", errorMsg);

    return NextResponse.json(
      { error: "An error occurred while confirming your booking. Please contact support." },
      { status: 500 }
    );
  }
}
