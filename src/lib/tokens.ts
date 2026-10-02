import { randomBytes, createHash, createHmac, timingSafeEqual } from "node:crypto";
const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const newTicketToken = () => randomBytes(32).toString("base64url"); // goes in QR URL only
export const hashToken = (t: string) => createHash("sha256").update(t).digest("hex"); // only this is stored
export const verifyUrl = (base: string, token: string) => `${base.replace(/\/$/, "")}/verify/${token}`;
export function newReference() {
  const b = randomBytes(6); let s = "";
  for (let i = 0; i < b.length; i++) s += ALPHA[b[i] % ALPHA.length];
  return `SSV-DANDIYA-${s}`;
}
const safeEq = (a: string, b: string) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };
// Razorpay checkout: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
export const verifyPaymentSignature = (orderId: string, paymentId: string, sig: string, secret: string) =>
  safeEq(createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex"), sig);
// Razorpay webhook: HMAC_SHA256(raw_body, webhook_secret) in X-Razorpay-Signature
export const verifyWebhookSignature = (rawBody: string, sig: string, secret: string) =>
  safeEq(createHmac("sha256", secret).update(rawBody).digest("hex"), sig);
// Ticket QR token derived from ticket id + server secret: unguessable, but re-creatable so the ticket page can re-render the QR.
export const deriveTicketToken = (ticketId: string, secret: string) =>
  createHmac("sha256", secret).update(`ticket:${ticketId}`).digest("base64url");
