"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  CheckCircle, Download, QrCode, MapPin, Calendar, Loader2, Share2,
} from "lucide-react";

interface BookingDetails {
  bookingId: string;
  bookingRef: string;
  customerName: string;
  ticketType: string;
  quantity: number;
  totalInPaise: number;
  status: string;
  eventDate: string;
  venue: string;
  qrCodeUrl: string; // first ticket's verify URL
}

function formatCurrency(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN");
}

function SuccessInner() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (bookingId) fetchBooking(bookingId);
    else setLoading(false);
  }, [bookingId]);

  async function fetchBooking(id: string) {
    try {
      const res = await fetch(`/api/bookings/${id}/success`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBooking(data);
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function downloadPDF() {
    if (!bookingId) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/tickets/${bookingId}/pdf`);
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SSV-Ticket-${booking?.bookingRef || bookingId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("PDF download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  function handleShare() {
    if (!booking) return;
    const text = `I just booked tickets for SSV Dandiya Divas 2026! 🎊\n14 October 2026, Bidar\nBooking: ${booking.bookingRef}`;
    if (navigator.share) {
      navigator.share({ title: "SSV Dandiya Divas 2026", text });
    } else {
      navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen" style={{ background: "#0f0202" }}>
        <div className="max-w-lg mx-auto px-4 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin" size={32} style={{ color: "#D4A017" }} />
            </div>
          ) : !booking ? (
            <div className="text-center py-20">
              <p style={{ color: "rgba(255,248,220,0.5)" }}>Booking details not found.</p>
              <Link href="/" className="btn-outline mt-6 inline-flex">← Home</Link>
            </div>
          ) : (
            <>
              {/* Success header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(45,80,22,0.3)", border: "2px solid rgba(144,238,144,0.4)", boxShadow: "0 0 30px rgba(144,238,144,0.2)" }}>
                  <CheckCircle size={40} style={{ color: "#90ee90" }} />
                </div>
                <h1 className="font-display font-black text-3xl mb-2" style={{ color: "#90ee90" }}>
                  Booking Confirmed!
                </h1>
                <p className="text-sm" style={{ color: "rgba(255,248,220,0.5)" }}>
                  Your ticket is ready. See you at the event! 🎊
                </p>
              </div>

              <div className="card-festive overflow-hidden mb-6">
                {/* Booking reference */}
                <div className="p-6 text-center" style={{ borderBottom: "1px solid rgba(212,160,23,0.1)" }}>
                  <div className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(212,160,23,0.6)" }}>
                    Booking Reference
                  </div>
                  <div className="font-display font-black text-2xl tracking-widest" style={{ color: "#D4A017" }}>
                    {booking.bookingRef}
                  </div>
                </div>

                {/* QR code */}
                {booking.qrCodeUrl && (
                  <div className="p-6 flex flex-col items-center" style={{ borderBottom: "1px solid rgba(212,160,23,0.1)" }}>
                    <div className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(212,160,23,0.6)" }}>
                      Entry QR Code
                    </div>
                    <img
                      src={booking.qrCodeUrl}
                      alt="QR Code for entry"
                      className="rounded-xl"
                      style={{ width: 180, height: 180 }}
                    />
                    <p className="text-xs mt-3" style={{ color: "rgba(255,248,220,0.35)" }}>
                      Present this at the entry gate
                    </p>
                  </div>
                )}

                {/* Details */}
                <div className="p-6 space-y-3">
                  {[
                    { label: "Name", value: booking.customerName },
                    { label: "Ticket", value: booking.ticketType },
                    { label: "Qty", value: String(booking.quantity) },
                    { label: "Date", value: "14 October 2026, Wednesday" },
                    { label: "Time", value: "5:00 PM Onwards" },
                    { label: "Venue", value: "Gumpa, Bidar" },
                    { label: "Paid", value: formatCurrency(booking.totalInPaise) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b"
                      style={{ borderColor: "rgba(212,160,23,0.06)" }}>
                      <span className="text-sm" style={{ color: "rgba(255,248,220,0.4)" }}>{label}</span>
                      <span className="text-sm font-medium" style={{ color: "#FFF8DC" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href={`/ticket/${bookingId}`}
                  className="btn-primary w-full justify-center py-4 text-sm"
                >
                  <QrCode size={16} /> VIEW FULL TICKET
                </Link>
                <button
                  onClick={downloadPDF}
                  disabled={downloading}
                  className="btn-outline w-full justify-center py-4 text-sm"
                >
                  {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  {downloading ? "Generating PDF..." : "DOWNLOAD PDF TICKET"}
                </button>
                <button
                  onClick={handleShare}
                  className="btn-outline w-full justify-center py-4 text-sm"
                >
                  <Share2 size={16} /> SHARE
                </button>
              </div>

              <div className="mt-8 p-4 rounded-xl" style={{ background: "rgba(45,80,22,0.15)", border: "1px solid rgba(144,238,144,0.2)" }}>
                <p className="text-sm text-center" style={{ color: "rgba(144,238,144,0.8)" }}>
                  📱 Booking confirmation email sent! Check your inbox (or spam folder).
                </p>
              </div>

              <div className="mt-4 text-center">
                <Link href="/" className="text-sm" style={{ color: "rgba(212,160,23,0.6)" }}>
                  ← Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0202" }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "#D4A017" }} />
      </div>
    }>
      <SuccessInner />
    </Suspense>
  );
}
