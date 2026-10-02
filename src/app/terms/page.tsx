import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";
import { Scale, CheckCircle2, AlertOctagon, ShieldCheck, Ticket, Users, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | SSV Dandiya Divas 2026",
  description:
    "Official Terms and Conditions, code of conduct, and ticketing rules for SSV Dandiya Divas 2026, Bidar.",
};

export default function TermsPage() {
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
            <Scale size={14} />
            Rules & Guidelines
          </div>
          <h1
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl mb-4"
            style={{ color: "#D4A017" }}
          >
            Terms & Conditions
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "rgba(255,248,220,0.6)" }}>
            Please read these terms carefully before purchasing tickets or attending SSV Dandiya Divas 2026.
          </p>
          <div className="mt-3 text-xs" style={{ color: "rgba(212,160,23,0.7)" }}>
            Effective Date: October 2026 • SSV Group, Bidar, Karnataka
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1: Ticket Rules & Entry */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <Ticket size={20} className="text-gold-400" />
              1. Ticketing & Admission Guidelines
            </h2>
            <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <li>
                <strong>Valid Digital Pass Required:</strong> Entry is strictly permitted only upon presenting a valid digital or printed e-ticket with an unscanned, verifiable QR code.
              </li>
              <li>
                <strong>Government Photo ID:</strong> Every attendee must carry a valid original Government Photo ID (Aadhaar Card, Driving License, Voter ID, or Passport) matching the booking details for verification at the security gate.
              </li>
              <li>
                <strong>Age Restrictions & Minors:</strong> Children below 5 years enjoy complimentary entry when accompanied by a ticketed adult guardian. Children 5 years and above require an individual ticket.
              </li>
              <li>
                <strong>Pass Validity:</strong> Each ticket grants admission for a single person (or couple / family depending on the ticket tier purchased) for the event on <strong>14 October 2026</strong>. Re-entry without a valid wristband is prohibited.
              </li>
            </ul>
          </section>

          {/* Section 2: Code of Conduct & Venue Rules */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <Users size={20} className="text-gold-400" />
              2. Cultural Spirit & Code of Conduct
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>
                <strong>SSV Dandiya Divas</strong> is a family-friendly, devotional cultural celebration. Attendees are expected to respect fellow dancers, artists, and staff:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Dress Code:</strong> Traditional Indian festive attire (Chaniya Choli, Kurta Pajama, Kedia, Dhoti, Sarees) is highly encouraged to honor the spirit of Navratri.
                </li>
                <li>
                  <strong>Mutual Respect:</strong> Any form of harassment, vulgarity, offensive language, or unruly behavior toward women, families, or staff will result in immediate expulsion without refund and handover to local law enforcement authorities.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Prohibited Items */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <AlertOctagon size={20} className="text-rose-400" />
              3. Strictly Prohibited Items & Behaviors
            </h2>
            <div className="space-y-3 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>The following items and activities are strictly forbidden inside the event venue:</p>
              <ul className="list-disc pl-5 space-y-2 text-rose-300">
                <li>Alcohol, drugs, narcotics, cigarettes, vapes, and all illicit substances.</li>
                <li>Weapons, sharp objects, fireworks, flammables, or metal rods (only standard wooden/fiber dandiya sticks are permitted).</li>
                <li>Outside cooked food and open beverages (dedicated food stalls are available inside the arena).</li>
                <li>Unauthorised commercial selling or distribution of promotional flyers.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Right of Admission */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <ShieldCheck size={20} className="text-gold-400" />
              4. Security Check & Right of Admission
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              Venue security personnel reserve the right to frisk and inspect bags of all attendees at entry points for public safety. The organizers and security team reserve the right of admission and may refuse entry or remove any person deemed disruptive, intoxicated, or non-compliant with venue rules.
            </p>
          </section>

          {/* Section 5: Governing Law & Jurisdiction */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4" style={{ color: "#D4A017" }}>
              5. Governing Law & Dispute Resolution
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              These terms are governed by and construed in accordance with the laws of India. Any legal disputes, claims, or proceedings arising out of or related to this event or ticket booking shall be subject to the exclusive jurisdiction of the competent courts in <strong>Bidar, Karnataka</strong>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
