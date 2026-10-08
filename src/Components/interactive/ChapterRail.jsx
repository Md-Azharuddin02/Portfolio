import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { usePreloaderDone } from "../../lib/preloader";

const CHAPTERS = [
  { id: "home", label: "Intro" },
  { id: "about", label: "About" },
  { id: "skills", label: "Capabilities" },
  { id: "project", label: "Work" },
  { id: "testimonials", label: "Kind words" },
  { id: "contact", label: "Contact" },
];

/**
 * Scroll-storytelling progress indicator (xl+ only). A hairline fills with overall progress;
 * each chapter is a tick that names itself on hover/focus and jumps on click.
 */
export function ChapterRail() {
  const booted = usePreloaderDone();
  const [active, setActive] = useState("home");
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (id === "home" ? 0 : 64), behavior: "smooth" });
  };

  return (
    <motion.nav
      aria-label="Chapters"
      className="group/rail fixed right-5 top-1/2 z-[900] hidden -translate-y-1/2 xl:block"
      initial={{ opacity: 0, x: 12 }}
      animate={booted ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative flex flex-col items-end gap-3 py-1 pr-3">
        {/* progress hairline */}
        <span className="absolute bottom-0 right-0 top-0 w-px bg-ink/15" aria-hidden="true">
          <motion.span className="absolute inset-0 origin-top bg-brand" style={{ scaleY: fill }} />
        </span>
        {CHAPTERS.map((c, i) => {
          const on = active === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => jump(c.id)}
              aria-current={on ? "true" : undefined}
              aria-label={`Chapter ${i}: ${c.label}`}
              className="group/tick flex h-6 items-center gap-3 focus-visible:outline-none"
            >
              <span
                className={`whitespace-nowrap rounded-full bg-canvas/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-md transition-all duration-500 ease-out-expo ${
                  on ? "text-ink" : "text-ink-muted"
                } translate-x-2 opacity-0 group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-focus-visible/tick:translate-x-0 group-focus-visible/tick:opacity-100 group-focus-visible/tick:ring-2 group-focus-visible/tick:ring-brand`}
              >
                {c.label}
              </span>
              <span className={`font-mono text-[10px] tabular-nums transition-colors ${on ? "text-ink" : "text-ink-muted"}`}>0{i}</span>
              <span
                className={`h-px transition-all duration-500 ease-out-expo ${on ? "w-6 bg-ink" : "w-3 bg-ink/30 group-hover/tick:w-5 group-hover/tick:bg-ink/60"}`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
