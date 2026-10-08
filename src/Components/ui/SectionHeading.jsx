import { motion } from "framer-motion";
import { EASE_OUT } from "../../lib/motion";
import { ScrambleText } from "../interactive/ScrambleText";

/**
 * Editorial section header on a 12-col grid: running index + label on the left,
 * a sentence-case statement on the right with one serif-italic emphasis.
 */
export function SectionHeading({ id, index, eyebrow, title, accent, after, children, className = "" }) {
  return (
    <div className={`mb-10 grid grid-cols-12 gap-x-6 gap-y-4 border-t border-ink/15 pt-5 sm:mb-16 sm:gap-y-6 ${className}`}>
      <motion.p
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }}
        className="col-span-12 flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted md:col-span-3"
      >
        <span className="text-ink">{index}</span>
        <ScrambleText text={eyebrow} />
      </motion.p>
      <div className="col-span-12 md:col-span-9">
        <h2 id={id} className="font-display text-[clamp(2.25rem,5.6vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-ink [text-wrap:balance]">
          <span className="block overflow-hidden pb-[0.1em] [text-wrap:balance]">
            <motion.span
              className="block"
              variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 1.1, ease: EASE_OUT } } }}
            >
              {title}{" "}
              {accent && <em className="font-serif font-normal italic tracking-[-0.02em] text-brand">{accent}</em>}
              {after && <> {after}</>}
            </motion.span>
          </span>
        </h2>
        {children && (
          <motion.p
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT, delay: 0.15 } } }}
            className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg"
          >
            {children}
          </motion.p>
        )}
      </div>
    </div>
  );
}
