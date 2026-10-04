"use client";

import { useState, useEffect } from "react";
import {
  Gift, Trophy, Search, CheckCircle, AlertCircle, Loader2, Sparkles,
  RefreshCw, Check, X, ShieldCheck
} from "lucide-react";
import CouponModal from "@/components/CouponModal";

interface CouponItem {
  id: string;
  code: string;
  type: string;
  benefitAmount: number;
  winnerName: string | null;
  status: string;
  issuedAt: string;
  redeemedAt: string | null;
  expiresAt: string | null;
  booking?: {
    bookingRef: string;
    customerName: string;
    customerPhone: string;
    status: string;
  } | null;
}

interface CouponStats {
  totalCoupons: number;
  shoppingBenefitCount: number;
  winnerCount: number;
  redeemedCount: number;
  activeCount: number;
}

export default function CouponsClient() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modals state
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const [winnerNotes, setWinnerNotes] = useState("");
  const [creatingWinner, setCreatingWinner] = useState(false);

  // Quick redeem state
  const [redeemCodeInput, setRedeemCodeInput] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Preview card modal
  const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, [typeFilter, statusFilter]);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (typeFilter) params.set("type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/coupons?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
      setStats(data.stats || null);
    } catch {
      setFeedback({ type: "error", message: "Failed to load coupons." });
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchCoupons();
  }

  async function handleCreateWinnerCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!winnerName.trim()) {
      alert("Please enter winner name");
      return;
    }
    setCreatingWinner(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/coupons/winner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winnerName: winnerName.trim(),
          notes: winnerNotes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create winner coupon");

      setIsWinnerModalOpen(false);
      setWinnerName("");
      setWinnerNotes("");
      setFeedback({
        type: "success",
        message: `₹5,000 Winner Coupon created successfully: ${data.coupon.code}!`,
      });
      fetchCoupons();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Error creating coupon",
      });
    } finally {
      setCreatingWinner(false);
    }
  }

  async function handleRedeemCoupon(codeToRedeem?: string) {
    const code = (codeToRedeem || redeemCodeInput).trim().toUpperCase();
    if (!code) {
      setFeedback({ type: "error", message: "Please enter a coupon code." });
      return;
    }
    setRedeeming(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/coupons/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to redeem coupon");

      setRedeemCodeInput("");
      setFeedback({
        type: "success",
        message: `Coupon ${code} marked as REDEEMED successfully!`,
      });
      fetchCoupons();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Redemption failed.",
      });
    } finally {
      setRedeeming(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-amber-400 flex items-center gap-2">
            <Gift className="text-amber-400" />
            Digital Coupons &amp; Benefits
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/60 mt-0.5">
            Manage ₹200 attendee shopping vouchers &amp; issue ₹5,000 Ramp Walk Winner coupons
          </p>
        </div>

        <button
          onClick={() => setIsWinnerModalOpen(true)}
          className="btn-gold text-xs sm:text-sm px-4 py-2.5 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,160,23,0.3)]"
        >
          <Trophy size={16} />
          Issue Ramp Walk Winner Coupon (₹5,000)
        </button>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="stat-card">
            <div className="text-xs font-semibold text-amber-200/60 uppercase">Total Issued</div>
            <div className="font-display font-black text-2xl text-amber-300 mt-1">
              {stats.totalCoupons}
            </div>
          </div>
          <div className="stat-card">
            <div className="text-xs font-semibold text-amber-200/60 uppercase">Active</div>
            <div className="font-display font-black text-2xl text-emerald-400 mt-1">
              {stats.activeCount}
            </div>
          </div>
          <div className="stat-card">
            <div className="text-xs font-semibold text-amber-200/60 uppercase">Redeemed</div>
            <div className="font-display font-black text-2xl text-stone-300 mt-1">
              {stats.redeemedCount}
            </div>
          </div>
          <div className="stat-card">
            <div className="text-xs font-semibold text-amber-200/60 uppercase">₹200 Attendee Perks</div>
            <div className="font-display font-black text-2xl text-amber-400 mt-1">
              {stats.shoppingBenefitCount}
            </div>
          </div>
          <div className="stat-card">
            <div className="text-xs font-semibold text-amber-200/60 uppercase">🏆 ₹5,000 Winners</div>
            <div className="font-display font-black text-2xl text-amber-300 mt-1">
              {stats.winnerCount}
            </div>
          </div>
        </div>
      )}

      {/* Alert / Feedback message */}
      {feedback && (
        <div
          className={`flex items-start justify-between gap-3 p-4 rounded-xl border ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
              : "bg-red-950/40 border-red-500/50 text-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-semibold">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-200"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Quick Redeem Coupon Bar */}
      <div className="card-festive p-4 sm:p-5 border border-amber-500/30 bg-black/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto">
            <h3 className="font-display font-bold text-sm text-amber-300 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-400" />
              Redeem Attendee / Winner Coupon
            </h3>
            <p className="text-[11px] text-amber-100/60">
              Verify and permanently mark a presented voucher as REDEEMED
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="e.g. SSV-DF26-XXXX or WINNER-..."
              value={redeemCodeInput}
              onChange={(e) => setRedeemCodeInput(e.target.value.toUpperCase())}
              className="form-input text-xs sm:text-sm uppercase font-mono py-2 w-full sm:w-64"
            />
            <button
              onClick={() => handleRedeemCoupon()}
              disabled={redeeming || !redeemCodeInput.trim()}
              className="btn-gold text-xs px-4 py-2 font-bold whitespace-nowrap"
            >
              {redeeming ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Redeem
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-festive p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-200/50"
            />
            <input
              type="text"
              placeholder="Search by coupon code, winner name, or booking ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-9 text-xs sm:text-sm py-2"
            />
          </div>
          <button type="submit" className="btn-outline text-xs px-4 py-2">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-input text-xs py-2 bg-stone-900 border-amber-500/20 text-amber-100"
          >
            <option value="">All Benefit Types</option>
            <option value="SHOPPING_BENEFIT_200">₹200 Shopping Benefit</option>
            <option value="RAMP_WALK_WINNER_5000">🏆 ₹5,000 Ramp Walk Winner</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input text-xs py-2 bg-stone-900 border-amber-500/20 text-amber-100"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="REDEEMED">REDEEMED</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>

          <button
            onClick={() => fetchCoupons()}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/20"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="card-festive overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr style={{ background: "rgba(26,5,5,0.8)" }}>
                <th className="px-4 py-3 text-left font-semibold text-amber-300/80">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-amber-300/80">Type &amp; Benefit</th>
                <th className="px-4 py-3 text-left font-semibold text-amber-300/80">Winner / Holder</th>
                <th className="px-4 py-3 text-center font-semibold text-amber-300/80">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-amber-300/80">Issued Date</th>
                <th className="px-4 py-3 text-right font-semibold text-amber-300/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Loader2 size={24} className="animate-spin text-amber-400 mx-auto" />
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-amber-200/40">
                    No coupons found.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => {
                  const isWinner = c.type === "RAMP_WALK_WINNER_5000";
                  return (
                    <tr
                      key={c.id}
                      className="border-t border-amber-500/10 hover:bg-maroon-950/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-amber-400">
                        {c.code}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            isWinner ? "text-amber-300" : "text-emerald-400"
                          }`}
                        >
                          {isWinner ? <Trophy size={13} /> : <Gift size={13} />}
                          ₹{c.benefitAmount} {isWinner ? "Winner Prize" : "Shopping Perk"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isWinner ? (
                          <span className="font-bold text-amber-300">
                            👑 {c.winnerName || "Ramp Walk Winner"}
                          </span>
                        ) : c.booking ? (
                          <div>
                            <span className="text-amber-100 font-medium">
                              {c.booking.customerName}
                            </span>
                            <span className="block font-mono text-[10px] text-amber-300/70">
                              {c.booking.bookingRef}
                            </span>
                          </div>
                        ) : (
                          <span className="text-amber-200/50">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            c.status === "REDEEMED"
                              ? "bg-stone-800 text-stone-300 border border-stone-600"
                              : c.status === "ACTIVE"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                              : "bg-red-950 text-red-300 border border-red-800"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-amber-200/60 text-xs">
                        {new Date(c.issuedAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedCoupon(c)}
                          className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold"
                        >
                          View Card
                        </button>
                        {c.status === "ACTIVE" && (
                          <button
                            onClick={() => handleRedeemCoupon(c.code)}
                            className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold"
                          >
                            Mark Redeemed
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Winner Creation Modal */}
      {isWinnerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsWinnerModalOpen(false)}
        >
          <div
            className="card-festive p-6 sm:p-8 max-w-md w-full border-2 border-amber-400 shadow-[0_0_40px_rgba(212,160,23,0.35)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-amber-400" />
                <h3 className="font-display font-black text-lg text-amber-400">
                  Issue Ramp Walk Winner Coupon
                </h3>
              </div>
              <button
                onClick={() => setIsWinnerModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-amber-100/70 mb-5 leading-relaxed">
              Creates the official <strong>₹5,000 Foreign Fits Shopping Voucher</strong> assigned
              exclusively to the Ramp Walk 1st Winner.
            </p>

            <form onSubmit={handleCreateWinnerCoupon} className="space-y-4">
              <div>
                <label className="form-label text-xs">Winner Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter 1st Winner's name"
                  value={winnerName}
                  onChange={(e) => setWinnerName(e.target.value)}
                  className="form-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs">Prize Value (Strict Rule)</label>
                <div className="p-3 rounded-lg bg-black/50 border border-amber-400/30 text-amber-300 font-display font-black text-lg">
                  ₹5,000 (Foreign Fits Shopping Coupon)
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Notes / Event Details (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Ramp Walk 1st Winner 2026"
                  value={winnerNotes}
                  onChange={(e) => setWinnerNotes(e.target.value)}
                  className="form-input text-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWinnerModalOpen(false)}
                  className="btn-outline text-xs px-4 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingWinner || !winnerName.trim()}
                  className="btn-gold text-xs px-5 py-2.5 font-black flex items-center gap-2"
                >
                  {creatingWinner ? (
                    <><Loader2 size={14} className="animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles size={14} /> Generate Winner Coupon</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Coupon Preview Modal */}
      {selectedCoupon && (
        <CouponModal
          isOpen={Boolean(selectedCoupon)}
          onClose={() => setSelectedCoupon(null)}
          code={selectedCoupon.code}
          type={selectedCoupon.type}
          benefitAmount={selectedCoupon.benefitAmount}
          status={selectedCoupon.status}
          winnerName={selectedCoupon.winnerName}
          bookingRef={selectedCoupon.booking?.bookingRef}
          expiresAt={selectedCoupon.expiresAt}
        />
      )}
    </div>
  );
}
