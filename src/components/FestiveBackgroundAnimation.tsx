"use client";

import React from "react";

export default function FestiveBackgroundAnimation() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* ============================================================
          TOP RIGHT / FLOATING DANDIYA STICKS ANIMATION
          ============================================================ */}
      <div className="absolute top-20 right-4 sm:right-10 md:right-16 lg:right-24 w-44 h-44 sm:w-56 sm:h-56 opacity-85">
        {/* Glow halo around dandiya */}
        <div className="absolute inset-0 rounded-full bg-radial-gold-glow animate-pulse-slow blur-xl opacity-40" />

        <svg
          viewBox="0 0 200 200"
          className="w-full h-full filter drop-shadow-[0_0_15px_rgba(212,160,23,0.6)]"
        >
          <defs>
            {/* Dandiya Stick 1 Gradient (Gold & Crimson) */}
            <linearGradient id="dandiya1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="25%" stopColor="#C0392B" />
              <stop offset="50%" stopColor="#D4A017" />
              <stop offset="75%" stopColor="#8B0000" />
              <stop offset="100%" stopColor="#F5C842" />
            </linearGradient>

            {/* Dandiya Stick 2 Gradient (Saffron & Ruby) */}
            <linearGradient id="dandiya2Grad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF8C00" />
              <stop offset="30%" stopColor="#D4A017" />
              <stop offset="60%" stopColor="#9B111E" />
              <stop offset="85%" stopColor="#F5C842" />
              <stop offset="100%" stopColor="#FF6B00" />
            </linearGradient>

            {/* Handle Grip Gradient */}
            <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5B0505" />
              <stop offset="50%" stopColor="#D4A017" />
              <stop offset="100%" stopColor="#5B0505" />
            </linearGradient>

            {/* Gold Sparkle Gradient */}
            <radialGradient id="sparkleGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FFE066" />
              <stop offset="80%" stopColor="#FF8C00" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Clash Impact Sparkles */}
          <g className="animate-clash-sparkle" transform="translate(100, 100)">
            <circle cx="0" cy="0" r="14" fill="url(#sparkleGlow)" opacity="0.8" />
            <path
              d="M 0 -22 L 4 -6 L 20 0 L 4 6 L 0 22 L -4 6 L -20 0 L -4 -6 Z"
              fill="#FFF8DC"
            />
            <circle cx="-14" cy="-12" r="2.5" fill="#FFD700" />
            <circle cx="15" cy="-10" r="2" fill="#FFF8DC" />
            <circle cx="-12" cy="14" r="2" fill="#FF8C00" />
            <circle cx="14" cy="12" r="3" fill="#FFD700" />
          </g>

          {/* Left Dandiya Stick */}
          <g className="animate-dandiya-left origin-[100px_100px]">
            {/* Main Stick Shaft */}
            <rect
              x="93"
              y="20"
              width="14"
              height="160"
              rx="7"
              fill="url(#dandiya1Grad)"
              stroke="#FFF8DC"
              strokeWidth="0.8"
            />
            {/* Decorative Rings / Bands */}
            <line x1="93" y1="45" x2="107" y2="45" stroke="#FFF8DC" strokeWidth="2.5" />
            <line x1="93" y1="52" x2="107" y2="52" stroke="#4A7A25" strokeWidth="2.5" />
            <line x1="93" y1="75" x2="107" y2="75" stroke="#FFF8DC" strokeWidth="2.5" />
            <line x1="93" y1="82" x2="107" y2="82" stroke="#FF6B00" strokeWidth="2.5" />
            <line x1="93" y1="105" x2="107" y2="105" stroke="#FFF8DC" strokeWidth="2.5" />
            <line x1="93" y1="112" x2="107" y2="112" stroke="#4A7A25" strokeWidth="2.5" />
            <line x1="93" y1="135" x2="107" y2="135" stroke="#FFF8DC" strokeWidth="2.5" />

            {/* Handle Grip */}
            <rect x="91.5" y="145" width="17" height="30" rx="3" fill="url(#handleGrad)" />
            <line x1="92" y1="152" x2="108" y2="152" stroke="#FFF8DC" strokeWidth="1" />
            <line x1="92" y1="160" x2="108" y2="160" stroke="#FFF8DC" strokeWidth="1" />
            <line x1="92" y1="168" x2="108" y2="168" stroke="#FFF8DC" strokeWidth="1" />

            {/* Bottom Bell / Ghungroo & Ribbon */}
            <circle cx="100" cy="180" r="5" fill="#D4A017" stroke="#FFF8DC" strokeWidth="0.5" />
            <path
              d="M 97 184 Q 92 195 90 200 M 103 184 Q 108 195 110 200"
              stroke="#FF8C00"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Right Dandiya Stick */}
          <g className="animate-dandiya-right origin-[100px_100px]">
            {/* Main Stick Shaft */}
            <rect
              x="93"
              y="20"
              width="14"
              height="160"
              rx="7"
              fill="url(#dandiya2Grad)"
              stroke="#FFF8DC"
              strokeWidth="0.8"
            />
            {/* Decorative Rings / Bands */}
            <line x1="93" y1="45" x2="107" y2="45" stroke="#FFF8DC" strokeWidth="2.5" />
            <line x1="93" y1="52" x2="107" y2="52" stroke="#2D5016" strokeWidth="2.5" />
            <line x1="93" y1="75" x2="107" y2="75" stroke="#FFF8DC" strokeWidth="2.5" />
            <line x1="93" y1="82" x2="107" y2="82" stroke="#C0392B" strokeWidth="2.5" />
            <line x1="93" y1="105" x2="107" y2="105" stroke="#FFF8DC" strokeWidth="2.5" />
            <line x1="93" y1="112" x2="107" y2="112" stroke="#2D5016" strokeWidth="2.5" />
            <line x1="93" y1="135" x2="107" y2="135" stroke="#FFF8DC" strokeWidth="2.5" />

            {/* Handle Grip */}
            <rect x="91.5" y="145" width="17" height="30" rx="3" fill="url(#handleGrad)" />
            <line x1="92" y1="152" x2="108" y2="152" stroke="#FFF8DC" strokeWidth="1" />
            <line x1="92" y1="160" x2="108" y2="160" stroke="#FFF8DC" strokeWidth="1" />
            <line x1="92" y1="168" x2="108" y2="168" stroke="#FFF8DC" strokeWidth="1" />

            {/* Bottom Bell / Ghungroo & Ribbon */}
            <circle cx="100" cy="180" r="5" fill="#D4A017" stroke="#FFF8DC" strokeWidth="0.5" />
            <path
              d="M 97 184 Q 93 195 91 200 M 103 184 Q 107 195 109 200"
              stroke="#C0392B"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* ============================================================
          BOTTOM LEFT / FLOATING DIYA (OIL LAMP) ANIMATION
          ============================================================ */}
      <div className="absolute bottom-12 left-4 sm:left-10 md:left-16 lg:left-24 w-40 h-40 sm:w-52 sm:h-52 opacity-90">
        {/* Diya Base Pulsing Light Glow */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-radial-diya-glow animate-diya-aura blur-xl pointer-events-none" />

        <svg
          viewBox="0 0 160 160"
          className="w-full h-full filter drop-shadow-[0_0_20px_rgba(255,140,0,0.55)]"
        >
          <defs>
            {/* Diya Clay / Brass Gradient */}
            <linearGradient id="diyaBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5C842" />
              <stop offset="25%" stopColor="#D4A017" />
              <stop offset="60%" stopColor="#A04000" />
              <stop offset="100%" stopColor="#5E1914" />
            </linearGradient>

            {/* Diya Rim Highlight */}
            <linearGradient id="diyaRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4A017" />
              <stop offset="50%" stopColor="#FFF8DC" />
              <stop offset="100%" stopColor="#D4A017" />
            </linearGradient>

            {/* Outer Flame Gradient */}
            <linearGradient id="flameOuter" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#FF4500" />
              <stop offset="40%" stopColor="#FF8C00" />
              <stop offset="80%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFF8DC" />
            </linearGradient>

            {/* Inner Flame Core Gradient */}
            <linearGradient id="flameInner" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#FF8C00" />
              <stop offset="50%" stopColor="#FFFF00" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            {/* Oil Glow */}
            <radialGradient id="oilGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="70%" stopColor="#FF8F00" />
              <stop offset="100%" stopColor="#5D4037" />
            </radialGradient>
          </defs>

          {/* Diya Stand / Base */}
          <ellipse cx="80" cy="142" rx="30" ry="7" fill="#420B0B" opacity="0.6" />
          <path
            d="M 64 138 C 64 144, 96 144, 96 138 L 90 130 L 70 130 Z"
            fill="url(#diyaBodyGrad)"
            stroke="#D4A017"
            strokeWidth="0.8"
          />

          {/* Diya Main Bowl */}
          <path
            d="M 22 108 C 24 138, 136 138, 138 108 C 138 100, 126 98, 80 102 C 34 98, 22 100, 22 108 Z"
            fill="url(#diyaBodyGrad)"
            stroke="#D4A017"
            strokeWidth="1"
          />

          {/* Diya Decorative Filigree / Engraving */}
          <path
            d="M 38 116 Q 80 134 122 116"
            fill="none"
            stroke="#FFF8DC"
            strokeWidth="1.2"
            strokeDasharray="2 3"
            opacity="0.8"
          />
          <circle cx="80" cy="125" r="2.5" fill="#FFF8DC" />
          <circle cx="62" cy="122" r="2" fill="#D4A017" />
          <circle cx="98" cy="122" r="2" fill="#D4A017" />
          <circle cx="48" cy="117" r="1.5" fill="#FFF8DC" />
          <circle cx="112" cy="117" r="1.5" fill="#FFF8DC" />

          {/* Diya Bowl Top Opening / Oil Pool */}
          <ellipse cx="80" cy="103" rx="54" ry="11" fill="url(#oilGlow)" stroke="url(#diyaRimGrad)" strokeWidth="1.5" />

          {/* Diya Spout / Wick Beak */}
          <path
            d="M 72 102 C 76 96, 84 96, 88 102 Z"
            fill="#3E1400"
          />
          {/* Wick */}
          <line x1="80" y1="102" x2="80" y2="92" stroke="#2B1000" strokeWidth="2.5" strokeLinecap="round" />

          {/* Animated Flame Container */}
          <g className="animate-flicker origin-[80px_92px]">
            {/* Outer Flame Glow */}
            <path
              d="M 80 32 C 96 62, 102 78, 80 92 C 58 78, 64 62, 80 32 Z"
              fill="url(#flameOuter)"
              opacity="0.95"
            />
            {/* Inner Flame Core */}
            <path
              d="M 80 50 C 90 70, 93 80, 80 90 C 67 80, 70 70, 80 50 Z"
              fill="url(#flameInner)"
              className="animate-flame-core"
            />
            {/* White-hot Center */}
            <ellipse cx="80" cy="80" rx="4" ry="7" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Rising Golden Sparks from Flame */}
          <g className="animate-sparkle-rise">
            <circle cx="80" cy="24" r="1.8" fill="#FFF8DC" />
            <circle cx="76" cy="12" r="1.4" fill="#FFD700" />
            <circle cx="83" cy="2" r="1.2" fill="#FF8C00" />
          </g>
        </svg>
      </div>

      {/* Floating Ambient Sparkles & Light Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-10 w-2 h-2 rounded-full bg-gold-400 animate-float-slow opacity-50 blur-[0.5px]" />
        <div className="absolute top-2/3 right-16 w-3 h-3 rounded-full bg-orange-400 animate-float-medium opacity-40 blur-[1px]" />
        <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 rounded-full bg-yellow-200 animate-float-fast opacity-60" />
        <div className="absolute bottom-1/4 right-1/3 w-2.5 h-2.5 rounded-full bg-gold-300 animate-float-slow opacity-45 blur-[0.5px]" />
      </div>
    </div>
  );
}
