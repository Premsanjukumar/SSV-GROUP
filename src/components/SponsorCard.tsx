"use client";

import { useState } from "react";
import Image from "next/image";
import type { Sponsor } from "@/data/sponsors";

interface SponsorCardProps {
  sponsor: Sponsor;
}

export default function SponsorCard({ sponsor }: SponsorCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group relative flex flex-col items-center justify-between rounded-2xl p-4 sm:p-6 transition-all duration-300 border border-gold-800/30 hover:md:border-gold-400/70 hover:md:-translate-y-1 bg-gradient-to-b from-[#1c0606] to-[#120303] shadow-lg hover:md:shadow-[0_10px_25px_rgba(212,160,23,0.18)] min-h-[150px] sm:min-h-[180px] w-full"
    >
      {/* Category Pill */}
      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-3 text-center line-clamp-1">
        {sponsor.category}
      </span>

      {/* Logo Container - Preserves aspect ratio & transparency, prevents distortion */}
      <div className="relative w-full h-20 sm:h-24 flex items-center justify-center my-auto p-1.5 sm:p-2 rounded-xl bg-black/40 border border-gold-800/20">
        {!imageError ? (
          <Image
            src={sponsor.logo}
            alt={sponsor.alt}
            width={220}
            height={110}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:md:scale-105 rounded-lg"
            onError={() => setImageError(true)}
            priority={false}
          />
        ) : (
          /* Graceful, styled fallback when logo image asset file is being uploaded */
          <div className="flex flex-col items-center justify-center text-center p-2">
            <span className="font-display font-black text-xs sm:text-sm text-amber-200 tracking-wide line-clamp-2">
              {sponsor.name}
            </span>
          </div>
        )}
      </div>

      {/* Sponsor Name / Description */}
      <div className="w-full text-center mt-3 pt-2.5 border-t border-gold-800/20">
        <h4 className="font-display font-bold text-xs sm:text-sm text-amber-100 group-hover:text-amber-300 transition-colors line-clamp-1">
          {sponsor.name}
        </h4>
        <p className="text-[10px] sm:text-xs text-amber-100/60 mt-0.5 line-clamp-1">
          {sponsor.description}
        </p>
      </div>
    </div>
  );
}
