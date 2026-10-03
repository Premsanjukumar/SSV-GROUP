import { NextResponse } from "next/server";
import { getPaymentMode, isDemoPaymentAllowed } from "@/services/payment";

// ============================================================
// GET /api/payment/mode
// Returns current gateway mode and production constraints
// ============================================================

export async function GET() {
  const isProduction = process.env.NODE_ENV === "production";
  const mode = getPaymentMode();
  const demoAllowed = isDemoPaymentAllowed();

  return NextResponse.json({
    mode,
    isProduction,
    demoAllowed,
  });
}
