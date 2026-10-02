"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Ticket, AlertCircle, CheckCircle, ChevronRight, Loader2 } from "lucide-react";

interface TicketType {
  id: string;
  name: string;
  description: string;
  priceInPaise: number;
  available: number;
  maxPerOrder: number;
  isActive: boolean;
  isFemaleOnly: boolean;
}

interface BookingState {
  step: 1 | 2 | 3;
  ticketType: TicketType | null;
  quantity: number;
  form: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCity: string;
    femaleConfirmation: boolean;
  };
}

function formatCurrency(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN");
}

function BookingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("type");

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<BookingState>({
    step: 1,
    ticketType: null,
    quantity: 1,
    form: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerCity: "",
      femaleConfirmation: false,
    },
  });

  useEffect(() => {
    fetchTicketTypes();
  }, []);

  async function fetchTicketTypes() {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (data.ticketTypes) {
        setTicketTypes(data.ticketTypes);
        // Preselect from URL param
        if (preselected) {
          const match = data.ticketTypes.find((t: TicketType) =>
            preselected === "single"
              ? t.isFemaleOnly
              : !t.isFemaleOnly
          );
          if (match) setState((s) => ({ ...s, ticketType: match, step: 1 }));
        }
      }
    } catch {
      setError("Failed to load ticket information. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  function selectTicket(ticket: TicketType) {
    setState((s) => ({ ...s, ticketType: ticket, quantity: 1, step: 2 }));
    setError(null);
  }

  function updateForm(field: keyof BookingState["form"], value: string | boolean) {
    setState((s) => ({ ...s, form: { ...s.form, [field]: value } }));
    setError(null);
  }

  function validateStep2(): string | null {
    const { form, ticketType } = state;
    if (!form.customerName.trim() || form.customerName.length < 2) return "Please enter your full name";
    if (!/^[a-zA-Z\s.'-]+$/.test(form.customerName)) return "Name contains invalid characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) return "Enter a valid email address";
    if (!/^[6-9]\d{9}$/.test(form.customerPhone)) return "Enter a valid 10-digit mobile number";
    if (ticketType?.isFemaleOnly && !form.femaleConfirmation)
      return "You must confirm eligibility for the Single Pass (Women Only)";
    return null;
  }

  async function handleProceed() {
    if (state.step === 1) {
      if (!state.ticketType) { setError("Please select a ticket type"); return; }
      setError(null);
      setState((s) => ({ ...s, step: 2 }));
      return;
    }

    if (state.step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
      setError(null);
      setState((s) => ({ ...s, step: 3 }));
      return;
    }

    if (state.step === 3) {
      await submitBooking();
    }
  }

  async function submitBooking() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketTypeId: state.ticketType!.id,
          quantity: state.quantity,
          customerName: state.form.customerName.trim(),
          customerEmail: state.form.customerEmail.trim().toLowerCase(),
          customerPhone: state.form.customerPhone.trim(),
          customerCity: state.form.customerCity.trim() || undefined,
          femaleConfirmation: state.form.femaleConfirmation,
          eventId: "auto", // server will resolve
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      // Redirect to checkout with booking ID
      router.push(`/checkout?bookingId=${data.bookingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const totalInPaise = (state.ticketType?.priceInPaise || 0) * state.quantity;

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen" style={{ background: "#0f0202" }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display font-black text-3xl md:text-4xl mb-2" style={{ color: "#D4A017" }}>
              Book Tickets
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,248,220,0.5)" }}>
              SSV Dandiya Divas 2026 • 14 October • Bidar
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[
              { n: 1, label: "Select Ticket" },
              { n: 2, label: "Your Details" },
              { n: 3, label: "Review & Pay" },
            ].map(({ n, label }, i, arr) => (
              <div key={n} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                    style={{
                      background: state.step >= n
                        ? "linear-gradient(135deg, #8B0000, #C0392B)"
                        : "rgba(26,5,5,0.8)",
                      border: state.step >= n
                        ? "1px solid rgba(212,160,23,0.5)"
                        : "1px solid rgba(212,160,23,0.15)",
                      color: state.step >= n ? "#D4A017" : "rgba(255,248,220,0.3)",
                    }}
                  >
                    {state.step > n ? <CheckCircle size={16} /> : n}
                  </div>
                  <span className="text-xs font-medium hidden sm:block"
                    style={{ color: state.step >= n ? "#D4A017" : "rgba(255,248,220,0.3)" }}>
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-8 h-px mx-1"
                    style={{ background: state.step > n ? "rgba(212,160,23,0.5)" : "rgba(212,160,23,0.15)" }} />
                )}
              </div>
            ))}
          </div>

          {/* Error banner */}
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
          ) : (
            <div className="card-festive overflow-hidden">
              {/* STEP 1: Select Ticket */}
              {state.step === 1 && (
                <div className="p-6 sm:p-8">
                  <h2 className="font-bold text-lg mb-6" style={{ color: "#FFF8DC" }}>
                    Select Ticket Type
                  </h2>
                  <div className="space-y-4">
                    {ticketTypes.map((ticket) => {
                      const isSelected = state.ticketType?.id === ticket.id;
                      const isSoldOut = ticket.available <= 0;
                      return (
                        <button
                          key={ticket.id}
                          onClick={() => !isSoldOut && selectTicket(ticket)}
                          disabled={isSoldOut}
                          className="w-full text-left rounded-xl p-5 transition-all duration-200"
                          style={{
                            background: isSelected
                              ? "rgba(139,0,0,0.3)"
                              : "rgba(26,5,5,0.6)",
                            border: isSelected
                              ? "2px solid rgba(212,160,23,0.6)"
                              : "1px solid rgba(212,160,23,0.15)",
                            cursor: isSoldOut ? "not-allowed" : "pointer",
                            opacity: isSoldOut ? 0.5 : 1,
                          }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{
                                  borderColor: isSelected ? "#D4A017" : "rgba(212,160,23,0.3)",
                                  background: isSelected ? "rgba(212,160,23,0.2)" : "transparent",
                                }}
                              >
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-gold-400" />}
                              </div>
                              <div>
                                <div className="font-bold" style={{ color: "#FFF8DC" }}>{ticket.name}</div>
                                {ticket.isFemaleOnly && (
                                  <span className="text-xs font-semibold" style={{ color: "rgba(212,160,23,0.7)" }}>
                                    ♀ Women Only
                                  </span>
                                )}
                                <div className="text-sm mt-1" style={{ color: "rgba(255,248,220,0.5)" }}>
                                  {ticket.description}
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="font-display font-black text-2xl" style={{ color: "#D4A017" }}>
                                {formatCurrency(ticket.priceInPaise)}
                              </div>
                              {isSoldOut
                                ? <span className="badge-sold-out text-xs">Sold Out</span>
                                : <span className="badge-available text-xs">{ticket.available} left</span>
                              }
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {state.ticketType && (
                    <div className="mt-6">
                      <label className="form-label">Quantity</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setState((s) => ({ ...s, quantity: Math.max(1, s.quantity - 1) }))}
                          className="w-10 h-10 rounded-xl font-bold text-lg flex items-center justify-center transition-all"
                          style={{ background: "rgba(139,0,0,0.3)", border: "1px solid rgba(212,160,23,0.2)", color: "#D4A017" }}
                        >
                          −
                        </button>
                        <span className="font-display font-bold text-2xl w-8 text-center" style={{ color: "#FFF8DC" }}>
                          {state.quantity}
                        </span>
                        <button
                          onClick={() => setState((s) => ({ ...s, quantity: Math.min(state.ticketType!.maxPerOrder, s.quantity + 1) }))}
                          className="w-10 h-10 rounded-xl font-bold text-lg flex items-center justify-center transition-all"
                          style={{ background: "rgba(139,0,0,0.3)", border: "1px solid rgba(212,160,23,0.2)", color: "#D4A017" }}
                        >
                          +
                        </button>
                        <span className="text-sm" style={{ color: "rgba(255,248,220,0.4)" }}>
                          Max {state.ticketType.maxPerOrder} per order
                        </span>
                      </div>
                      <div className="mt-4 p-3 rounded-lg" style={{ background: "rgba(26,5,5,0.6)", border: "1px solid rgba(212,160,23,0.1)" }}>
                        <div className="flex justify-between text-sm">
                          <span style={{ color: "rgba(255,248,220,0.5)" }}>
                            {state.quantity} × {formatCurrency(state.ticketType.priceInPaise)}
                          </span>
                          <span className="font-bold" style={{ color: "#D4A017" }}>
                            {formatCurrency(totalInPaise)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Details Form */}
              {state.step === 2 && (
                <div className="p-6 sm:p-8">
                  <h2 className="font-bold text-lg mb-6" style={{ color: "#FFF8DC" }}>
                    Your Details
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <label className="form-label" htmlFor="customerName">Full Name *</label>
                      <input
                        id="customerName"
                        type="text"
                        className="form-input"
                        placeholder="Enter your full name"
                        value={state.form.customerName}
                        onChange={(e) => updateForm("customerName", e.target.value)}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="customerEmail">Email Address *</label>
                      <input
                        id="customerEmail"
                        type="email"
                        className="form-input"
                        placeholder="your@email.com"
                        value={state.form.customerEmail}
                        onChange={(e) => updateForm("customerEmail", e.target.value)}
                        autoComplete="email"
                      />
                      <p className="text-xs mt-1" style={{ color: "rgba(255,248,220,0.35)" }}>
                        Ticket confirmation will be sent here
                      </p>
                    </div>
                    <div>
                      <label className="form-label" htmlFor="customerPhone">Mobile Number *</label>
                      <input
                        id="customerPhone"
                        type="tel"
                        className="form-input"
                        placeholder="10-digit mobile number"
                        value={state.form.customerPhone}
                        onChange={(e) => updateForm("customerPhone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                        autoComplete="tel"
                        maxLength={10}
                      />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="customerCity">City (Optional)</label>
                      <input
                        id="customerCity"
                        type="text"
                        className="form-input"
                        placeholder="Your city"
                        value={state.form.customerCity}
                        onChange={(e) => updateForm("customerCity", e.target.value)}
                      />
                    </div>

                    {state.ticketType?.isFemaleOnly && (
                      <div
                        className="p-4 rounded-xl"
                        style={{ background: "rgba(109,11,11,0.2)", border: "1px solid rgba(212,160,23,0.2)" }}
                      >
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="mt-0.5 w-4 h-4 accent-red-700"
                            checked={state.form.femaleConfirmation}
                            onChange={(e) => updateForm("femaleConfirmation", e.target.checked)}
                            id="femaleConfirmation"
                          />
                          <span className="text-sm leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
                            I confirm that this Single Pass is being booked for an eligible woman,
                            in accordance with the organizer&apos;s policy.
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Order Summary */}
              {state.step === 3 && (
                <div className="p-6 sm:p-8">
                  <h2 className="font-bold text-lg mb-6" style={{ color: "#FFF8DC" }}>
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    {[
                      { label: "Event", value: "SSV Dandiya Divas 2026" },
                      { label: "Date", value: "14 October 2026, Wednesday" },
                      { label: "Ticket Type", value: state.ticketType?.name || "" },
                      { label: "Quantity", value: String(state.quantity) },
                      { label: "Name", value: state.form.customerName },
                      { label: "Email", value: state.form.customerEmail },
                      { label: "Mobile", value: state.form.customerPhone },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start gap-4 py-3 border-b"
                        style={{ borderColor: "rgba(212,160,23,0.08)" }}>
                        <span className="text-sm" style={{ color: "rgba(255,248,220,0.45)" }}>{label}</span>
                        <span className="text-sm font-medium text-right" style={{ color: "#FFF8DC" }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl p-5" style={{ background: "rgba(26,5,5,0.8)", border: "1px solid rgba(212,160,23,0.2)" }}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm" style={{ color: "rgba(255,248,220,0.5)" }}>
                        {state.quantity} × {formatCurrency(state.ticketType?.priceInPaise || 0)}
                      </span>
                      <span style={{ color: "#FFF8DC" }}>{formatCurrency(totalInPaise)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm" style={{ color: "rgba(255,248,220,0.5)" }}>Platform fee</span>
                      <span className="text-sm" style={{ color: "rgba(255,248,220,0.5)" }}>₹0</span>
                    </div>
                    <div className="border-t pt-3 mt-3" style={{ borderColor: "rgba(212,160,23,0.2)" }}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold" style={{ color: "#FFF8DC" }}>Total</span>
                        <span className="font-display font-black text-2xl" style={{ color: "#D4A017" }}>
                          {formatCurrency(totalInPaise)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs mt-4" style={{ color: "rgba(255,248,220,0.3)" }}>
                    By proceeding you agree to the{" "}
                    <a href="/terms" target="_blank" className="underline" style={{ color: "rgba(212,160,23,0.6)" }}>
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/refund-policy" target="_blank" className="underline" style={{ color: "rgba(212,160,23,0.6)" }}>
                      Refund Policy
                    </a>.
                  </p>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="px-6 sm:px-8 pb-8 flex items-center justify-between gap-4">
                {state.step > 1 ? (
                  <button
                    onClick={() => setState((s) => ({ ...s, step: (s.step - 1) as 1 | 2 | 3 }))}
                    className="btn-outline text-sm px-5 py-3"
                    disabled={submitting}
                  >
                    ← Back
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={handleProceed}
                  disabled={submitting || (!state.ticketType && state.step === 1)}
                  className="btn-gold text-sm px-6 py-3 flex-1 sm:flex-none sm:min-w-[180px] justify-center"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Processing...</>
                  ) : state.step === 3 ? (
                    <><Ticket size={16} /> Proceed to Pay</>
                  ) : (
                    <>Continue <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0202" }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "#D4A017" }} />
      </div>
    }>
      <BookingPageInner />
    </Suspense>
  );
}
