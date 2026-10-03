import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { priceOrder, BookingError, TicketRow } from "../src/lib/pricing";
import { bookingInput } from "../src/lib/validators";
import { newTicketToken, hashToken, newReference, verifyPaymentSignature, verifyWebhookSignature } from "../src/lib/tokens";
import { paymentMode } from "../src/lib/config";
import { formatINR } from "../src/lib/money";

const single: TicketRow = {
  id: "single-1",
  name: "Single Pass",
  pricePaise: 29900,
  capacity: 10,
  soldCount: 8,
  maxPerOrder: 5,
  isActive: true,
};

describe("Pricing and Capacity Calculations", () => {
  it("computes subtotal in integer paise", () => {
    expect(priceOrder(single, 2, 0).totalPaise).toBe(59800);
  });

  it("adds platform fee if configured", () => {
    expect(priceOrder(single, 1, 500).totalPaise).toBe(30400);
  });

  it("blocks capacity oversell", () => {
    expect(() => priceOrder(single, 3, 0)).toThrow(/SOLD OUT/);
  });

  it("blocks invalid quantities (0 or negative)", () => {
    expect(() => priceOrder(single, 0, 0)).toThrow(BookingError);
  });

  it("blocks closed sales", () => {
    expect(() => priceOrder({ ...single, salesEnd: new Date(0) }, 1, 0)).toThrow(/closed/);
  });

  it("formats INR amounts correctly", () => {
    expect(formatINR(29900)).toBe("₹299");
    expect(formatINR(49900)).toBe("₹499");
  });
});

describe("Input Validation & Normalization", () => {
  const validPayload = {
    ticketTypeId: "single-1",
    quantity: 1,
    name: "Asha Sharma",
    mobile: "98765 43210",
    email: "Asha@Example.com",
  };

  it("accepts and normalises phone & email", () => {
    const result = bookingInput.parse(validPayload);
    expect(result.mobile).toBe("9876543210");
    expect(result.email).toBe("asha@example.com");
  });

  it("rejects invalid mobile numbers", () => {
    expect(bookingInput.safeParse({ ...validPayload, mobile: "12345" }).success).toBe(false);
  });

  it("ignores any client-injected price fields", () => {
    const result = bookingInput.parse({ ...validPayload, price: 1 } as any);
    expect("price" in result).toBe(false);
  });
});

describe("Security Tokens & Signature Verification", () => {
  it("generates unique and cryptographically hashed tokens", () => {
    const a = newTicketToken();
    const b = newTicketToken();
    expect(a).not.toBe(b);
    expect(hashToken(a)).not.toContain(a);
  });

  it("generates expected reference code format", () => {
    expect(newReference()).toMatch(/^SSV-DANDIYA-[A-Z2-9]{6}$/);
  });

  it("verifies payment signature correctly", () => {
    const sig = createHmac("sha256", "sec").update("order_1|pay_1").digest("hex");
    expect(verifyPaymentSignature("order_1", "pay_1", sig, "sec")).toBe(true);
    expect(verifyPaymentSignature("order_1", "pay_2", sig, "sec")).toBe(false);
    expect(verifyPaymentSignature("order_1", "pay_1", "invalid_sig", "sec")).toBe(false);
  });

  it("verifies webhook signature correctly", () => {
    const body = '{"event":"payment.captured"}';
    const sig = createHmac("sha256", "wh_sec").update(body).digest("hex");
    expect(verifyWebhookSignature(body, sig, "wh_sec")).toBe(true);
    expect(verifyWebhookSignature(body + " ", sig, "wh_sec")).toBe(false);
  });

  it("blocks demo mode in production environment", () => {
    expect(() => paymentMode({ NODE_ENV: "production", PAYMENT_MODE: "demo" })).toThrow();
    expect(paymentMode({ NODE_ENV: "development" })).toBe("demo");
  });
});
