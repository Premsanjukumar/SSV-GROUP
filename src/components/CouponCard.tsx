"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Sparkles, Trophy, Gift, Calendar, Tag, ShieldCheck } from "lucide-react";

export interface CouponCardProps {
  code: string;
  type: "SHOPPING_BENEFIT_200" | "RAMP_WALK_WINNER_5000" | string;
  benefitAmount?: number;
  status?: "ACTIVE" | "REDEEMED" | "EXPIRED" | "CANCELLED" | string;
  winnerName?: string | null;
  bookingRef?: string | null;
  expiresAt?: string | Date | null;
  isModal?: boolean;
}

export default function CouponCard({
  code,
  type,
  benefitAmount = 200,
  status = "ACTIVE",
  winnerName,
  bookingRef,
  expiresAt,
  isModal = false,
}: CouponCardProps) {
  const [copied, setCopied] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const isWinnerCoupon = type === "RAMP_WALK_WINNER_5000" || benefitAmount === 5000;
  const isRedeemed = status === "REDEEMED";
  const isExpired = status === "EXPIRED";

  async function handleCopy() {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older webviews
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setCopyFeedback(true);
      setTimeout(() => {
        setCopied(false);
        setCopyFeedback(false);
      }, 3000);
    } catch {
      // ignore
    }
  }

  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : isWinnerCoupon
    ? "30 Nov 2026"
    : "31 Oct 2026";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl transition-all select-none ${
        isWinnerCoupon
          ? "border-2 border-amber-400/80 shadow-[0_0_35px_rgba(212,160,23,0.35)]"
          : "border-2 border-amber-500/50 shadow-[0_0_25px_rgba(212,160,23,0.2)]"
      }`}
      style={{
        background: isWinnerCoupon
          ? "linear-gradient(145deg, #2a0808 0%, #170303 50%, #3a0d0d 100%)"
          : "linear-gradient(145deg, #1f0404 0%, #120202 50%, #290606 100%)",
      }}
    >
      {/* Top Festive Header Bar */}
      <div
        className="px-4 py-3 flex items-center justify-between border-b"
        style={{
          background: isWinnerCoupon
            ? "linear-gradient(90deg, #5c0f0f, #8b1313, #5c0f0f)"
            : "linear-gradient(90deg, #3d0909, #5e0e0e, #3d0909)",
          borderColor: isWinnerCoupon ? "rgba(212,160,23,0.5)" : "rgba(212,160,23,0.25)",
        }}
      >
        <div className="flex items-center gap-2">
          {isWinnerCoupon ? (
            <Trophy size={18} className="text-amber-300 animate-bounce" />
          ) : (
            <Gift size={16} className="text-amber-300" />
          )}
          <span className="font-display font-extrabold text-xs tracking-wider text-amber-200 uppercase">
            SSV GROUP • DANDIYA DIVAS 2026
          </span>
        </div>

        {/* Status Badge */}
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isRedeemed
              ? "bg-stone-800 text-stone-300 border border-stone-600"
              : isExpired
              ? "bg-red-950 text-red-300 border border-red-800"
              : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/50"
          }`}
        >
          {isRedeemed ? "REDEEMED" : isExpired ? "EXPIRED" : "ACTIVE"}
        </span>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Brand & Benefit Value Headline */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden bg-white/5 p-1 border-2 border-amber-400/40 shadow-inner flex-shrink-0">
              <Image
                src="/images/sponsors/foreign-fits.jpeg"
                alt="Foreign Fits Imported Fashion"
                fill
                className="object-contain rounded-full"
                sizes="72px"
              />
            </div>
            <div>
              <div className="text-[11px] font-extrabold tracking-widest text-amber-300/90 uppercase flex items-center justify-center sm:justify-start gap-1">
                <Sparkles size={11} className="text-amber-400" />
                {isWinnerCoupon ? "🏆 RAMP WALK 1ST WINNER" : "🎁 SHOPPING BENEFIT"}
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-amber-400 leading-tight">
                {isWinnerCoupon ? "₹5,000 OFF" : "₹200 OFF"}
              </h3>
              <p className="text-xs text-amber-100 font-semibold tracking-wide">
                FOREIGN FITS IMPORTED FASHION
              </p>
            </div>
          </div>

          {/* Benefit Badge */}
          <div className="text-center sm:text-right px-3 py-1.5 rounded-xl bg-black/40 border border-amber-400/20">
            <span className="text-[10px] uppercase font-bold text-amber-200/70 block">
              Benefit Type
            </span>
            <span className="text-xs font-black text-amber-300">
              {isWinnerCoupon ? "Champion Voucher" : "For Every Attendee"}
            </span>
          </div>
        </div>

        {/* Contest Winner Name Callout if applicable */}
        {isWinnerCoupon && winnerName && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/40 text-center">
            <span className="text-[10px] uppercase tracking-widest text-amber-200/80 font-bold block mb-0.5">
              🏆 Awarded Exclusively To:
            </span>
            <span className="font-display font-black text-lg text-amber-300">
              {winnerName}
            </span>
          </div>
        )}

        {/* Decorative Coupon Notch Divider */}
        <div className="relative py-2">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-amber-500/30" />
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0f0202] border-r-2 border-amber-500/40" />
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0f0202] border-l-2 border-amber-500/40" />
        </div>

        {/* Coupon Code Block */}
        <div className="p-4 rounded-xl bg-black/60 border border-amber-400/40 text-center space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-widest text-amber-200/70">
            Digital Coupon Code
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-amber-300 tracking-widest select-all">
            {code}
          </div>

          {/* Action Copy Button */}
          <button
            onClick={handleCopy}
            disabled={isRedeemed}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              copied
                ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : isRedeemed
                ? "bg-stone-800 text-stone-400 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-maroon-950 font-black shadow-[0_0_20px_rgba(212,160,23,0.35)]"
            }`}
          >
            {copied ? (
              <>
                <Check size={18} className="text-white" />
                <span>✓ COPIED TO CLIPBOARD!</span>
              </>
            ) : isRedeemed ? (
              <span>COUPON REDEEMED</span>
            ) : (
              <>
                <Copy size={16} />
                <span>COPY COUPON CODE</span>
              </>
            )}
          </button>

          {copyFeedback && (
            <p className="text-[11px] text-emerald-300 font-semibold animate-pulse">
              Coupon copied successfully! Present at Foreign Fits to redeem.
            </p>
          )}
        </div>

        {/* Footer Meta & Terms */}
        <div className="space-y-1.5 pt-1 text-[11px] text-amber-100/70">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-amber-400 flex-shrink-0" />
              Valid until: <strong>{formattedExpiry}</strong>
            </span>
            {bookingRef && (
              <span className="font-mono text-[10px] text-amber-300/80">
                Ref: {bookingRef}
              </span>
            )}
          </div>
          <div className="flex items-start gap-1.5 text-[10px] text-amber-200/60 leading-tight">
            <ShieldCheck size={12} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              {isWinnerCoupon
                ? "Special Ramp Walk 1st Winner coupon. Valid at Foreign Fits Imported Fashion store on verification."
                : "Valid with confirmed Dandiya Divas 2026 booking. One-time shopping redemption per voucher."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
