import React, { useEffect, useMemo, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Inject styles
// ─────────────────────────────────────────────────────────────────────────────

const injectStyles = () => {
  if (document.getElementById("offline-styles")) return;

  const s = document.createElement("style");

  s.id = "offline-styles";

  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500;700&display=swap');

    *, *::before, *::after {
      box-sizing: border-box;
    }

    .off-root {
      font-family: 'DM Sans', sans-serif;
      background: #020510;
      min-height: 100svh;
      min-height: 100dvh;
      min-height: 100vh;
      overflow: hidden;
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
    }

    .off-canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .off-scanlines {
      position: fixed;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.06) 2px,
        rgba(0,0,0,0.06) 4px
      );

      pointer-events: none;
      z-index: 1;
    }

    .off-static {
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");

      background-size: 180px;
      pointer-events: none;
      z-index: 2;

      animation: staticFlicker 3s step-end infinite;
    }

    @keyframes staticFlicker {
      0%,94%,100% {
        opacity: 0;
      }

      95% {
        opacity: 0.06;
      }

      96% {
        opacity: 0;
      }

      97% {
        opacity: 0.04;
      }

      98% {
        opacity: 0;
      }
    }

    .off-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(70px);
      pointer-events: none;
    }

    @keyframes satelliteFloat {
      0%,100% {
        transform: translateY(0px) rotate(0deg);
      }

      25% {
        transform: translateY(-14px) rotate(12deg);
      }

      50% {
        transform: translateY(-8px) rotate(-6deg);
      }

      75% {
        transform: translateY(-18px) rotate(10deg);
      }
    }

    .off-satellite {
      animation: satelliteFloat 7s ease-in-out infinite;
      filter: drop-shadow(0 0 18px rgba(239,68,68,0.4));
    }

    @keyframes brokenOrbit {
      from {
        transform: rotateX(65deg) rotateZ(0deg);
      }

      to {
        transform: rotateX(65deg) rotateZ(360deg);
      }
    }

    .off-orbit {
      animation: brokenOrbit 10s linear infinite;
    }

    @keyframes redPing {
      0% {
        transform: scale(1);
        opacity: 0.7;
      }

      100% {
        transform: scale(2.6);
        opacity: 0;
      }
    }

    .off-ping-1 {
      animation: redPing 2.2s ease-out infinite;
    }

    .off-ping-2 {
      animation: redPing 2.2s ease-out 0.8s infinite;
    }

    .off-glitch {
      font-family: 'Orbitron', monospace;
      font-weight: 900;
      font-size: clamp(3.5rem, 18vw, 10rem);
      line-height: 1;
      color: #fff;
      position: relative;
      letter-spacing: -0.02em;
      white-space: nowrap;
      text-shadow: 0 0 40px rgba(239,68,68,0.4);
    }

    .off-glitch::before,
    .off-glitch::after {
      content: attr(data-text);
      position: absolute;
      inset: 0;
      font-family: 'Orbitron', monospace;
      font-weight: 900;
      white-space: nowrap;
    }

    .off-glitch::before {
      color: #ef4444;

      animation: glitchR 2.8s infinite;

      clip-path: polygon(0 0, 100% 0, 100% 42%, 0 42%);
    }

    .off-glitch::after {
      color: #60a5fa;

      animation: glitchB 2.8s infinite;

      clip-path: polygon(0 58%, 100% 58%, 100% 100%, 0 100%);
    }

    @keyframes glitchR {
      0%,88%,100% {
        transform: translate(0);
        opacity: 0;
      }

      89% {
        transform: translate(-5px,-2px);
        opacity: 0.8;
      }

      91% {
        transform: translate(5px,0);
        opacity: 0.5;
      }

      93% {
        transform: translate(-3px,2px);
        opacity: 0.8;
      }

      96% {
        transform: translate(0);
        opacity: 0;
      }
    }

    @keyframes glitchB {
      0%,86%,100% {
        transform: translate(0);
        opacity: 0;
      }

      87% {
        transform: translate(5px,2px);
        opacity: 0.7;
      }

      90% {
        transform: translate(-4px,0);
        opacity: 0.4;
      }

      92% {
        transform: translate(3px,-1px);
        opacity: 0.7;
      }

      95% {
        transform: translate(0);
        opacity: 0;
      }
    }

    @keyframes signalPulse {
      0%,100% {
        opacity: 0.15;
        stroke-dashoffset: 0;
      }

      50% {
        opacity: 0.7;
        stroke-dashoffset: 12;
      }
    }

    .off-signal-1 {
      animation: signalPulse 1.4s ease-in-out infinite;
    }

    .off-signal-2 {
      animation: signalPulse 1.4s ease-in-out 0.3s infinite;
    }

    .off-signal-3 {
      animation: signalPulse 1.4s ease-in-out 0.6s infinite;
    }

    @keyframes blink {
      0%,100% {
        opacity: 1;
      }

      50% {
        opacity: 0;
      }
    }

    .off-cursor {
      animation: blink 0.9s step-end infinite;
    }

    @keyframes retrySpin {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    .off-spin {
      animation: retrySpin 1s linear infinite;
    }

    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(18px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .off-f1 {
      opacity: 0;
      animation: fadeUp 0.6s 0.05s ease forwards;
    }

    .off-f2 {
      opacity: 0;
      animation: fadeUp 0.6s 0.2s ease forwards;
    }

    .off-f3 {
      opacity: 0;
      animation: fadeUp 0.6s 0.35s ease forwards;
    }

    .off-f4 {
      opacity: 0;
      animation: fadeUp 0.6s 0.5s ease forwards;
    }

    .off-f5 {
      opacity: 0;
      animation: fadeUp 0.6s 0.65s ease forwards;
    }

    .off-f6 {
      opacity: 0;
      animation: fadeUp 0.6s 0.8s ease forwards;
    }

    @keyframes reconnectBar {
      from {
        width: 0%;
      }

      to {
        width: 100%;
      }
    }

    .off-reconnect-bar {
      animation: reconnectBar 2.5s ease forwards;
    }

    @keyframes drift {
      0% {
        transform: translateY(0) translateX(0) scale(1);
        opacity: 0.5;
      }

      50% {
        opacity: 0.8;
      }

      100% {
        transform: translateY(-85px) translateX(var(--dx)) scale(0.2);
        opacity: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .off-satellite,
      .off-orbit,
      .off-ping-1,
      .off-ping-2,
      .off-glitch::before,
      .off-glitch::after {
        animation: none;
      }
    }
  `;

  document.head.appendChild(s);
};

// ─────────────────────────────────────────────────────────────────────────────
// Starfield
// ─────────────────────────────────────────────────────────────────────────────

function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let raf;
    let stars = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.004 + 0.002,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        s.alpha += s.speed;

        if (s.alpha > 1 || s.alpha < 0) {
          s.speed *= -1;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(255,255,255,${Math.min(
          1,
          Math.max(0, s.alpha)
        )})`;

        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    init();
    draw();

    const onResize = () => {
      cancelAnimationFrame(raf);
      init();
      draw();
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="off-canvas" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Broken Satellite
// ─────────────────────────────────────────────────────────────────────────────

function BrokenSatellite() {
  return (
    <svg
      viewBox="0 0 140 120"
      fill="none"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="50" y="42" width="40" height="30" rx="6" fill="#e2e8f0" />

      <rect x="55" y="47" width="30" height="20" rx="4" fill="#cbd5e1" />

      <rect x="58" y="50" width="24" height="14" rx="3" fill="#0f172a" opacity="0.8" />

      <line
        x1="62"
        y1="54"
        x2="78"
        y2="60"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <line
        x1="78"
        y1="54"
        x2="62"
        y2="60"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <rect x="8" y="48" width="38" height="18" rx="3" fill="#60a5fa" opacity="0.85" />

      <rect x="94" y="48" width="34" height="18" rx="3" fill="#60a5fa" opacity="0.45" />

      <line x1="70" y1="42" x2="70" y2="28" stroke="#94a3b8" strokeWidth="2" />

      <line
        x1="70"
        y1="28"
        x2="80"
        y2="18"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeDasharray="3 2"
      />

      <circle cx="80" cy="18" r="3" fill="#ef4444" opacity="0.8" />

      <path
        d="M88 35 Q98 28 88 21"
        stroke="#ef4444"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="4 3"
        className="off-signal-1"
      />

      <path
        d="M92 38 Q106 28 92 18"
        stroke="#ef4444"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="4 3"
        className="off-signal-2"
      />

      <path
        d="M96 41 Q114 28 96 15"
        stroke="#ef4444"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="4 3"
        className="off-signal-3"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Typewriter Hook
// ─────────────────────────────────────────────────────────────────────────────

function useTypewriter(text, speed = 65) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");

    let i = 0;

    const t = setInterval(() => {
      setTyped(text.slice(0, i + 1));

      i++;

      if (i >= text.length) {
        clearInterval(t);
      }
    }, speed);

    return () => clearInterval(t);
  }, [text, speed]);

  return typed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Offline UI
// ─────────────────────────────────────────────────────────────────────────────

function OfflinePage({ onRetry, isRetrying, retryCount }) {
  useEffect(() => {
    injectStyles();
  }, []);

  const typedText = useTypewriter(
    "CONNECTION_LOST // NO SIGNAL"
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: `${6 + Math.random() * 88}%`,
        y: `${30 + Math.random() * 60}%`,
        size: `${1.5 + Math.random() * 3}px`,
        delay: Math.random() * 3,
        dur: 2.5 + Math.random() * 3,
        dx: (Math.random() - 0.5) * 50,
      })),
    []
  );

  return (
    <div className="off-root">
      <StarField />

      <div className="off-scanlines" />

      <div className="off-static" />

      {/* Blobs */}

      <div
        className="off-blob bg-red-600/10 z-0"
        style={{
          width: "min(380px,58vw)",
          height: "min(380px,58vw)",
          top: "-12%",
          left: "-10%",
        }}
      />

      <div
        className="off-blob bg-red-900/8 z-0"
        style={{
          width: "min(300px,50vw)",
          height: "min(300px,50vw)",
          bottom: "-8%",
          right: "-8%",
        }}
      />

      {/* Particles */}

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-red-400/50 pointer-events-none z-10"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            "--dx": `${p.dx}px`,
            animation: `drift ${p.dur}s ${p.delay}s ease-out infinite`,
          }}
        />
      ))}

      {/* Main content */}

      <div className="relative z-20 flex flex-col items-center text-center w-full max-w-3xl mx-auto px-5 py-10 gap-4 sm:gap-5">
        {/* Satellite */}

        <div
          className="off-f1 relative mb-1"
          style={{
            width: "clamp(110px,30vw,170px)",
            height: "clamp(80px,22vw,120px)",
          }}
        >
          <div className="off-orbit absolute inset-0">
            <div className="w-full h-full rounded-full border border-red-500/25 border-dashed" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="off-ping-1 absolute w-12 h-12 rounded-full border border-red-500/50" />

            <div className="off-ping-2 absolute w-12 h-12 rounded-full border border-red-500/30" />
          </div>

          <div className="off-satellite relative w-full h-full">
            <BrokenSatellite />
          </div>
        </div>

        {/* Terminal */}

        <div className="off-f2">
          <p
            className="text-red-400/80 font-mono tracking-[0.15em] uppercase"
            style={{
              fontSize: "clamp(0.55rem,2.2vw,0.72rem)",
            }}
          >
            {typedText}
            <span className="off-cursor">_</span>
          </p>
        </div>

        {/* OFFLINE */}

        <div className="off-f3">
          <h1 className="off-glitch select-none" data-text="OFFLINE">
            OFFLINE
          </h1>
        </div>

        {/* Divider */}

        <div className="off-f3 flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-500/35 to-transparent" />

          <span className="text-red-500/40 text-xs font-mono">
            ✦
          </span>

          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-500/35 to-transparent" />
        </div>

        {/* Message */}

        <div className="off-f4 space-y-3 px-2">
          <h2
            className="text-white font-semibold tracking-tight"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(0.9rem,3.8vw,1.2rem)",
            }}
          >
            Network interrupted
          </h2>

          <p
            className="text-slate-400 leading-relaxed max-w-xl"
            style={{
              fontSize: "clamp(0.78rem,3vw,0.9rem)",
            }}
          >
            The portfolio shell is loaded locally. Reconnect to
            restore live links, cloud assets, and external project
            destinations.
          </p>
        </div>

        {/* Retry count */}

        {retryCount > 0 && (
          <div className="off-f4">
            <span className="text-slate-500 font-mono px-3 py-1 rounded-full border border-slate-700/50 text-xs">
              Reconnect attempt #{retryCount}
            </span>
          </div>
        )}

        {/* Buttons */}

        <div className="off-f5 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5
              px-7 py-3 rounded-xl font-black tracking-wide
              transition-all duration-300 hover:scale-105
              disabled:opacity-60 disabled:hover:scale-100"
            style={{
              background: isRetrying
                ? "rgba(75,201,236,0.12)"
                : "#4BC9EC",

              color: isRetrying
                ? "#4BC9EC"
                : "#071018",

              border: isRetrying
                ? "1px solid rgba(75,201,236,0.3)"
                : "none",
            }}
          >
            {isRetrying ? (
              <>
                <svg
                  className="off-spin w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="40"
                    strokeDashoffset="10"
                  />
                </svg>

                Checking signal
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>

                Retry connection
              </>
            )}
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2
              px-7 py-3 rounded-xl
              border border-slate-700 hover:border-cyan-400/40
              text-slate-300 hover:text-white
              font-semibold transition-all duration-300
              hover:bg-white/5 hover:scale-105"
          >
            Open cached home
          </a>
        </div>

        {/* Reconnect bar */}

        {isRetrying && (
          <div className="off-f5 w-full space-y-1.5">
            <div className="w-full h-1 rounded-full overflow-hidden bg-white/5 border border-red-500/15">
              <div className="off-reconnect-bar h-full rounded-full bg-gradient-to-r from-red-700 via-red-400 to-orange-300" />
            </div>

            <p
              className="text-slate-500 font-mono text-center"
              style={{
                fontSize: "clamp(0.55rem,2vw,0.65rem)",
              }}
            >
              SCANNING FREQUENCIES...
            </p>
          </div>
        )}
        {/* Footer */}

        <div className="off-f6">
          <p
            className="text-slate-700 font-mono tracking-widest"
            style={{
              fontSize: "clamp(0.55rem,2vw,0.63rem)",
            }}
          >
            NET: DISCONNECTED · STATUS: ADRIFT · SIG: 0%
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main OfflineDetector Wrapper
// ─────────────────────────────────────────────────────────────────────────────

export default function OfflineDetector({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [isRetrying, setIsRetrying] = useState(false);

  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);

    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);

    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);

      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const handleRetry = () => {
    if (isRetrying) return;

    setIsRetrying(true);

    setRetryCount((count) => count + 1);

    setTimeout(() => {
      setIsOnline(navigator.onLine);

      setIsRetrying(false);
    }, 1800);
  };

  if (!isOnline) {
    return (
      <OfflinePage
        onRetry={handleRetry}
        isRetrying={isRetrying}
        retryCount={retryCount}
      />
    );
  }

  return children;
}