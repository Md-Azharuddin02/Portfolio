import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { testimonials } from "../../content/testimonials";
import { EASE_OUT, staggerContainer } from "../../lib/motion";
import { SectionHeading } from "../ui/SectionHeading";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const DURATION = 7000;
const pad = (n) => String(n).padStart(2, "0");

function Quote({ item }) {
  const words = item.text.split(" ");
  return (
    <motion.figure initial="hidden" animate="show" exit="exit" className="flex h-full flex-col">
      <blockquote className="font-display text-[clamp(1.5rem,2.9vw,2.6rem)] font-normal leading-[1.2] tracking-[-0.025em] text-ink">
        <motion.span
          aria-hidden="true"
          className="mr-1 font-serif italic text-brand"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }}
        >
          “
        </motion.span>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
              show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE_OUT, delay: i * 0.025 } },
              exit: { opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: 0.25 } },
            }}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </blockquote>
      <motion.figcaption
        className="mt-10 flex items-center gap-4"
        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 } }, exit: { opacity: 0 } }}
      >
        <img src={item.image} alt="" width="56" height="56" loading="lazy" decoding="async" className="h-14 w-14 rounded-full object-cover grayscale" />
        <div>
          <p className="font-display text-lg font-medium tracking-tight text-ink">{item.name}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">{item.role}</p>
        </div>
      </motion.figcaption>
    </motion.figure>
  );
}

function Testimonial() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // user-controlled (button)
  const [hovering, setHovering] = useState(false); // transient (hover / focus)
  const reduced = useReducedMotion();
  const stage = useRef(null);
  const inView = useInView(stage, { margin: "-20% 0px" });
  const running = !paused && !hovering && inView && !reduced;
  const count = testimonials.length;

  const go = useCallback((next) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(id);
  }, [running, index, go]);

  // Roving tabindex: arrows move selection *and* focus along the tab list.
  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (((index + step) % count) + count) % count;
    go(next);
    requestAnimationFrame(() => document.getElementById(`tm-tab-${testimonials[next].id}`)?.focus());
  };

  const current = testimonials[index];

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="w-full bg-canvas py-20 text-ink sm:py-32 lg:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <SectionHeading id="testimonials-heading" index="04" eyebrow="Kind words" title="What it's like" accent="working together." />
        </motion.div>

        <div
          ref={stage}
          className="grid grid-cols-12 gap-x-6 gap-y-12"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHovering(false)}
        >
          {/* People index — doubles as the tab list */}
          <div className="col-span-12 md:col-span-4">
            <div role="tablist" aria-label="Colleagues" onKeyDown={onKeyDown} className="flex border-t border-ink/15 md:block">
              {testimonials.map((person, i) => {
                const selected = i === index;
                return (
                  <button
                    key={person.id}
                    type="button"
                    role="tab"
                    id={`tm-tab-${person.id}`}
                    aria-selected={selected}
                    aria-controls="tm-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => go(i)}
                    className={`group relative flex flex-1 items-center justify-center gap-4 border-b border-ink/15 py-3 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:w-full md:justify-start md:py-4 ${
                      selected ? "text-ink" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    <span className="font-mono text-[11px]">{pad(i + 1)}</span>
                    {/* Compact numbered segments on phones; full names from md up */}
                    <span className="sr-only flex-1 md:not-sr-only">
                      <span className="block text-[15px]">{person.name}</span>
                      <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted sm:block">{person.role}</span>
                    </span>
                    {/* Progress rule for the active item */}
                    <span aria-hidden="true" className="absolute bottom-[-1px] left-0 h-px w-full overflow-hidden">
                      {selected && (
                        <motion.span
                          key={`${index}-${running}`}
                          className="block h-full origin-left bg-brand"
                          initial={{ scaleX: running ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: running ? DURATION / 1000 : 0, ease: "linear" }}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured quote */}
          <div className="col-span-12 -mt-4 flex flex-col md:col-span-8 md:mt-0 md:pl-10 lg:pl-16">
            <div id="tm-panel" role="tabpanel" aria-labelledby={`tm-tab-${current.id}`} className="min-h-[300px] sm:min-h-[300px]">
              <AnimatePresence mode="wait">
                <Quote key={current.id} item={current} />
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-ink/15 pt-5 sm:mt-12">
              <p className="font-mono text-[11px] tabular-nums tracking-[0.14em] text-ink-muted">
                <span className="text-ink">{pad(index + 1)}</span> / {pad(count)}
              </p>
              <div className="flex items-center gap-2">
                {!reduced && (
                  <button
                    type="button"
                    onClick={() => setPaused((p) => !p)}
                    aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
                    className="grid h-11 w-11 place-items-center rounded-full text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous testimonial"
                  className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next testimonial"
                  className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
