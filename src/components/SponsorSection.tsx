import { Crown } from "lucide-react";
import { SPONSORS } from "@/data/sponsors";
import SponsorCard from "@/components/SponsorCard";

export default function SponsorSection() {
  return (
    <section
      id="sponsors"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a0101 0%, #170404 50%, #0a0101 100%)",
        borderTop: "1px solid rgba(212,160,23,0.2)",
        borderBottom: "1px solid rgba(212,160,23,0.2)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-red-950/80 via-amber-950/60 to-red-950/80 border border-gold-500/40 text-amber-300 mb-3 shadow-lg">
            <Crown size={15} className="text-amber-300 animate-pulse" />
            PARTNERS IN CELEBRATION
          </div>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">
            OUR PROUD SPONSORS
          </h2>
          <p className="section-subtitle max-w-xl mx-auto px-4 mt-2">
            Organised &amp; supported with pride by the esteemed enterprises of{" "}
            <strong className="text-amber-300 font-bold">SSV GROUP</strong>
          </p>
        </div>

        {/* Responsive Logo Grid: 2 columns on mobile, 3 on tablet, 5 on desktop for 10 sponsors */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
          {SPONSORS.map((sponsor) => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>

        {/* Trust Note */}
        <div className="mt-10 sm:mt-12 text-center p-5 sm:p-6 rounded-2xl border border-gold-800/20 bg-black/40 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-amber-200/80 italic leading-relaxed">
            &ldquo;SSV GROUP is committed to bringing top-tier entertainment, cultural pride, and festive joy to the people of Bidar.&rdquo;
          </p>
          <div className="text-[10px] sm:text-[11px] uppercase tracking-widest text-amber-400 font-bold mt-2">
            — SSV GROUP ORGANIZING COMMITTEE
          </div>
        </div>
      </div>
    </section>
  );
}
