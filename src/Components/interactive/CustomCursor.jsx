import { useEffect, useRef } from "react";

// Dot + trailing ring. Over [data-cursor-label] targets the ring grows into a labelled lime disc.
export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return undefined;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let scale = 1;
    let mode = "idle"; // idle | hover | label
    let frame = 0;

    const move = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      // Events can target document/window (e.g. synthetic or edge-of-viewport events).
      const el = event.target instanceof Element ? event.target : null;
      const labelled = el?.closest("[data-cursor-label]");
      if (labelled) {
        mode = "label";
        label.textContent = labelled.getAttribute("data-cursor-label");
      } else {
        mode = el?.closest("a,button,input,textarea,[data-cursor='magnetic']") ? "hover" : "idle";
      }
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${mode === "idle" ? 1 : 0})`;
    };

    const render = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      const target = mode === "label" ? 2.6 : mode === "hover" ? 1.6 : 1;
      scale += (target - scale) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
      ring.dataset.mode = mode;
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
    <div aria-hidden="true" className="hidden md:block">
      <span
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[1500] h-1.5 w-1.5 rounded-full bg-brand-fill transition-[scale] duration-200"
      />
      <span
        ref={ringRef}
        data-mode="idle"
        className="group pointer-events-none fixed left-0 top-0 z-[1499] grid h-9 w-9 place-items-center rounded-full border border-ink/40 transition-[background-color,border-color] duration-300 data-[mode=hover]:border-brand data-[mode=label]:border-transparent data-[mode=label]:bg-brand-fill"
      >
        <span
          ref={labelRef}
          className="scale-[0.38] whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-wider text-on-brand opacity-0 transition-opacity duration-200 group-data-[mode=label]:opacity-100"
        />
      </span>
    </div>
  );
}
