import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountdownTimer from "@/components/CountdownTimer";
import FestiveBackgroundAnimation from "@/components/FestiveBackgroundAnimation";
import SSVLogo from "@/components/SSVLogo";
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
  Heart,
  ChevronRight,
  Phone,
  Ticket,
  Zap,
  Crown,
  Car,
  Building2,
  Megaphone,
  Baby,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "SSV Group Dandiya Night 2026 | Bidar",
  description:
    "Official website for SSV Group Dandiya Night 2026 — 14 October 2026 in Bidar, Karnataka. Organised by SSV GROUP. Featuring SP POWER, DJ + Live, Food Stalls, Couple Dance, Selfie Booths & more!",
};

const highlights = [
  {
    icon: Music,
    label: "DJ + LIVE",
    desc: "High-voltage DJ beats & live music all night",
    badge: "Music",
  },
  {
    icon: Utensils,
    label: "FOOD STALL",
    desc: "Mouth-watering festive delicacies & street treats",
    badge: "Feast",
  },
  {
    icon: Camera,
    label: "CELEBRITY WITH SELFIE",
    desc: "Exclusive selfie moments with celebrity guest SP POWER",
    badge: "Special",
  },
  {
    icon: Heart,
    label: "COUPLE'S PORTRAITS",
    desc: "Cherished themed photographic memories for couples",
    badge: "Memories",
  },
  {
    icon: Star,
    label: "SELFIE BOOTH",
    desc: "Glittering Navratri photo backdrops & 360 frames",
    badge: "Photos",
  },
  {
    icon: Users,
    label: "COUPLE DANCE",
    desc: "Traditional Dandiya Raas & Garba floor for couples",
    badge: "Dance",
  },
];

