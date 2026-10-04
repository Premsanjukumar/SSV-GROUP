"use client";

import { Gift, CheckCircle2, XCircle, Info, Sparkles } from "lucide-react";

interface ShoppingBenefitSelectorProps {
  value: boolean; // true = opted in (YES), false = opted out (NO THANKS)
  onChange: (optIn: boolean) => void;
  disabled?: boolean;
}

export default function ShoppingBenefitSelector({
  value,
  onChange,
  disabled = false,
}: ShoppingBenefitSelectorProps) {
  return (
    <div
      className="p-5 sm:p-6 rounded-2xl border-2 transition-all relative overflow-hidden"
      style={{
        background: value
          ? "linear-gradient(145deg, rgba(20,40,20,0.4) 0%, rgba(15,2,2,0.8) 100%)"
          : "linear-gradient(145deg, rgba(35,15,15,0.4) 0%, rgba(15,2,2,0.8) 100%)",
        borderColor: value ? "rgba(74,222,128,0.5)" : "rgba(212,160,23,0.3)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2">
        <div
          className={`p-2 rounded-xl flex items-center justify-center flex-shrink-0 ${
            value ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
          }`}
        >
          <Gift size={20} />
        </div>
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-300">
            OPTIONAL FESTIVE PERK
          </span>
          <h3 className="font-display font-black text-lg text-white flex items-center gap-1.5">
            🎁 ₹200 SHOPPING BENEFIT
          </h3>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed mb-4">
        Get <strong>₹200 shopping benefit</strong> at <strong>Foreign Fits Imported Fashion</strong>.
        Would you like to receive this digital benefit voucher with your booking?
      </p>

      {/* Choice Buttons (Mobile-first, touch-friendly) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
        {/* YES OPTION */}
        <button
          type="button"
          onClick={() => onChange(true)}
          disabled={disabled}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all text-left active:scale-[0.98] ${
            value
              ? "bg-gradient-to-r from-emerald-700 to-emerald-600 text-white border-2 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.35)]"
              : "bg-black/50 hover:bg-black/70 text-amber-100/80 border border-emerald-500/30"
          }`}
        >
          <CheckCircle2
            size={18}
            className={value ? "text-white flex-shrink-0" : "text-emerald-400/60 flex-shrink-0"}
          />
          <span className="tracking-wide">✓ YES, GIVE ME THE COUPON</span>
        </button>

        {/* NO THANKS OPTION */}
        <button
          type="button"
          onClick={() => onChange(false)}
          disabled={disabled}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all text-left active:scale-[0.98] ${
            !value
              ? "bg-stone-800 text-amber-100 border-2 border-amber-400/60 shadow-[0_0_15px_rgba(212,160,23,0.2)]"
              : "bg-black/50 hover:bg-black/70 text-amber-200/60 border border-stone-700/60"
          }`}
        >
          <XCircle
            size={18}
            className={!value ? "text-amber-300 flex-shrink-0" : "text-stone-400 flex-shrink-0"}
          />
          <span className="tracking-wide">NO THANKS, I DON&apos;T WANT IT</span>
        </button>
      </div>

      {/* Important Clarity / No Price Change Note */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-black/40 border border-amber-400/15 text-[11px] text-amber-200/70">
        <Info size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Important:</strong> Whether you choose <em>YES</em> or <em>NO THANKS</em>, your ticket price
          remains strictly ₹299 (Single) / ₹499 (Couple). This benefit does not reduce the ticket price.
        </span>
      </div>
    </div>
  );
}
