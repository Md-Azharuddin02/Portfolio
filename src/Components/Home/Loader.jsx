import React, { useEffect, useRef, useState, useMemo } from "react";

// ─── Inject styles ──────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("loader-styles")) return;
  const s = document.createElement("style");
  s.id = "loader-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    .ldr-root {
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
      z-index: 9999;
    }

    .ldr-canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .ldr-scanlines {
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

    .ldr-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(70px);
      pointer-events: none;
    }

    /* ── Rocket ── */
    @keyframes rocketFloat {
      0%,100% { transform: translateY(0px) rotate(-8deg); }
      50%      { transform: translateY(-18px) rotate(8deg); }
    }
    .ldr-rocket {
      animation: rocketFloat 3s ease-in-out infinite;
      filter: drop-shadow(0 0 20px rgba(245,158,11,0.5));
    }

    /* ── Exhaust flame flicker ── */
    @keyframes flicker {
      0%,100% { transform: scaleY(1) scaleX(1); opacity: 1; }
      25%      { transform: scaleY(1.3) scaleX(0.85); opacity: 0.8; }
      50%      { transform: scaleY(0.8) scaleX(1.1); opacity: 0.9; }
      75%      { transform: scaleY(1.2) scaleX(0.9); opacity: 0.7; }
    }
    .ldr-flame { animation: flicker 0.18s ease-in-out infinite; transform-origin: top center; }

    /* ── Orbit rings ── */
    @keyframes orbitA {
      from { transform: rotateX(70deg) rotateZ(0deg); }
      to   { transform: rotateX(70deg) rotateZ(360deg); }
    }
    @keyframes orbitB {
      from { transform: rotateX(50deg) rotateZ(0deg); }
      to   { transform: rotateX(50deg) rotateZ(-360deg); }
    }
    .ldr-orbit-a { animation: orbitA 4s linear infinite; }
    .ldr-orbit-b { animation: orbitB 6s linear infinite; }

    /* ── Pulse ring ── */
    @keyframes pulseRing {
      0%   { transform: scale(0.9); opacity: 0.8; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    .ldr-pulse-1 { animation: pulseRing 2s ease-out infinite; }
    .ldr-pulse-2 { animation: pulseRing 2s ease-out 0.7s infinite; }
    .ldr-pulse-3 { animation: pulseRing 2s ease-out 1.4s infinite; }

    /* ── Progress bar ── */
    @keyframes progressFill {
      0%   { width: 0%; }
      15%  { width: 18%; }
      30%  { width: 35%; }
      50%  { width: 55%; }
      70%  { width: 72%; }
      85%  { width: 88%; }
      100% { width: 100%; }
    }
    .ldr-bar-fill {
      animation: progressFill 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    /* ── Bar glow pulse ── */
    @keyframes barGlow {
      0%,100% { box-shadow: 0 0 8px rgba(245,158,11,0.6); }
      50%     { box-shadow: 0 0 20px rgba(245,158,11,0.9), 0 0 40px rgba(245,158,11,0.3); }
    }
    .ldr-bar-fill { animation: progressFill 3s cubic-bezier(0.4,0,0.2,1) forwards, barGlow 1s ease-in-out infinite; }

    /* ── Typewriter ── */
    @keyframes blink {
      0%,100% { opacity: 1; }
      50%     { opacity: 0; }
    }
    .ldr-cursor { animation: blink 0.9s step-end infinite; }

    /* ── Percentage counter ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ldr-fade-1 { opacity:0; animation: fadeUp 0.5s 0.1s ease forwards; }
    .ldr-fade-2 { opacity:0; animation: fadeUp 0.5s 0.25s ease forwards; }
    .ldr-fade-3 { opacity:0; animation: fadeUp 0.5s 0.4s ease forwards; }
    .ldr-fade-4 { opacity:0; animation: fadeUp 0.5s 0.55s ease forwards; }
    .ldr-fade-5 { opacity:0; animation: fadeUp 0.5s 0.7s ease forwards; }

    /* ── Dots loading ── */
    @keyframes dotBounce {
      0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
      40%          { transform: scale(1.2); opacity: 1; }
    }
    .ldr-dot-1 { animation: dotBounce 1.2s ease-in-out infinite; }
    .ldr-dot-2 { animation: dotBounce 1.2s ease-in-out 0.2s infinite; }
    .ldr-dot-3 { animation: dotBounce 1.2s ease-in-out 0.4s infinite; }

    /* ── Drift particles ── */
    @keyframes drift {
      0%   { transform: translateY(0) translateX(0) scale(1); opacity:0.5; }
      50%  { opacity: 0.9; }
      100% { transform: translateY(-90px) translateX(var(--dx)) scale(0.2); opacity:0; }
    }

    /* ── Exit animation ── */
    @keyframes loaderExit {
      0%   { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(1.05); }
    }
    .ldr-exit {
      animation: loaderExit 0.6s ease-in-out forwards;
    }

    @media (prefers-reduced-motion: reduce) {
      .ldr-rocket, .ldr-flame, .ldr-orbit-a, .ldr-orbit-b,
      .ldr-pulse-1, .ldr-pulse-2, .ldr-pulse-3 { animation: none; }
    }
  `;
  document.head.appendChild(s);
};

// ─── StarField ──────────────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, stars = [];

    const init = () => {
      canvas.width  = window.innerWidth;
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
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, Math.max(0, s.alpha))})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    init(); draw();
    const onResize = () => { cancelAnimationFrame(raf); init(); draw(); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="ldr-canvas" />;
}

// ─── Rocket SVG ──────────────────────────────────────────────────────────────
function Rocket() {
  return (
    <svg viewBox="0 0 80 120" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path d="M40 8 C28 8 20 30 20 55 L20 80 L40 88 L60 80 L60 55 C60 30 52 8 40 8Z"
        fill="#e2e8f0" />
      {/* Nose tip */}
      <path d="M40 4 C36 4 32 8 30 14 L50 14 C48 8 44 4 40 4Z" fill="#f59e0b" />
      {/* Window */}
      <circle cx="40" cy="42" r="10" fill="#0f172a" opacity="0.85" />
      <circle cx="40" cy="42" r="10" stroke="#cbd5e1" strokeWidth="2" fill="none" />
      <ellipse cx="37" cy="39" rx="3.5" ry="3" fill="white" opacity="0.15"
        transform="rotate(-20 37 39)" />
      {/* Amber chest stripe */}
      <rect x="28" y="60" width="24" height="6" rx="3" fill="#f59e0b" opacity="0.8" />
      {/* Left fin */}
      <path d="M20 65 L8 85 L20 80Z" fill="#cbd5e1" />
      {/* Right fin */}
      <path d="M60 65 L72 85 L60 80Z" fill="#cbd5e1" />
      {/* Nozzle */}
      <rect x="33" y="80" width="14" height="10" rx="4" fill="#94a3b8" />
      {/* Flame outer */}
      <g className="ldr-flame">
        <ellipse cx="40" cy="100" rx="8" ry="16" fill="#f59e0b" opacity="0.9" />
        <ellipse cx="40" cy="100" rx="5" ry="11" fill="#fde68a" opacity="0.8" />
        <ellipse cx="40" cy="98"  rx="2.5" ry="6"  fill="white" opacity="0.6" />
      </g>
    </svg>
  );
}

// ─── Main Loader ─────────────────────────────────────────────────────────────
export default function Loader({ onComplete }) {
  useEffect(() => { injectStyles(); }, []);

  const [progress, setProgress]   = useState(0);
  const [typedText, setTypedText] = useState("");
  const [exiting, setExiting]     = useState(false);
  const fullText = "INITIALIZING SYSTEMS...";

  // Typewriter
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(t);
    }, 70);
    return () => clearInterval(t);
  }, []);

  // Animate progress counter to match bar
  useEffect(() => {
    const keyframes = [
      { at: 150,  val: 18  },
      { at: 450,  val: 35  },
      { at: 750,  val: 55  },
      { at: 1050, val: 72  },
      { at: 1350, val: 88  },
      { at: 1700, val: 100 },
    ];
    const timers = keyframes.map(({ at, val }) =>
      setTimeout(() => setProgress(val), at)
    );
    // Trigger exit after complete
    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onComplete?.(), 600);
    }, 3200);
    return () => { timers.forEach(clearTimeout); clearTimeout(exitTimer); };
  }, [onComplete]);

  // Stable particles
  const particles = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: `${6 + Math.random() * 88}%`,
    y: `${30 + Math.random() * 60}%`,
    size: `${1.5 + Math.random() * 3}px`,
    delay: Math.random() * 3,
    dur: 2.5 + Math.random() * 3,
    dx: (Math.random() - 0.5) * 50,
  })), []);

  return (
    <div className={`ldr-root ${exiting ? "ldr-exit" : ""}`}>
      <StarField />
      <div className="ldr-scanlines" />

      {/* Blobs */}
      <div className="ldr-blob bg-amber-500/10 z-0"
        style={{ width:"min(360px,55vw)", height:"min(360px,55vw)", top:"-12%", left:"-10%" }} />
      <div className="ldr-blob bg-blue-600/8 z-0"
        style={{ width:"min(300px,50vw)", height:"min(300px,50vw)", bottom:"-8%", right:"-8%" }} />
      <div className="ldr-blob bg-violet-600/6 z-0"
        style={{ width:"min(200px,40vw)", height:"min(200px,40vw)", top:"40%", right:"15%" }} />

      {/* Particles */}
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full bg-amber-400/60 pointer-events-none z-10"
          style={{ left:p.x, top:p.y, width:p.size, height:p.size,
            "--dx":`${p.dx}px`, animation:`drift ${p.dur}s ${p.delay}s ease-out infinite` }} />
      ))}

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center w-full max-w-sm mx-auto px-5 gap-5">

        {/* Rocket with orbits */}
        <div className="ldr-fade-1 relative"
          style={{ width:"clamp(90px,24vw,140px)", height:"clamp(90px,24vw,140px)" }}>

          {/* Outer orbit */}
          <div className="ldr-orbit-a absolute inset-0">
            <div className="w-full h-full rounded-full border border-amber-500/25 border-dashed" />
          </div>
          {/* Outer orbit dot */}
          <div className="ldr-orbit-a absolute inset-0">
            <div className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]"
              style={{ top:"0%", left:"50%", transform:"translate(-50%,-50%)" }} />
          </div>

          {/* Inner orbit */}
          <div className="ldr-orbit-b absolute"
            style={{ inset:"16%"}}>
            <div className="w-full h-full rounded-full border border-blue-400/20" />
          </div>
          {/* Inner orbit dot */}
          <div className="ldr-orbit-b absolute" style={{ inset:"16%" }}>
            <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]"
              style={{ top:"0%", left:"50%", transform:"translate(-50%,-50%)" }} />
          </div>

          {/* Pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="ldr-pulse-1 absolute w-10 h-10 rounded-full border border-amber-500/50" />
            <div className="ldr-pulse-2 absolute w-10 h-10 rounded-full border border-amber-500/30" />
            <div className="ldr-pulse-3 absolute w-10 h-10 rounded-full border border-amber-500/20" />
          </div>

          {/* Rocket */}
          <div className="ldr-rocket relative w-full h-full">
            <Rocket />
          </div>
        </div>

        {/* Brand */}
        <div className="ldr-fade-2">
          <p className="text-white font-bold tracking-tight"
            style={{ fontFamily:"'Orbitron', monospace", fontSize:"clamp(1rem,4.5vw,1.3rem)" }}>
            Port<span className="text-amber-500">folio</span>
          </p>
        </div>

        {/* Terminal text */}
        <div className="ldr-fade-3">
          <p className="text-amber-500/70 font-mono tracking-[0.15em] uppercase"
            style={{ fontSize:"clamp(0.55rem,2.2vw,0.72rem)" }}>
            {typedText}<span className="ldr-cursor">_</span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="ldr-fade-4 w-full space-y-2">
          <div className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(245,158,11,0.15)" }}>
            <div className="ldr-bar-fill h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300" />
          </div>

          {/* Percentage + dots */}
          <div className="flex items-center justify-between px-0.5">
            <div className="flex gap-1.5 items-center">
              <div className="ldr-dot-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
              <div className="ldr-dot-2 w-1.5 h-1.5 rounded-full bg-amber-500" />
              <div className="ldr-dot-3 w-1.5 h-1.5 rounded-full bg-amber-500" />
            </div>
            <p className="text-amber-400 font-mono font-bold tabular-nums"
              style={{ fontSize:"clamp(0.65rem,2.5vw,0.8rem)" }}>
              {progress}%
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="ldr-fade-4 flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <span className="text-amber-500/40 text-xs font-mono">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </div>

        {/* Status */}
        <div className="ldr-fade-5">
          <p className="text-slate-500 font-mono tracking-widest"
            style={{ fontSize:"clamp(0.55rem,2vw,0.65rem)" }}>
            LAUNCH SEQUENCE · {progress < 100 ? "IN PROGRESS" : "COMPLETE"}
          </p>
        </div>

      </div>
    </div>
  );
}