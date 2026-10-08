import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_—·";

/**
 * Mono label that "decodes": each character cycles through random glyphs and locks in
 * left-to-right. Screen readers get the final text immediately via aria-label.
 */
export function ScrambleText({ text, className = "", delay = 0, duration = 700, active = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return undefined;
    }
    if (!inView || !active) return undefined;
    let frame = 0;
    let start = 0;
    const chars = Array.from(text);
    const step = (now) => {
      if (!start) start = now + delay * 1000;
      const t = now - start;
      if (t < 0) {
        setDisplay(chars.map((ch) => (ch === " " ? " " : "·")).join(""));
        frame = requestAnimationFrame(step);
        return;
      }
      let done = true;
      const out = chars.map((ch, i) => {
        if (ch === " ") return " ";
        const lockAt = (i / chars.length) * duration;
        if (t >= lockAt + 120) return ch;
        done = false;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      });
      setDisplay(out.join(""));
      if (!done) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, active, reduced, text, delay, duration]);

  return (
    <span ref={ref} aria-label={text} className={className}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
