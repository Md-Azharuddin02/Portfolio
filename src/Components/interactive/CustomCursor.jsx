import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let hovering = false;
    let frame = 0;

    const move = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      hovering = Boolean(event.target.closest("a,button,[data-cursor='magnetic'],[data-cursor='card']"));
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${hovering ? 1.75 : 1})`;
      ring.style.borderColor = hovering ? "rgba(34, 211, 238, 0.95)" : "rgba(148, 163, 184, 0.55)";
      frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <span ref={dotRef} className="pointer-events-none fixed left-0 top-0 z-[1500] hidden h-2 w-2 rounded-full bg-cyan-300 mix-blend-difference md:block" />
      <span ref={ringRef} className="pointer-events-none fixed left-0 top-0 z-[1499] hidden h-8 w-8 rounded-full border border-slate-400/60 transition-colors md:block" />
    </>
  );
}
