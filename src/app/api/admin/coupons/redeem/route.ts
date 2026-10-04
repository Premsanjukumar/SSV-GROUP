import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { RedeemCouponSchema } from "@/validators";
import { redeemDigitalCoupon } from "@/services/digitalCoupon";

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

  const parsed = RedeemCouponSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message || "Invalid coupon code";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    const result = await redeemDigitalCoupon(parsed.data.code, session.adminId);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error, coupon: result.coupon },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Coupon ${result.coupon?.code} successfully redeemed!`,
      coupon: result.coupon,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to redeem coupon";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
