import React, { useContext } from "react";
import { FaAws, FaBell, FaBrain, FaCodeBranch, FaDatabase, FaRocket, FaRobot, FaShieldAlt } from "react-icons/fa";
import { SiAwslambda, SiGithubactions, SiOpenai, SiPostman } from "react-icons/si";
import { ThemeContext } from "../../Store/ThemeContext ";

const AUTOMATIONS = [
  {
    Icon: SiGithubactions,
    title: "CI/CD Release System",
    detail: "Automated build, test, security checks, Docker packaging, and deployment readiness through GitHub Actions.",
    stat: "Ship faster",
  },
  {
    Icon: FaAws,
    title: "AWS Cloud Delivery",
    detail: "Cloud-first architecture thinking for static hosting, APIs, storage, functions, monitoring, and scalable rollout paths.",
    stat: "Cloud-ready",
  },
  {
    Icon: SiOpenai,
    title: "AI Product Workflows",
    detail: "Assistant-style experiences, smart content flows, query handling, and automation patterns using modern AI APIs.",
    stat: "AI-enabled",
  },
  {
    Icon: SiPostman,
    title: "API Quality Gates",
    detail: "Collections, smoke checks, auth validation, and contract testing patterns for REST APIs and microservices.",
    stat: "Less drift",
  },
  {
    Icon: FaBell,
    title: "Monitoring & Alerts",
    detail: "Error-aware alerts and actionable status signals for deployments, APIs, and core app flows.",
    stat: "Fewer surprises",
  },
];

const PIPELINE = [
  { label: "Design", Icon: FaCodeBranch },
  { label: "Build", Icon: FaRobot },
  { label: "API", Icon: FaDatabase },
  { label: "AI", Icon: FaBrain },
  { label: "AWS", Icon: SiAwslambda },
  { label: "Ship", Icon: FaRocket },
  { label: "Guard", Icon: FaShieldAlt },
];

function Automation() {
  const { theme, isDark } = useContext(ThemeContext);

  return (
    <section id="automation" className={`w-full ${theme?.themeColor} py-14 sm:py-16`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]
                ${isDark ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200" : "border-cyan-700/20 bg-cyan-50 text-cyan-700"}`}>
                Automation
              </span>
              <h2 className={`mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl
                ${isDark ? "text-white" : "text-slate-950"}`}>
                Modern systems that build, learn, deploy, and scale
              </h2>
            </div>
            <p className={`max-w-2xl text-sm leading-7 sm:text-base lg:justify-self-end
              ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              I focus on the full product path: polished React UI, robust APIs,
              database-backed flows, AI assistants, AWS-ready deployment, and
              automation that keeps releases reliable after launch.
            </p>
          </div>

          <div className={`mb-7 overflow-hidden rounded-[1.5rem] border p-4 sm:p-5
            ${isDark ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white/70 shadow-sm"}`}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {PIPELINE.map(({ label, Icon }, index) => (
                <div key={label} className="relative flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl px-2 text-center">
                  {index > 0 && (
                    <span className={`absolute left-[-10%] top-1/2 hidden h-px w-1/5 lg:block
                      ${isDark ? "bg-cyan-300/35" : "bg-cyan-700/25"}`} />
                  )}
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border
                    ${isDark ? "border-white/10 bg-slate-950 text-cyan-200" : "border-slate-200 bg-slate-50 text-cyan-700"}`}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-[0.14em]
                    ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {AUTOMATIONS.map(({ Icon, title, detail, stat }) => (
              <article key={title} className={`group rounded-[1.35rem] border p-5 transition duration-300 hover:-translate-y-1
                ${isDark
                  ? "border-white/10 bg-white/[0.045] hover:border-cyan-300/35 hover:bg-cyan-300/[0.06]"
                  : "border-slate-200 bg-white hover:border-cyan-600/30 hover:shadow-xl hover:shadow-cyan-900/10"}`}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl
                    ${isDark ? "bg-cyan-300/10 text-cyan-200" : "bg-cyan-50 text-cyan-700"}`}>
                    <Icon className="text-lg" aria-hidden="true" />
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold
                    ${isDark ? "bg-emerald-300/10 text-emerald-200" : "bg-emerald-50 text-emerald-700"}`}>
                    {stat}
                  </span>
                </div>
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-950"}`}>
                  {title}
                </h3>
                <p className={`mt-3 text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Automation;
