import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, confirmBooking } from "@/services/payment";
import { prisma, PaymentStatus } from "@/lib/prisma";

// Razorpay sends raw body — must be read as text for signature verification
export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error("[WEBHOOK] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event: string; payload: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log("[WEBHOOK] Event:", event.event);

  try {
    switch (event.event) {
      case "payment.captured": {
        const paymentEntity = (event.payload?.payment as { entity?: Record<string, unknown> })?.entity;
        const orderId = paymentEntity?.order_id as string;
        const paymentId = paymentEntity?.id as string;

        if (!orderId) break;

        // Find booking by Razorpay order ID
        const payment = await prisma.payment.findFirst({
          where: { razorpayOrderId: orderId },
        });

        if (payment && payment.status !== PaymentStatus.PAID) {
          await confirmBooking({
            bookingId: payment.bookingId,
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
          });

          await prisma.payment.update({
            where: { id: payment.id },
            data: { webhookVerified: true },
          });

          console.log("[WEBHOOK] Payment confirmed via webhook:", payment.bookingId);
        }
        break;
      }

      case "payment.failed": {
        const paymentEntity = (event.payload?.payment as { entity?: Record<string, unknown> })?.entity;
        const orderId = paymentEntity?.order_id as string;
        const errorDesc = paymentEntity?.error_description as string;

        if (orderId) {
          const payment = await prisma.payment.findFirst({
            where: { razorpayOrderId: orderId },
          });

          if (payment) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: {
                status: PaymentStatus.FAILED,
                failureReason: errorDesc || "Payment failed",
              },
            });
          }
        }
        break;
      }
    }
  } catch (error) {
    console.error("[WEBHOOK] Processing error:", error);
    // Return 200 so Razorpay doesn't retry — we log internally
  }

  return NextResponse.json({ received: true });
}
