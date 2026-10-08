/* global __BUILD_DATE__ */
import React, { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { LocalTime } from "../interactive/LocalTime";
import { EASE_OUT } from "../../lib/motion";

const INDEX = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Capabilities" },
  { href: "#project", label: "Work" },
  { href: "#testimonials", label: "Kind words" },
  { href: "#contact", label: "Contact" },
];

const ELSEWHERE = [
  { href: "https://github.com/Md-Azharuddin02", label: "GitHub" },
  { href: "https://www.linkedin.com/in/mdazharuddin02/", label: "LinkedIn" },
  { href: "https://x.com/Md_Azharuddin02", label: "X / Twitter" },
];

const WORDMARK = "Azharuddin";

function Column({ title, children }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">{title}</p>
      <div className="mt-4 space-y-2 text-[15px]">{children}</div>
    </div>
  );
}

const linkClass =
  "block w-fit text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

/**
 * Fit a single line of text to its container's width: measure at a 100px reference size,
 * then scale. Re-fits on resize and once web fonts finish loading (metrics change).
 */
function useFitText() {
  const box = useRef(null);
  const text = useRef(null);
  useLayoutEffect(() => {
    const fit = () => {
      if (!box.current || !text.current) return;
      text.current.style.fontSize = "100px";
      const natural = text.current.scrollWidth;
      if (natural) text.current.style.fontSize = `${(100 * box.current.clientWidth) / natural - 0.05}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box.current);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);
  return [box, text];
}

function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const [fitBox, fitText] = useFitText();

  return (
    <footer className="w-full overflow-hidden bg-canvas text-ink">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 border-t border-ink/15 pt-10 md:grid-cols-4">
          <Column title="Index">
            {INDEX.map((l) => (
              <a key={l.href} href={l.href} className={linkClass}>
                {l.label}
              </a>
            ))}
          </Column>
          <Column title="Elsewhere">
            {ELSEWHERE.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {l.label} ↗
              </a>
            ))}
          </Column>
          <Column title="Colophon">
            <p className="text-ink-muted">
              Built with React, three.js &amp; GSAP. Set in Space Grotesk, Archivo &amp; Newsreader.
            </p>
            <p className="font-mono text-[11px] text-ink-muted">Last build · {__BUILD_DATE__}</p>
          </Column>
          <Column title="Local time">
            <LocalTime className="text-ink" />
            <button
              type="button"
              onClick={toTop}
              className="group mt-4 flex items-center gap-2 text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Back to top
              <ArrowUp size={15} aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-1" />
            </button>
          </Column>
        </div>

        {/* Oversized wordmark — sized to exactly fill the container; letters rise in on enter */}
        <div ref={fitBox} className="mt-16 overflow-hidden pb-[0.02em] sm:mt-20" aria-hidden="true">
          <motion.p
            ref={fitText}
            className="inline-block select-none whitespace-nowrap pr-[0.06em] font-display font-medium leading-[0.8] tracking-[-0.055em] text-ink"
            style={{ fontSize: 100 }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
            variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          >
            {Array.from(WORDMARK).map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                className="inline-block"
                variants={{ hidden: { y: "100%" }, show: { y: "0%", transition: { duration: 1.1, ease: EASE_OUT } } }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-ink/15 py-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Md Azharuddin. All rights reserved.</p>
          <p>Designed &amp; engineered by hand</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
