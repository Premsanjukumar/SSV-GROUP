"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, CreditCard, AlertCircle, Loader2, Shield } from "lucide-react";

interface BookingSummary {
  bookingId: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  ticketType: string;
  quantity: number;
  totalInPaise: number;
  status: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

function formatCurrency(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN");
}

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      router.push("/book");
      return;
    }
    fetchBooking(bookingId);
    checkPaymentMode();
  }, [bookingId]);

  async function fetchBooking(id: string) {
    try {
      const res = await fetch(`/api/bookings/${id}`);
      if (!res.ok) throw new Error("Booking not found");
      const data = await res.json();
      setBooking(data.booking);
    } catch {
      setError("Booking not found or expired. Please try booking again.");
    } finally {
      setLoading(false);
    }
  }

  async function checkPaymentMode() {
    try {
      const res = await fetch("/api/payment/mode");
      const data = await res.json();
      setIsDemoMode(data.mode === "demo");
    } catch { /* ignore */ }
  }

  async function handleDemoPayment() {
    if (!booking) return;
    setPaying(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/demo-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.bookingId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Demo payment failed");
      router.push(`/booking/success?bookingId=${booking.bookingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setPaying(false);
    }
  }

  async function handleRazorpayPayment() {
    if (!booking) return;
    setPaying(true);
    setError(null);

    try {
      // 1. Create Razorpay order on server
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.bookingId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create payment order");

      // 2. Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load payment gateway"));
          document.head.appendChild(script);
        });
      }

      // 3. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "SSV Group",
        description: `Dandiya Divas 2026 — ${booking.ticketType}`,
        order_id: data.orderId,
        prefill: {
          name: booking.customerName,
          email: booking.customerEmail,
          contact: "",
        },
        theme: { color: "#8B0000" },
        handler: async (response: RazorpayResponse) => {
          // 4. Verify on server
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId: booking.bookingId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");
            router.push(`/booking/success?bookingId=${booking.bookingId}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment verification failed. Contact support with your booking ID.");
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            setError("Payment was cancelled. You can try again.");
          },
        },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setPaying(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen" style={{ background: "#0f0202" }}>
        <div className="max-w-lg mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="font-display font-black text-3xl mb-2" style={{ color: "#D4A017" }}>
              Checkout
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,248,220,0.5)" }}>
              Complete your payment to confirm booking
            </p>
          </div>

          {isDemoMode && (
            <div className="flex items-start gap-3 p-4 rounded-xl mb-6"
              style={{ background: "rgba(180,120,0,0.15)", border: "2px dashed rgba(212,160,23,0.4)" }}>
              <AlertCircle size={18} style={{ color: "#D4A017" }} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: "#D4A017" }}>
                  🧪 DEMO PAYMENT MODE
                </p>
                <p className="text-xs" style={{ color: "rgba(255,248,220,0.6)" }}>
                  No real money will be charged. This is for testing only.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl mb-6"
              style={{ background: "rgba(139,0,0,0.25)", border: "1px solid rgba(255,107,107,0.3)" }}>
              <AlertCircle size={18} style={{ color: "#ff6b6b" }} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm" style={{ color: "#ffaaaa" }}>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin" size={32} style={{ color: "#D4A017" }} />
            </div>
          ) : booking ? (
            <div className="card-festive p-6 sm:p-8">
              <h2 className="font-bold text-base mb-6" style={{ color: "#FFF8DC" }}>
                Order Details
              </h2>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Booking ID", value: booking.bookingRef },
                  { label: "Name", value: booking.customerName },
                  { label: "Email", value: booking.customerEmail },
                  { label: "Ticket", value: booking.ticketType },
                  { label: "Quantity", value: String(booking.quantity) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b"
                    style={{ borderColor: "rgba(212,160,23,0.08)" }}>
                    <span className="text-sm" style={{ color: "rgba(255,248,220,0.45)" }}>{label}</span>
                    <span className="text-sm font-medium" style={{ color: "#FFF8DC" }}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl mb-8"
                style={{ background: "rgba(26,5,5,0.8)", border: "1px solid rgba(212,160,23,0.2)" }}>
                <div className="flex justify-between items-center">
                  <span className="font-bold" style={{ color: "#FFF8DC" }}>Total Amount</span>
                  <span className="font-display font-black text-2xl" style={{ color: "#D4A017" }}>
                    {formatCurrency(booking.totalInPaise)}
                  </span>
                </div>
              </div>

              {isDemoMode ? (
                <button
                  onClick={handleDemoPayment}
                  disabled={paying}
                  className="btn-gold w-full py-4 text-base justify-center"
                >
                  {paying ? (
                    <><Loader2 size={18} className="animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard size={18} /> DEMO — CONFIRM BOOKING</>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleRazorpayPayment}
                  disabled={paying}
                  className="btn-gold w-full py-4 text-base justify-center"
                >
                  {paying ? (
                    <><Loader2 size={18} className="animate-spin" /> Opening Payment...</>
                  ) : (
                    <><Lock size={18} /> PAY {formatCurrency(booking.totalInPaise)}</>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-2 mt-4">
                <Shield size={14} style={{ color: "rgba(212,160,23,0.5)" }} />
                <p className="text-xs" style={{ color: "rgba(255,248,220,0.3)" }}>
                  Payments secured by Razorpay. Your data is safe.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0202" }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "#D4A017" }} />
      </div>
    }>
      <CheckoutInner />
    </Suspense>
  );
}
