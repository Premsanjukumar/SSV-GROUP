import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const checkedIn = searchParams.get("checkedIn") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = 50;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (q) {
    where.OR = [
      { bookingRef: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { customerPhone: { contains: q } },
      { customerEmail: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const { prisma, BookingStatus } = await import("@/lib/prisma");

    if (status && Object.values(BookingStatus).includes(status as any)) {
      where.status = status;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          bookingItems: { include: { ticketType: true } },
          payment: true,
          tickets: { take: 1 },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    // Filter by check-in status after join
    let filteredBookings = bookings;
    if (checkedIn === "true") {
      filteredBookings = bookings.filter((b: any) => b.tickets[0]?.checkedIn === true);
    } else if (checkedIn === "false") {
      filteredBookings = bookings.filter((b: any) => b.tickets[0]?.checkedIn !== true);
    }

    return NextResponse.json({
      bookings: filteredBookings.map((b: any) => ({
        id: b.id,
        bookingRef: b.bookingRef,
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        customerEmail: b.customerEmail,
        customerCity: b.customerCity,
        ticketType: b.bookingItems[0]?.ticketType.name || "Unknown",
        quantity: b.bookingItems[0]?.quantity || 1,
        totalInPaise: b.grandTotal,
        status: b.status,
        paymentStatus: b.payment?.status || "PENDING",
        paymentId: b.payment?.razorpayPaymentId,
        isDemoPayment: b.payment?.paymentMode === "demo",
        checkedIn: b.tickets[0]?.checkedIn === true,
        checkedInAt: b.tickets[0]?.checkedInAt,
        createdAt: b.createdAt,
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[ADMIN BOOKINGS] DB offline:", error);
    return NextResponse.json({ bookings: [], total: 0, page: 1, pages: 0 }, { status: 200 });
  }
}
