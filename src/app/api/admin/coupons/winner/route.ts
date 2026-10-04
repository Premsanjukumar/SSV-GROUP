import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { CreateWinnerCouponSchema } from "@/validators";
import { createRampWalkWinnerCoupon } from "@/services/digitalCoupon";

export async function POST(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
  }

  const parsed = CreateWinnerCouponSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message || "Invalid winner details";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    const coupon = await createRampWalkWinnerCoupon({
      winnerName: parsed.data.winnerName,
      notes: parsed.data.notes,
      adminId: session.adminId,
    });

    return NextResponse.json({
      success: true,
      message: "₹5,000 Ramp Walk Winner coupon successfully created!",
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        benefitAmount: coupon.benefitAmount,
        winnerName: coupon.winnerName,
        status: coupon.status,
        expiresAt: coupon.expiresAt,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create winner coupon";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
