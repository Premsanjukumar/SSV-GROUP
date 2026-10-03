"use client";

/**
 * SSV AI Support Widget
 *
 * Floating help-center widget for SSV Dandiya Divas 2026.
 * - Uses ONLY approved FAQ data from src/data/help-center.ts
 * - No external AI API — pure keyword/preset matching
 * - Does NOT touch payment, booking, database, or Razorpay
 * - Accessibility: aria-labels, keyboard navigation, Escape to close
 * - Security: all user input rendered as text (no dangerouslySetInnerHTML)
 */

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { X, MessageCircle, Phone, ChevronLeft, ThumbsUp, ThumbsDown, Search } from "lucide-react";
import {
  FAQ_CATEGORIES,
  FAQ_ENTRIES,
  CUSTOMER_CARE_NUMBERS,
  SUPPORT_HOURS,
  findFaqMatch,
  getFaqByCategory,
  type CategoryId,
  type FaqEntry,
} from "@/data/help-center";

// ─── Types ────────────────────────────────────────────────────────────────────

type PanelView =
  | { kind: "home" }
  | { kind: "category"; categoryId: CategoryId }
  | { kind: "answer"; entry: FaqEntry }
  | { kind: "care" }
  | { kind: "not-found" };

type FeedbackState = "none" | "yes" | "no";

// ─── Simple Markdown-to-JSX renderer (safe, no HTML injection) ────────────────
function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    // Bold: **text**
    const parts = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? (
        <strong key={j} style={{ color: "#F5C842" }}>
          {part}
        </strong>
      ) : (
        <span key={j}>{part}</span>
      )
    );
    return (
      <span key={i} style={{ display: "block", marginBottom: line === "" ? "8px" : "2px" }}>
        {parts}
      </span>
    );
  });
}

// ─── Customer Care Panel ──────────────────────────────────────────────────────
function CustomerCarePanel({ onBack }: { onBack: () => void }) {
  return (
    <div className="ssv-support-scroll" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <button
        onClick={onBack}
        className="ssv-support-back"
        aria-label="Go back"
        style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "#D4A017", fontSize: "12px", padding: "4px 0", fontWeight: 600 }}
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
        <div style={{ fontSize: "28px", marginBottom: "6px" }}>📞</div>
        <div style={{ color: "#D4A017", fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>
          Customer Care
        </div>
        <div style={{ color: "rgba(255,248,220,0.6)", fontSize: "11px" }}>
          {SUPPORT_HOURS}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {CUSTOMER_CARE_NUMBERS.map((care) => (
          <a
            key={care.label}
            href={care.tel}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212,160,23,0.2)",
              textDecoration: "none",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.5)";
              (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.07)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.2)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Phone size={16} style={{ color: "#D4A017", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "10px", color: "#D4A017", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>
                  {care.label}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>
                  {care.number}
                </div>
              </div>
            </div>
            <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px", background: "rgba(212,160,23,0.15)", color: "#F5C842", fontWeight: 600 }}>
              {care.badge}
            </span>
          </a>
        ))}
      </div>

      <a
        href="/contact"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid rgba(212,160,23,0.3)",
          color: "#D4A017",
          textDecoration: "none",
          fontSize: "12px",
          fontWeight: 600,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        View Full Contact Page →
      </a>
    </div>
  );
}

