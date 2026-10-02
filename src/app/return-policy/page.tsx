import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";
import { RotateCcw, ShieldAlert, CheckCircle2, AlertCircle, HelpCircle, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Return Policy | SSV Dandiya Divas 2026",
  description:
    "Official Return Policy for tickets and services purchased for SSV Dandiya Divas 2026, organized by SSV Group, Bidar.",
};

export default function ReturnPolicyPage() {
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
            <RotateCcw size={14} />
            Legal & Compliance
          </div>
          <h1
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl mb-4"
            style={{ color: "#D4A017" }}
          >
            Return Policy
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "rgba(255,248,220,0.6)" }}>
            Please read our policy regarding ticket returns, digital passes, and merchandise for SSV Dandiya Divas 2026.
          </p>
          <div className="mt-3 text-xs" style={{ color: "rgba(212,160,23,0.7)" }}>
            Last Updated: October 2026 • SSV Group, Bidar
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1: Digital Tickets & Event Passes */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <CheckCircle2 size={20} className="text-gold-400" />
              1. Digital Tickets & Entry Passes
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>
                All tickets, passes, and registrations purchased for <strong>SSV Dandiya Divas 2026</strong> (taking place on 14 October 2026 in Bidar, Karnataka) are <strong>digital event entry permits</strong> delivered via Email, SMS, and downloadable QR-code passes.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Non-Returnable Nature:</strong> Because tickets represent access to a live entertainment and cultural event with limited venue capacity, tickets once booked and confirmed <strong>cannot be returned, exchanged, or transferred for monetary cash back</strong>, except under the explicit conditions outlined in our <Link href="/refund-policy" className="text-gold-400 underline hover:text-gold-300">Refund Policy</Link>.
                </li>
                <li>
                  <strong>One-Time QR Verification:</strong> Each ticket features an encrypted, tamper-evident unique QR code. Once scanned at the entry gates on event day, the pass is permanently marked as redeemed and cannot be reused or returned.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Physical Wristbands & Badges */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <ShieldAlert size={20} className="text-gold-400" />
              2. Physical Wristbands, Dandiya Sticks & Accessories
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>
                For attendees receiving physical wristbands or complementary/purchased Dandiya sticks at the venue entrance:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Wristbands:</strong> Security wristbands must be worn securely at all times inside the venue. Torn, tampered, cut, or removed wristbands will not be replaced, returned, or exchanged.
                </li>
                <li>
                  <strong>Damaged Items at Counter:</strong> In the rare event that complimentary Dandiya sticks or pre-booked event merchandise are visibly defective or broken at the time of collection at the venue counter, you may request an immediate replacement at the helpdesk prior to entry.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Event Postponement or Cancellation */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <AlertCircle size={20} className="text-gold-400" />
              3. Event Postponement or Venue Change
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>
                If <strong>SSV Dandiya Divas 2026</strong> is rescheduled, relocated, or cancelled by the organizing committee due to unforeseen circumstances, natural calamity, government directives, or severe weather conditions:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Rescheduled Event:</strong> Your original ticket will automatically remain valid for the newly announced date without requiring any return or re-booking process.
                </li>
                <li>
                  <strong>Full Cancellation:</strong> If the event is permanently cancelled with no alternate date, 100% of the ticket face value will be refunded automatically to the original payment source as per our Refund Policy.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Need Assistance */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30 text-center">
            <h2 className="text-xl font-bold font-display mb-3" style={{ color: "#D4A017" }}>
              Have Questions About Your Booking?
            </h2>
            <p className="text-sm mb-6" style={{ color: "rgba(255,248,220,0.7)" }}>
              Our support team is happy to assist you with booking queries, ticket re-sends, or name corrections.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
              <a
                href="tel:+918618156721"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
              >
                <Phone size={16} /> +91 86181 56721 / +91 94826 29007
              </a>
              <Link
                href="/contact"
                className="btn-primary text-xs px-6 py-2.5 inline-flex items-center gap-2"
              >
                <HelpCircle size={14} /> Contact Support
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
