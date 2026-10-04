"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import CouponModal from "./CouponModal";

interface TicketCouponSectionProps {
  code: string;
  benefitAmount?: number;
  status?: string;
  bookingRef?: string;
}

export default function TicketCouponSection({
  code,
  benefitAmount = 200,
  status = "ACTIVE",
  bookingRef,
}: TicketCouponSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <article
        className="ticket"
        style={{
          marginBottom: 16,
          borderColor: "rgba(212,160,23,0.5)",
          background: "linear-gradient(145deg, #1c0505 0%, #2e0808 100%)",
        }}
      >
        <header>
          <small>🎁 SHOPPING BENEFIT</small>
          <b>FOREIGN FITS</b>
        </header>
        <div style={{ padding: "16px" }}>
          <h3
            style={{
              margin: "0 0 4px 0",
              color: "#F5C842",
              fontSize: "1.25rem",
              fontWeight: 900,
            }}
          >
            ₹200 OFF
          </h3>
          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "0.85rem",
              color: "#FFF8DC",
              lineHeight: 1.4,
            }}
          >
            Foreign Fits Imported Fashion • Shopping benefit for every person.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <Gift size={16} /> [ VIEW COUPON ]
          </button>
        </div>
      </article>

      <CouponModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        code={code}
        type="SHOPPING_BENEFIT_200"
        benefitAmount={benefitAmount}
        status={status}
        bookingRef={bookingRef}
      />
    </>
  );
}
