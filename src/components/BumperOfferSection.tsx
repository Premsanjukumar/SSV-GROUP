import Link from "next/link";
import { Gift, Trophy, Sparkles, Ticket, ShoppingBag, CheckCircle2, Crown } from "lucide-react";

export default function BumperOfferSection() {
  return (
    <section
      id="bumper-offer"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0101 0%, #1c0505 50%, #0a0101 100%)",
      }}
    >
      {/* Decorative festive ambient glows */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #D4A017 0%, #FF6B00 60%, transparent 80%)",
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #E11D48 0%, #7F1D1D 60%, transparent 80%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-red-950/80 via-amber-950/80 to-red-950/80 border border-gold-500/40 text-amber-300 mb-3 shadow-lg">
            <Sparkles size={14} className="text-amber-400 animate-pulse flex-shrink-0" />
            <span>EXCLUSIVE FESTIVE PERKS</span>
            <Sparkles size={14} className="text-amber-400 animate-pulse flex-shrink-0" />
          </div>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl text-center">
            🎉 BUMPER OFFER &amp; LUCKY WINNER
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto px-4 mt-2 text-xs sm:text-sm md:text-base text-amber-100/80">
            Special celebrations with exclusive shopping rewards brought to you by SSV GROUP &amp; Foreign Fits
          </p>
        </div>

        {/* Bumper Offer Grid: Split 2-card desktop / Stacked mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 items-stretch mb-8 sm:mb-10">
          {/* ============================================================
              CARD 1: ₹200 SHOPPING BENEFIT FOR EVERY PERSON
              ============================================================ */}
          <div
            className="rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-gold-400/60 shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, rgba(38, 8, 8, 0.95) 0%, rgba(20, 3, 3, 0.95) 100%)",
              border: "1.5px solid rgba(212, 160, 23, 0.4)",
              boxShadow: "0 10px 40px -10px rgba(212, 160, 23, 0.15)",
            }}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                <Gift size={13} className="text-amber-400 flex-shrink-0" />
                FOR EVERY PERSON
              </span>
              <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                Guaranteed Benefit
              </span>
            </div>

            <div>
              <div className="text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-amber-200/70 mb-1">
                FOREIGN FITS × DANDIYA DIVAS
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-2 leading-tight">
                🎁 ₹200 OFF
              </h3>
              <p className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider mb-3">
                Shopping Benefit For Every Person!
              </p>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-black/50 border border-gold-800/30 mb-4 text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                Book your Dandiya Divas ticket and enjoy a{" "}
                <span className="text-amber-300 font-extrabold">₹200 shopping benefit</span> at{" "}
                <span className="text-white font-bold">Foreign Fits</span> imported fashion.
              </div>

              {/* Eligibility checklist */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-100/90">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  <span>Eligible on <strong>Single Pass</strong> (₹299 full ticket)</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-100/90">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  <span>Eligible on <strong>Couple Pass</strong> (₹499 full ticket)</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-100/90">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  <span>Available on ticket confirmation after successful payment</span>
                </div>
              </div>

              {/* Clarification banner */}
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/20 text-[11px] text-amber-200/80 mb-5 leading-normal">
                <em>* Note: Ticket price remains ₹299 (Single) / ₹499 (Couple). The ₹200 is an exclusive post-booking store shopping benefit.</em>
              </div>
            </div>

            <Link
              href="/book"
              className="btn-gold w-full justify-center py-3 sm:py-3.5 text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg"
            >
              <Ticket size={16} />
              BOOK TICKET &amp; CLAIM BENEFIT
            </Link>
          </div>

          {/* ============================================================
              CARD 2: ₹5,000 RAMP WALK 1ST WINNER PRIZE
              ============================================================ */}
          <div
            className="rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-amber-300/60 shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, rgba(46, 12, 16, 0.95) 0%, rgba(24, 4, 8, 0.95) 100%)",
              border: "1.5px solid rgba(245, 200, 66, 0.5)",
              boxShadow: "0 10px 40px -10px rgba(245, 200, 66, 0.2)",
            }}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold shadow-md">
                <Crown size={13} className="text-stone-950 flex-shrink-0" />
                CONTEST SPOTLIGHT
              </span>
              <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-950/70 text-red-300 border border-red-500/40">
                1st Winner Only
              </span>
            </div>

            <div>
              <div className="text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-amber-200/70 mb-1">
                FASHION RUNWAY CHAMPION
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-amber-300 mb-2 leading-tight drop-shadow-[0_2px_10px_rgba(245,200,66,0.3)]">
                🏆 ₹5,000/-
              </h3>
              <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3">
                Worth of Foreign Fits Shopping Coupon
              </p>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-black/50 border border-gold-800/30 mb-4 text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                <strong className="text-amber-300 font-extrabold">Ramp Walk 1st Winner</strong> will get{" "}
                <span className="text-white font-bold">Rs: 5,000/- worth</span> of Foreign Fits shopping coupon for{" "}
                <span className="text-amber-200 font-semibold">Foreign Fits imported fashion</span>!
              </div>

              {/* Details & Rules */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-100/90">
                  <Trophy size={16} className="text-amber-400 flex-shrink-0" />
                  <span>Awarded live on stage to the <strong>Ramp Walk 1st Winner</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-100/90">
                  <ShoppingBag size={16} className="text-amber-400 flex-shrink-0" />
                  <span>Valid for <strong>Foreign Fits imported fashion collection</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-100/90">
                  <Crown size={16} className="text-amber-400 flex-shrink-0" />
                  <span>Open to all registered attendees participating in the Ramp Walk</span>
                </div>
              </div>

              {/* Clarity notice */}
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/20 text-[11px] text-amber-200/80 mb-5 leading-normal">
                <em>* Grand winner prize is awarded solely to the 1st Place Ramp Walk winner by celebrity jury.</em>
              </div>
            </div>

            <Link
              href="/event#highlights"
              className="btn-outline w-full justify-center py-3 sm:py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <Trophy size={16} />
              EXPLORE RAMP WALK DETAILS
            </Link>
          </div>
        </div>

        {/* Quick booking link banner */}
        <div className="text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 transition-colors underline underline-offset-4"
          >
            <Ticket size={16} />
            <span>Ready to join? Single Pass: ₹299 • Couple Pass: ₹499 → Book Now</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
