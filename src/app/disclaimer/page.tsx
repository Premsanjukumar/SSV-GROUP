import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";
import { AlertCircle, ShieldAlert, Sparkles, HeartPulse, Video, Info, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer | SSV Dandiya Divas 2026",
  description:
    "Official Event and Legal Disclaimer for SSV Dandiya Divas 2026 organized by SSV Group, Bidar, Karnataka.",
};

export default function DisclaimerPage() {
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
            <AlertCircle size={14} />
            Legal Notice
          </div>
          <h1
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl mb-4"
            style={{ color: "#D4A017" }}
          >
            Disclaimer
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "rgba(255,248,220,0.6)" }}>
            Important event terms, media recording notice, safety advisories, and liability limits for SSV Dandiya Divas 2026.
          </p>
          <div className="mt-3 text-xs" style={{ color: "rgba(212,160,23,0.7)" }}>
            Effective Date: October 2026 • SSV Group, Bidar, Karnataka
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1: General Event Participation */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <HeartPulse size={20} className="text-gold-400" />
              1. Event Participation & Physical Safety
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>
                <strong>SSV Dandiya Divas 2026</strong> is a celebratory cultural dance and music festival involving energetic Garba and Dandiya Raas dancing, large crowds, strobe/laser lighting effects, and amplified sound.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Attendees participate in dance and festival activities voluntarily at their own discretion.
                </li>
                <li>
                  Persons with medical conditions (including but not limited to heart ailments, respiratory sensitivities, pregnancy, or photosensitive epilepsy triggered by flashing lights) are advised to exercise caution and consult their physicians prior to participating.
                </li>
                <li>
                  First-aid stations and emergency assistance will be available on-site at the venue; however, the organizers assume no liability for personal medical events or injuries arising from individual voluntary exertion or negligence.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Personal Belongings & Valuables */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <ShieldAlert size={20} className="text-gold-400" />
              2. Personal Belongings & Valuables
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>
                Attendees are solely responsible for the safety of their personal belongings, mobile phones, jewelry, wallets, Dandiya sticks, and vehicles.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>SSV Group</strong> and the event venue management shall not be held liable for any loss, theft, misplacement, or damage to personal possessions inside or outside the event premises or parking areas.
                </li>
                <li>
                  We strongly advise attendees not to carry excessive cash, expensive valuables, or leave items unattended.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Photography, Audio & Video Recording */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <Video size={20} className="text-gold-400" />
              3. Media, Photography & Video Recording Notice
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>
                By entering the <strong>SSV Dandiya Divas 2026</strong> venue premises, you acknowledge and consent to being filmed, photographed, and recorded by official event photographers, videographers, sponsors, and media partners.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  The organizers reserve the right to use any photos, video clips, and live streams featuring attendees for archival, marketing, promotional, social media, and future event broadcasting purposes without requiring prior individual consent or compensation.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Lineup, Schedule & Performance Changes */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <Sparkles size={20} className="text-gold-400" />
              4. Artist Lineup & Schedule Adjustments
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>
                While the organizer strives to maintain the scheduled artist lineup (including <strong>SP POWER</strong> and featured performers) and event timeline:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  The event schedule, performance order, and stage timings are subject to reasonable modifications or delays due to weather conditions, technical requirements, or administrative guidelines without entitling attendees to refunds.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Website Accuracy */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <Info size={20} className="text-gold-400" />
              5. Information Accuracy
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              All information published on this website regarding event timings, pass categories, attractions, and venue guidelines is provided in good faith. SSV Group makes every effort to ensure information is accurate and up-to-date; however, organizers reserve the right to make necessary updates to event operations as required for attendee safety and regulatory compliance.
            </p>
          </section>

          {/* Contact Section */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30 text-center">
            <h2 className="text-xl font-bold font-display mb-3" style={{ color: "#D4A017" }}>
              Questions or Clarifications?
            </h2>
            <p className="text-sm mb-6" style={{ color: "rgba(255,248,220,0.7)" }}>
              Feel free to get in touch with our event helpline for any questions about policies or venue rules.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
              <a
                href="tel:+918618156721"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors"
              >
                <Phone size={16} /> +91 86181 56721 / +91 94826 29007
              </a>
              <Link
                href="/terms"
                className="btn-primary text-xs px-6 py-2.5 inline-flex items-center gap-2"
              >
                View Terms & Conditions
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
