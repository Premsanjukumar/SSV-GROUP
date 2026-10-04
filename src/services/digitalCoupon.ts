import crypto from "crypto";
import { prisma, CouponType, CouponStatus, BookingStatus, PaymentStatus } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// ============================================================
// AUTHORITATIVE DIGITAL COUPON SERVICE
//
// Rules Enforced:
// 1. ₹200 Shopping Benefit for Foreign Fits is an OPTIONAL post-payment perk.
// 2. Ticket prices are NEVER discounted (Single = ₹299, Couple = ₹499).
// 3. Benefit coupon is generated ONLY after verified server-confirmed payment
//    AND ONLY if shoppingBenefitOptIn is true.
// 4. ₹5,000 Foreign Fits coupon is EXCLUSIVELY for the Ramp Walk 1st Winner
//    and is managed strictly by Admin (never automatically given to bookings).
// 5. All coupon codes are cryptographically unique and non-guessable.
// 6. Redeemed coupons cannot be reused.
// ============================================================

const CHARSET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // excludes ambiguous 0, O, 1, I

/**
 * Generates a secure, non-guessable coupon code.
 */
export function generateCouponCode(type: CouponType): string {
  const bytes = crypto.randomBytes(6);
  let randomStr = "";
  for (let i = 0; i < bytes.length; i++) {
    randomStr += CHARSET[bytes[i] % CHARSET.length];
  }

  if (type === CouponType.RAMP_WALK_WINNER_5000) {
    return `WINNER-RW26-${randomStr}`;
  }
  return `SSV-DF26-${randomStr}`;
}

export interface IssueCouponResult {
  issued: boolean;
  reason?: string;
  coupon?: {
    id: string;
    code: string;
    type: CouponType;
    benefitAmount: number;
    status: CouponStatus;
    expiresAt: Date | null;
  };
}

/**
 * Idempotently issues the ₹200 Foreign Fits Shopping Benefit coupon for a confirmed booking.
 * Strictly checks:
 * - Booking exists and is CONFIRMED with PAID payment status.
 * - shoppingBenefitOptIn is TRUE. If FALSE, no coupon is created.
 * - Idempotent: If coupon already exists for booking, returns existing coupon.
 */
export async function issueBookingShoppingBenefitCoupon(
  bookingId: string,
  txClient?: Prisma.TransactionClient
): Promise<IssueCouponResult> {
  const client = txClient || prisma;

  const booking = await client.booking.findUnique({
    where: { id: bookingId },
    include: {
      coupons: {
        where: { type: CouponType.SHOPPING_BENEFIT_200 },
      },
    },
  });

  if (!booking) {
    return { issued: false, reason: "Booking not found" };
  }

  // Check customer opt-in choice
  if (!booking.shoppingBenefitOptIn) {
    return {
      issued: false,
      reason: "Customer opted out of the ₹200 shopping benefit.",
    };
  }

  // Must be verified paid and confirmed
  if (booking.status !== BookingStatus.CONFIRMED || booking.paymentStatus !== PaymentStatus.PAID) {
    return {
      issued: false,
      reason: "Booking is not yet confirmed and paid.",
    };
  }

  // Idempotency check: if coupon already exists, return it safely
  if (booking.coupons && booking.coupons.length > 0) {
    const existing = booking.coupons[0];
    return {
      issued: true,
      coupon: {
        id: existing.id,
        code: existing.code,
        type: existing.type as CouponType,
        benefitAmount: existing.benefitAmount,
        status: existing.status as CouponStatus,
        expiresAt: existing.expiresAt,
      },
    };
  }

  // Generate unique code with collision checking
  let code = generateCouponCode(CouponType.SHOPPING_BENEFIT_200);
  let collision = await client.coupon.findUnique({ where: { code } });
  let attempts = 0;
  while (collision && attempts < 5) {
    code = generateCouponCode(CouponType.SHOPPING_BENEFIT_200);
    collision = await client.coupon.findUnique({ where: { code } });
    attempts++;
  }

  // Default expiration: 31 October 2026 (end of festival month)
  const expiresAt = new Date("2026-10-31T23:59:59.000Z");

  const newCoupon = await client.coupon.create({
    data: {
      code,
      type: CouponType.SHOPPING_BENEFIT_200,
      benefitAmount: 200,
      bookingId: booking.id,
      customerId: booking.customerId,
      status: CouponStatus.ACTIVE,
      issuedAt: new Date(),
      expiresAt,
    },
  });

  return {
    issued: true,
    coupon: {
      id: newCoupon.id,
      code: newCoupon.code,
      type: newCoupon.type as CouponType,
      benefitAmount: newCoupon.benefitAmount,
      status: newCoupon.status as CouponStatus,
      expiresAt: newCoupon.expiresAt,
    },
  };
}

/**
 * Creates a ₹5,000 Ramp Walk 1st Winner coupon (Admin Only).
 * Never automatically generated for regular attendees.
 */
