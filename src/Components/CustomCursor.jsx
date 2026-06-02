import { useEffect, useRef, useCallback, useState } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, [role="button"], [data-cursor-hover]';
const LERP_FACTOR = 0.18;

export default function CustomCursor({
  theme = "auto",            // "auto" | "light" | "dark"
  accentColor = "#4BC9EC",   // hover color (works on both themes)
  dotSize = 6,
  ringSize = 30,
  hoverRingSize = 55,
  hideOnLeave = true,
}) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [resolvedTheme, setResolvedTheme] = useState("dark");

  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    ringX: 0,
    ringY: 0,
    isHovering: false,
    isPointerDown: false,
    isVisible: false,
    rafId: null,
  });

  // Resolve theme: explicit prop > <html data-theme> > prefers-color-scheme > body bg luminance
  const detectTheme = useCallback(() => {
    if (theme === "light" || theme === "dark") return theme;

    // 1. Check common theme attributes used by Tailwind/Next/etc.
    const html = document.documentElement;
    if (html.classList.contains("dark")) return "dark";
    if (html.classList.contains("light")) return "light";
    const dataTheme = html.getAttribute("data-theme");
    if (dataTheme === "dark" || dataTheme === "light") return dataTheme;

    // 2. Sample actual background luminance (most reliable)
    const bg = getComputedStyle(document.body).backgroundColor;
    const match = bg.match(/\d+(\.\d+)?/g);
    if (match && match.length >= 3) {
      const [r, g, b] = match.map(Number);
      // Relative luminance (WCAG)
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      if (lum > 0.5) return "light";
      if (lum > 0) return "dark";
    }

    // 3. Fallback to OS preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, [theme]);

  const supportsHover = useCallback(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    []
  );

  const prefersReducedMotion = useCallback(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Watch for theme changes (class/attribute mutations on <html>)
  useEffect(() => {
    setResolvedTheme(detectTheme());
    if (theme !== "auto") return;

    const observer = new MutationObserver(() => setResolvedTheme(detectTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolvedTheme(detectTheme());
    mq.addEventListener?.("change", onChange);

    return () => {
      observer.disconnect();
      mq.removeEventListener?.("change", onChange);
    };
  }, [theme, detectTheme]);

  // Theme-aware colors
  const isDark = resolvedTheme === "dark";
  const dotColor = isDark ? "#ffffff" : "#111111";
  const ringColor = isDark
    ? "rgba(255, 255, 255, 0.5)"
    : "rgba(17, 17, 17, 0.55)";
  // Skip difference blend on light bg (it looks muddy) — use plain color instead
  const blendMode = isDark ? "difference" : "normal";

  useEffect(() => {
    if (!supportsHover()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const state = stateRef.current;
    const reducedMotion = prefersReducedMotion();

    state.mouseX = window.innerWidth / 2;
    state.mouseY = window.innerHeight / 2;
    state.ringX = state.mouseX;
    state.ringY = state.mouseY;

    const setHoverState = (hovering) => {
      if (state.isHovering === hovering) return;
      state.isHovering = hovering;

      if (hovering) {
        ring.style.width = `${hoverRingSize}px`;
        ring.style.height = `${hoverRingSize}px`;
        ring.style.borderColor = accentColor;
        ring.style.background = `${accentColor}1F`; // ~12% alpha
        dot.style.opacity = "0";
      } else {
        ring.style.width = `${ringSize}px`;
        ring.style.height = `${ringSize}px`;
        ring.style.borderColor = ringColor;
        ring.style.background = "transparent";
        dot.style.opacity = "1";
      }
    };

    const handleMouseMove = (e) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;

      if (!state.isVisible) {
        state.isVisible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      const target = e.target;
      if (target?.closest) {
        setHoverState(!!target.closest(INTERACTIVE_SELECTOR));
      }
    };

    const handleMouseDown = () => {
      state.isPointerDown = true;
    };
    const handleMouseUp = () => {
      state.isPointerDown = false;
    };

    const handleMouseLeave = () => {
      if (!hideOnLeave) return;
      state.isVisible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const handleMouseEnter = () => {
      state.isVisible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const animate = () => {
      const lerp = reducedMotion ? 1 : LERP_FACTOR;
      state.ringX += (state.mouseX - state.ringX) * lerp;
      state.ringY += (state.mouseY - state.ringY) * lerp;

      const pressScale = state.isPointerDown ? 0.85 : 1;

      dot.style.transform = `translate3d(${state.mouseX}px, ${state.mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate(-50%, -50%) scale(${pressScale})`;

      state.rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    animate();

    return () => {
      cancelAnimationFrame(state.rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [
    accentColor,
    ringColor,
    ringSize,
    hoverRingSize,
    hideOnLeave,
    supportsHover,
    prefersReducedMotion,
  ]);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          border: `1.5px solid ${ringColor}`,
          borderRadius: "999px",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: 0,
          transition:
            "width 0.25s ease, height 0.25s ease, border-color 0.3s ease, background 0.25s ease, opacity 0.2s ease",
          willChange: "transform, width, height",
          backfaceVisibility: "hidden",
          boxShadow: isDark
            ? "0 0 0 1px rgba(0,0,0,0.1)"
            : "0 0 0 1px rgba(255,255,255,0.6)", // subtle halo for contrast
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          borderRadius: "999px",
          background: dotColor,
          pointerEvents: "none",
          mixBlendMode: blendMode,
          zIndex: 99999,
          opacity: 0,
          transition: "opacity 0.2s ease, background 0.3s ease",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
        }}
      />
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          body, body * { cursor: none !important; }
        }
      `}</style>
    </>
  );
}
