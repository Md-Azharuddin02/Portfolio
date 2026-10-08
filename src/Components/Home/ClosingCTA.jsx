import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { MagneticButton } from "../interactive/MagneticButton";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const ROW_A = "Let’s build something";
const ROW_B = "worth using";

function Row({ children, x, className }) {
  return (
    <motion.div style={{ x }} className={`flex w-max items-center gap-[0.35em] whitespace-nowrap ${className}`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="flex items-center gap-[0.35em]">
          {children}
          <span className="inline-block h-[0.12em] w-[0.6em] translate-y-[-0.05em] bg-current opacity-40" />
        </span>
      ))}
    </motion.div>
  );
}

/**
 * Story climax (scroll-storytelling pattern): two oversized rows scrubbed in opposite directions
 * by scroll position, with a magnetic CTA disc at the centre. Static under reduced motion.
 */
function ClosingCTA() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xA = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const xB = useTransform(scrollYProgress, [0, 1], ["-28%", "0%"]);

  return (
    <section ref={ref} aria-labelledby="closing-title" className="relative overflow-hidden border-y border-ink/15 bg-canvas py-14 text-ink sm:py-24">
      <h2 id="closing-title" className="sr-only">
        Let&apos;s build something worth using
      </h2>
      <div aria-hidden="true" className="select-none font-display text-[clamp(3.5rem,13vw,13rem)] font-medium leading-[0.95] tracking-[-0.05em]">
        <Row x={reduced ? "-10%" : xA}>{ROW_A}</Row>
        <Row x={reduced ? "-14%" : xB} className="font-serif font-normal italic tracking-[-0.03em] text-brand">
          {ROW_B}
        </Row>
      </div>

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <MagneticButton className="pointer-events-auto">
          <a
            href="#contact"
            aria-label="Start a project — jump to the contact form"
            data-cursor-label="Let's go"
            className="group relative grid h-36 w-36 place-items-center rounded-full bg-brand-fill text-on-brand shadow-[0_20px_60px_-15px_rgb(var(--brand-fill)/0.6)] transition-transform duration-500 ease-out-expo hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas sm:h-44 sm:w-44"
          >
            {/* rotating label ring */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full motion-safe:animate-[spin_14s_linear_infinite]" aria-hidden="true">
              <defs>
                <path id="cta-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-current font-mono text-[7.2px] uppercase tracking-[0.22em]">
                <textPath href="#cta-ring">Available for new projects · Available for new projects ·</textPath>
              </text>
            </svg>
            <span className="flex flex-col items-center gap-1 font-display text-sm font-medium">
              <ArrowDownRight size={22} aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:rotate-[-45deg]" />
              Start a project
            </span>
          </a>
        </MagneticButton>
      </div>
    </section>
  );
}

export default ClosingCTA;
