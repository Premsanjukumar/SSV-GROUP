import { NextRequest } from "next/server";
import { afterPayment } from "@/services/postConfirm";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPaymentSignature } from "@/lib/tokens";
import { confirmPayment } from "@/services/booking";
import { ok, fail } from "@/lib/http";

const schema = z.object({ razorpay_order_id: z.string(), razorpay_payment_id: z.string(), razorpay_signature: z.string() });
export async function POST(req: NextRequest) {
  try {
    const p = schema.safeParse(await req.json().catch(() => null));
    if (!p.success) return ok({ error: "Invalid payment response." }, 400);
    const { razorpay_order_id: o, razorpay_payment_id: pid, razorpay_signature: sig } = p.data;
    if (!verifyPaymentSignature(o, pid, sig, process.env.RAZORPAY_KEY_SECRET ?? "")) return ok({ error: "Payment could not be verified." }, 400);
    const pay = await db.payment.findUnique({ where: { razorpayOrderId: o } }); // booking found from our DB, not the browser
    if (!pay) return ok({ error: "Order not found." }, 404);
    const id = await confirmPayment(pay.bookingId, pid); await afterPayment(id); return ok({ bookingId: id });
  } catch (e) { return fail(e); }
}
