import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Tabs({ tabs, active, onChange }) {
  return (
    <div
      className="inline-flex rounded-full border border-ink/10 bg-ink/[0.04] p-1"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative min-h-[40px] rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
            active === tab.id
              ? "text-canvas"
              : "text-ink-muted hover:text-ink"
          )}
        >
          {active === tab.id && (
            <motion.span
              layoutId="tab-pill"
              className="absolute inset-0 rounded-full bg-ink shadow-sm"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}

          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
