import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountdownTimer from "@/components/CountdownTimer";
import FestiveBackgroundAnimation from "@/components/FestiveBackgroundAnimation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Music,
  Utensils,
  Camera,
  Star,
  Sparkles,
  Trophy,
  Heart,
  ChevronRight,
  Phone,
  Ticket,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "SSV Dandiya Divas 2026 | Bidar",
  description:
    "Book tickets for SSV Group Dandiya Divas 2026 — 14 October in Bidar, Karnataka. Featuring SP POWER. DJ + Live, Food, Celebrity Selfie & more!",
};

const highlights = [
  { icon: Music, label: "DJ + Live", desc: "Electrifying music all night" },
  { icon: Utensils, label: "Food Stall", desc: "Festive food & beverages" },
  { icon: Camera, label: "Celebrity Selfie", desc: "Selfie with SP POWER" },
  { icon: Star, label: "Selfie Booth", desc: "Premium photo experiences" },
  { icon: Sparkles, label: "Decoration", desc: "Breathtaking festive décor" },
  { icon: Trophy, label: "Competition", desc: "Win exciting prizes" },
  { icon: Heart, label: "Festive Vibe", desc: "Pure Navratri magic" },
];

const sponsors = [
  "SSV Photography and Films",
  "SSV Baby Pops Studio",
  "SSV Finance and Auto Leasing",
  "SSV Ads and Marketing",
  "SSV Boys PG / Hostel",
  "SSV Catering",
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <FestiveBackgroundAnimation />
      <main className="relative z-10">
        {/* ============================================================
            HERO SECTION
            ============================================================ */}
        <section
          id="hero"
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
          style={{
            background:
              "linear-gradient(180deg, #0f0202 0%, #1a0505 40%, #200606 100%)",
          }}
        >
          {/* Decorative elements */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background:
                "linear-gradient(90deg, transparent, #D4A017, #F5C842, #D4A017, transparent)",
            }}
          />
          <div
            className="mandala-bg"
            style={{
              width: "600px",
              height: "600px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.06,
              background:
                "radial-gradient(circle, #D4A017 0%, #FF6B00 40%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-20 right-10 opacity-10 hidden lg:block"
            style={{ fontSize: "120px", lineHeight: 1 }}
            aria-hidden="true"
          >
            🪘
          </div>
          <div
            className="absolute bottom-32 left-10 opacity-10 hidden lg:block"
            style={{ fontSize: "100px", lineHeight: 1 }}
            aria-hidden="true"
          >
            🎊
          </div>

          <div className="relative z-10 text-center px-4 py-12 max-w-5xl mx-auto">
            {/* SSV Group badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-8"
              style={{
                background: "rgba(109, 11, 11, 0.4)",
                border: "1px solid rgba(212, 160, 23, 0.3)",
                color: "#D4A017",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              SSV GROUP PRESENTS
            </div>

            {/* Main title */}
            <h1 className="font-display font-black tracking-tight mb-2">
              <span
                className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
                style={{
                  background:
                    "linear-gradient(135deg, #8B0000 0%, #C0392B 30%, #FF6B00 60%, #D4A017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                  lineHeight: 1.05,
                }}
              >
                DANDIYA
              </span>
              <span
                className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
                style={{
                  color: "#D4A017",
                  textShadow: "0 0 40px rgba(212, 160, 23, 0.4)",
                  lineHeight: 1.05,
                }}
              >
                DIVAS 2026
              </span>
            </h1>

            {/* Tagline */}
            <p
              className="text-sm sm:text-base tracking-widest uppercase font-semibold mt-4 mb-8"
              style={{ color: "rgba(255, 248, 220, 0.5)" }}
            >
              Tradition • Music • Dance • Togetherness
            </p>

            {/* Gold divider */}
            <div className="gold-divider max-w-xs mx-auto mb-8" />

            {/* Event info chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: "rgba(26, 5, 5, 0.8)",
                  border: "1px solid rgba(212,160,23,0.25)",
                  color: "rgba(255,248,220,0.85)",
                }}
              >
                <Calendar size={14} style={{ color: "#D4A017" }} />
                14 October 2026 • Wednesday
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: "rgba(26, 5, 5, 0.8)",
                  border: "1px solid rgba(212,160,23,0.25)",
                  color: "rgba(255,248,220,0.85)",
                }}
              >
                <Clock size={14} style={{ color: "#D4A017" }} />
                5:00 PM Onwards
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: "rgba(26, 5, 5, 0.8)",
                  border: "1px solid rgba(212,160,23,0.25)",
                  color: "rgba(255,248,220,0.85)",
                }}
              >
                <MapPin size={14} style={{ color: "#D4A017" }} />
                Gumpa, Bidar
              </div>
            </div>

            {/* Featuring */}
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-10"
              style={{
                background: "rgba(109, 11, 11, 0.3)",
                border: "1px solid rgba(212,160,23,0.2)",
              }}
            >
              <Zap size={16} style={{ color: "#FF6B00" }} />
              <span
                className="text-xs tracking-widest uppercase"
                style={{ color: "rgba(255,248,220,0.6)" }}
              >
                Featuring
              </span>
              <span
                className="font-display font-bold text-lg tracking-widest"
                style={{ color: "#D4A017" }}
              >
                SP POWER
              </span>
            </div>

            {/* Countdown */}
            <div className="mb-10">
              <CountdownTimer />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="btn-gold text-base px-8 py-4 rounded-xl w-full sm:w-auto"
              >
                <Ticket size={18} />
                BOOK TICKETS
              </Link>
              <Link
                href="/event"
                className="btn-outline text-base px-8 py-4 rounded-xl w-full sm:w-auto"
              >
                VIEW EVENT DETAILS
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Ticket prices teaser */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="text-center">
                <div
                  className="text-2xl font-bold font-display"
                  style={{ color: "#D4A017" }}
                >
                  ₹299
                </div>
                <div
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "rgba(255,248,220,0.4)" }}
                >
                  Single (Women)
                </div>
              </div>
              <div
                className="w-px h-10"
                style={{ background: "rgba(212,160,23,0.2)" }}
              />
              <div className="text-center">
                <div
                  className="text-2xl font-bold font-display"
                  style={{ color: "#D4A017" }}
                >
                  ₹499
                </div>
                <div
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "rgba(255,248,220,0.4)" }}
                >
                  Couple Pass
                </div>
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #0f0202)",
            }}
          />
        </section>

        {/* ============================================================
            HIGHLIGHTS SECTION
            ============================================================ */}
        <section
          id="highlights"
          className="py-20 px-4"
          style={{ background: "#0f0202" }}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="section-title">Event Highlights</h2>
            <p className="section-subtitle">
              An unforgettable Navratri experience awaits
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {highlights.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="card-festive p-6 flex flex-col items-center text-center gap-3 group cursor-default"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(139,0,0,0.4), rgba(192,57,43,0.2))",
                      border: "1px solid rgba(212,160,23,0.25)",
                    }}
                  >
                    <Icon size={24} style={{ color: "#D4A017" }} />
                  </div>
                  <div>
                    <div
                      className="font-bold text-sm tracking-wide"
                      style={{ color: "#FFF8DC" }}
                    >
                      {label}
                    </div>
                    <div
                      className="text-xs mt-1 leading-relaxed"
                      style={{ color: "rgba(255,248,220,0.45)" }}
                    >
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            TICKET SECTION
            ============================================================ */}
        <section
          id="tickets"
          className="py-20 px-4"
          style={{
            background:
              "linear-gradient(180deg, #0f0202 0%, #1a0505 50%, #0f0202 100%)",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="section-title">Get Your Tickets</h2>
            <p className="section-subtitle">
              Limited seats — book early to secure your spot
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Single Pass */}
              <div className="ticket-card">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3
                        className="font-display font-bold text-2xl"
                        style={{ color: "#D4A017" }}
                      >
                        Single Pass
                      </h3>
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mt-2"
                        style={{
                          background: "rgba(109,11,11,0.4)",
                          border: "1px solid rgba(212,160,23,0.2)",
                          color: "rgba(212,160,23,0.8)",
                        }}
                      >
                        ♀ Women Only
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-display font-black text-4xl"
                        style={{ color: "#D4A017" }}
                      >
                        ₹299
                      </div>
                      <div
                        className="text-xs tracking-widest uppercase"
                        style={{ color: "rgba(255,248,220,0.4)" }}
                      >
                        per person
                      </div>
                    </div>
                  </div>

                  <div className="ticket-perforation my-6" />

                  <ul className="space-y-3 mb-8">
                    {[
                      "Entry for one woman",
                      "Access to Dandiya event",
                      "DJ + Live entertainment",
                      "Competition participation*",
                    ].map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-3 text-sm"
                        style={{ color: "rgba(255,248,220,0.7)" }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                          style={{
                            background: "rgba(45,80,22,0.4)",
                            border: "1px solid rgba(144,238,144,0.3)",
                            color: "#90ee90",
                          }}
                        >
                          ✓
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/book?type=single"
                    className="btn-primary w-full justify-center py-4 text-sm"
                  >
                    <Ticket size={16} />
                    BOOK ₹299
                  </Link>

                  <p
                    className="text-xs text-center mt-3"
                    style={{ color: "rgba(255,248,220,0.3)" }}
                  >
                    *Subject to organizer rules
                  </p>
                </div>
              </div>

              {/* Couple Pass */}
              <div
                className="ticket-card"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(212,160,23,0.3), 0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                {/* Popular badge */}
                <div
                  className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, #D4A017, #F5C842)",
                    color: "#3D0808",
                  }}
                >
                  Most Popular
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3
                        className="font-display font-bold text-2xl"
                        style={{ color: "#D4A017" }}
                      >
                        Couple Pass
                      </h3>
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mt-2"
                        style={{
                          background: "rgba(45,80,22,0.3)",
                          border: "1px solid rgba(144,238,144,0.2)",
                          color: "rgba(144,238,144,0.8)",
                        }}
                      >
                        ♥ For Two
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-display font-black text-4xl"
                        style={{ color: "#D4A017" }}
                      >
                        ₹499
                      </div>
                      <div
                        className="text-xs tracking-widest uppercase"
                        style={{ color: "rgba(255,248,220,0.4)" }}
                      >
                        per couple
                      </div>
                    </div>
                  </div>

                  <div className="ticket-perforation my-6" />

                  <ul className="space-y-3 mb-8">
                    {[
                      "Entry for two attendees",
                      "Access to Dandiya event",
                      "DJ + Live entertainment",
                      "Competition participation*",
                    ].map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-3 text-sm"
                        style={{ color: "rgba(255,248,220,0.7)" }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                          style={{
                            background: "rgba(45,80,22,0.4)",
                            border: "1px solid rgba(144,238,144,0.3)",
                            color: "#90ee90",
                          }}
                        >
                          ✓
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/book?type=couple"
                    className="btn-gold w-full justify-center py-4 text-sm"
                  >
                    <Ticket size={16} />
                    BOOK ₹499
                  </Link>

                  <p
                    className="text-xs text-center mt-3"
                    style={{ color: "rgba(255,248,220,0.3)" }}
                  >
                    *Subject to organizer rules
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            VENUE SECTION
            ============================================================ */}
        <section
          id="venue"
          className="py-20 px-4"
          style={{ background: "#0f0202" }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title">Venue</h2>
            <p className="section-subtitle">Find us here</p>

            <div
              className="card-festive p-8 md:p-12 inline-block w-full"
            >
              <MapPin
                size={32}
                className="mx-auto mb-4"
                style={{ color: "#D4A017" }}
              />
              <h3
                className="font-display font-bold text-xl mb-2"
                style={{ color: "#FFF8DC" }}
              >
                Beside Beladale Petrol Pump
              </h3>
              <p
                className="text-lg mb-1"
                style={{ color: "rgba(255,248,220,0.7)" }}
              >
                Gumpa, Bidar
              </p>
              <p
                className="text-sm mb-8"
                style={{ color: "rgba(255,248,220,0.45)" }}
              >
                Karnataka, India
              </p>

              <a
                href={
                  process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
                  "https://maps.google.com/maps?q=Gumpa,Bidar,Karnataka,India"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex"
              >
                <MapPin size={16} />
                VIEW LOCATION
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================
            SPONSORS SECTION
            ============================================================ */}
        <section
          className="py-16 px-4"
          style={{
            background:
              "linear-gradient(180deg, #0f0202 0%, #1a0505 100%)",
            borderTop: "1px solid rgba(212,160,23,0.1)",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="section-title text-2xl md:text-3xl">
              Our Sponsors
            </h2>
            <p className="section-subtitle">
              Proudly supported by the SSV family
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor}
                  className="sponsor-card group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, #8B0000, #C0392B)",
                        border: "1px solid rgba(212,160,23,0.3)",
                        color: "#D4A017",
                      }}
                    >
                      S
                    </div>
                    <span
                      className="text-xs font-medium text-center leading-relaxed"
                      style={{ color: "rgba(255,248,220,0.65)" }}
                    >
                      {sponsor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            CONTACT CTA SECTION
            ============================================================ */}
        <section
          className="py-16 px-4"
          style={{ background: "#0f0202" }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="font-display font-bold text-2xl md:text-3xl mb-3"
              style={{ color: "#D4A017" }}
            >
              Book Your Tickets
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "rgba(255,248,220,0.5)" }}
            >
              Have questions? Call us directly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href="tel:+918618156721"
                className="flex items-center gap-3 px-6 py-4 rounded-xl w-full sm:w-auto justify-center transition-all duration-200 hover:scale-105"
                style={{
                  background: "rgba(26,5,5,0.8)",
                  border: "1px solid rgba(212,160,23,0.3)",
                  color: "#FFF8DC",
                }}
              >
                <Phone size={18} style={{ color: "#D4A017" }} />
                <span className="font-bold text-lg">8618156721</span>
              </a>
              <a
                href="tel:+919482629007"
                className="flex items-center gap-3 px-6 py-4 rounded-xl w-full sm:w-auto justify-center transition-all duration-200 hover:scale-105"
                style={{
                  background: "rgba(26,5,5,0.8)",
                  border: "1px solid rgba(212,160,23,0.3)",
                  color: "#FFF8DC",
                }}
              >
                <Phone size={18} style={{ color: "#D4A017" }} />
                <span className="font-bold text-lg">9482629007</span>
              </a>
            </div>

            <Link href="/book" className="btn-gold px-10 py-4 text-base">
              <Ticket size={18} />
              BOOK ONLINE NOW
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
