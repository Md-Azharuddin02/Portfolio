import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaAws,
  FaCodeBranch,
  FaHome,
  FaRobot,
} from "react-icons/fa";

import { SiOpenai, SiReact } from "react-icons/si";

// ─────────────────────────────────────────────────────────────────────────────
// Route checks
// ─────────────────────────────────────────────────────────────────────────────

const ROUTE_CHECKS = [
  {
    label: "Frontend route",
    value: "Not registered",
    Icon: SiReact,
  },
  {
    label: "API fallback",
    value: "No match",
    Icon: FaCodeBranch,
  },
  {
    label: "Cloud edge",
    value: "404 returned",
    Icon: FaAws,
  },
  {
    label: "AI hint",
    value: "Go home",
    Icon: SiOpenai,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Inject styles
// ─────────────────────────────────────────────────────────────────────────────

const injectStyles = () => {
  if (document.getElementById("p404-styles")) return;

  const s = document.createElement("style");

  s.id = "p404-styles";

  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500;700&display=swap');

    *, *::before, *::after {
      box-sizing: border-box;
    }

    .p404-root {
      font-family: 'DM Sans', sans-serif;
      background: #020510;
      min-height: 100svh;
      min-height: 100dvh;
      min-height: 100vh;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .p404-canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .p404-scanlines {
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

    .p404-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(70px);
      pointer-events: none;
    }

    .p404-glitch {
      font-family: 'Orbitron', monospace;
      font-weight: 900;
      font-size: clamp(4.5rem, 22vw, 13rem);
      line-height: 1;
      color: #fff;
      position: relative;
      letter-spacing: -0.03em;
      white-space: nowrap;
      text-shadow: 0 0 40px rgba(75, 201, 236, 0.25);
    }

    .p404-glitch::before,
    .p404-glitch::after {
      content: attr(data-text);
      position: absolute;
      inset: 0;
      font-family: 'Orbitron', monospace;
      font-weight: 900;
      white-space: nowrap;
    }

    .p404-glitch::before {
      color: #4BC9EC;
      animation: glitchTop 3.5s infinite;
      clip-path: polygon(0 0, 100% 0, 100% 38%, 0 38%);
    }

    .p404-glitch::after {
      color: #34d399;
      animation: glitchBot 3.5s infinite;
      clip-path: polygon(0 62%, 100% 62%, 100% 100%, 0 100%);
    }

    @keyframes glitchTop {
      0%,90%,100% {
        transform: translate(0);
        opacity: 0;
      }

      91% {
        transform: translate(-4px,-2px);
        opacity: 0.7;
      }

      93% {
        transform: translate(4px,0);
        opacity: 0.5;
      }

      95% {
        transform: translate(-2px,2px);
        opacity: 0.7;
      }

      97% {
        transform: translate(0);
        opacity: 0;
      }
    }

    @keyframes glitchBot {
      0%,88%,100% {
        transform: translate(0);
        opacity: 0;
      }

      89% {
        transform: translate(4px,2px);
        opacity: 0.6;
      }

      91% {
        transform: translate(-3px,0);
        opacity: 0.4;
      }

      93% {
        transform: translate(2px,-1px);
        opacity: 0.6;
      }

      96% {
        transform: translate(0);
        opacity: 0;
      }
    }

    @keyframes astronautFloat {
      0%,100% {
        transform: translateY(0px) rotate(-4deg);
      }

      50% {
        transform: translateY(-16px) rotate(4deg);
      }
    }

    .p404-astronaut {
      animation: astronautFloat 6s ease-in-out infinite;
      filter: drop-shadow(0 0 24px rgba(75,201,236,0.25));
    }

    @keyframes orbitSpin {
      from {
        transform: rotateX(70deg) rotateZ(0deg);
      }

      to {
        transform: rotateX(70deg) rotateZ(360deg);
      }
    }

    .p404-orbit {
      animation: orbitSpin 8s linear infinite;
    }

    @keyframes ping {
      0% {
        transform: scale(1);
        opacity: 0.7;
      }

      100% {
        transform: scale(2.4);
        opacity: 0;
      }
    }

    .p404-ping {
      animation: ping 1.8s ease-out infinite;
    }

    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .p404-fade-1 {
      opacity: 0;
      animation: fadeUp 0.65s 0.1s ease forwards;
    }

    .p404-fade-2 {
      opacity: 0;
      animation: fadeUp 0.65s 0.25s ease forwards;
    }

    .p404-fade-3 {
      opacity: 0;
      animation: fadeUp 0.65s 0.4s ease forwards;
    }

    .p404-fade-4 {
      opacity: 0;
      animation: fadeUp 0.65s 0.55s ease forwards;
    }

    .p404-fade-5 {
      opacity: 0;
      animation: fadeUp 0.65s 0.7s ease forwards;
    }

    .p404-fade-6 {
      opacity: 0;
      animation: fadeUp 0.65s 0.85s ease forwards;
    }

    @keyframes btnPulse {
      0%,100% {
        box-shadow: 0 0 0 0 rgba(75,201,236,0.35);
      }

      50% {
        box-shadow: 0 0 0 12px rgba(75,201,236,0);
      }
    }

    .p404-btn {
      animation: btnPulse 2.5s ease-in-out infinite;
    }

    @keyframes drift {
      0% {
        transform: translateY(0) translateX(0) scale(1);
        opacity: 0.5;
      }

      50% {
        opacity: 0.9;
      }

      100% {
        transform: translateY(-100px) translateX(var(--dx)) scale(0.2);
        opacity: 0;
      }
    }

    @keyframes blink {
      0%,100% {
        opacity: 1;
      }

      50% {
        opacity: 0;
      }
    }

    .p404-cursor {
      animation: blink 1s step-end infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      .p404-astronaut,
      .p404-orbit,
      .p404-ping,
      .p404-btn,
      .p404-glitch::before,
      .p404-glitch::after {
        animation: none;
      }
    }
  `;

  document.head.appendChild(s);
};

// ─────────────────────────────────────────────────────────────────────────────
// Star field
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

      stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
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

  return <canvas ref={canvasRef} className="p404-canvas" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Astronaut SVG
// ─────────────────────────────────────────────────────────────────────────────

function Astronaut() {
  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="42" r="30" fill="rgba(75,201,236,0.08)" />

      <rect x="34" y="68" width="52" height="46" rx="14" fill="#e2e8f0" />

      <rect x="44" y="78" width="32" height="20" rx="6" fill="#cbd5e1" />

      <circle cx="60" cy="88" r="4" fill="#4BC9EC" opacity="0.9" />

      <rect x="18" y="70" width="18" height="36" rx="9" fill="#e2e8f0" />

      <rect x="84" y="70" width="18" height="36" rx="9" fill="#e2e8f0" />

      <circle cx="27" cy="108" r="7" fill="#94a3b8" />

      <circle cx="93" cy="108" r="7" fill="#94a3b8" />

      <rect x="40" y="110" width="16" height="22" rx="8" fill="#cbd5e1" />

      <rect x="64" y="110" width="16" height="22" rx="8" fill="#cbd5e1" />

      <rect x="37" y="128" width="22" height="10" rx="5" fill="#94a3b8" />

      <rect x="61" y="128" width="22" height="10" rx="5" fill="#94a3b8" />

      <circle cx="60" cy="38" r="28" fill="#e2e8f0" />

      <ellipse cx="60" cy="38" rx="18" ry="16" fill="#0f172a" opacity="0.85" />

      <circle
        cx="60"
        cy="38"
        r="28"
        stroke="#cbd5e1"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function PageNotFound() {
  useEffect(() => {
    injectStyles();
  }, []);

  const [typedText, setTypedText] = useState("");

  const fullText = "ROUTE_DIAGNOSTICS // ERR:404";

  useEffect(() => {
    let i = 0;

    const t = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));

      i++;

      if (i >= fullText.length) {
        clearInterval(t);
      }
    }, 65);

    return () => clearInterval(t);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: `${8 + Math.random() * 84}%`,
        y: `${35 + Math.random() * 55}%`,
        size: `${2 + Math.random() * 3}px`,
        delay: Math.random() * 4,
        dur: 3 + Math.random() * 3,
        dx: (Math.random() - 0.5) * 50,
      })),
    []
  );

  return (
    <div className="p404-root">
      <StarField />

      <div className="p404-scanlines" />

      {/* Blobs */}

      <div
        className="p404-blob bg-cyan-400/10 z-0"
        style={{
          width: "min(384px,60vw)",
          height: "min(384px,60vw)",
          top: "-10%",
          left: "-10%",
        }}
      />

      <div
        className="p404-blob bg-emerald-400/10 z-0"
        style={{
          width: "min(320px,50vw)",
          height: "min(320px,50vw)",
          bottom: 0,
          right: "-5%",
        }}
      />

      {/* Particles */}

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-300/60 pointer-events-none z-10"
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
        {/* Astronaut */}

        <div
          className="p404-fade-1 relative mb-1"
          style={{
            width: "clamp(100px, 28vw, 160px)",
            height: "clamp(100px, 28vw, 160px)",
          }}
        >
          <div className="p404-orbit absolute inset-0">
            <div className="w-full h-full rounded-full border border-cyan-400/30 border-dashed" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p404-ping absolute w-14 h-14 rounded-full border border-cyan-400/40" />
          </div>

          <div className="p404-astronaut relative w-full h-full">
            <Astronaut />
          </div>
        </div>

        {/* Terminal text */}

        <div className="p404-fade-2">
          <p
            className="text-cyan-300/80 font-mono tracking-[0.15em] uppercase"
            style={{
              fontSize: "clamp(0.6rem, 2.5vw, 0.8rem)",
            }}
          >
            {typedText}
            <span className="p404-cursor">_</span>
          </p>
        </div>

        {/* 404 */}

        <div className="p404-fade-3">
          <h1 className="p404-glitch select-none" data-text="404">
            404
          </h1>
        </div>

        {/* Divider */}

        <div className="p404-fade-4 flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          <span className="text-cyan-300/50 text-xs font-mono">✦</span>

          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        </div>

        {/* Message */}

        <div className="p404-fade-4 space-y-3 px-2">
          <h2
            className="text-white font-semibold tracking-tight"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(1rem, 4vw, 1.4rem)",
            }}
          >
            This route is not deployed.
          </h2>

          <p
            className="text-slate-400 leading-relaxed max-w-2xl"
            style={{
              fontSize: "clamp(0.8rem, 3vw, 0.95rem)",
            }}
          >
            The page you requested is outside the current portfolio map.
            The React app is still online, the cloud edge responded,
            and the fastest path back is the home experience.
          </p>
        </div>

        {/* Buttons */}

        <div className="p404-fade-5 flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
          <a
            href="/"
            className="p404-btn inline-flex items-center justify-center gap-2
            px-6 py-3 rounded-xl w-full sm:w-auto
            bg-[#4BC9EC] hover:bg-cyan-300
            text-slate-950 font-black tracking-wide
            transition-all duration-300 hover:scale-105"
          >
            <FaHome className="shrink-0" />
            Return home
          </a>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2
            px-6 py-3 rounded-xl w-full sm:w-auto
            border border-slate-600 hover:border-cyan-400/60
            text-slate-300 hover:text-white font-semibold
            transition-all duration-300 hover:bg-white/5 hover:scale-105"
          >
            <FaArrowLeft className="shrink-0" />
            Go back
          </button>
        </div>


        {/* Coordinates */}

        <div className="p404-fade-6">
          <p
            className="text-slate-600 font-mono tracking-widest"
            style={{
              fontSize: "clamp(0.6rem, 2vw, 0.7rem)",
            }}
          >
            LAT: 404.00 · LON: NOT_FOUND · ALT: ∞
          </p>
        </div>
      </div>
    </div>
  );
}