import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendBookingConfirmation } from "../src/services/email";
import { generateTicketPDF } from "../src/services/pdf";
import { BookingFormSchema } from "../src/validators";
import nodemailer from "nodemailer";

describe("Automatic Ticket Email Delivery System", () => {
  const mockSendMail = vi.fn().mockResolvedValue({ messageId: "mock-message-id" });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(nodemailer, "createTransport").mockReturnValue({
      sendMail: mockSendMail,
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("validates customer email address on server-side with Zod", () => {
    const validBooking = {
      ticketTypeId: "tt_single_1",
      quantity: 1,
      customerName: "Pooja Patil",
      customerEmail: "pooja.patil@gmail.com",
      customerPhone: "9876543210",
      eventId: "event_dd_2026",
      femaleConfirmation: true,
      shoppingBenefitOptIn: true,
    };

    const validResult = BookingFormSchema.safeParse(validBooking);
    expect(validResult.success).toBe(true);

    const invalidEmailBooking = {
      ...validBooking,
      customerEmail: "not-an-email",
    };
    const invalidResult = BookingFormSchema.safeParse(invalidEmailBooking);
    expect(invalidResult.success).toBe(false);
  });

  it("sends confirmation to the exact customer email entered with PDF attachment", async () => {
    process.env.SMTP_HOST = "smtp.gmail.com";
    process.env.SMTP_USER = "tickets@ssvgroup.in";
    process.env.SMTP_PASS = "sample_app_password";

    const pdfBuffer = Buffer.from("%PDF-1.4 Mock PDF ticket content");
    const customerEmail = "customer.vip@gmail.com";
    const bookingRef = "SSV-DD26-X992";

    const emailData = {
      customerName: "Rohit & Ananya Verma",
      customerEmail,
      bookingRef,
      ticketType: "Couple Pass",
      quantity: 1,
      totalInPaise: 49900,
      paymentId: "pay_test_RzpPayment998",
      eventDate: "14 October 2026",
      eventDay: "Wednesday",
      eventTime: "5:00 PM – 10:00 PM",
      venue: "RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar",
      specialAttraction: "SP POWER",
      ticketUrl: `https://ssvgroup.in/ticket/${bookingRef}`,
      shoppingBenefitOptIn: true,
      couponCode: "SSV-DF26-W34K",
    };

    const result = await sendBookingConfirmation(emailData, pdfBuffer);

    expect(result.success).toBe(true);
    expect(mockSendMail).toHaveBeenCalledTimes(1);

    const sentPayload = mockSendMail.mock.calls[0][0];

    // Recipient must be the customer's entered email
    expect(sentPayload.to).toBe(customerEmail);

    // Subject must match specification
    expect(sentPayload.subject).toBe(
      "🎉 Your SSV GROUP Dandiya Divas 2026 Ticket is Confirmed!"
    );

    // Attachment verification
    expect(sentPayload.attachments).toHaveLength(1);
    expect(sentPayload.attachments[0].filename).toBe(
      `SSV-Dandiya-Divas-2026-Ticket-${bookingRef}.pdf`
    );
    expect(sentPayload.attachments[0].contentType).toBe("application/pdf");
    expect(sentPayload.attachments[0].content).toBe(pdfBuffer);

    // HTML Content verification
    const html = sentPayload.html;
    expect(html).toContain("SSV GROUP");
    expect(html).toContain("DANDIYA DIVAS 2026");
    expect(html).toContain("BOOKING CONFIRMED");
    expect(html).toContain("Rohit & Ananya Verma");
    expect(html).toContain("14 October 2026");
    expect(html).toContain("Wednesday");
    expect(html).toContain("5:00 PM – 10:00 PM");
    expect(html).toContain(
      "RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar"
    );
    expect(html).toContain("SP POWER");
    expect(html).toContain(bookingRef);
    expect(html).toContain("Couple Pass");
    expect(html).toContain("₹499");
    expect(html).toContain("pay_test_RzpPayment998");
    expect(html).toContain("SSV-DF26-W34K");

    // Plain text content verification
    const text = sentPayload.text;
    expect(text).toContain("Hello Rohit & Ananya Verma");
    expect(text).toContain("RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar");
    expect(text).toContain("SP POWER");
    expect(text).toContain("pay_test_RzpPayment998");
  });

  it("excludes coupon benefit from email when customer chose NO THANKS", async () => {
    process.env.SMTP_HOST = "smtp.gmail.com";
    process.env.SMTP_USER = "tickets@ssvgroup.in";
    process.env.SMTP_PASS = "sample_app_password";

    const customerEmail = "no.coupon@gmail.com";
    const bookingRef = "SSV-DD26-NOCP";

    const emailData = {
      customerName: "Kavita Rao",
      customerEmail,
      bookingRef,
      ticketType: "Single Pass",
      quantity: 1,
      totalInPaise: 29900,
      paymentId: "pay_test_Single299",
      ticketUrl: `https://ssvgroup.in/ticket/${bookingRef}`,
      shoppingBenefitOptIn: false,
      couponCode: null,
    };

    const result = await sendBookingConfirmation(emailData);

    expect(result.success).toBe(true);
    const sentPayload = mockSendMail.mock.calls[0][0];
    expect(sentPayload.html).not.toContain("Foreign Fits ₹200 Shopping Benefit");
    expect(sentPayload.text).not.toContain("Foreign Fits Shopping Benefit");
  });

  it("generates valid PDF ticket buffer with QR code without crashing", async () => {
    const pdfBuffer = await generateTicketPDF({
      bookingRef: "SSV-DD26-PDFTEST",
      customerName: "Anil Kumar",
      customerEmail: "anil@example.com",
      customerPhone: "9876543210",
      ticketType: "Single Pass",
      quantity: 1,
      totalInPaise: 29900,
      eventName: "SSV Dandiya Divas 2026",
      eventDate: "14 October 2026, Wednesday",
      eventTime: "5:00 PM – 10:00 PM",
      venue: "RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar",
      verifyUrl: "http://localhost:3000/verify/secure-qr-token-xyz",
      status: "CONFIRMED",
      shoppingBenefitOptIn: true,
      couponCode: "SSV-DF26-XYZ1",
    });

    expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
    expect(pdfBuffer.subarray(0, 4).toString()).toBe("%PDF");
    expect(pdfBuffer.length).toBeGreaterThan(1000);
  });
});
