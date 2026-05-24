import React, { memo, useEffect, useRef, useState } from "react";
import {  FaRobot,  } from "react-icons/fa";


const STATUS = [
  "Hydrating modern interface",
  "Preparing cloud-ready modules",
  "Wiring AI automation layer",
  "Launching portfolio experience",
];

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: `${6 + Math.random() * 88}%`,
  y: `${30 + Math.random() * 60}%`,
  size: `${1.5 + Math.random() * 3}px`,
  delay: Math.random() * 3,
  dur: 2.5 + Math.random() * 3,
  dx: `${(Math.random() - 0.5) * 50}px`,
}));

// ─────────────────────────────────────────────────────────────────────────────
// Styles Injection
// ─────────────────────────────────────────────────────────────────────────────

const injectStyles = () => {
  if (document.getElementById("optimized-loader-styles")) return;

  const style = document.createElement("style");

  style.id = "optimized-loader-styles";

  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500;700&display=swap');

    * {
      box-sizing: border-box;
    }

    .loader-root {
      position: fixed;
      inset: 0;
      z-index: 9999;
      overflow: hidden;

      display: flex;
      align-items: center;
      justify-content: center;

      background: #020510;

      font-family: 'DM Sans', sans-serif;
    }

    .loader-canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }

    .loader-scanlines {
      position: fixed;
      inset: 0;

      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.05) 2px,
        rgba(0,0,0,0.05) 4px
      );

      pointer-events: none;
      z-index: 1;
    }

    .loader-content {
      position: relative;
      z-index: 20;

      width: 100%;
      max-width: 42rem;

      padding-inline: 1.5rem;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;

      text-align: center;
    }

    .loader-blob {
      position: absolute;
      border-radius: 9999px;
      filter: blur(70px);
      pointer-events: none;
    }

    .loader-particle {
      position: absolute;
      border-radius: 9999px;
      background: rgba(103,232,249,0.6);

      animation: drift linear infinite;
      pointer-events: none;
    }

    .loader-card {
      width: 100%;
      border-radius: 1rem;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(2,6,23,0.5);

      padding: 0.85rem;
      backdrop-filter: blur(12px);
    }

    .loader-progress {
      height: 0.5rem;
      overflow: hidden;

      border-radius: 9999px;

      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(34,211,238,0.15);
    }

    .loader-progress-fill {
      height: 100%;
      border-radius: inherit;

      background: linear-gradient(
        to right,
        #22d3ee,
        #6ee7b7,
        #c084fc
      );

      transition: width 280ms ease;
    }

    .loader-terminal {
      color: rgba(103,232,249,0.75);

      font-family: monospace;

      letter-spacing: 0.16em;
      text-transform: uppercase;

      font-size: 0.72rem;
    }

    .loader-brand {
      font-family: 'Orbitron', monospace;
      font-weight: 800;

      color: white;

      font-size: clamp(1rem,4vw,1.35rem);
    }

    .loader-cursor {
      animation: blink 1s step-end infinite;
    }

    .loader-exit {
      animation: exitAnim 0.6s ease forwards;
    }

    .rocket-wrap {
      position: relative;
      width: clamp(90px,24vw,140px);
      height: clamp(90px,24vw,140px);
    }

    .rocket {
      animation: rocketFloat 3s ease-in-out infinite;
      filter: drop-shadow(0 0 20px rgba(34,211,238,0.45));
    }

    .rocket-flame {
      animation: flameFlicker 0.18s ease-in-out infinite;
      transform-origin: top center;
    }

    .orbit-a {
      animation: orbitA 4s linear infinite;
    }

    .orbit-b {
      animation: orbitB 6s linear infinite;
    }

    .pulse-1 {
      animation: pulseRing 2s ease-out infinite;
    }

    .pulse-2 {
      animation: pulseRing 2s ease-out 0.7s infinite;
    }

    .pulse-3 {
      animation: pulseRing 2s ease-out 1.4s infinite;
    }

    @keyframes rocketFloat {
      0%,100% {
        transform: translateY(0px) rotate(-8deg);
      }

      50% {
        transform: translateY(-18px) rotate(8deg);
      }
    }

    @keyframes flameFlicker {
      0%,100% {
        transform: scaleY(1) scaleX(1);
      }

      50% {
        transform: scaleY(1.25) scaleX(0.9);
      }
    }

    @keyframes orbitA {
      from {
        transform: rotateX(70deg) rotateZ(0deg);
      }

      to {
        transform: rotateX(70deg) rotateZ(360deg);
      }
    }

    @keyframes orbitB {
      from {
        transform: rotateX(55deg) rotateZ(0deg);
      }

      to {
        transform: rotateX(55deg) rotateZ(-360deg);
      }
    }

    @keyframes pulseRing {
      from {
        transform: scale(0.8);
        opacity: 0.8;
      }

      to {
        transform: scale(2.2);
        opacity: 0;
      }
    }

    @keyframes drift {
      from {
        transform: translateY(0) translateX(0) scale(1);
        opacity: 0.5;
      }

      to {
        transform: translateY(-90px) translateX(var(--dx)) scale(0.2);
        opacity: 0;
      }
    }

    @keyframes blink {
      50% {
        opacity: 0;
      }
    }

    @keyframes exitAnim {
      to {
        opacity: 0;
        transform: scale(1.05);
      }
    }
  `;

  document.head.appendChild(style);
};

// ─────────────────────────────────────────────────────────────────────────────
// Starfield
// ─────────────────────────────────────────────────────────────────────────────

const StarField = memo(function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let frame;

    const STAR_COUNT = 160;

    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      d: Math.random() > 0.5 ? 1 : -1,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        s.a += 0.003 * s.d;

        if (s.a >= 1 || s.a <= 0.1) {
          s.d *= -1;
        }

        ctx.beginPath();

        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(255,255,255,${s.a})`;

        ctx.fill();
      }

      frame = requestAnimationFrame(render);
    };

    resize();
    render();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="loader-canvas" />;
});

