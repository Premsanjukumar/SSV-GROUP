import QRCode from "qrcode";
import { getTicketData } from "@/services/ticketData";
import { mapsUrl } from "@/lib/event";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your ticket | SSV Dandiya Divas 2026", robots: { index: false } };

export default async function TicketPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  const d = await getTicketData(bookingId);
  if (!d) notFound();
  if (d.status !== "PAID" && d.status !== "CONFIRMED") return (
    <main className="page"><h1>Payment {d.status === "PENDING" ? "pending" : "not completed"}</h1>
      <p>{d.status === "PENDING" ? "We have not received a confirmed payment yet. Refresh in a minute, or contact the organizer with your booking ID." : "This booking has no valid ticket."}</p>
      <p>Booking ID: <b>{d.reference}</b></p></main>);
  const qrs = await Promise.all(d.tickets.map(t => QRCode.toDataURL(t.verifyUrl, { margin: 1, width: 400, errorCorrectionLevel: "M" })));
  const wa = `https://wa.me/?text=${encodeURIComponent(`My ticket for ${d.event.name} on ${d.event.dateText}. Booking ID: ${d.reference}`)}`;
  return (
    <main className="page">
      {qrs.map((src, i) => (
        <article className="ticket" key={i} style={{ marginBottom: 16 }}>
          <header><small>SSV GROUP</small><b>DANDIYA DIVAS 2026</b></header>
          <dl>
            <dt>Booking ID</dt><dd>{d.reference}</dd><dt>Name</dt><dd>{d.name}</dd><dt>Ticket</dt><dd>{d.ticketType}</dd>
            <dt>Quantity</dt><dd>{d.quantity}</dd><dt>Date</dt><dd>{d.event.dateText}</dd><dt>Time</dt><dd>{d.event.timeText}</dd>
            <dt>Venue</dt><dd>{d.event.venue}</dd><dt>Payment</dt><dd>Paid</dd><dt>Status</dt><dd><span className="badge">VALID</span></dd>
          </dl>
          <div className="qr"><img src={src} alt={`Entry QR code for pass ${i + 1} of ${qrs.length}`} width={260} height={260} /><p>Pass {i + 1} of {qrs.length}. Show this QR at the entry gate.</p></div>
        </article>))}
      <div className="btns">
        <a className="btn" href={`/api/tickets/${d.bookingId}/pdf`}>Download ticket</a>
        <a className="btn alt" href={mapsUrl()} target="_blank" rel="noopener noreferrer">View location</a>
        <a className="btn alt" href={wa} target="_blank" rel="noopener noreferrer">Share on WhatsApp</a>
      </div>
    </main>);
}
