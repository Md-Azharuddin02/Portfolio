import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Tabs({ tabs, active, onChange }) {
  return (
    <div
      className="inline-flex rounded-2xl border border-slate-300/70 bg-slate-200/50 p-1 dark:border-white/10 dark:bg-white/[0.04]"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative rounded-xl px-5 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            active === tab.id
              ? "text-slate-950"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          {active === tab.id && (
            <motion.span
              layoutId="tab-pill"
              className="absolute inset-0 rounded-xl bg-accent shadow-sm"
            />
          )}

          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