export async function createRampWalkWinnerCoupon(params: {
  winnerName: string;
  notes?: string;
  adminId?: string;
}) {
  const trimmedName = params.winnerName?.trim();
  if (!trimmedName || trimmedName.length < 2) {
    throw new Error("Winner name is required and must be at least 2 characters.");
  }

  let code = generateCouponCode(CouponType.RAMP_WALK_WINNER_5000);
  let collision = await prisma.coupon.findUnique({ where: { code } });
  let attempts = 0;
  while (collision && attempts < 5) {
    code = generateCouponCode(CouponType.RAMP_WALK_WINNER_5000);
    collision = await prisma.coupon.findUnique({ where: { code } });
    attempts++;
  }

  // Valid through 30 November 2026
  const expiresAt = new Date("2026-11-30T23:59:59.000Z");

  const coupon = await prisma.coupon.create({
    data: {
      code,
      type: CouponType.RAMP_WALK_WINNER_5000,
      benefitAmount: 5000,
      winnerName: trimmedName,
      notes: params.notes?.trim() || "Ramp Walk 1st Winner Official Prize",
      status: CouponStatus.ACTIVE,
      issuedAt: new Date(),
      expiresAt,
    },
  });

  if (params.adminId) {
    await prisma.auditLog.create({
      data: {
        adminId: params.adminId,
        action: "CREATE_WINNER_COUPON",
        details: {
          couponCode: coupon.code,
          winnerName: trimmedName,
          benefitAmount: 5000,
        },
      },
    }).catch(() => null);
  }

  return coupon;
}

export interface RedeemCouponResult {
  success: boolean;
  error?: string;
  coupon?: {
    code: string;
    type: CouponType;
    benefitAmount: number;
    status: CouponStatus;
    winnerName?: string | null;
    redeemedAt?: Date | null;
    bookingRef?: string | null;
    customerName?: string | null;
  };
}

/**
 * Authoritative atomic redemption of a digital coupon.
 * Prevents double redemption, validates active status, and logs audit record.
 */
export async function redeemDigitalCoupon(
  rawCode: string,
  adminId?: string
): Promise<RedeemCouponResult> {
  const code = (rawCode || "").trim().toUpperCase();

  if (!code) {
    return { success: false, error: "Please provide a valid coupon code." };
  }

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const coupon = await tx.coupon.findUnique({
      where: { code },
      include: {
        booking: {
          select: {
            bookingRef: true,
            customerName: true,
            status: true,
          },
        },
      },
    });

    if (!coupon) {
      return { success: false, error: "Coupon code not found." };
    }

    if (coupon.status === CouponStatus.REDEEMED) {
      const redeemedDate = coupon.redeemedAt
        ? new Date(coupon.redeemedAt).toLocaleString("en-IN")
        : "earlier";
      return {
        success: false,
        error: `Coupon was already redeemed on ${redeemedDate}. Redeemed coupons cannot be reused.`,
        coupon: {
          code: coupon.code,
          type: coupon.type as CouponType,
          benefitAmount: coupon.benefitAmount,
          status: CouponStatus.REDEEMED,
          winnerName: coupon.winnerName,
          redeemedAt: coupon.redeemedAt,
          bookingRef: coupon.booking?.bookingRef,
          customerName: coupon.booking?.customerName,
        },
      };
    }

    if (coupon.status === CouponStatus.EXPIRED) {
      return { success: false, error: "This coupon code has expired." };
    }

    if (coupon.status === CouponStatus.CANCELLED) {
      return { success: false, error: "This coupon has been cancelled." };
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { status: CouponStatus.EXPIRED },
      });
      return { success: false, error: "This coupon code has expired." };
    }

    // Atomic update to REDEEMED
    const redeemedAt = new Date();
    const updated = await tx.coupon.update({
      where: { id: coupon.id },
      data: {
        status: CouponStatus.REDEEMED,
        redeemedAt,
      },
    });

    if (adminId) {
      await tx.auditLog.create({
        data: {
          adminId,
          action: "REDEEM_COUPON",
          details: {
            couponCode: updated.code,
            type: updated.type,
            benefitAmount: updated.benefitAmount,
            winnerName: updated.winnerName,
          },
        },
      });
    }

    return {
      success: true,
      coupon: {
        code: updated.code,
        type: updated.type as CouponType,
        benefitAmount: updated.benefitAmount,
        status: CouponStatus.REDEEMED,
        winnerName: updated.winnerName,
        redeemedAt: updated.redeemedAt,
        bookingRef: coupon.booking?.bookingRef,
        customerName: coupon.booking?.customerName,
      },
    };
  });
}

/**
 * Retrieves the active coupon for a confirmed booking.
 */
export async function getBookingCoupon(bookingId: string) {
  return await prisma.coupon.findFirst({
    where: {
      bookingId,
      type: CouponType.SHOPPING_BENEFIT_200,
    },
    select: {
      id: true,
      code: true,
      type: true,
      benefitAmount: true,
      status: true,
      expiresAt: true,
      redeemedAt: true,
      issuedAt: true,
    },
  });
}
