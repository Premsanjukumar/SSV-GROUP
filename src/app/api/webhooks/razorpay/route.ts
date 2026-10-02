import { NextRequest } from "next/server";
import { afterPayment } from "@/services/postConfirm";
import { db } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/tokens";
import { confirmPayment } from "@/services/booking";
import { ok, fail } from "@/lib/http";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text(); // signature is over the exact raw body
    const sig = req.headers.get("x-razorpay-signature") ?? "";
    if (!verifyWebhookSignature(raw, sig, process.env.RAZORPAY_WEBHOOK_SECRET ?? "")) return ok({ error: "Bad signature." }, 400);
    const evt = JSON.parse(raw);
    if (evt.event === "payment.captured") {
      const e = evt.payload.payment.entity as { id: string; order_id: string; amount: number };
      const pay = await db.payment.findUnique({ where: { razorpayOrderId: e.order_id } });
      if (pay && pay.amountPaise === e.amount) { const id = await confirmPayment(pay.bookingId, e.id); await afterPayment(id); } // amount must match our DB
    }
    return ok({ received: true });
  } catch (e) { return fail(e); }
}
