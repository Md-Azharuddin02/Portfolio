import React, { useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { ThemeContext } from "../../Store/ThemeContext ";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  // { id: "ai-integration", label: "AI Integration" },
  { id: "project", label: "Projects" },
  { id: "contact", label: "Contact" },
];

function Navbar() {
  const { isDark, handleTheamChange, active, handleSetActive, isOpen, handleMenuBar } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.id), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [handleSetActive, sectionIds]);

  const scrollToSection = (id, event) => {
    event.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY - 74;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    handleSetActive({ target: { name: id } });
    handleMenuBar(false);
  };

  return (
    <motion.header
      className="sticky top-0 z-[999] w-full"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        className={`border-b backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? isDark
              ? "border-white/10 bg-[#070A12]/86 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.32)]"
              : "border-slate-900/10 bg-[#F7F7F2]/86 py-2 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
            : isDark
              ? "border-white/5 bg-[#070A12]/60 py-4"
              : "border-slate-900/5 bg-[#F7F7F2]/60 py-4"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="#home"
            onClick={(event) => scrollToSection("home", event)}
            className={`text-xl font-black tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${isDark ? "text-white" : "text-slate-950"}`}
          >
            Azhar<span className="text-cyan-400">.</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => scrollToSection(item.id, event)}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  active === item.id ? "text-cyan-300" : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {active === item.id && (
                  <motion.span layoutId="nav-underline" className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-cyan-300" />
                )}
                <span className="relative">{item.label}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTheamChange}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className={`rounded-full p-2 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isDark ? "text-cyan-200 hover:bg-white/10" : "text-cyan-700 hover:bg-slate-900/5"
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => handleMenuBar()}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              className={`rounded-full p-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden ${
                isDark ? "text-white hover:bg-white/10" : "text-slate-950 hover:bg-slate-900/5"
              }`}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[998] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => handleMenuBar(false)} aria-label="Close navigation menu" />
            <motion.nav
              className={`absolute inset-x-4 top-20 rounded-2xl border p-4 shadow-2xl ${isDark ? "border-white/10 bg-slate-950" : "border-slate-200 bg-white"}`}
              initial={{ y: -18, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -12, scale: 0.96 }}
            >
              {NAV_ITEMS.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(event) => scrollToSection(item.id, event)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    active === item.id
                      ? "bg-cyan-300 text-slate-950"
                      : isDark
                        ? "text-slate-300 hover:bg-white/10 hover:text-white"
                        : "text-slate-700 hover:bg-slate-100"
                  }`}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  {item.label}
                  {active === item.id && <span className="h-2 w-2 rounded-full bg-slate-950" />}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
