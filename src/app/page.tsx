import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountdownTimer from "@/components/CountdownTimer";
import FestiveBackgroundAnimation from "@/components/FestiveBackgroundAnimation";
import SSVLogo from "@/components/SSVLogo";
import BumperOfferSection from "@/components/BumperOfferSection";
import EventHighlights from "@/components/EventHighlights";
import SponsorSection from "@/components/SponsorSection";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  ChevronRight,
  Phone,
  Ticket,
  Zap,
  Gift,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "SSV Group Dandiya Divas 2026 | Bidar",
  description:
    "Official website for SSV Group Dandiya Divas 2026 — Wednesday, 14 October 2026 in Bidar, Karnataka. Organised by SSV GROUP. Featuring SP POWER, DJ Live, Ramp Walk, Food Stalls, Couple Dance, Selfie Booth & more!",
};

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
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-14 sm:pb-20"
          style={{
            background: "#0a0101",
          }}
        >
          {/* Animated Dandiya Festival Grand Artwork Background */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 animate-hero-bg"
              style={{
                backgroundImage: "url('/images/dandiya-hero-bg.jpg')",
                filter: "brightness(0.85) contrast(1.15) saturate(1.2)",
              }}
            />
            {/* Cinematic Vignette Overlays for Maximum Text Legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(10, 1, 1, 0.35) 0%, rgba(10, 1, 1, 0.82) 75%, #0a0101 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10, 1, 1, 0.75) 0%, transparent 30%, transparent 70%, #0a0101 100%)",
              }}
            />
          </div>

          {/* Top golden accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 z-10"
            style={{
              background:
                "linear-gradient(90deg, transparent, #FF6B00, #F5C842, #D4A017, #FF6B00, transparent)",
            }}
          />

          {/* Glowing background mandalas */}
          <div
            className="mandala-bg animate-spin-slow z-0"
            style={{
              width: "min(680px, 90vw)",
              height: "min(680px, 90vw)",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.08,
              background:
                "radial-gradient(circle, #F5C842 0%, #FF6B00 45%, transparent 75%)",
            }}
          />

          <div className="relative z-10 text-center px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto w-full flex flex-col items-center">
            {/* ============================================================
                ORGANIZER: SSV GROUP ROYAL BANNER (ANIMATED & CENTERED)
                ============================================================ */}
            {/* ============================================================
                ORGANIZER: SSV GROUP ROYAL BANNER (ANIMATED & CENTERED)
                ============================================================ */}
            <div className="w-full max-w-xs sm:max-w-md mx-auto mb-5 sm:mb-6">
              <div className="ssv-brand-box flex flex-col items-center justify-center px-4 sm:px-8 py-3.5 sm:py-4 rounded-2xl animate-ssv-pulse cursor-default border border-gold-500/40 bg-gradient-to-b from-[#240606] to-[#120202] shadow-xl w-full">
                {/* Divine Ganesha Icon with Trishul */}
                <div className="mb-2 transition-transform duration-300 hover:scale-105">
                  <SSVLogo size={46} />
                </div>

                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-amber-300"
                  >
                    Organised by
                  </span>
                </div>
                <h2 className="font-display font-black text-xl sm:text-3xl md:text-4xl tracking-wider sm:tracking-widest ssv-gold-gradient uppercase drop-shadow-[0_2px_12px_rgba(212,160,23,0.5)]">
                  SSV GROUP
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span
                    className="text-[11px] sm:text-xs font-medium italic tracking-wide text-amber-100/90"
                  >
                    Together for More Joy
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sub-tagline top with SVG Sparkles */}
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] sm:text-xs tracking-widest uppercase font-bold text-amber-300 shadow-sm backdrop-blur-sm">
                <Sparkles size={13} className="text-amber-400 flex-shrink-0 animate-pulse" />
                <span>Let&apos;s Dance Celebrate Together</span>
                <Sparkles size={13} className="text-amber-400 flex-shrink-0 animate-pulse" />
              </span>
            </div>

            {/* ============================================================
                MAIN TITLE: RESPONSIVE FLUID TYPOGRAPHY (CLEAN & SEPARATED)
                ============================================================ */}
            <h1 className="w-full flex flex-col items-center justify-center text-center my-2 sm:my-3">
              <span className="hero-title-dandiya select-none">
                DANDIYA
              </span>
              <span className="hero-title-night select-none">
                Night
              </span>
            </h1>

            {/* Official Tagline from poster */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-black/60 border border-gold-800/40 mt-3 sm:mt-4 mb-4 sm:mb-6 text-[10px] min-[360px]:text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-200 shadow-md">
              <span>DANCE</span>
              <span className="text-amber-500">•</span>
              <span>FOOD</span>
              <span className="text-amber-500">•</span>
              <span>FUN</span>
              <span className="text-amber-500">•</span>
              <span>TOGETHER</span>
            </div>

            {/* Gold divider */}
            <div className="gold-divider max-w-xs mx-auto mb-5 sm:mb-6 w-full" />

            {/* Event Info Badges (Responsive Clean Stack on Mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto mb-6 sm:mb-8 w-full">
              <div
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md"
                style={{
                  background: "rgba(26, 5, 5, 0.88)",
                  border: "1px solid rgba(245, 200, 66, 0.4)",
                  color: "#FFF8DC",
                }}
              >
                <Calendar size={16} className="text-amber-400 flex-shrink-0" />
                <span className="line-clamp-1">Wednesday, 14 Oct 2026</span>
              </div>
              <div
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md"
                style={{
                  background: "rgba(26, 5, 5, 0.88)",
                  border: "1px solid rgba(245, 200, 66, 0.4)",
                  color: "#FFF8DC",
                }}
              >
                <Clock size={16} className="text-amber-400 flex-shrink-0" />
                <span>5:00 PM – 10:00 PM</span>
              </div>
              <div
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md"
                style={{
                  background: "rgba(26, 5, 5, 0.88)",
                  border: "1px solid rgba(245, 200, 66, 0.4)",
                  color: "#FFF8DC",
                }}
              >
                <MapPin size={16} className="text-amber-400 flex-shrink-0" />
                <span className="line-clamp-1">RS Open Ground, Bidar</span>
              </div>
            </div>

            {/* Featuring Guest: SP POWER */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl mb-6 sm:mb-8 border border-gold-500/40 bg-gradient-to-r from-red-950/70 via-amber-950/50 to-red-950/70 shadow-lg max-w-full">
              <Zap size={16} className="text-amber-400 animate-bounce flex-shrink-0" />
              <span className="text-[11px] sm:text-xs tracking-widest uppercase font-semibold text-amber-200/90">
                Special Attraction:
              </span>
              <span className="font-display font-black text-base sm:text-lg tracking-wider text-amber-300 drop-shadow-[0_0_10px_rgba(245,200,66,0.6)]">
                SP POWER
              </span>
            </div>

            {/* Responsive Countdown Timer */}
            <div className="mb-8 sm:mb-10 w-full flex justify-center">
              <CountdownTimer />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 w-full max-w-md sm:max-w-none">
              <Link
                href="/book"
                className="btn-gold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl w-full sm:w-auto shadow-2xl font-bold flex items-center justify-center gap-2 group"
              >
                <Ticket size={18} className="group-hover:rotate-12 transition-transform" />
                BOOK TICKETS NOW
              </Link>
              <Link
                href="/event"
                className="btn-outline text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2"
              >
                VIEW EVENT DETAILS
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* Quick Pricing Badge Overview from Poster */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto w-full p-3 sm:p-4 rounded-2xl border border-gold-500/30 bg-black/60 backdrop-blur-md">
              <div className="p-3.5 rounded-xl border border-pink-500/30 bg-gradient-to-b from-pink-950/30 to-black/60 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-pink-300 mb-0.5">
                  ♀ ONLY FOR LADIES
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black font-display text-amber-300">
                    ₹299
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    + ₹200 Shopping Benefit
                  </span>
                </div>
                <div className="text-[10px] text-amber-200/70 uppercase tracking-widest mt-1">
                  Single Entry Pass
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-purple-500/30 bg-gradient-to-b from-purple-950/30 to-black/60 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-0.5">
                  💑 FOR COUPLES
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black font-display text-amber-300">
                    ₹499
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    + ₹200 Shopping Benefit
                  </span>
                </div>
                <div className="text-[10px] text-amber-200/70 uppercase tracking-widest mt-1">
                  Entry for 2 People
                </div>
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className="mt-6 sm:mt-8 text-xs sm:text-sm font-semibold tracking-wider text-amber-300/80 flex items-center justify-center gap-2">
              <span>Same Vibes</span>
              <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
              <span>New Memories</span>
            </div>
          </div>

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, #0a0101)",
            }}
          />
        </section>

        {/* ============================================================
            BUMPER OFFER & LUCKY WINNER SECTION (BEFORE HIGHLIGHTS)
            ============================================================ */}
        <BumperOfferSection />

        {/* ============================================================
            EVENT HIGHLIGHTS (8 HIGHLIGHTS, RAMP WALK AS FIRST ITEM)
            ============================================================ */}
        <EventHighlights />

        {/* ============================================================
            TICKET PRICING SECTION
            ============================================================ */}
        <section
          id="tickets"
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
          style={{
            background:
              "linear-gradient(180deg, #0a0101 0%, #1a0505 50%, #0a0101 100%)",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-950/60 border border-gold-500/30 text-amber-300 mb-3">
                <Ticket size={14} />
                RESERVE YOUR ENTRY
              </div>
              <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">
                Get Your Official Passes
              </h2>
              <p className="section-subtitle mb-0 max-w-xl mx-auto px-4 mt-2">
                Official passes with QR code verification &amp; instant digital delivery
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Single Pass Card */}
              <div className="ticket-card flex flex-col justify-between">
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3
                        className="font-display font-bold text-xl sm:text-2xl"
                        style={{ color: "#D4A017" }}
                      >
                        Single Pass
                      </h3>
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mt-2"
                        style={{
                          background: "rgba(109,11,11,0.4)",
                          border: "1px solid rgba(212,160,23,0.2)",
                          color: "#FFB6C1",
                        }}
                      >
                        ♀ Only for Ladies
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-display font-black text-3xl sm:text-4xl"
                        style={{ color: "#D4A017" }}
                      >
                        ₹299
                      </div>
                      <div className="text-[10px] tracking-widest uppercase text-amber-100/60">
                        per person
                      </div>
                    </div>
                  </div>

                  {/* Shopping Benefit Callout */}
                  <div className="my-3 p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                      <Gift size={13} className="text-amber-400" />
                      Foreign Fits Benefit
                    </span>
                    <span className="text-emerald-300 font-bold">
                      ₹200 Shopping Benefit
                    </span>
                  </div>

                  <div className="ticket-perforation my-5" />

                  <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                    {[
                      "Entry for one woman",
                      "Full access to Dandiya dance floor",
                      "Live DJ & Celebrity performance (SP POWER)",
                      "Access to Food Stalls & Selfie Booth",
                      "Ramp Walk participation opportunity",
                      "Guaranteed ₹200 Foreign Fits shopping benefit",
                      "Instant digital ticket with QR code",
                    ].map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-100/80"
                      >
                        <span
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] sm:text-xs"
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
                    className="btn-primary w-full justify-center py-3.5 sm:py-4 text-xs sm:text-sm font-bold shadow-lg"
                  >
                    <Ticket size={16} />
                    BOOK LADIES PASS — ₹299
                  </Link>
                </div>
              </div>

              {/* Couple Pass Card */}
              <div
                className="ticket-card relative flex flex-col justify-between"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(212,160,23,0.35), 0 20px 60px rgba(0,0,0,0.6)",
                }}
              >
                {/* Popular badge */}
                <div
                  className="absolute top-4 right-4 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full tracking-wider uppercase z-10 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #D4A017, #F5C842)",
                    color: "#3D0808",
                  }}
                >
                  ⭐ Most Popular
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3
                        className="font-display font-bold text-xl sm:text-2xl"
                        style={{ color: "#D4A017" }}
                      >
                        Couples Pass
                      </h3>
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mt-2"
                        style={{
                          background: "rgba(45,80,22,0.3)",
                          border: "1px solid rgba(144,238,144,0.2)",
                          color: "rgba(144,238,144,0.9)",
                        }}
                      >
                        💑 For Couples (2 People)
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-display font-black text-3xl sm:text-4xl"
                        style={{ color: "#D4A017" }}
                      >
                        ₹499
                      </div>
                      <div className="text-[10px] tracking-widest uppercase text-amber-100/60">
                        per couple
                      </div>
                    </div>
                  </div>

                  {/* Shopping Benefit Callout */}
                  <div className="my-3 p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                      <Gift size={13} className="text-amber-400" />
                      Foreign Fits Benefit
                    </span>
                    <span className="text-emerald-300 font-bold">
                      ₹200 Shopping Benefit
                    </span>
                  </div>

                  <div className="ticket-perforation my-5" />

                  <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                    {[
                      "Entry for two attendees (Couple)",
                      "Access to Couple Dance special arena",
                      "Live DJ & SP POWER performance",
                      "Access to Couple / Solo Portrait booth",
                      "Food Stalls & Decoration areas",
                      "Guaranteed ₹200 Foreign Fits shopping benefit",
                      "Instant digital ticket with QR code",
                    ].map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-100/80"
                      >
                        <span
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] sm:text-xs"
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
                    className="btn-gold w-full justify-center py-3.5 sm:py-4 text-xs sm:text-sm font-black shadow-lg"
                  >
                    <Ticket size={16} />
                    BOOK COUPLE PASS — ₹499
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            OFFICIAL SPONSORS SECTION (SSV ENTERPRISES & PARTNERS)
            ============================================================ */}
        <SponsorSection />

        {/* ============================================================
            VENUE SECTION (MATCHING POSTER)
            ============================================================ */}
        <section
          id="venue"
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
          style={{ background: "#0a0101" }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">
              Official Event Venue
            </h2>
            <p className="section-subtitle max-w-xl mx-auto mt-2">
              Spacious open grounds with grand stage, security &amp; ample parking
            </p>

            <div className="card-festive p-6 sm:p-10 md:p-12 inline-block w-full text-center">
              <MapPin
                size={36}
                className="mx-auto mb-3 text-amber-400 animate-bounce"
              />
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400 mb-2">
                LOCATION DETAILS
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl md:text-3xl mb-1 text-white">
                RS OPEN GROUND
              </h3>
              <p className="text-base sm:text-lg font-semibold text-amber-200 mb-1">
                Beside Beldale Petrol Pump, Gumpa
              </p>
              <p className="text-xs sm:text-sm text-amber-100/60 mb-2">
                Bidar, Karnataka, India
              </p>
              <p className="text-xs text-amber-300 font-bold mb-6">
                ⏰ Timing: 5:00 PM to 10:00 PM • Wednesday, 14 October 2026
              </p>

              <a
                href={
                  process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
                  "https://maps.google.com/maps?q=Beside+Beldale+Petrol+Pump+Gumpa+Bidar"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex text-xs sm:text-sm px-6 py-3.5"
              >
                <MapPin size={16} />
                OPEN IN GOOGLE MAPS
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================
            DIRECT HELPLINE / BOOKING CONTACTS (3 OFFICIAL NUMBERS)
            ============================================================ */}
        <section
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
          style={{
            background:
              "linear-gradient(180deg, #0a0101 0%, #1a0505 100%)",
            borderTop: "1px solid rgba(212,160,23,0.15)",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-950/60 border border-gold-500/30 text-amber-300 mb-3">
              <Phone size={14} />
              BOOK YOUR TICKETS ON
            </div>
            <h2
              className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-3"
              style={{ color: "#D4A017" }}
            >
              Contact Organizers
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/60 mb-8 max-w-xl mx-auto px-4">
              Call or WhatsApp our team for passes, group bookings, sponsorship, or general queries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-8 sm:mb-10 max-w-2xl mx-auto">
              <a
                href="tel:+918618156721"
                className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border border-gold-500/30 bg-black/60 transition-all hover:scale-105 hover:border-gold-400 shadow-lg min-h-[90px]"
              >
                <Phone size={20} className="text-amber-400 mb-1.5" />
                <span className="text-[10px] text-amber-200/70 font-semibold uppercase tracking-wider">
                  Helpline 1
                </span>
                <span className="font-bold text-base sm:text-lg text-white mt-0.5">
                  8618156721
                </span>
              </a>

              <a
                href="tel:+919482629007"
                className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border border-gold-500/30 bg-black/60 transition-all hover:scale-105 hover:border-gold-400 shadow-lg min-h-[90px]"
              >
                <Phone size={20} className="text-amber-400 mb-1.5" />
                <span className="text-[10px] text-amber-200/70 font-semibold uppercase tracking-wider">
                  Helpline 2
                </span>
                <span className="font-bold text-base sm:text-lg text-white mt-0.5">
                  9482629007
                </span>
              </a>

              <a
                href="tel:+918431812193"
                className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border border-gold-500/30 bg-black/60 transition-all hover:scale-105 hover:border-gold-400 shadow-lg min-h-[90px]"
              >
                <Phone size={20} className="text-amber-400 mb-1.5" />
                <span className="text-[10px] text-amber-200/70 font-semibold uppercase tracking-wider">
                  Helpline 3
                </span>
                <span className="font-bold text-base sm:text-lg text-white mt-0.5">
                  8431812193
                </span>
              </a>
            </div>

            <Link
              href="/book"
              className="btn-gold px-8 sm:px-12 py-3.5 sm:py-4 text-sm sm:text-base font-black inline-flex items-center gap-3 shadow-xl"
            >
              <Ticket size={18} />
              BOOK ONLINE INSTANTLY
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
