"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Copy, Check, Ticket, ArrowRight, ShieldCheck, Tag } from "lucide-react";

export default function CouponSection() {
  const [copied, setCopied] = useState(false);
  const couponCode = "DANDIYA200";

  function handleCopy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  return (
    <section
      id="special-offer"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(139, 0, 0, 0.25) 0%, rgba(15, 2, 2, 0.98) 70%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-950/70 border border-gold-500/40 text-amber-300 mb-2 shadow-md">
            <Sparkles size={14} className="text-amber-400 animate-spin-slow" />
            SPECIAL OFFER
          </div>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">
            Save ₹200 on Your Single Pass
          </h2>
          <p className="section-subtitle mb-0 max-w-lg mx-auto">
            Limited-period festive discount for women attendees
          </p>
        </div>

        {/* Voucher Card Container */}
        <div
          className="relative rounded-3xl p-6 sm:p-8 border-2 border-dashed border-amber-400/50 bg-gradient-to-br from-[#240606] via-[#160303] to-[#200505] shadow-[0_10px_40px_rgba(212,160,23,0.18)] overflow-hidden"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-red-600/10 blur-xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Value & Offer Info */}
            <div className="md:col-span-7 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-pink-950/60 border border-pink-500/30 text-pink-300 mb-3">
                <Tag size={12} />
                Single Pass Exclusive
              </div>

              <h3 className="font-display font-black text-3xl sm:text-4xl text-amber-300 tracking-tight leading-none mb-2">
                ₹200 OFF
              </h3>
              <p className="text-base sm:text-lg font-bold text-white mb-2">
                Pay only <span className="text-amber-300 text-xl font-black">₹99</span> instead of <span className="line-through text-amber-200/50">₹299</span>
              </p>
              <p className="text-xs sm:text-sm text-amber-100/70 leading-relaxed mb-4">
                Enjoy complete access to the Dandiya raas floor, DJ Live entertainment, food zones, and selfie arenas at an unbeatable festive price.
              </p>

              {/* Eligibility info badge */}
              <div className="flex items-center justify-center md:justify-start gap-2 text-[11px] text-amber-200/80">
                <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0" />
                <span>Valid <strong>ONLY</strong> for Single Pass (Ladies Entry) • Max 1 per booking</span>
              </div>
            </div>

            {/* Right: Interactive Voucher Code & Copy Action */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full max-w-xs flex flex-col items-center gap-3 p-4 rounded-2xl bg-black/60 border border-gold-500/40 text-center shadow-inner">
                <div className="text-[10px] uppercase font-bold tracking-widest text-amber-200/60">
                  Click below to copy coupon
                </div>

                {/* Clickable Coupon Box */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full group relative flex items-center justify-between px-4 py-3 rounded-xl border border-amber-400/60 bg-gradient-to-r from-amber-950/40 via-red-950/40 to-amber-950/40 hover:border-amber-300 hover:scale-[1.02] transition-all active:scale-[0.98] cursor-pointer"
                  aria-label="Copy coupon code DANDIYA200"
                >
                  <span className="font-mono font-black text-xl tracking-widest text-amber-300 drop-shadow-[0_0_10px_rgba(245,200,66,0.5)]">
                    {couponCode}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-200 group-hover:text-white">
                    {copied ? (
                      <>
                        <Check size={16} className="text-emerald-400" />
                        <span className="text-emerald-400 font-black">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy</span>
                      </>
                    )}
                  </span>
                </button>

                {/* Direct Action CTA */}
                <Link
                  href="/book?type=single&coupon=DANDIYA200"
                  className="btn-gold w-full text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <Ticket size={14} />
                  CLAIM &amp; BOOK NOW (₹99)
                  <ArrowRight size={14} />
                </Link>

                <p className="text-[10px] text-amber-200/50 mt-1">
                  Coupon applies automatically at checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
