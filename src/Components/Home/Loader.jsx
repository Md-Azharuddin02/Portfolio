import { useEffect, useMemo, useState } from "react";
import { FaAws, FaRobot, FaServer } from "react-icons/fa";
import { SiOpenai, SiReact } from "react-icons/si";

const LOAD_STEPS = [
  { label: "React UI", Icon: SiReact },
  { label: "API layer", Icon: FaServer },
  { label: "AWS ready", Icon: FaAws },
  { label: "AI flows", Icon: SiOpenai },
];

const STATUS = [
  "Hydrating modern interface",
  "Preparing cloud-ready modules",
  "Wiring AI automation layer",
  "Launching portfolio experience",
];

function Loader({ onComplete }) {
  const [progress, setProgress] = useState(8);
  const [statusIndex, setStatusIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2.5}s`,
        duration: `${4 + Math.random() * 4}s`,
      })),
    [],
  );

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((current) => Math.min(current + Math.ceil(Math.random() * 9), 100));
    }, 240);

    const statusTimer = setInterval(() => {
      setStatusIndex((current) => (current + 1) % STATUS.length);
    }, 750);

    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onComplete?.(), 420);
    }, 2600);

    return () => {
      clearInterval(progressTimer);
      clearInterval(statusTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[#070A12] px-5 text-white transition duration-500 ${
        exiting ? "scale-[1.02] opacity-0" : "scale-100 opacity-100"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-12rem] h-[30rem] w-[30rem] rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-[-12rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute h-1 w-1 animate-[loaderDrift_6s_linear_infinite] rounded-full bg-cyan-200/60"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes loaderDrift {
          0% { transform: translate3d(0, 20px, 0); opacity: 0; }
          20% { opacity: 0.9; }
          100% { transform: translate3d(36px, -96px, 0); opacity: 0; }
        }
      `}</style>

      <div className="relative w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-7">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-black tracking-tight">
              Azhar<span className="text-cyan-400">.</span>
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Modern portfolio boot
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
            <FaRobot className="text-xl" aria-hidden="true" />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LOAD_STEPS.map(({ label, Icon }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
              <Icon className="mb-3 text-lg text-cyan-300" aria-hidden="true" />
              <p className="text-xs font-bold text-slate-300">{label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-black tracking-tight">Loading experience</p>
              <p className="mt-1 text-sm text-slate-400">{STATUS[statusIndex]}</p>
            </div>
            <p className="font-mono text-lg font-black tabular-nums text-cyan-300">
              {progress}%
            </p>
          </div>

          <div className="h-2 overflow-hidden rounded-full border border-cyan-300/15 bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-300 to-violet-300 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
