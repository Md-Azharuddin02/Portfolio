import { cn } from "../../lib/utils";

export function MarqueeRow({ skills, direction = "left", isDark, label, Icon, activeCategory, category }) {
  const faded = activeCategory !== "all" && activeCategory !== category;
  const doubled = [...skills, ...skills];

  return (
    <div className={cn("w-full transition-opacity duration-300", faded && "opacity-30")}>
      <div className="mb-3 flex items-center gap-2 px-1">
        <div className={cn("grid h-8 w-8 place-items-center rounded-lg", isDark ? "bg-white/[0.06]" : "bg-slate-100")}>
          <Icon className="h-4 w-4 text-cyan-300" />
        </div>
        <span className={cn("text-xs font-bold uppercase tracking-widest", isDark ? "text-slate-400" : "text-slate-500")}>{label}</span>
        <div className={cn("h-px flex-1", isDark ? "bg-white/10" : "bg-slate-200")} />
      </div>
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
        <div className={cn("flex w-max gap-3 py-1 motion-safe:animate-marquee", direction === "right" && "motion-safe:[animation-direction:reverse]")}>
          {doubled.map((skill, i) => (
            <span
              key={`${skill.name}-${i}`}
              className={cn(
                "group flex shrink-0 cursor-default items-center gap-2 rounded-xl border-l-[3px] px-4 py-2.5 text-sm font-semibold transition duration-300 hover:-translate-y-1 hover:shadow-glow",
                isDark ? "bg-white/[0.05] text-slate-300 hover:bg-white/[0.08]" : "bg-white text-slate-700 shadow-sm",
              )}
              style={{ borderLeftColor: skill.color }}
            >
              <skill.Icon className="h-4 w-4 transition group-hover:scale-110" style={{ color: skill.color }} />
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
