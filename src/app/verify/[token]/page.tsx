import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ticket verification", robots: { index: false } };

// Public and read-only: shows status only and never consumes the ticket. Check-in happens in /admin/scanner.
export default async function VerifyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const t = token.length > 200 ? null : await prisma.ticket.findFirst({ where: { token }, include: { booking: true } });
  let title = "INVALID TICKET", note = "This QR code is not recognised.", bg = "#B3162B";
  if (t) {
    if (!t.isValid || (t.booking.status !== "CONFIRMED" && t.booking.paymentStatus !== "PAID")) {
      title = "TICKET NOT VALID"; note = "This ticket has been cancelled or refunded.";
    }
    else if (t.checkedIn) { title = "ALREADY USED"; note = "This ticket has already been used for entry."; }
    else { title = "VALID TICKET"; note = "Entry is confirmed by the gate scanner."; bg = "#2E7D4F"; }
  }
  return (
    <main className="page"><div className="vbox" style={{ background: bg }} role="status"><h1>{title}</h1><p>{note}</p>
      {t && <p>Booking ID: <b>{t.booking.bookingRef}</b></p>}</div></main>);
}
