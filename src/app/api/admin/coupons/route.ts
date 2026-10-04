import { NextRequest, NextResponse } from "next/server";
import { prisma, CouponType, CouponStatus } from "@/lib/prisma";
import { getAdminSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const typeFilter = searchParams.get("type")?.trim() || "";
  const statusFilter = searchParams.get("status")?.trim() || "";

  try {
    const where: Record<string, unknown> = {};

    if (typeFilter && (typeFilter in CouponType)) {
      where.type = typeFilter;
    }

    if (statusFilter && (statusFilter in CouponStatus)) {
      where.status = statusFilter;
    }

    if (q) {
      where.OR = [
        { code: { contains: q, mode: "insensitive" } },
        { winnerName: { contains: q, mode: "insensitive" } },
        { booking: { bookingRef: { contains: q, mode: "insensitive" } } },
        { booking: { customerName: { contains: q, mode: "insensitive" } } },
      ];
    }

    const [coupons, totalCount, shoppingBenefitCount, winnerCount, redeemedCount, activeCount] =
      await Promise.all([
        prisma.coupon.findMany({
          where,
          include: {
            booking: {
              select: {
                bookingRef: true,
                customerName: true,
                customerPhone: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
        prisma.coupon.count(),
        prisma.coupon.count({ where: { type: CouponType.SHOPPING_BENEFIT_200 } }),
        prisma.coupon.count({ where: { type: CouponType.RAMP_WALK_WINNER_5000 } }),
        prisma.coupon.count({ where: { status: CouponStatus.REDEEMED } }),
        prisma.coupon.count({ where: { status: CouponStatus.ACTIVE } }),
      ]);

    return NextResponse.json({
      coupons,
      stats: {
        totalCoupons: totalCount,
        shoppingBenefitCount,
        winnerCount,
        redeemedCount,
        activeCount,
      },
    });
  } catch (error) {
    console.error("[ADMIN_COUPONS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons." },
      { status: 500 }
    );
  }
}
