import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

export function Dialog({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1200] flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          <button className="absolute inset-0 cursor-default bg-slate-950/80 backdrop-blur-md" onClick={onClose} aria-label="Close project detail" />
          <motion.div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl border border-white/10 bg-slate-950 p-5 text-white shadow-2xl"
            initial={{ y: 28, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 18, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 id="dialog-title" className="text-2xl font-black">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
