"use client";

import { useState, useEffect, useRef } from "react";
import {
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  RefreshCw,
  Search,
  Volume2,
  VolumeX,
  Ticket as TicketIcon,
} from "lucide-react";

interface ScanResponse {
  valid: boolean;
  status: "SUCCESS" | "ALREADY_USED" | "INVALID" | "CANCELLED" | "NOT_FOUND";
  message: string;
  ticketInfo?: {
    bookingRef: string;
    customerName: string;
    ticketType: string;
    quantity: number;
    checkedInAt?: string;
  };
}

interface ScanHistoryItem {
  id: string;
  timestamp: string;
  status: string;
  customerName?: string;
  bookingRef?: string;
  ticketType?: string;
}

export default function ScannerClient() {
  const [manualCode, setManualCode] = useState("");
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResponse | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<unknown | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound effects generator using Web Audio API
  const playBeep = (type: "success" | "error" | "warning") => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.setValueAtTime(1244.5, ctx.currentTime + 0.1); // E6
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "warning") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(350, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = "square";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn("Audio feedback error:", e);
    }
  };

  const handleScanToken = async (rawCode: string) => {
    if (!rawCode || loading) return;

    // Extract token if code is full URL
    let token = rawCode.trim();
    if (token.includes("/verify/")) {
      token = token.split("/verify/")[1].split("?")[0].trim();
    }

    setLoading(true);
    setCameraError(null);

    try {
      const res = await fetch("/api/tickets/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data: ScanResponse = await res.json();
      setLastResult(data);

      if (data.valid) {
        playBeep("success");
      } else if (data.status === "ALREADY_USED") {
        playBeep("warning");
      } else {
        playBeep("error");
      }

      // Add to history log
      setScanHistory((prev) => [
        {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString(),
          status: data.status,
          customerName: data.ticketInfo?.customerName,
          bookingRef: data.ticketInfo?.bookingRef,
          ticketType: data.ticketInfo?.ticketType,
        },
        ...prev.slice(0, 19),
      ]);
    } catch (err) {
      console.error("Verification failed:", err);
      setLastResult({
        valid: false,
        status: "INVALID",
        message: "Network or server error during scan verification.",
      });
      playBeep("error");
    } finally {
      setLoading(false);
    }
  };

  // Start Html5Qrcode Camera Scanner
  const startCamera = async () => {
    setCameraError(null);
    setIsScanningCamera(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleScanToken(decodedText);
        },
        () => {
          // ignore scan frame errors
        }
      );
    } catch (err: unknown) {
      console.error("Camera init failed:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setCameraError(errMsg || "Could not access camera. Please allow camera permissions.");
      setIsScanningCamera(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        const scanner = scannerRef.current as { stop: () => Promise<void> };
        await scanner.stop();
      } catch (e) {
        console.warn("Scanner stop warning:", e);
      }
      scannerRef.current = null;
    }
    setIsScanningCamera(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        const scanner = scannerRef.current as { stop: () => Promise<void> };
        scanner.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-amber-500/20 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <QrCode className="w-7 h-7 text-amber-500" />
            Gate Entry Scanner
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            SSV Dandiya Divas 2026 — Official Ticket Verification & Check-in
          </p>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${
            soundEnabled
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
              : "bg-zinc-800 border-zinc-700 text-zinc-400"
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          Sound {soundEnabled ? "ON" : "OFF"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner & Manual Input Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Camera Scan Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                Live QR Camera Scanner
              </h2>
              {isScanningCamera ? (
                <button
                  onClick={stopCamera}
                  className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition"
                >
                  Stop Camera
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 rounded-lg text-sm font-semibold hover:brightness-110 transition flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" /> Start Camera
                </button>
              )}
            </div>

            {/* Video Container */}
            <div className="relative bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden min-h-[260px] flex items-center justify-center">
              <div id="reader" className="w-full h-full min-h-[260px]" />
              {!isScanningCamera && !cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-950/90">
                  <QrCode className="w-16 h-16 text-zinc-700 mb-3" />
                  <p className="text-zinc-400 text-sm font-medium">Camera Scanner Paused</p>
                  <p className="text-zinc-600 text-xs mt-1">
                    Click &quot;Start Camera&quot; to begin scanning visitor QR codes at entry.
                  </p>
                </div>
              )}
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-950/95 text-red-400">
                  <AlertTriangle className="w-12 h-12 mb-2 text-red-500" />
                  <p className="font-semibold text-sm">Camera Error</p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs">{cameraError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Manual Entry */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              Manual Search / Code Verification
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              Paste or type Ticket Token or Booking Reference (e.g. SSV-DD26-XXXXXX)
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleScanToken(manualCode);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter Booking Ref or Ticket Token..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition placeholder:text-zinc-600"
              />
              <button
                type="submit"
                disabled={loading || !manualCode.trim()}
                className="px-6 py-3 bg-amber-500 text-zinc-950 font-semibold rounded-xl hover:bg-amber-400 disabled:opacity-50 transition text-sm flex items-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify"}
              </button>
            </form>
          </div>
        </div>

        {/* Scan Results & History Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Scan Result Banner Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4">Current Verification Result</h2>

            {!lastResult ? (
              <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
                <TicketIcon className="w-10 h-10 mx-auto mb-2 text-zinc-700" />
                <p className="text-sm font-medium">Awaiting Scan</p>
                <p className="text-xs text-zinc-600 mt-1">Scan a QR code or submit a code to verify entry.</p>
              </div>
            ) : lastResult.valid ? (
              /* SUCCESS BANNER */
              <div className="bg-emerald-950/50 border-2 border-emerald-500/60 rounded-2xl p-6 text-emerald-300 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      ENTRY ALLOWED
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-1">VALID TICKET</h3>
                  </div>
                </div>

                {lastResult.ticketInfo && (
                  <div className="bg-zinc-950/60 rounded-xl p-4 space-y-2 border border-emerald-500/20 text-sm">
                    <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                      <span className="text-zinc-400">Guest Name:</span>
                      <span className="font-bold text-white">{lastResult.ticketInfo.customerName}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                      <span className="text-zinc-400">Pass Category:</span>
                      <span className="font-semibold text-amber-400">{lastResult.ticketInfo.ticketType}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                      <span className="text-zinc-400">Quantity:</span>
                      <span className="font-semibold text-white">{lastResult.ticketInfo.quantity} Person(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Booking Ref:</span>
                      <span className="font-mono text-zinc-300">{lastResult.ticketInfo.bookingRef}</span>
                    </div>
                  </div>
                )}
                <p className="text-xs text-emerald-400/80 text-center font-medium">
                  ✓ Ticket marked as CHECKED IN. Allow visitor entry.
                </p>
              </div>
            ) : lastResult.status === "ALREADY_USED" ? (
              /* ALREADY USED BANNER */
              <div className="bg-amber-950/50 border-2 border-amber-500/60 rounded-2xl p-6 text-amber-300 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      WARNING — ALREADY USED
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-1">DUPLICATE ENTRY</h3>
                  </div>
                </div>
                <p className="text-sm text-zinc-300">{lastResult.message}</p>
                {lastResult.ticketInfo && (
                  <div className="bg-zinc-950/60 rounded-xl p-4 space-y-2 border border-amber-500/20 text-sm">
                    <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                      <span className="text-zinc-400">Guest Name:</span>
                      <span className="font-bold text-white">{lastResult.ticketInfo.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Checked In At:</span>
                      <span className="font-semibold text-amber-400">
                        {lastResult.ticketInfo.checkedInAt
                          ? new Date(lastResult.ticketInfo.checkedInAt).toLocaleString()
                          : "Earlier"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* INVALID / CANCELLED / NOT FOUND BANNER */
              <div className="bg-red-950/50 border-2 border-red-500/60 rounded-2xl p-6 text-red-300 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                    <XCircle className="w-7 h-7 text-red-400" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-red-400 bg-red-500/20 px-2.5 py-0.5 rounded-full border border-red-500/30">
                      ENTRY DENIED
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-1">INVALID TICKET</h3>
                  </div>
                </div>
                <p className="text-sm text-zinc-300">{lastResult.message}</p>
              </div>
            )}
          </div>

          {/* Recent Scan History */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-3 text-sm flex items-center justify-between">
              <span>Recent Scan Session Log</span>
              <span className="text-xs text-zinc-500 font-normal">{scanHistory.length} scanned</span>
            </h2>
            {scanHistory.length === 0 ? (
              <p className="text-xs text-zinc-600 text-center py-4">No scans logged in this session yet.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-auto pr-1">
                {scanHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-850 text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white">
                        {item.customerName || item.bookingRef || "Unknown"}
                      </p>
                      <p className="text-zinc-500 text-[10px]">{item.ticketType || "N/A"}</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span
                        className={`inline-block font-bold px-2 py-0.5 rounded text-[10px] ${
                          item.status === "SUCCESS"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : item.status === "ALREADY_USED"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                      <p className="text-zinc-600 text-[10px]">{item.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
