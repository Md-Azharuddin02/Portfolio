import React, { useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeContext } from "../../Store/ThemeContext ";
import { OPEN_PALETTE_EVENT } from "../interactive/CommandPalette";
import { EASE_OUT } from "../../lib/motion";
import { usePreloaderDone } from "../../lib/preloader";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Capabilities" },
  { id: "project", label: "Work" },
  { id: "contact", label: "Contact" },
];

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

// Half-filled disc that rotates 180° between themes.
function ThemeGlyph({ isDark }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      animate={{ rotate: isDark ? 180 : 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
    </motion.svg>
  );
}

function Navbar() {
  const { isDark, toggleTheme, active, handleSetActive, isOpen, handleMenuBar } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const booted = usePreloaderDone();
  const sectionIds = useMemo(() => ["home", ...NAV_ITEMS.map((item) => item.id)], []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) handleSetActive({ target: { name: visible.target.id } });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [handleSetActive, sectionIds]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const scrollToSection = (id, event) => {
    event.preventDefault();
    const section = document.getElementById(id);
    const top = section ? section.getBoundingClientRect().top + window.scrollY - 64 : 0;
    window.scrollTo({ top, behavior: "smooth" });
    handleSetActive({ target: { name: id } });
    handleMenuBar(false);
  };

  const onToggleTheme = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[999]"
      initial={{ y: -20, opacity: 0 }}
      animate={booted ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
    >
      <nav
        aria-label="Primary"
        className={`transition-[background-color,border-color] duration-500 ${
          scrolled || isOpen ? "border-b border-ink/10 bg-canvas/80 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="#home"
            onClick={(event) => scrollToSection("home", event)}
            className="group flex items-baseline gap-2 font-display text-[15px] font-medium tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Md Azharuddin
            <span className="font-mono text-[10px] text-ink-muted transition-colors group-hover:text-brand">©{new Date().getFullYear()}</span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => scrollToSection(item.id, event)}
                  aria-current={active === item.id ? "true" : undefined}
                  className={`group relative flex items-baseline gap-1.5 py-2 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    active === item.id ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className="font-mono text-[10px] text-ink-muted">0{i + 1}</span>
                  {item.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-ink transition-transform duration-500 ease-out-expo ${
                      active === item.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
              aria-label="Open command menu"
              aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
              className="hidden h-9 items-center gap-1 rounded-full border border-ink/15 px-3 font-mono text-[11px] text-ink-muted transition-colors hover:border-ink/40 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:flex"
            >
              <span>{isMac ? "⌘" : "Ctrl"}</span>K
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              data-cursor-label={isDark ? "Light" : "Dark"}
              className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <ThemeGlyph isDark={isDark} />
            </button>
            <button
              type="button"
              onClick={() => handleMenuBar()}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="relative grid h-11 w-11 place-items-center rounded-full text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:hidden"
            >
              <span className={`absolute h-px w-5 bg-current transition-transform duration-500 ease-out-expo ${isOpen ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute h-px w-5 bg-current transition-transform duration-500 ease-out-expo ${isOpen ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-16 z-[998] flex flex-col bg-canvas px-4 pb-8 pt-6 sm:px-6 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.4, ease: EASE_OUT } }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <ul className="flex-1 border-t border-ink/10">
              {NAV_ITEMS.map((item, index) => (
                <li key={item.id} className="overflow-hidden border-b border-ink/10">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={(event) => scrollToSection(item.id, event)}
                    className="flex items-baseline justify-between py-5 font-display text-4xl font-medium tracking-tight text-ink"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 + index * 0.06 }}
                  >
                    {item.label}
                    <span className="font-mono text-xs text-ink-muted">0{index + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">mdazharuddin02@gmail.com</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
