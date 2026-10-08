import Lenis from "lenis";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Pinned sections cache their start/end offsets, so re-measure whenever content above them
// changes height (web-font swap, accordions, tabs, late images).
function useScrollTriggerAutoRefresh() {
  useEffect(() => {
    let lastHeight = document.body.scrollHeight;
    let timer = 0;
    const refresh = () => {
      ScrollTrigger.refresh();
      lastHeight = document.body.scrollHeight;
    };
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        // Guard against loops: refresh itself can resize pin spacers.
        if (Math.abs(document.body.scrollHeight - lastHeight) > 2) refresh();
      }, 200);
    });
    observer.observe(document.body);
    document.fonts?.ready.then(refresh);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}

export function SmoothScroll() {
  useScrollTriggerAutoRefresh();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    // Exposed so full-screen overlays (case studies, menus) can pause page scrolling.
    window.__lenis = lenis;
    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  return null;
}
