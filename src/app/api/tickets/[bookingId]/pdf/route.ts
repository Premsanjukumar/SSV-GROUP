import { NextRequest, NextResponse } from "next/server";
import { prisma, BookingStatus } from "@/lib/prisma";
import { generateTicketPDF } from "@/services/pdf";
import { buildVerifyUrl } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await params;

  let bookingRef = "SSV-DANDIYA-DEMO01";
  let customerName = "Guest Visitor";
  let customerEmail = "guest@example.com";
  let customerPhone = "9876543210";
  let ticketType = "Single Pass";
  let quantity = 1;
  let totalInPaise = 29900;
  let verifyUrl = buildVerifyUrl("demo-ticket-token-123456");

  try {
    const dbBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        bookingItems: { include: { ticketType: true } },
        tickets: { take: 1, orderBy: { createdAt: "asc" } },
      },
    });

    if (dbBooking) {
      const item = dbBooking.bookingItems[0];
      const firstTicket = dbBooking.tickets[0];
      bookingRef = dbBooking.bookingRef;
      customerName = dbBooking.customerName;
      customerEmail = dbBooking.customerEmail;
      customerPhone = dbBooking.customerPhone;
      ticketType = item?.ticketType.name || "Single Pass";
      quantity = item?.quantity || 1;
      totalInPaise = dbBooking.grandTotal;
      if (firstTicket) {
        verifyUrl = buildVerifyUrl(firstTicket.token);
      }
    }
  } catch (error) {
    console.warn("[PDF] DB lookup fallback activated:", (error as Error).message);
  }

  try {
    const pdfBuffer = await generateTicketPDF({
      bookingRef,
      customerName,
      customerEmail,
      customerPhone,
      ticketType,
      quantity,
      totalInPaise,
      eventName: "SSV Dandiya Divas 2026",
      eventDate: "14 October 2026, Wednesday",
      eventTime: "5:00 PM Onwards",
      venue: "Beside Beladale Petrol Pump, Gumpa, Bidar",
      verifyUrl,
      status: "CONFIRMED",
    });

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="SSV-Ticket-${bookingRef}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    console.error("[PDF]", error);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