// ─── Answer Panel ─────────────────────────────────────────────────────────────
function AnswerPanel({
  entry,
  onBack,
  onCare,
}: {
  entry: FaqEntry;
  onBack: () => void;
  onCare: () => void;
}) {
  const [feedback, setFeedback] = useState<FeedbackState>("none");

  return (
    <div className="ssv-support-scroll" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <button
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "#D4A017", fontSize: "12px", padding: "4px 0", fontWeight: 600 }}
        aria-label="Go back"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div style={{ padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,160,23,0.15)" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "#D4A017", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          🤖 SSV Support
        </div>
        <div style={{ fontSize: "13px", color: "rgba(255,248,220,0.9)", lineHeight: 1.7 }}>
          {renderMarkdown(entry.answer!)}
        </div>
      </div>

      {/* Feedback */}
      {feedback === "none" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontSize: "12px", color: "rgba(255,248,220,0.5)" }}>Was this helpful?</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setFeedback("yes")}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(212,160,23,0.3)", background: "transparent", color: "#D4A017", cursor: "pointer", fontSize: "12px", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              aria-label="Yes, this was helpful"
            >
              <ThumbsUp size={13} /> Yes
            </button>
            <button
              onClick={() => setFeedback("no")}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,248,220,0.5)", cursor: "pointer", fontSize: "12px", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              aria-label="No, this was not helpful"
            >
              <ThumbsDown size={13} /> No
            </button>
          </div>
        </div>
      )}

      {feedback === "yes" && (
        <div style={{ textAlign: "center", padding: "10px", borderRadius: "10px", background: "rgba(45,80,22,0.2)", border: "1px solid rgba(45,80,22,0.4)", color: "#90ee90", fontSize: "13px" }}>
          Glad I could help! 😊
        </div>
      )}

      {feedback === "no" && (
        <div style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(109,11,11,0.3)", border: "1px solid rgba(212,160,23,0.15)" }}>
          <div style={{ fontSize: "12px", color: "rgba(255,248,220,0.7)", marginBottom: "10px" }}>
            Sorry about that. Would you like to contact customer care?
          </div>
          <button
            onClick={onCare}
            style={{ width: "100%", padding: "9px", borderRadius: "9px", background: "linear-gradient(135deg,#8B0000,#C0392B)", border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017", fontWeight: 700, fontSize: "12px", cursor: "pointer", letterSpacing: "0.04em" }}
          >
            📞 Contact Customer Care
          </button>
        </div>
      )}

      <button
        onClick={onCare}
        style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(212,160,23,0.25)", background: "transparent", color: "rgba(255,248,220,0.55)", fontSize: "12px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#D4A017"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.5)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,248,220,0.55)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.25)"; }}
      >
        <Phone size={13} /> Still need help? Contact Customer Care
      </button>
    </div>
  );
}

// ─── Not Found Panel ──────────────────────────────────────────────────────────
function NotFoundPanel({ onBack, onCare }: { onBack: () => void; onCare: () => void }) {
  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "14px", alignItems: "center", textAlign: "center" }}>
      <div style={{ fontSize: "36px" }}>🤔</div>
      <div>
        <div style={{ color: "rgba(255,248,220,0.85)", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
          I couldn&apos;t find a reliable answer to that.
        </div>
        <div style={{ color: "rgba(255,248,220,0.5)", fontSize: "12px" }}>
          I only answer from approved information. Would you like to contact our team?
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
        <button
          onClick={onCare}
          style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "linear-gradient(135deg,#8B0000,#C0392B)", border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
        >
          📞 Contact Customer Care
        </button>
        <button
          onClick={onBack}
          style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid rgba(212,160,23,0.2)", background: "transparent", color: "rgba(255,248,220,0.6)", fontSize: "12px", cursor: "pointer" }}
        >
          ← Back to Help Center
        </button>
      </div>
    </div>
  );
}

