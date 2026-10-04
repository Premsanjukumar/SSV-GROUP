"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

const EVENT_DATE = new Date("2026-10-14T11:30:00.000Z"); // 5 PM IST

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft | null {
  const now = new Date();
  const diff = EVENT_DATE.getTime() - now.getTime();

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const EVENT_END = new Date("2026-10-15T00:00:00.000Z"); // End of event day

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    // SSR placeholder to avoid hydration mismatch
    return (
      <div className="flex items-center justify-center gap-3">
        {["--", "--", "--", "--"].map((_, i) => (
          <div key={i} className="countdown-digit opacity-50">
            <span className="number">--</span>
            <span className="label">{["Days", "Hours", "Mins", "Secs"][i]}</span>
          </div>
        ))}
      </div>
    );
  }

  const now = new Date();

  if (!timeLeft) {
    if (now < EVENT_END) {
      return (
        <div
          className="flex items-center gap-3 px-6 py-4 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(45,80,22,0.3), rgba(74,122,37,0.2))",
            border: "2px solid rgba(144,238,144,0.4)",
            boxShadow: "0 0 30px rgba(144,238,144,0.2)",
          }}
        >
          <Zap size={20} style={{ color: "#90ee90" }} className="animate-pulse" />
          <div>
            <div
              className="font-display font-bold text-xl tracking-widest"
              style={{ color: "#90ee90" }}
            >
              EVENT STARTED!
            </div>
            <div
              className="text-xs tracking-wider uppercase mt-0.5"
              style={{ color: "rgba(144,238,144,0.7)" }}
            >
              Come join us at the venue
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="flex items-center gap-3 px-6 py-4 rounded-2xl"
        style={{
          background: "rgba(26,5,5,0.6)",
          border: "1px solid rgba(212,160,23,0.2)",
        }}
      >
        <div>
          <div
            className="font-display font-bold text-xl tracking-widest"
            style={{ color: "rgba(212,160,23,0.7)" }}
          >
            EVENT COMPLETED
          </div>
          <div
            className="text-xs tracking-wider uppercase mt-0.5"
            style={{ color: "rgba(255,248,220,0.4)" }}
          >
            Thank you for joining SSV Dandiya Divas 2026!
          </div>
        </div>
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Mins" },
    { value: timeLeft.seconds, label: "Secs" },
  ];

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 max-w-full overflow-hidden px-1">
      <p
        className="text-[10px] sm:text-xs tracking-widest uppercase font-semibold text-amber-400/80"
      >
        Event starts in
      </p>
      <div className="flex items-center justify-center gap-1 min-[360px]:gap-2 sm:gap-3 max-w-full">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-1 min-[360px]:gap-2 sm:gap-3">
            <div className="countdown-digit">
              <span className="number">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="label">{unit.label}</span>
            </div>
            {i < units.length - 1 && (
              <span
                className="font-display font-bold text-lg sm:text-2xl leading-none animate-pulse text-amber-400/50"
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
