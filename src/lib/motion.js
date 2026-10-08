export const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Shared motion tokens: decelerate on enter, keep exits shorter than entrances.
export const EASE_OUT = [0.16, 1, 0.3, 1];
export const DURATION = { fast: 0.2, base: 0.45, slow: 0.7 };

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
};
