import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function TiltCard({ children, className = "", max = 6 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });

  const onMove = (event) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(Math.max(-max, Math.min(max, -y * max * 2)));
    rotateY.set(Math.max(-max, Math.min(max, x * max * 2)));
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      data-cursor="card"
    >
      {children}
    </motion.div>
  );
}
