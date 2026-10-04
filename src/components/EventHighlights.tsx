import {
  Sparkles,
  Music,
  Utensils,
  Camera,
  Image as ImageIcon,
  Users,
  Palette,
  Gift,
  Crown,
} from "lucide-react";

export interface HighlightItem {
  id: string;
  label: string;
  desc: string;
  badge: string;
  icon: typeof Sparkles;
  isFirst?: boolean;
}

export const HIGHLIGHTS: HighlightItem[] = [
  {
    id: "ramp-walk",
    label: "Ramp Walk",
    desc: "Grand traditional attire fashion spotlight & runway moments",
    badge: "Spotlight",
    icon: Crown,
    isFirst: true,
  },
  {
    id: "dj-live",
    label: "DJ Live",
    desc: "Electrifying festive DJ tracks & live musical performers",
    badge: "Music",
    icon: Music,
  },
  {
    id: "food-stalls",
    label: "Food Stalls",
    desc: "Authentic festival delicacies, street chaat & refreshments",
    badge: "Feast",
    icon: Utensils,
  },
  {
    id: "selfie-booth",
    label: "Selfie Booth",
    desc: "Vibrant themed 360 photo zones & festive backdrops",
    badge: "Photos",
    icon: Camera,
  },
  {
    id: "couple-solo-portrait",
    label: "Couple / Solo Portrait",
    desc: "Professional keepsake portraits capturing your festive look",
    badge: "Memories",
    icon: ImageIcon,
  },
  {
    id: "couple-dance",
    label: "Couple Dance",
    desc: "Dedicated Dandiya Raas & Garba floor for couples",
    badge: "Dance",
    icon: Users,
  },
  {
    id: "decoration",
    label: "Decoration",
    desc: "Majestic Navratri lighting, floral setups & royal decor",
    badge: "Ambiance",
    icon: Palette,
  },
  {
    id: "gift-voucher",
    label: "Gift & Voucher",
    desc: "Exciting lucky draw prizes, gift hampers & sponsor rewards",
    badge: "Rewards",
    icon: Gift,
  },
];

export default function EventHighlights() {
  return (
    <section
      id="highlights"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative"
      style={{ background: "#0a0101" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-950/70 border border-gold-500/40 text-amber-300 mb-3 shadow-md">
            <Sparkles size={14} className="text-amber-400" />
            WHAT AWAITS YOU
          </div>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">
            EVENT HIGHLIGHTS
          </h2>
          <p className="section-subtitle mb-0 max-w-xl mx-auto px-4 mt-2">
            Experience Bidar&apos;s most sensational Navratri Dandiya celebration
          </p>
        </div>

        {/* 2-column on mobile, 4-column on desktop: balanced and not excessively tall */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {HIGHLIGHTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`relative flex flex-col items-center text-center rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-default ${
                  item.isFirst
                    ? "border-2 border-amber-400/80 bg-gradient-to-b from-[#2d0909] to-[#1a0505] shadow-[0_8px_25px_rgba(212,160,23,0.25)] hover:border-amber-300"
                    : "border border-gold-800/30 bg-gradient-to-b from-[#1c0606] to-[#120303] hover:border-gold-400/60 hover:shadow-lg"
                }`}
              >
                {/* Number / Featured badge */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                  <span
                    className={`inline-flex items-center justify-center text-[10px] sm:text-xs font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full ${
                      item.isFirst
                        ? "bg-amber-400 text-maroon-950 font-black shadow-md"
                        : "bg-black/50 text-amber-200/70 border border-gold-500/20"
                    }`}
                  >
                    #{index + 1}
                  </span>
                </div>

                {/* Category Badge */}
                <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>

                {/* Icon Container */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mt-5 mb-3 transition-transform duration-300 hover:scale-110 shadow-md ${
                    item.isFirst
                      ? "bg-gradient-to-br from-[#FF6B00] via-[#D4A017] to-[#8B0000] border-2 border-amber-300 text-maroon-950"
                      : "bg-gradient-to-br from-[#8B0000]/70 to-[#C0392B]/40 border border-gold-500/40 text-amber-300"
                  }`}
                >
                  <Icon
                    size={24}
                    className={item.isFirst ? "text-amber-950" : "text-amber-300"}
                  />
                </div>

                {/* Label */}
                <h3
                  className={`font-display font-black text-xs sm:text-sm md:text-base tracking-wide line-clamp-1 mb-1 ${
                    item.isFirst ? "text-amber-300" : "text-amber-100"
                  }`}
                >
                  {item.label}
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-xs leading-relaxed text-amber-100/60 line-clamp-2">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
