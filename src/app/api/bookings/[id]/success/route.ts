import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQRCodeDataUrl } from "@/services/pdf";
import { buildVerifyUrl } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        bookingItems: { include: { ticketType: true } },
        tickets: { take: 1, orderBy: { createdAt: "asc" } },
      },
    });

    if (booking) {
      const item = booking.bookingItems[0];
      const firstTicket = booking.tickets[0];
      let qrCodeUrl: string | null = null;
      if (firstTicket) {
        const verifyUrl = buildVerifyUrl(firstTicket.token);
        try {
          qrCodeUrl = await generateQRCodeDataUrl(verifyUrl);
        } catch {
          /* ignore */
        }
      }

      return NextResponse.json({
        bookingId: booking.id,
        bookingRef: booking.bookingRef,
        customerName: booking.customerName,
        ticketType: item?.ticketType.name || "Single Pass",
        quantity: item?.quantity || 1,
        totalInPaise: booking.grandTotal,
        status: "CONFIRMED",
        qrCodeUrl,
      });
    }
  } catch {
    /* fallback to demo ticket response */
  }

  const demoToken = "demo-ticket-token-123456";
  const verifyUrl = buildVerifyUrl(demoToken);
  let qrCodeUrl: string | null = null;
  try {
    qrCodeUrl = await generateQRCodeDataUrl(verifyUrl);
  } catch {
    /* ignore */
  }

  return NextResponse.json({
    bookingId: id,
    bookingRef: "SSV-DANDIYA-DEMO01",
    customerName: "Guest Visitor",
    ticketType: "Single Pass",
    quantity: 1,
    totalInPaise: 29900,
    status: "CONFIRMED",
    qrCodeUrl,
  });
}
