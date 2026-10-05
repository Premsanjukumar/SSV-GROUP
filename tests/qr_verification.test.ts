import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyAndCheckInTicket } from "../src/services/payment";
import { prisma, BookingStatus, PaymentStatus } from "../src/lib/prisma";

vi.mock("../src/lib/prisma", () => {
  const mockPrisma = {
    $transaction: vi.fn((cb) => cb(mockPrisma)),
    coupon: {
      findFirst: vi.fn(),
    },
    adminUser: {
      findUnique: vi.fn(),
    },
    ticket: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      updateMany: vi.fn(),
      create: vi.fn(),
    },
    booking: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    ticketScan: {
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  };

  return {
    prisma: mockPrisma,
    BookingStatus: {
      PENDING: "PENDING",
      CONFIRMED: "CONFIRMED",
      CANCELLED: "CANCELLED",
      REFUNDED: "REFUNDED",
    },
    PaymentStatus: {
      PENDING: "PENDING",
      PAID: "PAID",
      FAILED: "FAILED",
      CANCELLED: "CANCELLED",
      REFUNDED: "REFUNDED",
    },
  };
});

describe("Admin Scanner Verification: QR Tokens & Booking References", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockValidBooking = {
    id: "booking-101",
    bookingRef: "SSV-DANDIYA-KJF3H8",
    customerName: "Sanjukumar Sonde",
    customerEmail: "ssvphotography777@gmail.com",
    customerPhone: "9482629007",
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    bookingItems: [
      {
        ticketType: { name: "Single Pass" },
        quantity: 1,
      },
    ],
  };

  const mockUnscannedTicket = {
    id: "ticket-001",
    bookingId: "booking-101",
    token: "tok_kjf3h8_secure_1791192442072",
    qrData: "https://ssvgroup.in/verify/tok_kjf3h8_secure_1791192442072",
    isValid: true,
    checkedIn: false,
    checkedInAt: null,
    booking: mockValidBooking,
  };

  // 1. QR TOKEN VERIFICATION
  it("CASE 1: First valid QR token scan returns status VERIFIED and marks ticket checked in", async () => {
    (prisma.adminUser.findUnique as any).mockResolvedValueOnce({ id: "admin-user-1" });
    (prisma.coupon.findFirst as any).mockResolvedValueOnce(null);
    (prisma.ticket.findFirst as any).mockResolvedValueOnce(mockUnscannedTicket);
    (prisma.ticket.updateMany as any).mockResolvedValueOnce({ count: 1 });
    (prisma.ticketScan.create as any).mockResolvedValueOnce({ id: "scan-1" });

    const result = await verifyAndCheckInTicket("tok_kjf3h8_secure_1791192442072", "admin-user-1");

    expect(result.valid).toBe(true);
    expect(result.status).toBe("VERIFIED");
    expect(result.ticketInfo?.customerName).toBe("Sanjukumar Sonde");
    expect(result.ticketInfo?.bookingRef).toBe("SSV-DANDIYA-KJF3H8");
    expect(result.ticketInfo?.ticketType).toBe("Single Pass");
    expect(result.ticketInfo?.quantity).toBe(1);
    expect(result.ticketInfo?.checkedInAt).toBeDefined();

    expect(prisma.ticketScan.create).toHaveBeenCalledTimes(1);
  });

  // 2. SAME QR TOKEN SCANNED AGAIN
  it("CASE 2: Same QR token scanned again returns ALREADY_VERIFIED without duplicate scan records", async () => {
    const originalCheckedInTime = new Date("2026-10-14T17:30:00.000Z");
    const mockAlreadyScannedTicket = {
      ...mockUnscannedTicket,
      checkedIn: true,
      checkedInAt: originalCheckedInTime,
    };

    (prisma.coupon.findFirst as any).mockResolvedValueOnce(null);
    (prisma.ticket.findFirst as any).mockResolvedValueOnce(mockAlreadyScannedTicket);

    const result = await verifyAndCheckInTicket("tok_kjf3h8_secure_1791192442072", "admin-user-1");

    expect(result.valid).toBe(false);
    expect(result.status).toBe("ALREADY_VERIFIED");
    expect(result.message).toContain("already been verified");
    expect(result.ticketInfo?.customerName).toBe("Sanjukumar Sonde");
    expect(result.ticketInfo?.checkedInAt).toEqual(originalCheckedInTime);

    expect(prisma.ticket.updateMany).not.toHaveBeenCalled();
    expect(prisma.ticketScan.create).not.toHaveBeenCalled();
  });

  // 3. BOOKING REFERENCE MANUAL LOOKUP: FIRST ATTEMPT
  it("CASE 3: Manual lookup by Booking Reference SSV-DANDIYA-KJF3H8 verifies successfully on first attempt", async () => {
    (prisma.adminUser.findUnique as any).mockResolvedValueOnce({ id: "admin-user-1" });
    (prisma.coupon.findFirst as any).mockResolvedValueOnce(null);
    (prisma.ticket.findFirst as any).mockResolvedValueOnce(null); // not found by ticket token

    const bookingWithTickets = {
      ...mockValidBooking,
      tickets: [mockUnscannedTicket],
    };
    (prisma.booking.findFirst as any).mockResolvedValueOnce(bookingWithTickets);
    (prisma.ticket.updateMany as any).mockResolvedValueOnce({ count: 1 });
    (prisma.ticketScan.create as any).mockResolvedValueOnce({ id: "scan-manual-1" });

    const result = await verifyAndCheckInTicket("SSV-DANDIYA-KJF3H8", "admin-user-1");

    expect(result.valid).toBe(true);
    expect(result.status).toBe("VERIFIED");
    expect(result.ticketInfo?.customerName).toBe("Sanjukumar Sonde");
    expect(result.ticketInfo?.bookingRef).toBe("SSV-DANDIYA-KJF3H8");
    expect(result.ticketInfo?.checkedInAt).toBeDefined();

    expect(prisma.ticket.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ bookingId: "booking-101", checkedIn: false }),
        data: expect.objectContaining({ checkedIn: true }),
      })
    );
    expect(prisma.ticketScan.create).toHaveBeenCalledTimes(1);
  });

  // 4. BOOKING REFERENCE MANUAL LOOKUP: SECOND ATTEMPT
  it("CASE 4: Manual lookup by Booking Reference SSV-DANDIYA-KJF3H8 returns ALREADY_VERIFIED on second attempt", async () => {
    const originalCheckedInTime = new Date("2026-10-14T17:35:00.000Z");
    (prisma.coupon.findFirst as any).mockResolvedValueOnce(null);
    (prisma.ticket.findFirst as any).mockResolvedValueOnce(null); // not found by ticket token

    const bookingWithCheckedInTicket = {
      ...mockValidBooking,
      tickets: [
        {
          ...mockUnscannedTicket,
          checkedIn: true,
          checkedInAt: originalCheckedInTime,
        },
      ],
    };
    (prisma.booking.findFirst as any).mockResolvedValueOnce(bookingWithCheckedInTicket);

    const result = await verifyAndCheckInTicket("SSV-DANDIYA-KJF3H8", "admin-user-1");

    expect(result.valid).toBe(false);
    expect(result.status).toBe("ALREADY_VERIFIED");
    expect(result.message).toContain("already been verified and checked in");
    expect(result.ticketInfo?.bookingRef).toBe("SSV-DANDIYA-KJF3H8");
    expect(result.ticketInfo?.checkedInAt).toEqual(originalCheckedInTime);

    expect(prisma.ticket.updateMany).not.toHaveBeenCalled();
    expect(prisma.ticketScan.create).not.toHaveBeenCalled();
  });

  // 5. FOREIGN FITS COUPON REJECTION
  it("CASE 5: Foreign Fits coupon code entered into scanner is rejected as INVALID", async () => {
    (prisma.coupon.findFirst as any).mockResolvedValueOnce({
      id: "coupon-1",
      code: "SSV-FF26-ABC999",
      benefitAmount: 200,
    });

    const result = await verifyAndCheckInTicket("SSV-FF26-ABC999", "admin-user-1");

    expect(result.valid).toBe(false);
    expect(result.status).toBe("INVALID");
    expect(result.message).toContain("Foreign Fits coupon codes cannot be used for event entry");
    expect(prisma.ticket.findFirst).not.toHaveBeenCalled();
    expect(prisma.ticketScan.create).not.toHaveBeenCalled();
  });

  // 6. CONCURRENT RACE SAFETY
  it("CASE 6: Two simultaneous scan requests race -> only one VERIFIED, other ALREADY_VERIFIED", async () => {
    const firstCheckInTime = new Date("2026-10-14T18:00:00.000Z");

    (prisma.coupon.findFirst as any).mockResolvedValue(null);
    (prisma.ticket.findFirst as any)
      .mockResolvedValueOnce(mockUnscannedTicket) // Request 1 read
      .mockResolvedValueOnce(mockUnscannedTicket); // Request 2 read

    // Request 1 succeeds in the atomic conditional update
    (prisma.ticket.updateMany as any).mockResolvedValueOnce({ count: 1 });
    // Request 2 finds 0 rows matching checkedIn: false because Request 1 won the race
    (prisma.ticket.updateMany as any).mockResolvedValueOnce({ count: 0 });

    (prisma.ticket.findUnique as any).mockResolvedValueOnce({ checkedInAt: firstCheckInTime });
    (prisma.ticketScan.create as any).mockResolvedValueOnce({ id: "scan-race-1" });

    const [result1, result2] = await Promise.all([
      verifyAndCheckInTicket("tok_kjf3h8_secure_1791192442072", "admin-1"),
      verifyAndCheckInTicket("tok_kjf3h8_secure_1791192442072", "admin-2"),
    ]);

    expect(result1.status).toBe("VERIFIED");
    expect(result1.valid).toBe(true);

    expect(result2.status).toBe("ALREADY_VERIFIED");
    expect(result2.valid).toBe(false);
    expect(result2.ticketInfo?.checkedInAt).toEqual(firstCheckInTime);

    expect(prisma.ticketScan.create).toHaveBeenCalledTimes(1);
  });

  // 7. INVALID CODE OR REFERENCE
  it("CASE 7: Invalid code returns INVALID", async () => {
    (prisma.coupon.findFirst as any).mockResolvedValueOnce(null);
    (prisma.ticket.findFirst as any).mockResolvedValueOnce(null);
    (prisma.booking.findFirst as any).mockResolvedValueOnce(null);

    const result = await verifyAndCheckInTicket("completely-invalid-code", "admin-user-1");

    expect(result.valid).toBe(false);
    expect(result.status).toBe("INVALID");
    expect(result.message).toContain("No matching record found");
  });

  // 8. CANCELLED OR UNPAID BOOKING
  it("CASE 8: Handles cancelled booking by returning CANCELLED status", async () => {
    const mockCancelledTicket = {
      ...mockUnscannedTicket,
      booking: {
        ...mockValidBooking,
        status: BookingStatus.CANCELLED,
        paymentStatus: PaymentStatus.FAILED,
      },
    };

    (prisma.coupon.findFirst as any).mockResolvedValueOnce(null);
    (prisma.ticket.findFirst as any).mockResolvedValueOnce(mockCancelledTicket);

    const result = await verifyAndCheckInTicket("tok_kjf3h8_secure_1791192442072", "admin-user-1");

    expect(result.valid).toBe(false);
    expect(result.status).toBe("CANCELLED");
    expect(result.message).toContain("Entry permitted only for PAID bookings");
    expect(prisma.ticketScan.create).not.toHaveBeenCalled();
  });
});
