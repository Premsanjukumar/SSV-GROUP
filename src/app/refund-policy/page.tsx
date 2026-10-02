import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";
import { CreditCard, Clock, CheckCircle2, XCircle, AlertTriangle, HelpCircle, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | SSV Dandiya Divas 2026",
  description:
    "Official Refund and Cancellation Policy for SSV Dandiya Divas 2026 organized by SSV Group, Bidar. Clear timelines and eligibility criteria.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0f0202]">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{
              background: "rgba(109,11,11,0.4)",
              border: "1px solid rgba(212,160,23,0.3)",
              color: "#D4A017",
            }}
          >
            <CreditCard size={14} />
            Payment & Billing
          </div>
          <h1
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl mb-4"
            style={{ color: "#D4A017" }}
          >
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "rgba(255,248,220,0.6)" }}>
            Our transparent refund guidelines, duplicate payment handling, and cancellation terms for SSV Dandiya Divas 2026.
          </p>
          <div className="mt-3 text-xs" style={{ color: "rgba(212,160,23,0.7)" }}>
            Effective Date: October 2026 • SSV Group, Bidar, Karnataka
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Summary Box */}
          <div
            className="p-5 sm:p-6 rounded-2xl border"
            style={{
              background: "linear-gradient(135deg, rgba(139,0,0,0.25), rgba(26,5,5,0.8))",
              borderColor: "rgba(212,160,23,0.3)",
            }}
          >
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-bold text-gold-400 mb-1">Standard Processing Window</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,248,220,0.8)" }}>
                  Eligible refunds are processed within <strong>5 to 7 working business days</strong> directly to the original payment method (UPI, Debit Card, Credit Card, or Net Banking account).
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Eligible Cases for Refund */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <CheckCircle2 size={20} className="text-emerald-400" />
              1. When Are You Eligible for a Refund?
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>Refunds are initiated under the following specific circumstances:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                  <div>
                    <strong>Duplicate / Multiple Deductions:</strong> If your bank account or UPI was charged multiple times for a single ticket order due to a network glitch, all extra charges will be verified and refunded automatically.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                  <div>
                    <strong>Payment Deducted but Ticket Not Generated:</strong> If your account was debited but the booking system failed to generate your confirmation ticket/booking reference, the full amount is auto-reconciled and refunded within 5-7 working days.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                  <div>
                    <strong>Event Cancellation by Organizer:</strong> If the event is permanently cancelled by SSV Group without an alternate reschedule date, 100% of the ticket price will be refunded.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Non-Refundable Cases */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <XCircle size={20} className="text-rose-400" />
              2. Non-Refundable Scenarios
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>Tickets are strictly non-refundable under the following circumstances:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                  <div>
                    <strong>Change of Mind / Personal Unavailability:</strong> Inability to attend the event on 14 October 2026 due to personal schedule, travel conflicts, or emergencies.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                  <div>
                    <strong>No-Show or Late Arrival:</strong> Arriving after gate closing or failing to attend the event during venue operational hours.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                  <div>
                    <strong>Security Denial / Code of Conduct Violation:</strong> Entry denied or attendee removed by venue security for possession of prohibited items, intoxication, unruly behavior, or lack of valid government ID.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: How to Raise a Refund Claim */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <AlertTriangle size={20} className="text-amber-400" />
              3. How to Request a Refund or Report Duplicate Charges
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>
                If you experienced a failed transaction with payment deduction or duplicate debit, please contact our team with:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Your Full Name and Registered Mobile Number / Email ID</li>
                <li>Booking Reference ID (if generated)</li>
                <li>Payment Transaction ID / UPI Reference / Bank UTR Number</li>
                <li>Bank debit SMS or screenshot showing timestamp and amount</li>
              </ol>
              <p className="mt-2 text-xs" style={{ color: "rgba(255,248,220,0.5)" }}>
                Send these details via WhatsApp or Phone to our helpline: <strong>+91 86181 56721</strong> or <strong>+91 94826 29007</strong>.
              </p>
            </div>
          </section>

          {/* Section 4: Refund Timeline & Methods */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4" style={{ color: "#D4A017" }}>
              4. Mode of Refund
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              All refunds are credited strictly to the source bank account, credit card, or UPI VPA from which the original payment originated. We do not issue cash refunds or refunds to third-party bank accounts to protect against financial fraud and comply with RBI regulations.
            </p>
          </section>

          {/* Quick Contact */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30 text-center">
            <h2 className="text-xl font-bold font-display mb-3" style={{ color: "#D4A017" }}>
              Need Help With a Payment?
            </h2>
            <p className="text-sm mb-6" style={{ color: "rgba(255,248,220,0.7)" }}>
              Our payment support desk is ready to help resolve your billing concerns promptly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
              <a
                href="tel:+918618156721"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors font-medium"
              >
                <Phone size={16} /> +91 86181 56721
              </a>
              <a
                href="tel:+919482629007"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors font-medium"
              >
                <Phone size={16} /> +91 94826 29007
              </a>
              <Link
                href="/contact"
                className="btn-primary text-xs px-6 py-2.5 inline-flex items-center gap-2"
              >
                <HelpCircle size={14} /> Contact Us
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
