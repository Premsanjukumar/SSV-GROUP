import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SSVLogo from "@/components/SSVLogo";
import BumperOfferSection from "@/components/BumperOfferSection";
import EventHighlights from "@/components/EventHighlights";
import Link from "next/link";
import { Metadata } from "next";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Zap,
  Ticket,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Event Details | SSV Group Dandiya Night 2026",
  description:
    "Full details for SSV Group Dandiya Night 2026 — 14 October 2026 at RS Open Ground, Bidar. Organised by SSV GROUP.",
};

export default function EventPage() {
  const mapsUrl =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
    "https://maps.google.com/maps?q=Beside+Beldale+Petrol+Pump+Gumpa+Bidar";

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section
          className="relative py-24 px-4 text-center overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #1a0505 0%, #0a0101 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, #D4A017 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-gold-500/40 bg-gradient-to-r from-red-950/80 via-amber-950/60 to-red-950/80 text-amber-300 shadow-xl"
            >
              <SSVLogo size={26} />
              ORGANISED BY SSV GROUP • TOGETHER FOR MORE JOY
            </div>
            <h1
              className="font-display font-black text-4xl sm:text-6xl md:text-7xl mb-4 text-amber-300"
            >
              Dandiya Night 2026
            </h1>
            <p
              className="text-base tracking-widest uppercase mb-2 text-amber-200/80 font-bold"
            >
              DANCE • FOOD • FUN • TOGETHER
            </p>
            <p className="text-xs sm:text-sm text-amber-100/60 mt-2">
              ✨ Same Vibes ♥ New Memories ✨
            </p>
          </div>
        </section>

        {/* Event Info Grid */}
        <section className="py-16 px-4" style={{ background: "#0a0101" }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date & Time */}
              <div className="card-festive p-8">
                <h2
                  className="font-display font-bold text-xl mb-6 text-amber-300"
                >
                  Date & Timing
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(139,0,0,0.4)",
                        border: "1px solid rgba(212,160,23,0.3)",
                      }}
                    >
                      <Calendar size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <div
                        className="text-xs tracking-widest uppercase mb-1 text-amber-400/80 font-semibold"
                      >
                        Date
                      </div>
                      <div
                        className="font-bold text-xl text-white"
                      >
                        14 October 2026
                      </div>
                      <div
                        className="text-sm text-amber-100/60"
                      >
                        Wednesday
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(139,0,0,0.4)",
                        border: "1px solid rgba(212,160,23,0.3)",
                      }}
                    >
                      <Clock size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <div
                        className="text-xs tracking-widest uppercase mb-1 text-amber-400/80 font-semibold"
                      >
                        Timing
                      </div>
                      <div
                        className="font-bold text-xl text-white"
                      >
                        5:00 PM to 10:00 PM
                      </div>
                      <div
                        className="text-sm text-amber-100/60"
                      >
                        Gates open promptly at 5:00 PM IST
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div className="card-festive p-8 flex flex-col justify-between">
                <div>
                  <h2
                    className="font-display font-bold text-xl mb-6 text-amber-300"
                  >
                    Venue Location
                  </h2>
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(139,0,0,0.4)",
                        border: "1px solid rgba(212,160,23,0.3)",
                      }}
                    >
                      <MapPin size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <div
                        className="font-black text-xl text-white"
                      >
                        RS OPEN GROUND
                      </div>
                      <div
                        className="text-sm font-semibold text-amber-200 mt-1"
                      >
                        Beside Beldale Petrol Pump, Gumpa
                      </div>
                      <div
                        className="text-xs text-amber-100/60 mt-0.5"
                      >
                        Bidar, Karnataka, India
                      </div>
                    </div>
                  </div>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-xs px-5 py-3 inline-flex self-start"
                >
                  <MapPin size={14} />
                  OPEN IN GOOGLE MAPS
                </a>
              </div>

              {/* Celebrity Attraction */}
              <div className="card-festive p-8 md:col-span-2 border border-gold-500/40 bg-gradient-to-r from-[#1f0606] via-[#2a0a0a] to-[#1f0606]">
                <h2
                  className="font-display font-bold text-lg mb-4 text-amber-300"
                >
                  Special Celebrity Feature
                </h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #8B0000, #C0392B)",
                      border: "1.5px solid rgba(212,160,23,0.6)",
                      boxShadow: "0 0 20px rgba(212,160,23,0.4)",
                    }}
                  >
                    <Zap size={32} className="text-amber-300 animate-bounce" />
                  </div>
                  <div>
                    <div
                      className="font-display font-black text-3xl sm:text-4xl text-amber-300"
                    >
                      SP POWER
                    </div>
                    <p
                      className="text-sm mt-1 text-amber-100/70 leading-relaxed"
                    >
                      Experience electrifying live appearances, sensational musical atmosphere, and direct celebrity selfie opportunities throughout the festival evening!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bumper Offer & Lucky Winner Section */}
        <BumperOfferSection />

        {/* 8 Official Highlights (Ramp Walk as first item) */}
        <EventHighlights />

        {/* Ticket CTA */}
        <section
          className="py-20 px-4 text-center"
          style={{ background: "#0a0101" }}
        >
          <div className="max-w-xl mx-auto">
            <h2
              className="font-display font-black text-3xl mb-4 text-amber-300"
            >
              Ready to Join the Celebration?
            </h2>
            <p
              className="text-sm text-amber-100/60 mb-8"
            >
              Ladies Pass: ₹299/- • Couple Pass: ₹499/-. Instant online booking with QR code ticket.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="btn-gold px-8 py-4 text-sm font-bold">
                <Ticket size={18} />
                BOOK PASSES ONLINE
              </Link>
              <Link href="/contact" className="btn-outline px-8 py-4 text-sm font-bold">
                CONTACT HELPLINE
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
