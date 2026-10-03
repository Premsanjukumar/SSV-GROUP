import React from "react";

interface SSVLogoProps {
  className?: string;
  size?: number;
  showGlow?: boolean;
}

export default function SSVLogo({
  className = "",
  size = 40,
  showGlow = true,
}: SSVLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full bg-amber-400/20 blur-md pointer-events-none animate-pulse"
          style={{ transform: "scale(1.2)" }}
        />
      )}
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="relative z-10 w-full h-full filter drop-shadow-[0_0_8px_rgba(245,200,66,0.6)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ssvGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="25%" stopColor="#F5C842" />
            <stop offset="60%" stopColor="#D4A017" />
            <stop offset="100%" stopColor="#B37400" />
          </linearGradient>

          <radialGradient id="trishulGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* ============================================================
            TRISHUL (TRIDENT) CREST ON TOP
            ============================================================ */}
        <g id="trishul" stroke="url(#ssvGoldGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Central Spike */}
          <path d="M 100 24 L 100 65" strokeWidth="4.5" />
          
          {/* Left Trishul Prong */}
          <path d="M 100 65 C 84 55, 78 40, 84 26 C 88 38, 92 48, 100 52" strokeWidth="4" />
          
          {/* Right Trishul Prong */}
          <path d="M 100 65 C 116 55, 122 40, 116 26 C 112 38, 108 48, 100 52" strokeWidth="4" />
          
          {/* Trishul Base Band */}
          <path d="M 88 64 Q 100 60 112 64" strokeWidth="4" />
          <path d="M 86 69 Q 100 65 114 69" strokeWidth="3.5" />
        </g>

        {/* ============================================================
            LORD GANESHA HEAD, EAR, EYE & SPIRAL TRUNK
            ============================================================ */}
        <g id="ganesha" stroke="url(#ssvGoldGrad)" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Crown Arch over Head */}
          <path
            d="M 82 74 Q 100 68 118 74"
            strokeWidth="4"
          />

          {/* Main Outer Body Curve (Right Profile -> Trunk Spiral) */}
          <path
            d="M 100 70 C 132 80, 142 120, 130 150 C 120 174, 92 178, 80 162 C 68 146, 80 125, 96 126 C 110 127, 114 140, 105 150 C 98 158, 88 152, 92 142"
            strokeWidth="5"
          />

          {/* Inner Trunk Detail Accent */}
          <path
            d="M 94 140 C 93 144, 96 148, 100 146"
            strokeWidth="3.5"
            fill="url(#ssvGoldGrad)"
          />

          {/* Left Large Ear Outer Flap */}
          <path
            d="M 84 76 C 58 78, 48 95, 62 118 C 72 130, 88 126, 94 116"
            strokeWidth="4.5"
          />

          {/* Inner Ear Delicate Curve */}
          <path
            d="M 72 88 C 62 96, 62 108, 72 114 C 78 112, 84 104, 82 96 Z"
            strokeWidth="3.5"
          />

          {/* Ganesha Eye / Tilak */}
          {/* Eyebrow / Eye upper lid */}
          <path
            d="M 108 106 C 116 102, 126 108, 126 118 C 118 120, 110 114, 108 106 Z"
            strokeWidth="3.5"
          />
          {/* Eye Pupil / Dot */}
          <circle cx="118" cy="113" r="3" fill="url(#ssvGoldGrad)" stroke="none" />
        </g>
      </svg>
    </div>
  );
}
