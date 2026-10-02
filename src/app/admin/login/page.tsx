"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #0f0202 0%, #1a0505 50%, #0f0202 100%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-5"
            style={{
              background: "linear-gradient(135deg, #8B0000, #C0392B)",
              border: "1px solid rgba(212,160,23,0.4)",
              boxShadow: "0 8px 30px rgba(139,0,0,0.4)",
            }}
          >
            <Lock size={28} style={{ color: "#D4A017" }} />
          </div>
          <h1
            className="font-display font-black text-2xl mb-1"
            style={{ color: "#D4A017" }}
          >
            Admin Login
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,248,220,0.4)" }}>
            SSV Dandiya Divas 2026
          </p>
        </div>

        <div className="card-festive p-8">
          {error && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl mb-6"
              style={{
                background: "rgba(139,0,0,0.25)",
                border: "1px solid rgba(255,107,107,0.3)",
              }}
            >
              <AlertCircle
                size={18}
                style={{ color: "#ff6b6b" }}
                className="flex-shrink-0 mt-0.5"
              />
              <p className="text-sm" style={{ color: "#ffaaaa" }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(212,160,23,0.5)" }}
                />
                <input
                  id="email"
                  type="email"
                  className="form-input pl-10"
                  placeholder="admin@ssvgroup.in"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(212,160,23,0.5)" }}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(212,160,23,0.5)" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 text-base justify-center mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "rgba(255,248,220,0.2)" }}
        >
          Restricted access — SSV Group administrators only
        </p>
      </div>
    </div>
  );
}
