import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCw, Wifi } from "lucide-react";
import { LocalTime } from "./interactive/LocalTime";

const EASE = [0.16, 1, 0.3, 1];
const timeFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

// navigator.onLine is optimistic (it only knows about the local link), so confirm with a real request.
async function hasConnectivity() {
  if (!navigator.onLine) return false;
  try {
    const res = await fetch(`/?ping=${Date.now()}`, { method: "HEAD", cache: "no-store" });
    return res.ok || res.type === "opaque";
  } catch {
    return false;
  }
}

function Radar() {
  // Fixed "blips" at polar positions — what the sweep is (not) finding.
  const blips = [
    [0.62, 40],
    [0.38, 150],
    [0.8, 230],
    [0.5, 310],
  ];
  return (
    <div aria-hidden="true" className="relative aspect-square w-full max-w-[420px]">
      {[1, 0.75, 0.5, 0.25].map((s) => (
        <span key={s} className="absolute rounded-full border border-ink/15" style={{ inset: `${(1 - s) * 50}%` }} />
      ))}
      <span className="absolute inset-y-0 left-1/2 w-px bg-ink/10" />
      <span className="absolute inset-x-0 top-1/2 h-px bg-ink/10" />
      <span className="radar-sweep absolute inset-0 rounded-full motion-reduce:hidden" />
      {blips.map(([r, deg], i) => (
        <motion.span
          key={deg}
          className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/40"
          style={{
            left: `${50 + Math.cos((deg * Math.PI) / 180) * r * 50}%`,
            top: `${50 + Math.sin((deg * Math.PI) / 180) * r * 50}%`,
          }}
          animate={{ opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: (deg / 360) * 3.2, ease: "easeOut" }}
        />
      ))}
      <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-fill">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-fill opacity-60" />
      </span>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
        Scanning for network
      </span>
    </div>
  );
}

function OfflinePanel({ since, attempts, checking, onRetry }) {
  const retryRef = useRef(null);

  useEffect(() => {
    retryRef.current?.focus();
  }, []);

  return (
    <motion.div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="offline-title"
      aria-describedby="offline-desc"
      className="fixed inset-0 z-[1900] overflow-y-auto bg-canvas text-ink"
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={{ clipPath: "inset(0% 0 0 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div className="container mx-auto flex min-h-full flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
          <span>Md Azharuddin</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-fill" /> Offline
          </span>
        </div>

        <div className="grid flex-1 grid-cols-12 items-center gap-x-6 gap-y-12 py-16">
          <div className="col-span-12 lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">Error 0 — no connection</p>
            <h1 id="offline-title" className="mt-6 font-display text-[clamp(3rem,8vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.045em]">
              You&apos;re <em className="font-serif font-normal italic text-brand">offline.</em>
            </h1>
            <p id="offline-desc" className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
              The page is still here, untouched. Reconnect and you&apos;ll pick up exactly where you left off — scroll position and anything you typed included.
            </p>

            <dl className="mt-10 grid max-w-md grid-cols-2 border-t border-ink/15 font-mono text-[11px] uppercase tracking-[0.14em]">
              {[
                ["Connection", "Lost"],
                ["Since", `${since} IST`],
                ["Attempts", String(attempts).padStart(2, "0")],
                ["Auto-reconnect", "Listening"],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-ink/15 py-3 pr-4">
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="mt-1 text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                ref={retryRef}
                type="button"
                onClick={onRetry}
                disabled={checking}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-canvas transition-colors hover:bg-brand-fill hover:text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-wait disabled:opacity-70"
              >
                <RotateCw size={15} aria-hidden="true" className={checking ? "animate-spin" : ""} />
                {checking ? "Checking…" : "Try again"}
              </button>
              <p className="text-sm text-ink-muted" aria-live="polite">
                {checking ? "Pinging the server…" : attempts > 0 ? "Still no signal. Check Wi-Fi or mobile data." : "Reconnects automatically."}
              </p>
            </div>
          </div>

          <div className="col-span-12 flex justify-center lg:col-span-5 lg:justify-end">
            <Radar />
          </div>
        </div>

        <div className="flex justify-between border-t border-ink/15 pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
          <span>Local time</span>
          <LocalTime className="text-ink" />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Watches connectivity and overlays an offline screen *without unmounting the app*,
 * so nothing (scroll, form state, carousel position) is lost while the network is down.
 */
export default function OfflineDetector({ children }) {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [since, setSince] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [checking, setChecking] = useState(false);
  const [toast, setToast] = useState(false);
  const appRef = useRef(null);
  const wasOffline = useRef(false);

  const goOffline = useCallback(() => {
    setSince(timeFmt.format(new Date()));
    setAttempts(0);
    setOnline(false);
  }, []);

  const confirmOnline = useCallback(async () => {
    if (await hasConnectivity()) setOnline(true);
  }, []);

  useEffect(() => {
    window.addEventListener("online", confirmOnline);
    window.addEventListener("offline", goOffline);
    if (!navigator.onLine) goOffline();
    return () => {
      window.removeEventListener("online", confirmOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [confirmOnline, goOffline]);

  // Make the page behind the overlay inert (no focus/AT access) while offline.
  useEffect(() => {
    const el = appRef.current;
    if (!el) return;
    if (online) el.removeAttribute("inert");
    else el.setAttribute("inert", "");
    document.documentElement.style.overflow = online ? "" : "hidden";
    if (!online) wasOffline.current = true;
    if (online && wasOffline.current) {
      wasOffline.current = false;
      setToast(true);
      const id = window.setTimeout(() => setToast(false), 2600);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [online]);

  const retry = async () => {
    if (checking) return;
    setChecking(true);
    setAttempts((n) => n + 1);
    const ok = await hasConnectivity();
    setChecking(false);
    if (ok) setOnline(true);
  };

  return (
    <>
      <div ref={appRef} style={{ display: "contents" }}>
        {children}
      </div>
      <AnimatePresence>{!online && <OfflinePanel key="offline" since={since} attempts={attempts} checking={checking} onRetry={retry} />}</AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.p
            role="status"
            className="fixed bottom-6 left-1/2 z-[1950] flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm text-canvas"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <Wifi size={15} aria-hidden="true" /> Back online — carry on.
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}
