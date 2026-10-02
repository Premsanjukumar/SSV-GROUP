"use client";

import { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, AlertCircle, Loader2, ShieldCheck, MapPin, Phone, IndianRupee, Ticket } from "lucide-react";

export default function SettingsClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    contact_phone_1: "8618156721",
    contact_phone_2: "9482629007",
    platform_fee_paise: "0",
    mapsUrl: "https://maps.google.com/maps?q=Gumpa,Bidar,Karnataka,India",
  });

  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [paymentMode, setPaymentMode] = useState<string>("demo");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) return;
      const data = await res.json();
      if (data.settings) {
        setForm({
          contact_phone_1: data.settings.contact_phone_1 || "8618156721",
          contact_phone_2: data.settings.contact_phone_2 || "9482629007",
          platform_fee_paise: data.settings.platform_fee_paise || "0",
          mapsUrl: data.event?.mapsUrl || "https://maps.google.com/maps?q=Gumpa,Bidar,Karnataka,India",
        });
        setPaymentMode(data.settings.payment_mode || "demo");
      }
      if (data.ticketTypes) {
        setTicketTypes(data.ticketTypes);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load settings" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            contact_phone_1: form.contact_phone_1,
            contact_phone_2: form.contact_phone_2,
            platform_fee_paise: form.platform_fee_paise,
          },
          ticketTypes,
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save settings." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} style={{ color: "#D4A017" }} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl" style={{ color: "#D4A017" }}>
          Event Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,248,220,0.4)" }}>
          Manage event configuration, ticket capacities, contact info, and payment settings.
        </p>
      </div>

      {message && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{
            background: message.type === "success" ? "rgba(45,80,22,0.3)" : "rgba(139,0,0,0.3)",
            border: `1px solid ${message.type === "success" ? "rgba(144,238,144,0.4)" : "rgba(255,107,107,0.4)"}`,
            color: message.type === "success" ? "#90ee90" : "#ffaaaa",
          }}
        >
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Payment Mode Status */}
        <div className="card-festive p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(212,160,23,0.15)", border: "1px solid rgba(212,160,23,0.3)" }}
              >
                <ShieldCheck size={20} style={{ color: "#D4A017" }} />
              </div>
              <div>
                <h2 className="font-bold text-base" style={{ color: "#FFF8DC" }}>Payment Gateway Status</h2>
                <p className="text-xs" style={{ color: "rgba(255,248,220,0.5)" }}>
                  Current active mode: <strong className="uppercase text-gold-400">{paymentMode}</strong>
                </p>
              </div>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: paymentMode === "razorpay" ? "rgba(45,80,22,0.4)" : "rgba(255,140,0,0.2)",
                color: paymentMode === "razorpay" ? "#90ee90" : "#ffd700",
                border: `1px solid ${paymentMode === "razorpay" ? "rgba(144,238,144,0.3)" : "rgba(255,215,0,0.3)"}`,
              }}
            >
              {paymentMode === "razorpay" ? "● Razorpay Live/Test" : "● Demo Payment Mode"}
            </span>
          </div>
        </div>

        {/* Ticket Capacities & Inventory */}
        <div className="card-festive p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Ticket size={18} style={{ color: "#D4A017" }} />
            <h2 className="font-bold text-base" style={{ color: "#FFF8DC" }}>Ticket Capacities & Limits</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ticketTypes.map((t, idx) => (
              <div
                key={t.id || idx}
                className="p-4 rounded-xl border space-y-3"
                style={{ background: "rgba(26,5,5,0.6)", borderColor: "rgba(212,160,23,0.15)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm" style={{ color: "#D4A017" }}>{t.name}</span>
                  <span className="text-xs font-semibold" style={{ color: "#FFF8DC" }}>
                    ₹{t.price ? t.price / 100 : (t.name.includes("Single") ? 299 : 499)}
                  </span>
                </div>

                <div>
                  <label className="form-label" htmlFor={`capacity-${idx}`}>Capacity (Total Seats)</label>
                  <input
                    id={`capacity-${idx}`}
                    type="number"
                    min="1"
                    className="form-input"
                    value={t.capacity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setTicketTypes((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, capacity: val } : item))
                      );
                    }}
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor={`max-order-${idx}`}>Max Tickets Per Order</label>
                  <input
                    id={`max-order-${idx}`}
                    type="number"
                    min="1"
                    max="20"
                    className="form-input"
                    value={t.maxPerOrder || 5}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 5;
                      setTicketTypes((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, maxPerOrder: val } : item))
                      );
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="card-festive p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Phone size={18} style={{ color: "#D4A017" }} />
            <h2 className="font-bold text-base" style={{ color: "#FFF8DC" }}>Public Contact Numbers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="phone1">Primary Contact Number</label>
              <input
                id="phone1"
                type="tel"
                className="form-input font-mono"
                value={form.contact_phone_1}
                onChange={(e) => setForm((f) => ({ ...f, contact_phone_1: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="phone2">Secondary Contact Number</label>
              <input
                id="phone2"
                type="tel"
                className="form-input font-mono"
                value={form.contact_phone_2}
                onChange={(e) => setForm((f) => ({ ...f, contact_phone_2: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>

        {/* Location & Platform Fee */}
        <div className="card-festive p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={18} style={{ color: "#D4A017" }} />
            <h2 className="font-bold text-base" style={{ color: "#FFF8DC" }}>Venue & Fee Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label" htmlFor="mapsUrl">Google Maps Link</label>
              <input
                id="mapsUrl"
                type="url"
                className="form-input"
                value={form.mapsUrl}
                onChange={(e) => setForm((f) => ({ ...f, mapsUrl: e.target.value }))}
                placeholder="https://maps.google.com/maps?q=..."
              />
            </div>

            <div>
              <label className="form-label" htmlFor="platformFee">Platform Fee (in Paise, e.g. 0 for ₹0)</label>
              <div className="relative">
                <input
                  id="platformFee"
                  type="number"
                  min="0"
                  className="form-input"
                  value={form.platform_fee_paise}
                  onChange={(e) => setForm((f) => ({ ...f, platform_fee_paise: e.target.value }))}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: "rgba(255,248,220,0.4)" }}>
                Current fee: ₹{(parseInt(form.platform_fee_paise || "0") / 100).toFixed(2)} (Default is ₹0)
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-gold px-8 py-3.5 text-sm">
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
