/**
 * SSV Dandiya Divas 2026 — Coupon & Discount Service
 * 
 * Authoritative Server-side Coupon Validation & Calculation.
 * Prevents client-side tampering, enforces ticket-tier eligibility,
 * prevents negative balances, and supports extensible promotional campaigns.
 */

export interface CouponRule {
  code: string;
  name: string;
  discountInPaise: number; // e.g. 20000 = ₹200
  description: string;
  isActive: boolean;
  expiresAt?: string; // ISO date string
  /**
   * Only tickets whose name (or flags) match are eligible.
   * "Single Pass" / womenOnly tickets only for DANDIYA200.
   */
  eligibleTicketNames: string[];
  requiresWomenOnly?: boolean;
  minSubtotalInPaise?: number;
}

export const ACTIVE_COUPONS: Record<string, CouponRule> = {
  DANDIYA200: {
    code: "DANDIYA200",
    name: "Foreign Fits ₹200 Shopping Benefit",
    discountInPaise: 0, // Ticket price is NOT discounted; benefit is received post-payment
    description: "The ₹200 Foreign Fits shopping benefit is provided to every attendee after successful payment confirmation.",
    isActive: false, // Inactive as a ticket price discount
    expiresAt: "2026-10-15T00:00:00.000Z",
    eligibleTicketNames: ["Single Pass", "Couple Pass"],
    minSubtotalInPaise: 29900,
  },
};

export interface CouponValidationInput {
  couponCode?: string | null;
  ticketTypeId: string;
  ticketTypeName: string;
  ticketPriceInPaise: number;
  quantity: number;
  isFemaleOnly?: boolean;
}

export interface CouponValidationOutput {
  isValid: boolean;
  code: string;
  discountInPaise: number;
  discountInRupees: number;
  originalSubtotalInPaise: number;
  finalGrandTotalInPaise: number;
  error?: string;
  message?: string;
}

/**
 * Validates a coupon code server-side against ticket tier and business rules.
 */
export function validateCoupon(
  input: CouponValidationInput
): CouponValidationOutput {
  const rawCode = (input.couponCode || "").trim().toUpperCase();

  const originalSubtotal = input.ticketPriceInPaise * input.quantity;

  if (!rawCode) {
    return {
      isValid: false,
      code: "",
      discountInPaise: 0,
      discountInRupees: 0,
      originalSubtotalInPaise: originalSubtotal,
      finalGrandTotalInPaise: originalSubtotal,
    };
  }

  const coupon = ACTIVE_COUPONS[rawCode];

  // 1. Check coupon existence and active status
  if (!coupon || !coupon.isActive) {
    return {
      isValid: false,
      code: rawCode,
      discountInPaise: 0,
      discountInRupees: 0,
      originalSubtotalInPaise: originalSubtotal,
      finalGrandTotalInPaise: originalSubtotal,
      error: "Invalid or expired coupon code.",
    };
  }

  // 2. Check expiration date
  if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
    return {
      isValid: false,
      code: rawCode,
      discountInPaise: 0,
      discountInRupees: 0,
      originalSubtotalInPaise: originalSubtotal,
      finalGrandTotalInPaise: originalSubtotal,
      error: "This coupon code has expired.",
    };
  }

  // 3. Strict Ticket Tier Eligibility (Single Pass ONLY for DANDIYA200)
  const isTicketEligible =
    coupon.eligibleTicketNames.some(
      (name) =>
        input.ticketTypeName.toLowerCase().includes(name.toLowerCase()) ||
        input.ticketTypeId.toLowerCase().includes(name.toLowerCase())
    ) || (coupon.requiresWomenOnly && input.isFemaleOnly);

  if (!isTicketEligible) {
    return {
      isValid: false,
      code: rawCode,
      discountInPaise: 0,
      discountInRupees: 0,
      originalSubtotalInPaise: originalSubtotal,
      finalGrandTotalInPaise: originalSubtotal,
      error: "Coupon DANDIYA200 is valid ONLY for the Single Pass (Ladies Entry). It cannot be applied to Couple Passes.",
    };
  }

  // 4. Minimum subtotal check
  if (
    coupon.minSubtotalInPaise &&
    originalSubtotal < coupon.minSubtotalInPaise
  ) {
    return {
      isValid: false,
      code: rawCode,
      discountInPaise: 0,
      discountInRupees: 0,
      originalSubtotalInPaise: originalSubtotal,
      finalGrandTotalInPaise: originalSubtotal,
      error: `Minimum order amount of ₹${coupon.minSubtotalInPaise / 100} required for this coupon.`,
    };
  }

  // 5. Calculate discount (flat ₹200 off eligible single booking, never exceeds subtotal)
  const discountInPaise = Math.min(coupon.discountInPaise, originalSubtotal);
  const finalGrandTotal = Math.max(0, originalSubtotal - discountInPaise);

  return {
    isValid: true,
    code: coupon.code,
    discountInPaise,
    discountInRupees: discountInPaise / 100,
    originalSubtotalInPaise: originalSubtotal,
    finalGrandTotalInPaise: finalGrandTotal,
    message: `₹${discountInPaise / 100} discount successfully applied to Single Pass!`,
  };
}