// ─── Home Panel ───────────────────────────────────────────────────────────────
function HomePanel({
  onCategory,
  onAnswer,
  onCare,
  onNotFound,
}: {
  onCategory: (id: CategoryId) => void;
  onAnswer: (entry: FaqEntry) => void;
  onCare: () => void;
  onNotFound: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearch() {
    const q = query.trim();
    if (!q) return;
    const match = findFaqMatch(q);
    if (!match) { onNotFound(); return; }
    if (match.answer === null) { onCare(); return; }
    onAnswer(match);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  // Popular quick questions from all categories (first question of each)
  const quickQuestions = FAQ_ENTRIES.slice(0, 6);

  return (
    <div className="ssv-support-scroll" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Search */}
      <div style={{ display: "flex", gap: "6px" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,160,23,0.2)", transition: "border-color 0.2s" }}>
          <Search size={14} style={{ color: "rgba(212,160,23,0.6)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask your question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#FFF8DC", fontSize: "13px" }}
            aria-label="Ask a support question"
            maxLength={200}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={!query.trim()}
          style={{ padding: "9px 14px", borderRadius: "10px", background: query.trim() ? "linear-gradient(135deg,#8B0000,#C0392B)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(212,160,23,0.25)", color: query.trim() ? "#D4A017" : "rgba(255,255,255,0.3)", cursor: query.trim() ? "pointer" : "default", fontSize: "12px", fontWeight: 700, transition: "all 0.2s" }}
          aria-label="Search"
        >
          Ask
        </button>
      </div>

      {/* Categories */}
      <div>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(212,160,23,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
          Help Center
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategory(cat.id)}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,160,23,0.15)", cursor: "pointer", textAlign: "left", transition: "all 0.2s", color: "rgba(255,248,220,0.8)", fontSize: "12px", fontWeight: 600 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.35)";
                (e.currentTarget as HTMLElement).style.color = "#F5C842";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.15)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,248,220,0.8)";
              }}
              aria-label={`Browse ${cat.label} questions`}
            >
              <span style={{ fontSize: "16px" }}>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick questions */}
      <div>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(212,160,23,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
          Popular Questions
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {quickQuestions.map((entry) => (
            <button
              key={entry.id}
              onClick={() => {
                if (entry.answer === null) { onCare(); return; }
                onAnswer(entry);
              }}
              style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: "8px", background: "none", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", color: "rgba(255,248,220,0.65)", fontSize: "12px", transition: "all 0.2s" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.06)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.25)";
                (e.currentTarget as HTMLElement).style.color = "#FFF8DC";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "none";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,248,220,0.65)";
              }}
            >
              → {entry.question}
            </button>
          ))}
        </div>
      </div>

      {/* Care CTA */}
      <button
        onClick={onCare}
        style={{ width: "100%", padding: "11px", borderRadius: "10px", background: "linear-gradient(135deg,#8B0000,#C0392B)", border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017", fontWeight: 700, fontSize: "12px", cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(139,0,0,0.5)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
      >
        <Phone size={14} /> Contact Customer Care
      </button>
    </div>
  );
}

