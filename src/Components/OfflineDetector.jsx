import { useEffect, useState } from "react";
import { FaCloud, FaDatabase, FaRedoAlt, FaSignal, FaWifi } from "react-icons/fa";
import { SiAmazonaws, SiReact } from "react-icons/si";

const NETWORK_CHECKS = [
  { label: "React shell", value: "Cached", Icon: SiReact },
  { label: "Cloud edge", value: "Waiting", Icon: SiAmazonaws },
  { label: "API access", value: "Paused", Icon: FaDatabase },
  { label: "Signal", value: "Offline", Icon: FaSignal },
];

function OfflinePage({ onRetry, isRetrying, retryCount }) {
  return (
    <div className="fixed inset-0 z-[9998] flex min-h-screen items-center justify-center overflow-hidden bg-[#070A12] px-5 py-10 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-rose-500/15 blur-3xl" />
        <div className="absolute bottom-[-12rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <section className="relative grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="text-center lg:text-left">
          <span className="inline-flex rounded-full border border-rose-300/20 bg-rose-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-rose-200">
            Network interrupted
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
            You are offline, but the interface is ready.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300 lg:mx-0">
            The portfolio shell is loaded locally. Reconnect to restore live
            links, cloud assets, and external project destinations.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <button
              type="button"
              onClick={onRetry}
              disabled={isRetrying}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-xl hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <FaRedoAlt className={isRetrying ? "animate-spin" : ""} aria-hidden="true" />
              {isRetrying ? "Checking signal" : "Retry connection"}
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-black text-slate-200 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-white/[0.06]"
            >
              Open cached home
            </a>
          </div>

          {retryCount > 0 && (
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
              Reconnect attempt #{retryCount}
            </p>
          )}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
                Connectivity status
              </p>
              <p className="mt-2 text-2xl font-black">Local fallback active</p>
            </div>
            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-300/10 text-rose-200">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-rose-400/10" />
              <FaWifi className="relative text-xl" aria-hidden="true" />
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {NETWORK_CHECKS.map(({ label, value, Icon }) => (
              <article key={label} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <Icon className="mb-4 text-xl text-cyan-300" aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  {label}
                </p>
                <p className="mt-1 text-lg font-black text-white">{value}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <FaCloud className="text-cyan-300" aria-hidden="true" />
              <p className="text-sm font-bold text-slate-300">Recovery pipeline</p>
            </div>
            <div className="grid grid-cols-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              <span className="border-r border-white/10 px-3 py-4">Detect</span>
              <span className="border-r border-white/10 px-3 py-4">Reconnect</span>
              <span className="px-3 py-4">Resume</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function OfflineDetector({ children }) {
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
    }, 1100);
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

export default OfflineDetector;
