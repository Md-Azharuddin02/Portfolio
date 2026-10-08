import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const TOGGLE_GRID_EVENT = "toggle-layout-grid";

const isTyping = (el) => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

/** Press "G" (or ⌘K → Toggle layout grid) to reveal the 12-column grid the site is set on. */
export function LayoutGrid() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const toggle = () => setOn((v) => !v);
    const onKey = (event) => {
      if (event.key.toLowerCase() !== "g" || event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      toggle();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(TOGGLE_GRID_EVENT, toggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(TOGGLE_GRID_EVENT, toggle);
    };
  }, []);

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[950]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container mx-auto grid h-full grid-cols-4 gap-x-6 px-4 sm:grid-cols-12 sm:px-6 lg:px-8">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.span
                key={i}
                className={`h-full border-x border-brand/25 bg-brand-fill/[0.06] ${i >= 4 ? "hidden sm:block" : ""}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.025 }}
                style={{ originY: i % 2 ? 1 : 0 }}
              />
            ))}
          </div>
          <p className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-canvas">
            12-col grid · 24px gutter · press G to hide
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
