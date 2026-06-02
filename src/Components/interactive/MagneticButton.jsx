import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function MagneticButton({ children, className = "", as = "div" }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 16, mass: 0.25 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 16, mass: 0.25 });
  const MotionTag = motion[as] || motion.div;

  const onMove = (event) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
    if (distance < 80) {
      x.set((event.clientX - centerX) * 0.18);
      y.set((event.clientY - centerY) * 0.18);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  return (
    <MotionTag
      ref={ref}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
      data-cursor="magnetic"
    >
      {children}
    </MotionTag>
  );
}
