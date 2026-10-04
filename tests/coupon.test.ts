import { describe, it, expect } from "vitest";
import { validateCoupon } from "@/services/coupon";

describe("Server-Side Ticket Price & Benefit Guard", () => {
  it("strictly preserves full ticket price for Single Pass (₹299 without ticket discount)", () => {
    const result = validateCoupon({
      couponCode: "DANDIYA200",
      ticketTypeId: "single-pass-default",
      ticketTypeName: "Single Pass",
      ticketPriceInPaise: 29900,
      quantity: 1,
      isFemaleOnly: true,
    });

    // ₹200 shopping benefit is NOT a ticket price discount
    expect(result.discountInPaise).toBe(0);
    expect(result.originalSubtotalInPaise).toBe(29900);
    expect(result.finalGrandTotalInPaise).toBe(29900); // Must remain full price ₹299
  });

  it("strictly preserves full ticket price for Couple Pass (₹499)", () => {
    const result = validateCoupon({
      couponCode: "DANDIYA200",
      ticketTypeId: "couple-pass-default",
      ticketTypeName: "Couple Pass",
      ticketPriceInPaise: 49900,
      quantity: 1,
      isFemaleOnly: false,
    });

    expect(result.discountInPaise).toBe(0);
    expect(result.originalSubtotalInPaise).toBe(49900);
    expect(result.finalGrandTotalInPaise).toBe(49900); // Must remain full price ₹499
  });

  it("rejects non-existent or fake coupon codes", () => {
    const result = validateCoupon({
      couponCode: "FAKECOUPON500",
      ticketTypeId: "single-pass-default",
      ticketTypeName: "Single Pass",
      ticketPriceInPaise: 29900,
      quantity: 1,
      isFemaleOnly: true,
    });

    expect(result.isValid).toBe(false);
    expect(result.discountInPaise).toBe(0);
    expect(result.finalGrandTotalInPaise).toBe(29900);
    expect(result.error).toBeDefined();
  });

  it("handles empty or whitespace coupon code without error", () => {
    const result = validateCoupon({
      couponCode: "   ",
      ticketTypeId: "single-pass-default",
      ticketTypeName: "Single Pass",
      ticketPriceInPaise: 29900,
      quantity: 1,
    });

    expect(result.isValid).toBe(false);
    expect(result.discountInPaise).toBe(0);
    expect(result.finalGrandTotalInPaise).toBe(29900);
  });
});

import { generateCouponCode } from "@/services/digitalCoupon";
import { CouponType } from "@/lib/prisma";

describe("Digital Coupon Code Generation & Security", () => {
  it("generates attendee shopping benefit coupon code in official format (SSV-DF26-XXXXXX)", () => {
    const code = generateCouponCode(CouponType.SHOPPING_BENEFIT_200);
    expect(code).toMatch(/^SSV-DF26-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
  });

  it("generates Ramp Walk 1st Winner coupon code in official format (WINNER-RW26-XXXXXX)", () => {
    const code = generateCouponCode(CouponType.RAMP_WALK_WINNER_5000);
    expect(code).toMatch(/^WINNER-RW26-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
  });

  it("generates unique, cryptographically random codes with zero collisions across 500 iterations", () => {
    const set = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const code = generateCouponCode(CouponType.SHOPPING_BENEFIT_200);
      expect(set.has(code)).toBe(false);
      set.add(code);
    }
    expect(set.size).toBe(500);
  });

  it("keeps ₹200 attendee benefit and ₹5,000 winner coupon strictly distinct", () => {
    const attendeeCode = generateCouponCode(CouponType.SHOPPING_BENEFIT_200);
    const winnerCode = generateCouponCode(CouponType.RAMP_WALK_WINNER_5000);

    expect(attendeeCode.startsWith("SSV-DF26-")).toBe(true);
    expect(winnerCode.startsWith("WINNER-RW26-")).toBe(true);
    expect(attendeeCode).not.toEqual(winnerCode);
  });
});