// ─── Category Panel ───────────────────────────────────────────────────────────
function CategoryPanel({
  categoryId,
  onBack,
  onAnswer,
  onCare,
}: {
  categoryId: CategoryId;
  onBack: () => void;
  onAnswer: (entry: FaqEntry) => void;
  onCare: () => void;
}) {
  const category = FAQ_CATEGORIES.find((c) => c.id === categoryId)!;
  const entries = getFaqByCategory(categoryId);

  return (
    <div className="ssv-support-scroll" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <button
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "#D4A017", fontSize: "12px", padding: "4px 0", fontWeight: 600 }}
        aria-label="Go back"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
        <span style={{ fontSize: "22px" }}>{category.emoji}</span>
        <span style={{ color: "#D4A017", fontWeight: 700, fontSize: "15px" }}>{category.label}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {entries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => {
              if (entry.answer === null) { onCare(); return; }
              onAnswer(entry);
            }}
            style={{ width: "100%", textAlign: "left", padding: "11px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,160,23,0.15)", cursor: "pointer", color: "rgba(255,248,220,0.8)", fontSize: "13px", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.35)";
              (e.currentTarget as HTMLElement).style.color = "#FFF8DC";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.15)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,248,220,0.8)";
            }}
          >
            <span>{entry.question}</span>
            <span style={{ color: "#D4A017", flexShrink: 0, fontSize: "16px" }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export default function AISupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<PanelView>({ kind: "home" });
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Delay mount animation
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Escape key closes panel
  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Focus trap: move focus to panel when opened
  useEffect(() => {
    if (isOpen) {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        'button, input, a[href]'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  // Reset to home when closed
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setView({ kind: "home" }), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  function goHome() { setView({ kind: "home" }); }
  function goCare() { setView({ kind: "care" }); }

  const viewStack: PanelView[] = view.kind === "home" ? [] : [{ kind: "home" }];

  return (
    <>
      {/* ── Floating Button ── */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "20px",
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.7)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <button
          ref={triggerRef}
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Close SSV Support" : "Open SSV Support"}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 18px",
            borderRadius: "50px",
            background: isOpen
              ? "linear-gradient(135deg,#220808,#3D0808)"
              : "linear-gradient(135deg,#8B0000,#C0392B)",
            border: "1px solid rgba(212,160,23,0.4)",
            color: "#D4A017",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: "0 4px 24px rgba(139,0,0,0.5), 0 0 0 0 rgba(212,160,23,0)",
            transition: "all 0.3s ease",
            letterSpacing: "0.03em",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-inter, Inter, sans-serif)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(139,0,0,0.6), 0 0 0 2px rgba(212,160,23,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(139,0,0,0.5)";
          }}
        >
          {isOpen ? (
            <X size={16} />
          ) : (
            <MessageCircle size={16} />
          )}
          {isOpen ? "Close" : "AI Support"}
        </button>
      </div>

      {/* ── Support Panel ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="SSV Support Help Center"
          aria-modal="true"
          ref={panelRef}
          style={{
            position: "fixed",
            bottom: "76px",
            right: "20px",
            zIndex: 9999,
            width: "min(360px, calc(100vw - 32px))",
            maxHeight: "min(540px, calc(100vh - 100px))",
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            overflow: "hidden",
            background: "linear-gradient(145deg, rgba(22,4,4,0.98), rgba(30,7,7,0.98))",
            border: "1px solid rgba(212,160,23,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,160,23,0.1), inset 0 1px 0 rgba(212,160,23,0.1)",
            backdropFilter: "blur(20px)",
            animation: "ssvPanelSlideUp 0.25s ease-out",
            fontFamily: "var(--font-inter, Inter, sans-serif)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 18px 14px",
              borderBottom: "1px solid rgba(212,160,23,0.15)",
              background: "linear-gradient(135deg, rgba(109,11,11,0.4), rgba(26,5,5,0.6))",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg,#8B0000,#C0392B)", border: "1px solid rgba(212,160,23,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                  🤖
                </div>
                <div>
                  <div style={{ color: "#D4A017", fontWeight: 700, fontSize: "14px", lineHeight: 1.2 }}>SSV Support</div>
                  <div style={{ color: "rgba(255,248,220,0.5)", fontSize: "10px", lineHeight: 1.2 }}>How can we help you?</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setIsOpen(false); triggerRef.current?.focus(); }}
              aria-label="Close support panel"
              style={{ padding: "6px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,248,220,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "#FFF8DC"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,248,220,0.5)"; }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            {view.kind === "home" && (
              <HomePanel
                onCategory={(id) => setView({ kind: "category", categoryId: id })}
                onAnswer={(entry) => setView({ kind: "answer", entry })}
                onCare={goCare}
                onNotFound={() => setView({ kind: "not-found" })}
              />
            )}
            {view.kind === "category" && (
              <CategoryPanel
                categoryId={view.categoryId}
                onBack={goHome}
                onAnswer={(entry) => setView({ kind: "answer", entry })}
                onCare={goCare}
              />
            )}
            {view.kind === "answer" && view.entry.answer !== null && (
              <AnswerPanel
                entry={view.entry}
                onBack={() => setView({ kind: "category", categoryId: view.entry.categoryId })}
                onCare={goCare}
              />
            )}
            {view.kind === "care" && <CustomerCarePanel onBack={goHome} />}
            {view.kind === "not-found" && (
              <NotFoundPanel onBack={goHome} onCare={goCare} />
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(212,160,23,0.1)", background: "rgba(0,0,0,0.3)", textAlign: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "10px", color: "rgba(255,248,220,0.25)", letterSpacing: "0.05em" }}>
              SSV Group • Dandiya Divas 2026 • Bidar
            </span>
          </div>
        </div>
      )}

      {/* ── Panel animation keyframes (injected once) ── */}
      <style>{`
        @keyframes ssvPanelSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .ssv-support-scroll::-webkit-scrollbar { width: 4px; }
        .ssv-support-scroll::-webkit-scrollbar-track { background: transparent; }
        .ssv-support-scroll::-webkit-scrollbar-thumb { background: rgba(212,160,23,0.3); border-radius: 4px; }
      `}</style>
    </>
  );
}
