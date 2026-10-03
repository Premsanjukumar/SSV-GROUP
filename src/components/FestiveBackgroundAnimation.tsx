"use client";

import React from "react";

export default function FestiveBackgroundAnimation() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* ============================================================
          TOP FAIRY LIGHTS CANOPY STRING (TWINKLING)
          ============================================================ */}
      <div className="absolute top-0 left-0 right-0 h-16 opacity-85 z-0">
        <svg
          viewBox="0 0 1200 60"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="fairyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FFE066" />
              <stop offset="80%" stopColor="#FF9900" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Hanging string curve 1 */}
          <path
            d="M 0,0 Q 150,45 300,5 Q 450,45 600,5 Q 750,45 900,5 Q 1050,45 1200,0"
            fill="none"
            stroke="rgba(212, 160, 23, 0.4)"
            strokeWidth="1.2"
          />

          {/* Fairy light bulbs along curve */}
          {[
            { cx: 75, cy: 26, delay: "0s" },
            { cx: 150, cy: 45, delay: "0.4s" },
            { cx: 225, cy: 26, delay: "0.8s" },
            { cx: 375, cy: 26, delay: "1.2s" },
            { cx: 450, cy: 45, delay: "0.3s" },
            { cx: 525, cy: 26, delay: "0.7s" },
            { cx: 675, cy: 26, delay: "1.1s" },
            { cx: 750, cy: 45, delay: "0.5s" },
            { cx: 825, cy: 26, delay: "0.9s" },
            { cx: 975, cy: 26, delay: "1.4s" },
            { cx: 1050, cy: 45, delay: "0.2s" },
            { cx: 1125, cy: 26, delay: "0.6s" },
          ].map((bulb, idx) => (
            <g key={idx} className="animate-fairy-twinkle" style={{ animationDelay: bulb.delay }}>
              <circle cx={bulb.cx} cy={bulb.cy} r="6" fill="url(#fairyGlow)" />
              <circle cx={bulb.cx} cy={bulb.cy} r="2" fill="#FFFFFF" />
            </g>
          ))}
        </svg>
      </div>

      {/* ============================================================
          TOP-LEFT HANGING FESTIVAL LANTERN (KANDIL WITH TASSELS)
          ============================================================ */}
      <div className="absolute -top-4 left-4 sm:left-10 md:left-16 w-20 sm:w-28 h-48 sm:h-64 opacity-85 animate-lantern-left hidden sm:block">
        <svg viewBox="0 0 100 220" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(255,140,0,0.6)]">
          <defs>
            <linearGradient id="lanternRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4500" />
              <stop offset="50%" stopColor="#B30000" />
              <stop offset="100%" stopColor="#4A0000" />
            </linearGradient>
            <linearGradient id="lanternGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4A017" />
              <stop offset="50%" stopColor="#FFE066" />
              <stop offset="100%" stopColor="#D4A017" />
            </linearGradient>
          </defs>

          {/* Hanging Cord */}
          <line x1="50" y1="0" x2="50" y2="40" stroke="#D4A017" strokeWidth="1.5" />

          {/* Top Cap */}
          <polygon points="35,40 65,40 50,28" fill="url(#lanternGold)" />

          {/* Lantern Main Diamond Body */}
          <polygon
            points="50,40 85,85 50,130 15,85"
            fill="url(#lanternRed)"
            stroke="url(#lanternGold)"
            strokeWidth="2"
          />

          {/* Inner Decorative Patterns */}
          <polygon points="50,55 72,85 50,115 28,85" fill="#FF8C00" opacity="0.6" />
          <circle cx="50" cy="85" r="8" fill="#FFF8DC" className="animate-pulse" />

          {/* Bottom Cap */}
          <rect x="42" y="130" width="16" height="8" rx="2" fill="url(#lanternGold)" />

          {/* Hanging Golden Tassels */}
          <line x1="44" y1="138" x2="38" y2="195" stroke="#FFE066" strokeWidth="1.5" />
          <line x1="47" y1="138" x2="44" y2="205" stroke="#D4A017" strokeWidth="1.5" />
          <line x1="50" y1="138" x2="50" y2="215" stroke="#FFE066" strokeWidth="2" />
          <line x1="53" y1="138" x2="56" y2="205" stroke="#D4A017" strokeWidth="1.5" />
          <line x1="56" y1="138" x2="62" y2="195" stroke="#FFE066" strokeWidth="1.5" />

          {/* Tassel Bells */}
          <circle cx="50" cy="215" r="3" fill="#D4A017" />
          <circle cx="44" cy="205" r="2.5" fill="#D4A017" />
          <circle cx="56" cy="205" r="2.5" fill="#D4A017" />
        </svg>
      </div>

      {/* ============================================================
          TOP-RIGHT HANGING FESTIVAL LANTERN (KANDIL WITH TASSELS)
          ============================================================ */}
      <div className="absolute -top-4 right-4 sm:right-10 md:right-20 w-20 sm:w-28 h-48 sm:h-64 opacity-85 animate-lantern-right hidden sm:block">
        <svg viewBox="0 0 100 220" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(255,140,0,0.6)]">
          {/* Hanging Cord */}
          <line x1="50" y1="0" x2="50" y2="35" stroke="#D4A017" strokeWidth="1.5" />

          {/* Top Cap */}
          <polygon points="35,35 65,35 50,22" fill="url(#lanternGold)" />

          {/* Lantern Main Diamond Body */}
          <polygon
            points="50,35 85,80 50,125 15,80"
            fill="url(#lanternRed)"
            stroke="url(#lanternGold)"
            strokeWidth="2"
          />

          {/* Inner Glow */}
          <polygon points="50,50 72,80 50,110 28,80" fill="#FF8C00" opacity="0.6" />
          <circle cx="50" cy="80" r="8" fill="#FFF8DC" className="animate-pulse" />

          {/* Bottom Cap */}
          <rect x="42" y="125" width="16" height="8" rx="2" fill="url(#lanternGold)" />

          {/* Hanging Tassels */}
          <line x1="44" y1="133" x2="38" y2="190" stroke="#FFE066" strokeWidth="1.5" />
          <line x1="47" y1="133" x2="44" y2="200" stroke="#D4A017" strokeWidth="1.5" />
          <line x1="50" y1="133" x2="50" y2="210" stroke="#FFE066" strokeWidth="2" />
          <line x1="53" y1="133" x2="56" y2="200" stroke="#D4A017" strokeWidth="1.5" />
          <line x1="56" y1="133" x2="62" y2="190" stroke="#FFE066" strokeWidth="1.5" />

          {/* Tassel Bells */}
          <circle cx="50" cy="210" r="3" fill="#D4A017" />
          <circle cx="44" cy="200" r="2.5" fill="#D4A017" />
          <circle cx="56" cy="200" r="2.5" fill="#D4A017" />
        </svg>
      </div>

      {/* ============================================================
          TOP RIGHT / FLOATING DANDIYA STICKS ANIMATION
          ============================================================ */}
      <div className="absolute top-28 right-2 sm:right-8 md:right-16 lg:right-28 w-36 h-36 sm:w-52 sm:h-52 opacity-85">
        <div className="absolute inset-0 rounded-full bg-radial-gold-glow animate-pulse-slow blur-xl opacity-40" />

        <svg
          viewBox="0 0 200 200"
          className="w-full h-full filter drop-shadow-[0_0_15px_rgba(212,160,23,0.6)]"
        >
          <defs>
            <linearGradient id="dandiya1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="25%" stopColor="#C0392B" />
              <stop offset="50%" stopColor="#D4A017" />
              <stop offset="75%" stopColor="#8B0000" />
              <stop offset="100%" stopColor="#F5C842" />
            </linearGradient>

            <linearGradient id="dandiya2Grad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF8C00" />
              <stop offset="30%" stopColor="#D4A017" />
              <stop offset="60%" stopColor="#9B111E" />
              <stop offset="85%" stopColor="#F5C842" />
              <stop offset="100%" stopColor="#FF6B00" />
            </linearGradient>

            <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5B0505" />
              <stop offset="50%" stopColor="#D4A017" />
              <stop offset="100%" stopColor="#5B0505" />
            </linearGradient>

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
            <line x1="93" y1="45" x2="107" y2="45" stroke="#FFF8DC" strokeWidth="2.5" />
            <line x1="93" y1="52" x2="107" y2="52" stroke="#4A7A25" strokeWidth="2.5" />
            <line x1="93" y1="75" x2="107" y2="75" stroke="#FFF8DC" strokeWidth="2.5" />
            <line x1="93" y1="82" x2="107" y2="82" stroke="#FF6B00" strokeWidth="2.5" />
            <line x1="93" y1="105" x2="107" y2="105" stroke="#FFF8DC" strokeWidth="2.5" />
            <line x1="93" y1="112" x2="107" y2="112" stroke="#4A7A25" strokeWidth="2.5" />
            <line x1="93" y1="135" x2="107" y2="135" stroke="#FFF8DC" strokeWidth="2.5" />

            <rect x="91.5" y="145" width="17" height="30" rx="3" fill="url(#handleGrad)" />
            <line x1="92" y1="152" x2="108" y2="152" stroke="#FFF8DC" strokeWidth="1" />
            <line x1="92" y1="160" x2="108" y2="160" stroke="#FFF8DC" strokeWidth="1" />
            <line x1="92" y1="168" x2="108" y2="168" stroke="#FFF8DC" strokeWidth="1" />

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
            <line x1="93" y1="45" x2="107" y2="45" stroke="#FFF8DC" strokeWidth="2.5" />
            <line x1="93" y1="52" x2="107" y2="52" stroke="#2D5016" strokeWidth="2.5" />
            <line x1="93" y1="75" x2="107" y2="75" stroke="#FFF8DC" strokeWidth="2.5" />
            <line x1="93" y1="82" x2="107" y2="82" stroke="#C0392B" strokeWidth="2.5" />
            <line x1="93" y1="105" x2="107" y2="105" stroke="#FFF8DC" strokeWidth="2.5" />
            <line x1="93" y1="112" x2="107" y2="112" stroke="#2D5016" strokeWidth="2.5" />
            <line x1="93" y1="135" x2="107" y2="135" stroke="#FFF8DC" strokeWidth="2.5" />

            <rect x="91.5" y="145" width="17" height="30" rx="3" fill="url(#handleGrad)" />
            <line x1="92" y1="152" x2="108" y2="152" stroke="#FFF8DC" strokeWidth="1" />
            <line x1="92" y1="160" x2="108" y2="160" stroke="#FFF8DC" strokeWidth="1" />
            <line x1="92" y1="168" x2="108" y2="168" stroke="#FFF8DC" strokeWidth="1" />

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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-radial-diya-glow animate-diya-aura blur-xl pointer-events-none" />

        <svg
          viewBox="0 0 160 160"
          className="w-full h-full filter drop-shadow-[0_0_20px_rgba(255,140,0,0.55)]"
        >
          <defs>
            <linearGradient id="diyaBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5C842" />
              <stop offset="25%" stopColor="#D4A017" />
              <stop offset="60%" stopColor="#A04000" />
              <stop offset="100%" stopColor="#5E1914" />
            </linearGradient>

            <linearGradient id="diyaRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4A017" />
              <stop offset="50%" stopColor="#FFF8DC" />
              <stop offset="100%" stopColor="#D4A017" />
            </linearGradient>

            <linearGradient id="flameOuter" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#FF4500" />
              <stop offset="40%" stopColor="#FF8C00" />
              <stop offset="80%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFF8DC" />
            </linearGradient>

            <linearGradient id="flameInner" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#FF8C00" />
              <stop offset="50%" stopColor="#FFFF00" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            <radialGradient id="oilGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="70%" stopColor="#FF8F00" />
              <stop offset="100%" stopColor="#5D4037" />
            </radialGradient>
          </defs>

          {/* Diya Base */}
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

          {/* Diya Decorative Filigree */}
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

          {/* Diya Bowl Top Opening */}
          <ellipse cx="80" cy="103" rx="54" ry="11" fill="url(#oilGlow)" stroke="url(#diyaRimGrad)" strokeWidth="1.5" />
          <line x1="80" y1="102" x2="80" y2="92" stroke="#2B1000" strokeWidth="2.5" strokeLinecap="round" />

          {/* Animated Flame */}
          <g className="animate-flicker origin-[80px_92px]">
            <path
              d="M 80 32 C 96 62, 102 78, 80 92 C 58 78, 64 62, 80 32 Z"
              fill="url(#flameOuter)"
              opacity="0.95"
            />
            <path
              d="M 80 50 C 90 70, 93 80, 80 90 C 67 80, 70 70, 80 50 Z"
              fill="url(#flameInner)"
              className="animate-flame-core"
            />
            <ellipse cx="80" cy="80" rx="4" ry="7" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Rising Sparks */}
          <g className="animate-sparkle-rise">
            <circle cx="80" cy="24" r="1.8" fill="#FFF8DC" />
            <circle cx="76" cy="12" r="1.4" fill="#FFD700" />
            <circle cx="83" cy="2" r="1.2" fill="#FF8C00" />
          </g>
        </svg>
      </div>

      {/* ============================================================
          FLOATING GOLDEN FIREFLY PARTICLES & DRIFTING PETALS
          ============================================================ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Fireflies */}
        <div
          className="absolute top-1/4 left-1/6 w-2.5 h-2.5 rounded-full bg-amber-300 blur-[0.5px]"
          style={{ animation: "firefly-pulse 4s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/2 left-3/4 w-3 h-3 rounded-full bg-amber-400 blur-[1px]"
          style={{ animation: "firefly-pulse 5.5s ease-in-out infinite 1.5s" }}
        />
        <div
          className="absolute top-2/3 left-1/3 w-2 h-2 rounded-full bg-yellow-200"
          style={{ animation: "firefly-pulse 3.5s ease-in-out infinite 2.2s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-orange-400 blur-[0.8px]"
          style={{ animation: "firefly-pulse 6s ease-in-out infinite 0.8s" }}
        />

        {/* Floating Rose & Marigold Petals */}
        {[
          { left: "10%", delay: "0s", duration: "12s", color: "#FF3366", rotate: "45deg" },
          { left: "25%", delay: "3s", duration: "15s", color: "#FF9900", rotate: "12deg" },
          { left: "45%", delay: "6s", duration: "14s", color: "#FFD700", rotate: "65deg" },
          { left: "70%", delay: "2s", duration: "16s", color: "#FF3366", rotate: "30deg" },
          { left: "85%", delay: "8s", duration: "13s", color: "#FF8C00", rotate: "50deg" },
        ].map((petal, i) => (
          <div
            key={i}
            className="absolute -top-6 w-3 h-4 rounded-full opacity-0 pointer-events-none"
            style={{
              left: petal.left,
              backgroundColor: petal.color,
              transform: `rotate(${petal.rotate})`,
              boxShadow: `0 0 6px ${petal.color}`,
              animation: `petal-drift ${petal.duration} linear infinite`,
              animationDelay: petal.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
