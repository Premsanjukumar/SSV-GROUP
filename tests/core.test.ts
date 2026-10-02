import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { priceOrder, BookingError, TicketRow } from "../src/lib/pricing";
import { bookingInput } from "../src/lib/validators";
import { newTicketToken, hashToken, newReference, verifyPaymentSignature, verifyWebhookSignature } from "../src/lib/tokens";
import { scanToken, ScanDb } from "../src/services/scan";
import { paymentMode } from "../src/lib/config";
import { formatINR } from "../src/lib/money";

const single: TicketRow = { id: "s", name: "Single", pricePaise: 29900, capacity: 10, soldCount: 8, maxPerOrder: 6, isActive: true };
describe("pricing", () => {
  it("computes in paise", () => expect(priceOrder(single, 2, 0).totalPaise).toBe(59800));
  it("adds configured fee", () => expect(priceOrder(single, 1, 500).totalPaise).toBe(30400));
  it("blocks oversell", () => expect(() => priceOrder(single, 3, 0)).toThrow(/SOLD OUT/));
  it("blocks bad qty", () => expect(() => priceOrder(single, 0, 0)).toThrow(BookingError));
  it("blocks closed sales", () => expect(() => priceOrder({ ...single, salesEnd: new Date(0) }, 1, 0)).toThrow(/closed/));
  it("formats INR", () => { expect(formatINR(29900)).toBe("₹299"); expect(formatINR(49900)).toBe("₹499"); });
});
describe("validation", () => {
  const ok = { ticketTypeId: "a", quantity: 1, name: "Asha", mobile: "98765 43210", email: "A@x.com" };
  it("accepts and normalises", () => { const r = bookingInput.parse(ok); expect(r.mobile).toBe("9876543210"); expect(r.email).toBe("a@x.com"); });
  it("rejects bad mobile", () => expect(bookingInput.safeParse({ ...ok, mobile: "12345" }).success).toBe(false));
  it("ignores browser-sent price", () => expect("price" in bookingInput.parse({ ...ok, price: 1 })).toBe(false));
});
describe("tokens and payment signatures", () => {
  it("tokens are unique and hashed", () => { const a = newTicketToken(); expect(a).not.toBe(newTicketToken()); expect(hashToken(a)).not.toContain(a); });
  it("reference format", () => expect(newReference()).toMatch(/^SSV-DANDIYA-[A-Z2-9]{6}$/));
  it("verifies checkout signature", () => {
    const sig = createHmac("sha256", "sec").update("order_1|pay_1").digest("hex");
    expect(verifyPaymentSignature("order_1", "pay_1", sig, "sec")).toBe(true);
    expect(verifyPaymentSignature("order_1", "pay_2", sig, "sec")).toBe(false);
    expect(verifyPaymentSignature("order_1", "pay_1", "bad", "sec")).toBe(false);
  });
  it("verifies webhook signature", () => {
    const body = '{"event":"payment.captured"}', sig = createHmac("sha256", "wh").update(body).digest("hex");
    expect(verifyWebhookSignature(body, sig, "wh")).toBe(true);
    expect(verifyWebhookSignature(body + " ", sig, "wh")).toBe(false);
  });
  it("demo mode blocked in production", () => {
    expect(() => paymentMode({ NODE_ENV: "production", PAYMENT_MODE: "demo" })).toThrow();
    expect(paymentMode({ NODE_ENV: "development" })).toBe("demo");
  });
});
describe("scanner", () => {
  function fakeDb(status = "PAID") {
    const token = newTicketToken(); const h = hashToken(token);
    const row = { id: "t1", isActive: true, bookingStatus: status, checkedInAt: null as Date | null, name: "Asha", ticketType: "Single", reference: "SSV-DANDIYA-AAAAAA" };
    const db: ScanDb = {
      findTicket: async x => (x === h ? { ...row } : null),
      markCheckedIn: async (_id, _a, at) => { if (row.checkedInAt) return 0; row.checkedInAt = at; return 1; },
      logScan: async () => {},
    };
    return { db, token };
  }
  it("first scan valid, second already used", async () => {
    const { db, token } = fakeDb();
    expect((await scanToken(db, token, "adm")).result).toBe("VALID");
    const second = await scanToken(db, token, "adm"); expect(second.result).toBe("ALREADY_USED");
  });
  it("simultaneous scans: only one succeeds", async () => {
    const { db, token } = fakeDb();
    const rs = await Promise.all([1, 2, 3, 4, 5].map(() => scanToken(db, token, "adm")));
    expect(rs.filter(r => r.result === "VALID").length).toBe(1);
  });
  it("invalid and refunded", async () => {
    const { db } = fakeDb(); expect((await scanToken(db, "nope", "adm")).result).toBe("INVALID");
    const r = fakeDb("REFUNDED"); expect((await scanToken(r.db, r.token, "adm")).result).toBe("NOT_VALID");
  });
});