const sponsorsList = [
  {
    name: "SSV PHOTOGRAPHY AND FILMS",
    desc: "Cinematic Event & Wedding Photography",
    icon: Camera,
    highlight: "Visual Magic",
  },
  {
    name: "SSV BABY PROPS STUDIO",
    desc: "Newborn, Toddler & Theme Photo Shoots",
    icon: Baby,
    highlight: "Memories",
  },
  {
    name: "SSV FINANCE AND AUTOLEASING",
    desc: "Vehicle Financing & Auto Solutions",
    icon: Car,
    highlight: "Finance",
  },
  {
    name: "SSV BOYS PG / HOSTEL",
    desc: "Safe, Premium & Comfortable Accommodation",
    icon: Building2,
    highlight: "Stay",
  },
  {
    name: "SSV ADS AND MARKETING",
    desc: "Digital Marketing, Branding & Publicity",
    icon: Megaphone,
    highlight: "Promotions",
  },
  {
    name: "SSV CATRING",
    desc: "Authentic Festive & Event Catering",
    icon: Utensils,
    highlight: "Delicious Food",
  },
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
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16"
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
              width: "700px",
              height: "700px",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.08,
              background:
                "radial-gradient(circle, #F5C842 0%, #FF6B00 45%, transparent 75%)",
            }}
          />

          <div className="relative z-10 text-center px-4 py-8 max-w-5xl mx-auto w-full">
            
            {/* ============================================================
                HIGHLIGHTED SSV GROUP ROYAL BANNER (ANIMATED)
                ============================================================ */}
            <div className="inline-block mb-8">
              <div
                className="ssv-brand-box inline-flex flex-col items-center px-6 sm:px-10 py-4 sm:py-5 rounded-2xl animate-ssv-pulse cursor-default"
              >
                {/* Divine Ganesha Icon with Trishul */}
                <div className="mb-2 transition-transform duration-300 hover:scale-110">
                  <SSVLogo size={56} />
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs sm:text-sm font-semibold tracking-widest uppercase"
                    style={{ color: "#F5C842" }}
                  >
                    Organised by
                  </span>
                </div>
                <h2
                  className="font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-widest ssv-gold-gradient uppercase drop-shadow-[0_2px_15px_rgba(212,160,23,0.6)]"
                >
                  SSV GROUP
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span
                    className="text-xs sm:text-sm font-medium italic tracking-wide"
                    style={{ color: "#FFF8DC" }}
                  >
                    Together for More Joy
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sub-tagline top */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-xs tracking-widest uppercase font-bold text-amber-400/90">
                ✨ Let&apos;s Dance Celebrate Together ✨
              </span>
            </div>

            {/* Main Title matching Poster */}
            <h1 className="font-display font-black tracking-tight mb-2">
              <span
                className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold"
                style={{
                  background:
                    "linear-gradient(135deg, #FFF8DC 0%, #F5C842 25%, #FF6B00 65%, #D4A017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.05,
                  filter: "drop-shadow(0 4px 25px rgba(255,107,0,0.4))",
                }}
              >
                Dandiya
              </span>
              <span
                className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl mt-1"
                style={{
                  color: "#FF3366",
                  fontStyle: "italic",
                  fontFamily: "var(--font-sans), sans-serif",
                  textShadow: "0 0 30px rgba(255, 51, 102, 0.6), 0 0 60px rgba(255, 107, 0, 0.4)",
                  lineHeight: 1.1,
                }}
              >
                Night
              </span>
            </h1>

            {/* Official Tagline from poster */}
            <div className="inline-flex items-center gap-2 sm:gap-4 px-4 py-1.5 rounded-full bg-black/40 border border-gold-800/30 my-4 text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-200">
              <span>DANCE</span>
              <span className="text-amber-500">•</span>
              <span>FOOD</span>
              <span className="text-amber-500">•</span>
              <span>FUN</span>
              <span className="text-amber-500">•</span>
              <span>TOGETHER</span>
            </div>

            {/* Gold divider */}
            <div className="gold-divider max-w-xs mx-auto my-6" />

            {/* Event info chips (Official Date, Time & Venue from Poster) */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <div
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg"
                style={{
                  background: "rgba(26, 5, 5, 0.85)",
                  border: "1px solid rgba(245, 200, 66, 0.4)",
                  color: "#FFF8DC",
                }}
              >
                <Calendar size={16} className="text-amber-400" />
                <span>14 OCT 2026 • WEDNESDAY</span>
              </div>
              <div
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg"
                style={{
                  background: "rgba(26, 5, 5, 0.85)",
                  border: "1px solid rgba(245, 200, 66, 0.4)",
                  color: "#FFF8DC",
                }}
              >
                <Clock size={16} className="text-amber-400" />
                <span>6 PM ONWARDS</span>
              </div>
              <div
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg"
                style={{
                  background: "rgba(26, 5, 5, 0.85)",
                  border: "1px solid rgba(245, 200, 66, 0.4)",
                  color: "#FFF8DC",
                }}
              >
                <MapPin size={16} className="text-amber-400" />
                <span>RS Open Ground, Gumpa Bidar</span>
              </div>
            </div>

            {/* Featuring Guest */}
            <div
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl mb-8 border border-gold-500/40 bg-gradient-to-r from-red-950/60 via-amber-950/40 to-red-950/60"
            >
              <Zap size={18} className="text-amber-400 animate-bounce" />
              <span
                className="text-xs tracking-widest uppercase font-semibold text-amber-200/80"
              >
                Special Celebrity Attraction:
              </span>
              <span
                className="font-display font-black text-lg tracking-wider text-amber-300 drop-shadow-[0_0_10px_rgba(245,200,66,0.6)]"
              >
                SP POWER
              </span>
            </div>

            {/* Countdown */}
            <div className="mb-10">
              <CountdownTimer />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/book"
                className="btn-gold text-base px-8 py-4 rounded-xl w-full sm:w-auto shadow-2xl font-bold flex items-center justify-center gap-2 group"
              >
                <Ticket size={20} className="group-hover:rotate-12 transition-transform" />
                BOOK TICKETS NOW
              </Link>
              <Link
                href="/event"
                className="btn-outline text-base px-8 py-4 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2"
              >
                VIEW EVENT DETAILS
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* Official Ticket Price Banner from Poster */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto p-4 rounded-2xl border border-gold-500/30 bg-black/50 backdrop-blur-md">
              <div className="p-4 rounded-xl border border-pink-500/30 bg-gradient-to-b from-pink-950/30 to-black/60 text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-pink-300 mb-1">
                  ♀ ONLY FOR LADIES
                </div>
                <div className="text-3xl font-black font-display text-amber-300">
                  ₹299/-
                </div>
                <div className="text-[11px] text-amber-200/60 uppercase tracking-widest mt-1">
                  Single Entry Pass
                </div>
              </div>

              <div className="p-4 rounded-xl border border-purple-500/30 bg-gradient-to-b from-purple-950/30 to-black/60 text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">
                  💑 COUPLES PASS
                </div>
                <div className="text-3xl font-black font-display text-amber-300">
                  ₹499/-
                </div>
                <div className="text-[11px] text-amber-200/60 uppercase tracking-widest mt-1">
                  Entry for 2 People
                </div>
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className="mt-8 text-sm font-semibold tracking-wider text-amber-300/80 flex items-center justify-center gap-2">
              <span>Same Vibes</span>
              <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
              <span>New Memories</span>
            </div>
          </div>

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, #0a0101)",
            }}
          />
        </section>

        {/* ============================================================
            HIGHLIGHTS SECTION (6 OFFICIAL POSTER HIGHLIGHTS)
            ============================================================ */}
        <section
          id="highlights"
          className="py-20 px-4"
          style={{ background: "#0a0101" }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-950/60 border border-gold-500/30 text-amber-300 mb-3">
                <Sparkles size={14} />
                WHAT AWAITS YOU
              </div>
              <h2 className="section-title text-3xl sm:text-4xl">Event Highlights</h2>
              <p className="section-subtitle mb-0">
                Experience Bidar&apos;s most sensational Dandiya celebration
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map(({ icon: Icon, label, desc, badge }) => (
                <div
                  key={label}
                  className="card-festive p-6 flex flex-col items-center text-center gap-4 group cursor-default transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(139,0,0,0.6), rgba(192,57,43,0.3))",
                        border: "1.5px solid rgba(212,160,23,0.4)",
                      }}
                    >
                      <Icon size={28} className="text-amber-300 transition-transform group-hover:rotate-6" />
                    </div>
                    <span className="absolute -bottom-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {badge}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="font-display font-black text-base tracking-wide text-amber-200"
                    >
                      {label}
                    </h3>
                    <p
                      className="text-xs mt-1.5 leading-relaxed text-amber-100/60"
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            OFFICIAL SPONSORS SECTION — SSV FAMILY SHOWCASE (HIGHLIGHTED)
            ============================================================ */}
        <section
          id="sponsors"
          className="py-20 px-4 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #0a0101 0%, #170404 50%, #0a0101 100%)",
            borderTop: "1px solid rgba(212,160,23,0.2)",
            borderBottom: "1px solid rgba(212,160,23,0.2)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Header with Crown & Royal SSV highlight */}
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-red-950/80 via-amber-950/60 to-red-950/80 border border-gold-500/40 text-amber-300 mb-3 shadow-lg">
                <Crown size={16} className="text-amber-300 animate-crown" />
                OUR PROUD SPONSORS
              </div>
              <h2 className="section-title text-3xl sm:text-4xl">
                Powering Dandiya Night 2026
              </h2>
              <p className="section-subtitle max-w-xl mx-auto">
                Organised & supported with love by the enterprises of <strong className="text-amber-300 font-bold">SSV GROUP</strong>
              </p>
            </div>

            {/* 6 SSV Vertical Cards with Rich Icons & Animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsorsList.map((sponsor) => {
                const IconComponent = sponsor.icon;
                return (
                  <div
                    key={sponsor.name}
                    className="relative group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 border border-gold-800/30 hover:border-gold-400/80 bg-gradient-to-b from-[#1c0606] to-[#120303] shadow-xl hover:shadow-[0_10px_30px_rgba(212,160,23,0.2)]"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                        style={{
                          background:
                            "linear-gradient(135deg, #8B0000, #C0392B)",
                          border: "1.5px solid rgba(245,200,66,0.6)",
                          boxShadow: "0 0 15px rgba(212,160,23,0.3)",
                        }}
                      >
                        <IconComponent size={24} className="text-amber-200" />
                      </div>
                      <div className="flex-1">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1.5">
                          {sponsor.highlight}
                        </span>
                        <h3 className="font-display font-black text-sm text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {sponsor.name}
                        </h3>
                        <p className="text-xs text-amber-100/60 mt-1 leading-relaxed">
                          {sponsor.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Quote */}
            <div className="mt-12 text-center p-6 rounded-2xl border border-gold-800/20 bg-black/40 max-w-2xl mx-auto">
              <p className="text-xs sm:text-sm text-amber-200/80 italic">
                &ldquo;SSV GROUP is committed to bringing top-tier entertainment, cultural pride, and joy to the people of Bidar.&rdquo;
              </p>
              <div className="text-[11px] uppercase tracking-widest text-amber-400 font-bold mt-2">
                — SSV GROUP ORGANIZING COMMITTEE
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            TICKET PRICING SECTION
            ============================================================ */}
        <section
          id="tickets"
          className="py-20 px-4"
          style={{
            background:
              "linear-gradient(180deg, #0a0101 0%, #1a0505 50%, #0a0101 100%)",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-950/60 border border-gold-500/30 text-amber-300 mb-3">
                <Ticket size={14} />
                RESERVE YOUR ENTRY
              </div>
              <h2 className="section-title text-3xl sm:text-4xl">Get Your Passes</h2>
              <p className="section-subtitle mb-0">
                Official passes with QR code verification & digital instant delivery
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                          color: "#FFB6C1",
                        }}
                      >
                        ♀ Only for Ladies
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
                        className="text-xs tracking-widest uppercase text-amber-100/50"
                      >
                        per person
                      </div>
                    </div>
                  </div>

                  <div className="ticket-perforation my-6" />

                  <ul className="space-y-3 mb-8">
                    {[
                      "Entry for one woman",
                      "Full access to Dandiya dance floor",
                      "Live DJ & Celebrity performance (SP POWER)",
                      "Access to Food Stalls & Selfie Booth",
                      "Instant digital ticket with QR code",
                    ].map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-3 text-sm text-amber-100/80"
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
                    className="btn-primary w-full justify-center py-4 text-sm font-bold"
                  >
                    <Ticket size={16} />
                    BOOK LADIES PASS — ₹299
                  </Link>
                </div>
              </div>

              {/* Couple Pass */}
              <div
                className="ticket-card relative"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(212,160,23,0.35), 0 20px 60px rgba(0,0,0,0.6)",
                }}
              >
                {/* Popular badge */}
                <div
                  className="absolute top-4 right-4 text-xs font-black px-3 py-1 rounded-full tracking-wider uppercase z-10 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #D4A017, #F5C842)",
                    color: "#3D0808",
                  }}
                >
                  ⭐ Most Popular
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3
                        className="font-display font-bold text-2xl"
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
                        className="font-display font-black text-4xl"
                        style={{ color: "#D4A017" }}
                      >
                        ₹499
                      </div>
                      <div
                        className="text-xs tracking-widest uppercase text-amber-100/50"
                      >
                        per couple
                      </div>
                    </div>
                  </div>

                  <div className="ticket-perforation my-6" />

                  <ul className="space-y-3 mb-8">
                    {[
                      "Entry for two attendees (Couple)",
                      "Access to Couple Dance special arena",
                      "Live DJ & SP POWER performance",
                      "Complimentary Couple Portrait access",
                      "Instant digital ticket with QR code",
                    ].map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-3 text-sm text-amber-100/80"
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
                    className="btn-gold w-full justify-center py-4 text-sm font-black"
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
            VENUE SECTION (MATCHING POSTER)
            ============================================================ */}
        <section
          id="venue"
          className="py-20 px-4"
          style={{ background: "#0a0101" }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title">Official Event Venue</h2>
            <p className="section-subtitle">Spacious open grounds with grand stage & parking</p>

            <div
              className="card-festive p-8 md:p-12 inline-block w-full text-center"
            >
              <MapPin
                size={36}
                className="mx-auto mb-4 text-amber-400 animate-bounce"
              />
              <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
                LOCATION DETAILS
              </div>
              <h3
                className="font-display font-black text-2xl md:text-3xl mb-2 text-white"
              >
                RS OPEN GROUND
              </h3>
              <p
                className="text-lg font-semibold text-amber-200 mb-1"
              >
                Beside Beldale Petrol Pump, Gumpa
              </p>
              <p
                className="text-sm text-amber-100/60 mb-8"
              >
                Bidar, Karnataka, India
              </p>

              <a
                href={
                  process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
                  "https://maps.google.com/maps?q=Beside+Beldale+Petrol+Pump+Gumpa+Bidar"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex text-sm px-6 py-3.5"
              >
                <MapPin size={18} />
                OPEN IN GOOGLE MAPS
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================
            DIRECT HELPLINE / BOOKING CONTACTS (3 OFFICIAL NUMBERS)
            ============================================================ */}
        <section
          className="py-20 px-4"
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
              className="font-display font-bold text-3xl md:text-4xl mb-3"
              style={{ color: "#D4A017" }}
            >
              Contact Organizers
            </h2>
            <p
              className="text-sm text-amber-100/60 mb-8 max-w-xl mx-auto"
            >
              Call or WhatsApp our team for passes, group bookings, sponsorship, or general queries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <a
                href="tel:+918618156721"
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-gold-500/30 bg-black/60 transition-all hover:scale-105 hover:border-gold-400 shadow-lg"
              >
                <Phone size={22} className="text-amber-400 mb-2" />
                <span className="text-xs text-amber-200/70 font-semibold uppercase">Helpline 1</span>
                <span className="font-bold text-lg text-white mt-0.5">8618156721</span>
              </a>

              <a
                href="tel:+919482629007"
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-gold-500/30 bg-black/60 transition-all hover:scale-105 hover:border-gold-400 shadow-lg"
              >
                <Phone size={22} className="text-amber-400 mb-2" />
                <span className="text-xs text-amber-200/70 font-semibold uppercase">Helpline 2</span>
                <span className="font-bold text-lg text-white mt-0.5">9482629007</span>
              </a>

              <a
                href="tel:+918431812193"
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-gold-500/30 bg-black/60 transition-all hover:scale-105 hover:border-gold-400 shadow-lg"
              >
                <Phone size={22} className="text-amber-400 mb-2" />
                <span className="text-xs text-amber-200/70 font-semibold uppercase">Helpline 3</span>
                <span className="font-bold text-lg text-white mt-0.5">8431812193</span>
              </a>
            </div>

            <Link href="/book" className="btn-gold px-12 py-4 text-base font-black inline-flex items-center gap-3">
              <Ticket size={20} />
              BOOK ONLINE INSTANTLY
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
