import { FaArrowLeft, FaAws, FaCodeBranch, FaHome, FaRobot } from "react-icons/fa";
import { SiOpenai, SiReact } from "react-icons/si";

const ROUTE_CHECKS = [
  { label: "Frontend route", value: "Not registered", Icon: SiReact },
  { label: "API fallback", value: "No match", Icon: FaCodeBranch },
  { label: "Cloud edge", value: "404 returned", Icon: FaAws },
  { label: "AI hint", value: "Go home", Icon: SiOpenai },
];

function PageNotFound() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#070A12] px-5 py-10 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-14rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-[-14rem] right-[-12rem] h-[34rem] w-[34rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <section className="relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="text-center lg:text-left">
          <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
            Route diagnostics
          </span>
          <h1 className="mt-6 text-7xl font-black leading-none tracking-tight text-white sm:text-8xl lg:text-9xl">
            404
          </h1>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            This route is not deployed.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 lg:mx-0">
            The page you requested is outside the current portfolio map. The
            React app is still online, the cloud edge responded, and the fastest
            path back is the home experience.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-xl hover:shadow-cyan-500/20"
            >
              <FaHome aria-hidden="true" />
              Return home
            </a>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-black text-slate-200 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-white/[0.06]"
            >
              <FaArrowLeft aria-hidden="true" />
              Go back
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-cyan-300/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-7">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
                  Missing route report
                </p>
                <p className="mt-2 text-2xl font-black">Navigation recovery</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
                <FaRobot aria-hidden="true" />
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ROUTE_CHECKS.map(({ label, value, Icon }) => (
                <article key={label} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <Icon className="mb-4 text-xl text-cyan-300" aria-hidden="true" />
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 text-lg font-black text-white">{value}</p>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-4">
              <p className="text-sm font-bold text-emerald-200">
                Recommendation: reopen the portfolio from the home route and
                navigate via the sticky menu.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PageNotFound;
