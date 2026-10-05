import { NextRequest, NextResponse } from "next/server";
import { prisma, PaymentStatus } from "@/lib/prisma";
import { verifyWebhookSignature, confirmBooking } from "@/services/payment";
import { afterPayment } from "@/services/postConfirm";

// ============================================================
// POST /api/payment/webhook
// Canonical Razorpay Webhook Handler
// Uses exact raw body for timing-safe HMAC SHA-256 validation.
// Idempotently confirms payments and triggers fulfillment.
// ============================================================

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature");
  if (!signature) {
    console.error("[WEBHOOK_REJECTED] Missing x-razorpay-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Failed to read request body" }, { status: 400 });
  }

  // 1. TIMING-SAFE HMAC SHA-256 WEBHOOK SIGNATURE VERIFICATION
  const isSignatureValid = verifyWebhookSignature(rawBody, signature);
  if (!isSignatureValid) {
    console.error("[WEBHOOK_REJECTED] Invalid webhook signature detected");
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let eventPayload: { event: string; payload: Record<string, unknown> };
  try {
    eventPayload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }

  const eventName = eventPayload.event;
  console.log(`[RAZORPAY_WEBHOOK] Received event: ${eventName}`);

  try {
    switch (eventName) {
      case "payment.captured":
      case "order.paid": {
        const paymentEntity = (
          eventPayload.payload?.payment as { entity?: Record<string, unknown> }
        )?.entity;

        const orderId = (paymentEntity?.order_id as string) || (eventPayload.payload?.order as { entity?: { id?: string } })?.entity?.id;
        const paymentId = paymentEntity?.id as string;
        const amount = paymentEntity?.amount as number;

        if (!orderId) {
          console.warn("[WEBHOOK] No order_id present in captured payment entity");
          break;
        }

        // Find payment record in our database
        const payment = await prisma.payment.findFirst({
          where: { razorpayOrderId: orderId },
          include: { booking: true },
        });

        if (!payment) {
          console.warn(`[WEBHOOK] No local payment found for order: ${orderId}`);
          break;
        }

        // Amount verification
        if (amount && payment.amount !== amount) {
          console.error(
            `[WEBHOOK_AMOUNT_MISMATCH] Expected ${payment.amount} paise, received ${amount} paise`
          );
          break;
        }

        // Idempotent Confirmation
        const confirmation = await confirmBooking({
          bookingId: payment.bookingId,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId || payment.razorpayPaymentId || undefined,
          webhookVerified: true,
        });

        console.log(
          `[WEBHOOK_SUCCESS] Booking ${payment.bookingId} confirmed via webhook (Already Confirmed: ${Boolean(confirmation.alreadyConfirmed)})`
        );

        // Asynchronous post-payment delivery
        try {
          await afterPayment(payment.bookingId);
        } catch (err) {
          console.error("[postConfirm Async Failure via Webhook]", err instanceof Error ? err.message : err);
        }

        break;
      }

      case "payment.failed": {
        const paymentEntity = (
          eventPayload.payload?.payment as { entity?: Record<string, unknown> }
        )?.entity;

        const orderId = paymentEntity?.order_id as string;
        const errorDescription = paymentEntity?.error_description as string;

        if (orderId) {
          const payment = await prisma.payment.findFirst({
            where: { razorpayOrderId: orderId },
          });

          if (payment && payment.status !== PaymentStatus.PAID) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: {
                status: PaymentStatus.FAILED,
                failureReason: errorDescription || "Payment failed via gateway",
              },
            });
            console.log(`[WEBHOOK] Marked payment ${payment.id} as FAILED`);
          }
        }
        break;
      }

      default:
        // Ignore other unhandled events safely
        break;
    }
  } catch (error) {
    console.error("[WEBHOOK_PROCESSING_ERROR]", error instanceof Error ? error.message : error);
    // Return 200 to acknowledge receipt so Razorpay doesn't indefinitely retry on handled errors
  }

  return NextResponse.json({ received: true });
}
