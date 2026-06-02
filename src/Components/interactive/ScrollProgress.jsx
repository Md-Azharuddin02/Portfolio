import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[1400] h-0.5 w-full origin-left bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-400"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