// ─────────────────────────────────────────────────────────────────────────────
// Rocket
// ─────────────────────────────────────────────────────────────────────────────

const Rocket = memo(function Rocket() {
  return (
    <svg
      viewBox="0 0 80 120"
      fill="none"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 8 C28 8 20 30 20 55 L20 80 L40 88 L60 80 L60 55 C60 30 52 8 40 8Z"
        fill="#e2e8f0"
      />

      <circle cx="40" cy="42" r="10" fill="#0f172a" opacity="0.85" />

      <circle
        cx="40"
        cy="42"
        r="10"
        stroke="#cbd5e1"
        strokeWidth="2"
        fill="none"
      />

      <path d="M20 65 L8 85 L20 80Z" fill="#cbd5e1" />

      <path d="M60 65 L72 85 L60 80Z" fill="#cbd5e1" />

      <g className="rocket-flame">
        <ellipse
          cx="40"
          cy="100"
          rx="8"
          ry="16"
          fill="#22d3ee"
          opacity="0.9"
        />

        <ellipse
          cx="40"
          cy="100"
          rx="5"
          ry="10"
          fill="#67e8f9"
          opacity="0.8"
        />
      </g>
    </svg>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Loader
// ─────────────────────────────────────────────────────────────────────────────

export default function Loader({ onComplete }) {
  useEffect(() => {
    injectStyles();
  }, []);

  const [progress, setProgress] = useState(0);

  const [statusIndex, setStatusIndex] = useState(0);

  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 4, 100);

        return next;
      });

      setStatusIndex((prev) => (prev + 1) % STATUS.length);
    }, 220);

    const exitTimeout = setTimeout(() => {
      setExiting(true);

      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(exitTimeout);
    };
  }, [onComplete]);

  return (
    <div className={`loader-root ${exiting ? "loader-exit" : ""}`}>
      <StarField />

      <div className="loader-scanlines" />

      <div
        className="loader-blob bg-cyan-500/10"
        style={{
          width: "360px",
          height: "360px",
          top: "-10%",
          left: "-10%",
        }}
      />

      <div
        className="loader-blob bg-emerald-500/10"
        style={{
          width: "300px",
          height: "300px",
          bottom: "-8%",
          right: "-8%",
        }}
      />

      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="loader-particle"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            "--dx": p.dx,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className="loader-content">

        {/* Rocket */}

        <div className="rocket-wrap">
          <div className="orbit-a absolute inset-0">
            <div className="w-full h-full rounded-full border border-cyan-400/25 border-dashed" />
          </div>

          <div className="orbit-b absolute inset-[16%]">
            <div className="w-full h-full rounded-full border border-emerald-300/20" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="pulse-1 absolute w-10 h-10 rounded-full border border-cyan-400/40" />

            <div className="pulse-2 absolute w-10 h-10 rounded-full border border-cyan-400/25" />

            <div className="pulse-3 absolute w-10 h-10 rounded-full border border-cyan-400/15" />
          </div>

          <div className="rocket relative w-full h-full">
            <Rocket />
          </div>
        </div>

        {/* Brand */}

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
            <FaRobot className="text-lg" />
          </div>

          <div className="text-left">
            <p className="loader-brand">
              Azhar<span className="text-cyan-400">.</span>
            </p>

            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200">
              Modern portfolio boot
            </p>
          </div>
        </div>

        {/* Terminal */}

        <p className="loader-terminal">
          BOOTING CLOUD SYSTEMS...
          <span className="loader-cursor">_</span>
        </p>


        {/* Progress */}

        <div className="w-full space-y-3">
          <div className="flex items-end justify-between gap-4">
            <div className="text-left">
              <p className="text-xl font-black tracking-tight text-white">
                Loading experience
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {STATUS[statusIndex]}
              </p>
            </div>

            <p className="font-mono text-lg font-black tabular-nums text-cyan-300">
              {progress}%
            </p>
          </div>

          <div className="loader-progress">
            <div
              className="loader-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Footer */}

        <p
          className="text-slate-600 font-mono tracking-widest"
          style={{
            fontSize: "0.65rem",
          }}
        >
          CLOUD BOOT · AI READY · SYSTEM ONLINE
        </p>
      </div>
    </div>
  );
}