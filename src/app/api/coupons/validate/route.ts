import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCoupon } from "@/services/coupon";
import { getClientIp, checkRateLimit } from "@/lib/utils";

// ============================================================
// POST /api/coupons/validate
// Validates a coupon code server-side against a selected ticket type.
// ============================================================

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);

  // Rate limit: 30 validation attempts per 5 minutes per IP
  if (!checkRateLimit(`coupon-validate:${ip}`, 30, 5 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many coupon attempts. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: { code?: string; ticketTypeId?: string; quantity?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }

  const rawCode = (body.code || "").trim();
  const ticketTypeId = (body.ticketTypeId || "").trim();
  const quantity = Math.max(1, Math.min(10, Number(body.quantity) || 1));

  if (!rawCode) {
    return NextResponse.json(
      { error: "Coupon code is required" },
      { status: 400 }
    );
  }

  if (!ticketTypeId) {
    return NextResponse.json(
      { error: "Please select a ticket type first" },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch ticket type from database
    let ticketType = await prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
    });

    // Fallback if demo/default ID
    let ticketTypeName = ticketType?.name || "Single Pass";
    let ticketPrice = ticketType?.price || 29900;
    let isFemaleOnly = ticketType?.womenOnly ?? true;

    if (!ticketType && ticketTypeId.toLowerCase().includes("couple")) {
      ticketTypeName = "Couple Pass";
      ticketPrice = 49900;
      isFemaleOnly = false;
    }

    // 2. Authoritative server validation
    const result = validateCoupon({
      couponCode: rawCode,
      ticketTypeId,
      ticketTypeName,
      ticketPriceInPaise: ticketPrice,
      quantity,
      isFemaleOnly,
    });

    if (!result.isValid) {
      return NextResponse.json(
        {
          valid: false,
          error: result.error || "Coupon could not be applied.",
          code: rawCode.toUpperCase(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: result.code,
      discountInPaise: result.discountInPaise,
      discountInRupees: result.discountInRupees,
      originalSubtotalInPaise: result.originalSubtotalInPaise,
      finalGrandTotalInPaise: result.finalGrandTotalInPaise,
      message: result.message,
    });
  } catch (error) {
    console.error("[COUPON_VALIDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to validate coupon. Please try again." },
      { status: 500 }
    );
  }
}
