import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";
import {
  Calendar, Clock, MapPin, Music, Utensils, Camera,
  Star, Sparkles, Trophy, Heart, Zap, Ticket, ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Event Details | SSV Dandiya Divas 2026",
  description:
    "Full details for SSV Dandiya Divas 2026 — Date, time, venue, highlights, lineup, and ticket information.",
};

const highlights = [
  { icon: Music, label: "DJ + Live", desc: "Electrifying DJ sets and live performances throughout the night" },
  { icon: Utensils, label: "Food Stall", desc: "Delicious festive food and beverages at dedicated food stalls" },
  { icon: Camera, label: "Celebrity Selfie", desc: "Exclusive selfie opportunity with SP POWER" },
  { icon: Star, label: "Selfie Booth", desc: "Premium themed selfie booth for memorable photos" },
  { icon: Sparkles, label: "Decoration", desc: "Breathtaking Navratri-themed decoration and lighting" },
  { icon: Trophy, label: "Competition", desc: "Exciting Dandiya competitions with prizes" },
  { icon: Heart, label: "Festive Environment", desc: "An authentic, warm, and joyful Navratri atmosphere" },
];

export default function EventPage() {
  const mapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
    "https://maps.google.com/maps?q=Gumpa,Bidar,Karnataka,India";

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section
          className="relative py-24 px-4 text-center overflow-hidden"
          style={{ background: "linear-gradient(180deg, #1a0505 0%, #0f0202 100%)" }}
        >
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #D4A017 0%, transparent 60%)" }} />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{ background: "rgba(109,11,11,0.4)", border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017" }}>
              SSV GROUP PRESENTS
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl mb-4" style={{ color: "#D4A017" }}>
              Dandiya Divas 2026
            </h1>
            <p className="text-base tracking-widest uppercase mb-2" style={{ color: "rgba(255,248,220,0.5)" }}>
              Tradition • Music • Dance • Togetherness
            </p>
          </div>
        </section>

        {/* Event Info */}
        <section className="py-16 px-4" style={{ background: "#0f0202" }}>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date & Time */}
              <div className="card-festive p-8">
                <h2 className="font-display font-bold text-lg mb-6" style={{ color: "#D4A017" }}>
                  Date & Time
                </h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(139,0,0,0.3)", border: "1px solid rgba(212,160,23,0.2)" }}>
                      <Calendar size={18} style={{ color: "#D4A017" }} />
                    </div>
                    <div>
                      <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(212,160,23,0.6)" }}>Date</div>
                      <div className="font-bold text-lg" style={{ color: "#FFF8DC" }}>14 October 2026</div>
                      <div className="text-sm" style={{ color: "rgba(255,248,220,0.5)" }}>Wednesday</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(139,0,0,0.3)", border: "1px solid rgba(212,160,23,0.2)" }}>
                      <Clock size={18} style={{ color: "#D4A017" }} />
                    </div>
                    <div>
                      <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(212,160,23,0.6)" }}>Time</div>
                      <div className="font-bold text-lg" style={{ color: "#FFF8DC" }}>5:00 PM Onwards</div>
                      <div className="text-sm" style={{ color: "rgba(255,248,220,0.5)" }}>Doors open at 5 PM IST</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div className="card-festive p-8">
                <h2 className="font-display font-bold text-lg mb-6" style={{ color: "#D4A017" }}>
                  Venue
                </h2>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(139,0,0,0.3)", border: "1px solid rgba(212,160,23,0.2)" }}>
                    <MapPin size={18} style={{ color: "#D4A017" }} />
                  </div>
                  <div>
                    <div className="font-bold text-lg" style={{ color: "#FFF8DC" }}>
                      Beside Beladale Petrol Pump
                    </div>
                    <div className="text-sm mt-1" style={{ color: "rgba(255,248,220,0.7)" }}>Gumpa, Bidar</div>
                    <div className="text-sm" style={{ color: "rgba(255,248,220,0.45)" }}>Karnataka, India</div>
                  </div>
                </div>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="btn-outline text-xs px-4 py-2.5 inline-flex">
                  <MapPin size={14} />
                  VIEW ON GOOGLE MAPS
                </a>
              </div>

              {/* Featuring */}
              <div className="card-festive p-8 md:col-span-2">
                <h2 className="font-display font-bold text-lg mb-4" style={{ color: "#D4A017" }}>
                  Featuring
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #8B0000, #C0392B)", border: "1px solid rgba(212,160,23,0.3)" }}>
                    <Zap size={28} style={{ color: "#D4A017" }} />
                  </div>
                  <div>
                    <div className="font-display font-black text-3xl" style={{ color: "#D4A017" }}>SP POWER</div>
                    <div className="text-sm mt-1" style={{ color: "rgba(255,248,220,0.5)" }}>
                      Live performance by the sensational SP POWER
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-16 px-4" style={{ background: "linear-gradient(180deg, #0f0202, #1a0505)" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="section-title">Event Highlights</h2>
            <p className="section-subtitle">Everything you can look forward to</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {highlights.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="card-festive p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(139,0,0,0.3)", border: "1px solid rgba(212,160,23,0.2)" }}>
                    <Icon size={20} style={{ color: "#D4A017" }} />
                  </div>
                  <div>
                    <div className="font-bold mb-1" style={{ color: "#FFF8DC" }}>{label}</div>
                    <div className="text-sm leading-relaxed" style={{ color: "rgba(255,248,220,0.5)" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tickets CTA */}
        <section className="py-16 px-4" style={{ background: "#0f0202" }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-3" style={{ color: "#D4A017" }}>
              Ready to Join?
            </h2>
            <p className="text-sm mb-8" style={{ color: "rgba(255,248,220,0.5)" }}>
              Secure your spot for SSV Dandiya Divas 2026 now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/book" className="btn-gold px-10 py-4 text-base w-full sm:w-auto justify-center">
                <Ticket size={18} /> BOOK TICKETS
              </Link>
              <Link href="/" className="btn-outline px-8 py-4 text-base w-full sm:w-auto justify-center">
                ← Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
