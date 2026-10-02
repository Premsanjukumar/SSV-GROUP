"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f0202]">
      <div className="card-festive max-w-lg w-full p-8 md:p-12 text-center space-y-6">
        <div
          className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(139,0,0,0.5), rgba(192,57,43,0.3))",
            border: "1px solid rgba(255,107,107,0.4)",
          }}
        >
          <AlertTriangle size={36} style={{ color: "#ff6b6b" }} />
        </div>

        <div>
          <h1 className="font-display font-bold text-2xl mb-2" style={{ color: "#D4A017" }}>
            Something Went Wrong
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,248,220,0.6)" }}>
            We encountered an unexpected error. Please try refreshing or return to the homepage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="btn-gold w-full sm:w-auto px-6 py-3 text-sm"
          >
            <RotateCcw size={16} /> Try Again
          </button>
          <Link href="/" className="btn-outline w-full sm:w-auto px-6 py-3 text-sm">
            <Home size={16} /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
