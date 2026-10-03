import { NextRequest, NextResponse } from "next/server";
import { confirmDemoPayment, isDemoPaymentAllowed } from "@/services/payment";
import { afterPayment } from "@/services/postConfirm";
import { DemoPaymentSchema } from "@/validators";
import { getClientIp, checkRateLimit } from "@/lib/utils";

// ============================================================
// POST /api/payment/demo-confirm
// Development & Testing Demo Confirmation Endpoint
// STRICT SECURITY: Endpoint returns 403 Forbidden in production.
// ============================================================

export async function POST(req: NextRequest) {
  // STRICT PRODUCTION BLOCK: Demo confirmation must never be accessible in production
  if (process.env.NODE_ENV === "production" || !isDemoPaymentAllowed()) {
    console.warn("[SECURITY_ALERT] Demo payment confirmation attempt rejected in production.");
    return NextResponse.json(
      { error: "Forbidden: Demo payments are disabled in production." },
      { status: 403 }
    );
  }

  const ip = getClientIp(req.headers);
  if (!checkRateLimit(`demo-payment:${ip}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
  }

  const result = DemoPaymentSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
  }

  const { bookingId } = result.data;

  try {
    const confirmation = await confirmDemoPayment(bookingId);

    // Asynchronously trigger post-payment fulfillment
    afterPayment(bookingId).catch((err) => {
      console.error("[postConfirm Async Demo Failure]", err?.message || err);
    });

    return NextResponse.json({
      success: true,
      bookingId: confirmation.bookingId,
      demo: true,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Demo payment confirmation failed";
    console.error("[DEMO_CONFIRM_ERROR]", errorMsg);

    return NextResponse.json(
      { error: errorMsg },
      { status: 400 }
    );
  }
}
