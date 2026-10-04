"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import CouponCard, { CouponCardProps } from "./CouponCard";

interface CouponModalProps extends CouponCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CouponModal({
  isOpen,
  onClose,
  ...couponProps
}: CouponModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md transition-all animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md sm:max-w-lg mx-auto overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/80 hover:bg-black border border-amber-400/40 text-amber-300 hover:text-white flex items-center justify-center transition-all shadow-lg active:scale-95"
          aria-label="Close coupon modal"
        >
          <X size={18} />
        </button>

        {/* The Card */}
        <CouponCard {...couponProps} isModal={true} />

        {/* Bottom Close Action */}
        <div className="mt-3 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-wider text-amber-200/80 hover:text-amber-100 px-4 py-2 rounded-lg bg-black/40 hover:bg-black/60 border border-amber-500/20 transition-all"
          >
            [ Close Coupon ]
          </button>
        </div>
      </div>
    </div>
  );
}
