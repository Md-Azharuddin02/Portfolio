import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Copy, Download, LayoutGrid as GridIcon, Moon, Search, Sun } from "lucide-react";
import { TOGGLE_GRID_EVENT } from "./LayoutGrid";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { ThemeContext } from "../../Store/ThemeContext ";
import resume from "../../assets/MdAzharuddinFullStackResume.pdf";
import { EASE_OUT } from "../../lib/motion";

export const OPEN_PALETTE_EVENT = "open-command-palette";
const EMAIL = "mdazharuddin02@gmail.com";

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
};

/** ⌘K / Ctrl+K command menu: jump to sections, switch theme, copy email, grab the résumé. */
export function CommandPalette() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef(null);
  const returnFocus = useRef(null);

  const commands = useMemo(
    () => [
      { id: "about", group: "Navigate", label: "About", Icon: ArrowRight, run: () => scrollToId("about") },
      { id: "skills", group: "Navigate", label: "Capabilities", Icon: ArrowRight, run: () => scrollToId("skills") },
      { id: "work", group: "Navigate", label: "Selected work", Icon: ArrowRight, run: () => scrollToId("project") },
      { id: "kind", group: "Navigate", label: "Kind words", Icon: ArrowRight, run: () => scrollToId("testimonials") },
      { id: "contact", group: "Navigate", label: "Contact", Icon: ArrowRight, run: () => scrollToId("contact") },
      {
        id: "theme",
        group: "Actions",
        label: isDark ? "Switch to light theme" : "Switch to dark theme",
        Icon: isDark ? Sun : Moon,
        run: () => toggleTheme({ x: window.innerWidth / 2, y: window.innerHeight / 2 }),
      },
      {
        id: "grid",
        group: "Actions",
        label: "Toggle layout grid (G)",
        Icon: GridIcon,
        run: () => window.dispatchEvent(new Event(TOGGLE_GRID_EVENT)),
      },
      {
        id: "copy",
        group: "Actions",
        label: "Copy email address",
        Icon: Copy,
        run: async () => {
          try {
            await navigator.clipboard.writeText(EMAIL);
            setToast("Email copied");
          } catch {
            setToast(EMAIL);
          }
        },
      },
      {
        id: "cv",
        group: "Actions",
        label: "Download résumé",
        Icon: Download,
        run: () => {
          const a = document.createElement("a");
          a.href = resume;
          a.download = "MdAzharuddin-Resume.pdf";
          a.click();
        },
      },
      { id: "gh", group: "Elsewhere", label: "GitHub", Icon: FaGithub, run: () => window.open("https://github.com/Md-Azharuddin02", "_blank", "noopener") },
      { id: "li", group: "Elsewhere", label: "LinkedIn", Icon: FaLinkedin, run: () => window.open("https://www.linkedin.com/in/mdazharuddin02/", "_blank", "noopener") },
    ],
    [isDark, toggleTheme],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  const show = useCallback(() => {
    returnFocus.current = document.activeElement;
    setQuery("");
    setIndex(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open ? close() : show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
    };
  }, [open, show, close]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const runAt = (i) => {
    const cmd = results[i];
    if (!cmd) return;
    close();
    // Let the dialog unmount before scrolling / opening windows.
    window.setTimeout(() => cmd.run(), 60);
  };

  const onInputKey = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((i) => (i + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      runAt(index);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  let lastGroup = "";

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[1600] flex items-start justify-center px-4 pt-[14vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
            <button type="button" aria-label="Close command menu" className="absolute inset-0 cursor-default bg-canvas/70 backdrop-blur-sm" onClick={close} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-ink/15 bg-surface text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]"
              initial={{ y: -12, scale: 0.98 }}
              animate={{ y: 0, scale: 1, transition: { duration: 0.35, ease: EASE_OUT } }}
              exit={{ y: -8, scale: 0.98, transition: { duration: 0.15 } }}
            >
              <div className="flex items-center gap-3 border-b border-ink/10 px-4">
                <Search size={16} className="text-ink-muted" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIndex(0);
                  }}
                  onKeyDown={onInputKey}
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="cmdk-list"
                  aria-activedescendant={results[index] ? `cmdk-${results[index].id}` : undefined}
                  placeholder="Type a command or search…"
                  className="h-14 flex-1 bg-transparent text-base placeholder:text-ink-muted focus:outline-none"
                />
                <kbd className="rounded border border-ink/15 px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">ESC</kbd>
              </div>
              <ul id="cmdk-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
                {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-ink-muted">No results for “{query}”</li>}
                {results.map((cmd, i) => {
                  const header = cmd.group !== lastGroup ? cmd.group : null;
                  lastGroup = cmd.group;
                  return (
                    <React.Fragment key={cmd.id}>
                      {header && <li role="presentation" className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">{header}</li>}
                      <li
                        id={`cmdk-${cmd.id}`}
                        role="option"
                        aria-selected={i === index}
                        onMouseMove={() => setIndex(i)}
                        onClick={() => runAt(i)}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${i === index ? "bg-ink text-canvas" : "text-ink"}`}
                      >
                        <cmd.Icon size={15} aria-hidden="true" className={i === index ? "" : "text-ink-muted"} />
                        <span className="flex-1">{cmd.label}</span>
                        {i === index && <span className="font-mono text-[10px] opacity-70">↵</span>}
                      </li>
                    </React.Fragment>
                  );
                })}
              </ul>
              <div className="flex items-center justify-between border-t border-ink/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                <span>↑↓ navigate · ↵ select</span>
                <span>⌘K toggle</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.p
            role="status"
            className="fixed bottom-6 left-1/2 z-[1600] -translate-x-1/2 rounded-full bg-ink px-4 py-2 font-mono text-xs text-canvas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}
