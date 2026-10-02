import { NextResponse } from "next/server";

export async function GET() {
  const mode = process.env.PAYMENT_MODE || "demo";
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && mode === "demo") {
    return NextResponse.json({
      mode: "demo",
      warning: "DEMO mode is active in production. Configure PAYMENT_MODE=razorpay.",
    });
  }

  return NextResponse.json({ mode });
}
