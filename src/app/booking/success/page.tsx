"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  CheckCircle, Download, QrCode, MapPin, Calendar, Loader2, Share2, Gift,
} from "lucide-react";
import CouponModal from "@/components/CouponModal";

interface BookingDetails {
  bookingId: string;
  bookingRef: string;
  customerName: string;
  customerEmail?: string;
  emailDeliveryStatus?: string;
  ticketType: string;
  quantity: number;
  totalInPaise: number;
  shoppingBenefitOptIn?: boolean;
  coupon?: {
    code: string;
    benefitAmount: number;
    status: string;
    expiresAt?: string;
  } | null;
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
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

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

              {/* Conditional Verified Shopping Benefit Card */}
              {booking.shoppingBenefitOptIn !== false && booking.coupon ? (
                <div className="card-festive overflow-hidden mb-6 p-5 sm:p-6 border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 via-black to-emerald-950/30">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                      <Gift size={20} />
                    </span>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-extrabold">
                        VERIFIED ATTENDEE PERK
                      </span>
                      <h3 className="font-display font-black text-lg sm:text-xl text-white">
                        🎁 YOUR SHOPPING BENEFIT
                      </h3>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/30 my-3">
                    <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                      FOREIGN FITS IMPORTED FASHION
                    </div>
                    <div className="text-2xl font-black font-display text-emerald-400 mb-1">
                      ₹200 OFF
                    </div>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      Shopping benefit for every person. Your verified digital coupon code has been securely issued!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCouponModalOpen(true)}
                    className="btn-gold w-full justify-center py-3.5 text-sm font-black flex items-center gap-2 shadow-[0_0_20px_rgba(212,160,23,0.3)] active:scale-98"
                  >
                    <Gift size={16} /> [ VIEW COUPON ]
                  </button>

                  <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-medium mt-3">
                    <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>Valid at Foreign Fits imported fashion store</span>
                  </div>
                </div>
              ) : booking.shoppingBenefitOptIn === false ? (
                <div className="p-3.5 rounded-xl mb-6 bg-stone-900/40 border border-amber-500/20 text-center">
                  <p className="text-xs text-amber-200/60">
                    You chose not to receive the Foreign Fits shopping benefit.
                  </p>
                </div>
              ) : null}

              {/* Digital Coupon Modal */}
              {booking.coupon && (
                <CouponModal
                  isOpen={isCouponModalOpen}
                  onClose={() => setIsCouponModalOpen(false)}
                  code={booking.coupon.code}
                  type="SHOPPING_BENEFIT_200"
                  benefitAmount={booking.coupon.benefitAmount || 200}
                  status={booking.coupon.status}
                  bookingRef={booking.bookingRef}
                  expiresAt={booking.coupon.expiresAt}
                />
              )}

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

              {/* Email Delivery Status Banner */}
              {booking.emailDeliveryStatus === "FAILED" ? (
                <div
                  className="mt-6 p-4 rounded-xl text-center border"
                  style={{
                    background: "rgba(180,83,9,0.15)",
                    borderColor: "rgba(245,158,11,0.3)",
                  }}
                >
                  <div className="font-extrabold text-sm mb-1" style={{ color: "#90ee90" }}>
                    ✓ BOOKING CONFIRMED
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "#FFF8DC" }}>
                    Your payment was successful and your ticket is ready.
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,248,220,0.65)" }}>
                    We couldn&apos;t send the email right now.
                  </p>
                  <p className="text-xs mt-2" style={{ color: "rgba(212,160,23,0.9)" }}>
                    You can view your QR ticket online or download the official PDF ticket above.
                  </p>
                </div>
              ) : (
                <div
                  className="mt-6 p-4 rounded-xl text-center border"
                  style={{
                    background: "rgba(45,80,22,0.2)",
                    borderColor: "rgba(144,238,144,0.3)",
                  }}
                >
                  <div className="font-extrabold text-sm mb-1 tracking-wide" style={{ color: "#90ee90" }}>
                    ✓ BOOKING CONFIRMED
                  </div>
                  <p className="text-sm font-bold mb-2" style={{ color: "#90ee90" }}>
                    🎟️ Your ticket has been generated.
                  </p>
                  <div className="py-2 px-3 rounded-lg inline-block max-w-full" style={{ background: "rgba(0,0,0,0.4)" }}>
                    <div className="text-xs" style={{ color: "rgba(255,248,220,0.7)" }}>
                      📧 Ticket email sent to:
                    </div>
                    <div className="text-sm font-bold font-mono break-all mt-0.5" style={{ color: "#F5C842" }}>
                      {booking.customerEmail || "your registered email"}
                    </div>
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: "rgba(255,248,220,0.5)" }}>
                    Please check your inbox (or spam folder) for your attached PDF ticket & entry QR code.
                  </p>
                </div>
              )}

              <div className="mt-6 text-center">
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
