import { describe, it, expect } from "vitest";
import crypto from "crypto";
import {
  verifyRazorpaySignature,
  verifyWebhookSignature,
  getPaymentMode,
  isDemoPaymentAllowed,
} from "../src/services/payment";
import { formatINR } from "../src/lib/money";
import { generateTicketToken, generateBookingRef } from "../src/lib/utils";

describe("Canonical Payment Service — Razorpay Signature Verification", () => {
  const secret = "test_secret_1234567890abcdef";
  const orderId = "order_O8x9abcdef1234";
  const paymentId = "pay_P9y8abcdef5678";

  it("1. Validates genuine Razorpay signature correctly", () => {
    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const result = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: validSignature,
      secret,
    });

    expect(result).toBe(true);
  });

  it("2. Rejects forged or invalid payment signature", () => {
    const forgedSignature = "0000000000000000000000000000000000000000000000000000000000000000";

    const result = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: forgedSignature,
      secret,
    });

    expect(result).toBe(false);
  });

  it("3. Rejects payment signature with wrong order ID", () => {
    const validSignatureForOtherOrder = crypto
      .createHmac("sha256", secret)
      .update(`different_order_123|${paymentId}`)
      .digest("hex");

    const result = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: validSignatureForOtherOrder,
      secret,
    });

    expect(result).toBe(false);
  });

  it("4. Rejects payment signature with wrong payment ID", () => {
    const validSignatureForOtherPayment = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|different_payment_456`)
      .digest("hex");

    const result = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: validSignatureForOtherPayment,
      secret,
    });

    expect(result).toBe(false);
  });

  it("5. Rejects empty parameters gracefully without throwing", () => {
    expect(verifyRazorpaySignature({ orderId: "", paymentId: "", signature: "", secret })).toBe(false);
    expect(verifyRazorpaySignature({ orderId, paymentId, signature: "", secret })).toBe(false);
  });
});

describe("Canonical Payment Service — Webhook Signature Verification", () => {
  const webhookSecret = "webhook_secret_secure_999";
  const rawBody = JSON.stringify({
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: "pay_test123",
          order_id: "order_test456",
          amount: 29900,
          currency: "INR",
        },
      },
    },
  });

  it("6. Validates genuine raw webhook payload signature", () => {
    const validSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const result = verifyWebhookSignature(rawBody, validSignature, webhookSecret);
    expect(result).toBe(true);
  });

  it("7. Rejects tampered raw body even with single character change", () => {
    const validSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const tamperedBody = rawBody + " ";
    const result = verifyWebhookSignature(tamperedBody, validSignature, webhookSecret);
    expect(result).toBe(false);
  });

  it("8. Rejects empty or invalid webhook signature", () => {
    expect(verifyWebhookSignature(rawBody, "", webhookSecret)).toBe(false);
    expect(verifyWebhookSignature("", "invalid_sig", webhookSecret)).toBe(false);
  });
});

describe("Payment Modes & Production Security Guardrails", () => {
  it("9. Refuses demo mode in production", () => {
    const originalEnv = process.env.NODE_ENV;
    const originalMode = process.env.PAYMENT_MODE;

    try {
      process.env.NODE_ENV = "production";
      process.env.PAYMENT_MODE = "demo";

      expect(isDemoPaymentAllowed()).toBe(false);
      expect(getPaymentMode()).toBe("razorpay");
    } finally {
      process.env.NODE_ENV = originalEnv;
      process.env.PAYMENT_MODE = originalMode;
    }
  });

  it("10. Allows demo mode in development when configured", () => {
    const originalEnv = process.env.NODE_ENV;
    const originalMode = process.env.PAYMENT_MODE;

    try {
      process.env.NODE_ENV = "development";
      process.env.PAYMENT_MODE = "demo";

      expect(isDemoPaymentAllowed()).toBe(true);
      expect(getPaymentMode()).toBe("demo");
    } finally {
      process.env.NODE_ENV = originalEnv;
      process.env.PAYMENT_MODE = originalMode;
    }
  });
});

describe("Cryptographic Token & Reference Generation", () => {
  it("11. Generates high-entropy unique ticket tokens", () => {
    const token1 = generateTicketToken();
    const token2 = generateTicketToken();

    expect(token1).toHaveLength(64);
    expect(token2).toHaveLength(64);
    expect(token1).not.toBe(token2);
  });

  it("12. Generates formatted booking references", () => {
    const ref = generateBookingRef();
    expect(ref).toMatch(/^SSV-DANDIYA-[A-Z0-9]{6}$/);
  });

  it("13. Formats INR currency accurately", () => {
    expect(formatINR(29900)).toBe("₹299");
    expect(formatINR(49900)).toBe("₹499");
    expect(formatINR(100000)).toBe("₹1,000");
  });
});
