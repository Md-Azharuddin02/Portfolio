import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Animates the numeric part of `value` (e.g. "99.9%", "10K+") once it scrolls into view.
export function CountUp({ value, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const match = String(value).match(/^([^\d]*)([\d.]+)(.*)$/);

  useEffect(() => {
    if (!match || !inView || reduced || !ref.current) return undefined;
    const [, prefix, num, suffix] = match;
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const controls = animate(0, parseFloat(num), {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
