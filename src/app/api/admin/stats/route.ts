import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";

const DEMO_STATS = {
  stats: {
    totalBookings: 0,
    paidBookings: 0,
    ticketsSold: 0,
    totalRevenuePaise: 0,
    singleSold: 0,
    coupleSold: 0,
    checkedIn: 0,
  },
  recentBookings: [],
  salesChart: [],
};

export async function GET(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prisma, BookingStatus } = await import("@/lib/prisma");

    const [
      totalBookings,
      paidBookings,
      ticketsSoldResult,
      revenueResult,
      singleSoldResult,
      coupleSoldResult,
      checkedInCount,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      prisma.bookingItem.aggregate({
        where: { booking: { status: BookingStatus.CONFIRMED } },
        _sum: { quantity: true },
      }),
      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.bookingItem.aggregate({
        where: {
          booking: { status: BookingStatus.CONFIRMED },
          ticketType: { womenOnly: true },
        },
        _sum: { quantity: true },
      }),
      prisma.bookingItem.aggregate({
        where: {
          booking: { status: BookingStatus.CONFIRMED },
          ticketType: { womenOnly: false },
        },
        _sum: { quantity: true },
      }),
      prisma.ticket.count({ where: { checkedIn: true } }),
    ]);

    // Recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        bookingItems: { include: { ticketType: true } },
        payment: true,
        tickets: { take: 1 },
      },
    });

    // Sales over time (last 30 days, grouped by date)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await prisma.booking.findMany({
      where: {
        status: BookingStatus.CONFIRMED,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
        grandTotal: true,
      },
    });

    // Group by date
    const salesByDate: Record<string, { date: string; bookings: number; revenue: number }> = {};
    for (const b of salesData) {
      const date = b.createdAt.toISOString().split("T")[0];
      if (!salesByDate[date]) {
        salesByDate[date] = { date, bookings: 0, revenue: 0 };
      }
      salesByDate[date].bookings++;
      salesByDate[date].revenue += b.grandTotal;
    }

    return NextResponse.json({
      stats: {
        totalBookings,
        paidBookings,
        ticketsSold: ticketsSoldResult._sum.quantity || 0,
        totalRevenuePaise: revenueResult._sum.amount || 0,
        singleSold: singleSoldResult._sum.quantity || 0,
        coupleSold: coupleSoldResult._sum.quantity || 0,
        checkedIn: checkedInCount,
      },
      recentBookings: recentBookings.map((b: any) => ({
        id: b.id,
        bookingRef: b.bookingRef,
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        customerEmail: b.customerEmail,
        ticketType: b.bookingItems[0]?.ticketType.name || "Unknown",
        quantity: b.bookingItems[0]?.quantity || 1,
        totalInPaise: b.grandTotal,
        status: b.status,
        paymentStatus: b.payment?.status || "PENDING",
        checkedIn: b.tickets[0]?.checkedIn || false,
        checkedInAt: b.tickets[0]?.checkedInAt,
        createdAt: b.createdAt,
      })),
      salesChart: Object.values(salesByDate).sort((a, b) => a.date.localeCompare(b.date)),
    });
  } catch (error) {
    console.error("[ADMIN STATS] DB offline, returning demo data:", error);
    // Return demo empty stats so admin dashboard renders without DB
    return NextResponse.json(DEMO_STATS, { status: 200 });
  }
}
