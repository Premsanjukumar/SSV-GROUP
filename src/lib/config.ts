export function paymentMode(env: Record<string, string | undefined>): "demo" | "razorpay" {
  const m = env.PAYMENT_MODE === "razorpay" ? "razorpay" : "demo";
  if (m === "demo" && env.NODE_ENV === "production") throw new Error("PAYMENT_MODE=demo is not allowed in production.");
  if (m === "razorpay" && (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET)) throw new Error("Razorpay keys missing.");
  return m;
}
