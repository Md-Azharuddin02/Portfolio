import React, { Suspense, lazy, useCallback, useContext, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ThemeContext } from "../../Store/ThemeContext ";
import resume from "../../assets/MdAzharuddinFullStackResume.pdf";
import { MagneticButton } from "../interactive/MagneticButton";
import { LocalTime } from "../interactive/LocalTime";
import { ScrambleText } from "../interactive/ScrambleText";
import { Button } from "../ui/Button";
import { EASE_OUT } from "../../lib/motion";
import { usePreloaderDone } from "../../lib/preloader";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// The WebGL field (~250 kB gz with three.js) loads after first paint.
const SignalField = lazy(() => import("../three/SignalField"));

// Each line is a list of [text, isEmphasis] runs.
const LINES = [
  [["Full-stack products", false]],
  [["with cloud scale", false]],
  [["& ", false], ["AI intelligence.", true]],
];

function RevealLine({ runs, lineIndex, revealed }) {
  return (
    <span className="block" aria-hidden="true">
      {runs.map(([text, em]) =>
        text.split(" ").filter(Boolean).map((word, w) => (
          <React.Fragment key={`${text}-${w}`}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className={`inline-block ${em ? "font-serif font-normal italic tracking-[-0.02em] text-brand" : ""}`}
                initial={{ y: "135%" }}
                animate={{ y: revealed ? "0%" : "135%" }}
                transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.25 + lineIndex * 0.1 + w * 0.04 }}
              >
                {Array.from(word).map((char, c) => (
                  <span key={c} data-char className="inline-block">
                    {char}
                  </span>
                ))}
              </motion.span>
            </span>{" "}
          </React.Fragment>
        )),
      )}
    </span>
  );
}

// Entrance for supporting copy; `revealed` comes from the WebGL name sequence.
const fadeIn = (delay, revealed = true) => ({
  initial: { opacity: 0, y: 14 },
  animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
  transition: { duration: 1, ease: EASE_OUT, delay },
});

const META = [
  { label: "Role", value: "Full-stack developer" },
  { label: "Focus", value: "Frontend · Backend · AI" },
  { label: "Status", value: "Open to new projects", live: true },
];

/**
 * Letters swell toward the cursor using Space Grotesk's variable weight axis.
 * Fine pointers on wide screens only; each glyph eases toward its target weight per frame.
 */
function useProximityWeight(ref, enabled) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return undefined;
    const media = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    if (!media.matches) return undefined;
    const chars = Array.from(root.querySelectorAll("[data-char]")).filter((el) => !el.closest(".font-serif"));
    const weights = chars.map(() => 500);
    const pointer = { x: -9999, y: -9999 };
    let frame = 0;
    let idleFrames = 0;
    const RADIUS = 220;

    const tick = () => {
      let moving = false;
      chars.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2));
        const target = 500 + 200 * Math.max(0, 1 - d / RADIUS) ** 2;
        const next = weights[i] + (target - weights[i]) * 0.18;
        if (Math.abs(next - weights[i]) > 0.5) moving = true;
        weights[i] = next;
        el.style.fontVariationSettings = `"wght" ${next.toFixed(0)}`;
      });
      // Stop the loop once everything has settled; restart on the next pointer move.
      idleFrames = moving ? 0 : idleFrames + 1;
      frame = idleFrames > 10 ? 0 : requestAnimationFrame(tick);
    };
    const onMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      chars.forEach((el) => (el.style.fontVariationSettings = ""));
    };
  }, [ref, enabled]);
}

function HomePageHero() {
  const { isDark } = useContext(ThemeContext);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const headlineY = useTransform(scrollY, [0, 800], [0, -140]);
  const fade = useTransform(scrollY, [0, 600], [1, 0]);
  const headlineRef = useRef(null);
  // The headline waits for the dot-name to collapse into the terrain (see SignalField).
  const booted = usePreloaderDone();
  const [revealed, setRevealed] = useState(false);
  const onReveal = useCallback(() => setRevealed(true), []);
  useEffect(() => {
    if (!booted) return undefined;
    // Never strand the visitor: reveal anyway if WebGL is slow, blocked or unsupported.
    const id = window.setTimeout(onReveal, reduced ? 0 : 5000);
    return () => window.clearTimeout(id);
  }, [booted, onReveal, reduced]);
  useProximityWeight(headlineRef, !reduced && revealed);

  return (
    <section id="home" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-canvas text-ink" aria-labelledby="hero-title">
      <div className="absolute inset-x-0 bottom-0 top-[38%] -z-10 sm:top-[30%]">
        <Suspense fallback={null}>
          <SignalField isDark={isDark} reducedMotion={reduced} onReveal={onReveal} />
        </Suspense>
        {/* Blend the field into the page edge */}
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-canvas to-transparent transition-opacity duration-1000 ${revealed ? "opacity-100" : "opacity-0"}`} />
        <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-canvas via-canvas/70 to-transparent transition-opacity duration-1000 ${revealed ? "opacity-100" : "opacity-0"}`} />
      </div>

      <div className="container relative mx-auto flex flex-1 flex-col px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <motion.dl {...fadeIn(0.1, booted)} className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink/15 pt-4 font-mono text-[11px] uppercase tracking-[0.14em] sm:grid-cols-4">
          {META.map((item) => (
            <div key={item.label}>
              <dt className="text-ink-muted">{item.label}</dt>
              <dd className="mt-1 flex items-center gap-2 text-ink">
                {item.live && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-fill opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-fill" />
                  </span>
                )}
                <ScrambleText text={item.value} active={booted} delay={0.25} />
              </dd>
            </div>
          ))}
          <div>
            <dt className="text-ink-muted">Local time</dt>
            <dd className="mt-1 text-ink">
              <LocalTime />
            </dd>
          </div>
        </motion.dl>

        <motion.h1
          ref={headlineRef}
          id="hero-title"
          aria-label="Full-stack products with cloud scale and AI intelligence."
          style={reduced ? undefined : { y: headlineY }}
          className="mt-14 font-display text-[clamp(2.75rem,8.6vw,9rem)] font-medium leading-[0.92] tracking-[-0.045em] sm:mt-20"
        >
          {LINES.map((runs, index) => (
            <RevealLine key={index} runs={runs} lineIndex={index} revealed={revealed} />
          ))}
        </motion.h1>

        <motion.div style={reduced ? undefined : { opacity: fade }} className="mt-auto grid grid-cols-12 items-end gap-6 pt-12">
          <motion.p {...fadeIn(0.75, revealed)} className="col-span-12 max-w-md text-base leading-relaxed text-ink-muted md:col-span-5">
            I design and ship polished interfaces backed by scalable APIs, cloud-ready delivery and LLM-powered features — the kind of software that feels fast, useful and reliable.
          </motion.p>

          <motion.div {...fadeIn(0.85, revealed)} className="col-span-12 flex flex-wrap gap-3 md:col-span-5">
            <MagneticButton>
              <Button as="a" href="#project" data-cursor-label="Work">
                Selected work <ArrowDown size={16} aria-hidden="true" />
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button as="a" href={resume} download variant="secondary">
                Résumé <ArrowUpRight size={16} aria-hidden="true" />
              </Button>
            </MagneticButton>
          </motion.div>

          <motion.a
            {...fadeIn(0.95, revealed)}
            href="#about"
            className="col-span-2 hidden items-center justify-end gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted transition-colors hover:text-ink md:flex"
          >
            Scroll
            <span className="relative h-10 w-px overflow-hidden bg-ink/15">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-ink"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

export default HomePageHero;
