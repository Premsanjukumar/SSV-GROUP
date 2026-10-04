import { describe, it, expect, vi } from "vitest";
import { generateTicketPDF } from "../src/services/pdf";
import { sendBookingConfirmation } from "../src/services/email";

const sampleData = {
  bookingRef: "SSV-DANDIYA-ABC234",
  customerName: "Asha Sharma",
  customerEmail: "asha@example.com",
  customerPhone: "9876543210",
  status: "CONFIRMED",
  ticketType: "Couple Pass",
  quantity: 2,
  totalInPaise: 49900,
  eventName: "SSV Dandiya Divas 2026",
  eventDate: "14 October 2026, Wednesday",
  eventTime: "5:00 PM onwards",
  venue: "Beside Beladale Petrol Pump, Gumpa, Bidar, Karnataka",
  verifyUrl: "http://localhost:3000/verify/demo-token-12345",
  ticketUrl: "http://localhost:3000/ticket/booking-123",
};

describe("ticket pdf", () => {
  it("creates a valid printable PDF buffer", async () => {
    const pdf = await generateTicketPDF(sampleData);
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(1000);
  });
});

describe("email confirmation", () => {
  it("safely handles unconfigured SMTP without crashing", async () => {
    const origMode = process.env.EMAIL_MODE;
    const origEnv = process.env.NODE_ENV;
    process.env.EMAIL_MODE = "live";
    (process.env as any).NODE_ENV = "production";
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await sendBookingConfirmation(sampleData);
    expect(result.success).toBe(false);
    expect(result.error).toContain("SMTP");
    spy.mockRestore();
    process.env.EMAIL_MODE = origMode;
    (process.env as any).NODE_ENV = origEnv;
  });
});
