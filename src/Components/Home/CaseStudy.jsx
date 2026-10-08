import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Button } from "../ui/Button";

export const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Skip choreography when the user prefers reduced motion or nobody can see it (hidden tab):
// state changes must never wait on animation frames that will not render.
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden;

/** The card image this case study expands from / collapses back into. */
const originFor = (index) => document.querySelector(`[data-project-img="${index}"]`);

/**
 * clip-path inset() that crops a full-bleed box down to `rect` (the card image on screen).
 * Returns null when the card is off-screen, in which case we cross-fade instead.
 */
function clipFrom(rect, box) {
  if (!rect || rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) return null;
  const top = Math.max(0, rect.top - box.top);
  const right = Math.max(0, box.right - rect.right);
  const bottom = Math.max(0, box.bottom - rect.bottom);
  const left = Math.max(0, rect.left - box.left);
  return `inset(${top}px ${right}px ${bottom}px ${left}px round 2px)`;
}

/**
 * Full-screen case study with a shared-element entrance: the project image grows out of the
 * exact rectangle of the card that was clicked (clip-path, so object-fit:cover never distorts),
 * and shrinks back into it on close. Accessible modal: focus moved in/out, page behind made inert.
 */
export const CaseStudy = forwardRef(function CaseStudy({ project, index, total, onRequestClose, onClosed, onNext }, ref) {
  const root = useRef(null);
  const backdrop = useRef(null);
  const media = useRef(null);
  const image = useRef(null);
  const closeBtn = useRef(null);
  const firstRender = useRef(true);
  const busy = useRef(false);

  // ---- open -------------------------------------------------------------------------------
  useLayoutEffect(() => {
    const origin = originFor(index);
    const appRoot = document.getElementById("root");
    appRoot?.setAttribute("inert", "");
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";

    const reveal = root.current.querySelectorAll("[data-cs-reveal]");
    const clip = !reducedMotion() && clipFrom(origin?.getBoundingClientRect(), media.current.getBoundingClientRect());
    // Focus moves into the dialog immediately — keyboard/AT users never wait on decoration.
    closeBtn.current?.focus({ preventScroll: true });
    const tl = gsap.timeline();

    if (clip) {
      origin.style.visibility = "hidden";
      tl.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
        .fromTo(media.current, { clipPath: clip }, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: 0.9, ease: "expo.inOut" }, 0)
        .fromTo(image.current, { scale: 1.12 }, { scale: 1, duration: 1.3, ease: "expo.out" }, 0)
        .fromTo(reveal, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 }, 0.5);
    } else {
      tl.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: reducedMotion() ? 0 : 0.35 });
    }

    return () => {
      tl.kill();
      appRoot?.removeAttribute("inert");
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      const o = originFor(index);
      if (o) o.style.visibility = "";
    };
    // Mount-only: switching projects inside the overlay is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- switch to another project while open ---------------------------------------------------
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    root.current.scrollTop = 0;
    if (reducedMotion()) return;
    gsap.fromTo(image.current, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.9, ease: "expo.out" });
    gsap.fromTo(root.current.querySelectorAll("[data-cs-reveal]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.05 });
  }, [index]);

  // ---- close (called by the parent so history/back-button stay the single source of truth) ----
  const close = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    const origin = originFor(index);
    const done = () => {
      if (origin) origin.style.visibility = "";
      // Lift inert *before* restoring focus — elements inside an inert subtree can't take focus.
      document.getElementById("root")?.removeAttribute("inert");
      origin?.closest("button")?.focus({ preventScroll: true });
      onClosed();
    };
    if (reducedMotion()) {
      done();
      return;
    }
    // 1) fade the copy and return to the top, 2) collapse the image back into its card.
    const tl = gsap.timeline();
    tl.to(root.current.querySelectorAll("[data-cs-reveal]"), { opacity: 0, y: 16, duration: 0.25, ease: "power2.in" }, 0);
    if (root.current.scrollTop > 0) tl.to(root.current, { scrollTop: 0, duration: 0.4, ease: "power2.inOut" }, 0);
    tl.add(() => {
      const clip = clipFrom(origin?.getBoundingClientRect(), media.current.getBoundingClientRect());
      if (!clip) {
        gsap.to(root.current, { opacity: 0, duration: 0.3, onComplete: done });
        return;
      }
      if (origin) origin.style.visibility = "hidden";
      gsap
        .timeline({ onComplete: done })
        .to(media.current, { clipPath: clip, duration: 0.75, ease: "expo.inOut" }, 0)
        .to(image.current, { scale: 1.1, duration: 0.75, ease: "expo.inOut" }, 0)
        .to(backdrop.current, { opacity: 0, duration: 0.45, ease: "power2.in" }, 0.3);
    });
  }, [index, onClosed]);

  useImperativeHandle(ref, () => ({ close }), [close]);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onRequestClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onRequestClose]);

  const pad = (n) => String(n).padStart(2, "0");

  return createPortal(
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cs-title"
      data-lenis-prevent
      className="fixed inset-0 z-[1200] overflow-y-auto overscroll-contain text-ink"
    >
      <div ref={backdrop} className="fixed inset-0 bg-canvas" aria-hidden="true" />

      {/* Top bar */}
      <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <p className="rounded-full bg-canvas/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted backdrop-blur-md">
          Case study <span className="text-ink">{pad(index + 1)}</span> / {pad(total)}
        </p>
        <button
          ref={closeBtn}
          type="button"
          onClick={onRequestClose}
          aria-label="Close case study"
          data-cursor-label="Close"
          className="grid h-12 w-12 place-items-center rounded-full bg-ink text-canvas transition-transform duration-500 ease-out-expo hover:rotate-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="relative">
        {/* Shared-element media */}
        <div ref={media} className="relative h-[56vh] w-full overflow-hidden bg-surface sm:h-[76vh]">
          <img ref={image} src={project.img} alt={`${project.name} interface`} className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <article className="container mx-auto px-4 pb-24 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 border-t border-ink/15 pt-6">
            <p data-cs-reveal className="col-span-12 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted md:col-span-3">
              Project {pad(index + 1)}
            </p>
            <div className="col-span-12 md:col-span-9">
              <h2 id="cs-title" data-cs-reveal className="font-display text-[clamp(2.75rem,8vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.045em]">
                {project.name}
              </h2>
              <p data-cs-reveal className="mt-8 max-w-2xl font-display text-[clamp(1.25rem,2.2vw,1.9rem)] leading-[1.3] tracking-[-0.015em] text-ink">
                {project.description}
              </p>
            </div>

            <dl data-cs-reveal className="col-span-12 grid grid-cols-2 border-t border-ink/15 font-mono text-[11px] uppercase tracking-[0.14em] md:col-span-9 md:col-start-4 md:grid-cols-3">
              <div className="border-b border-ink/15 py-4 pr-4">
                <dt className="text-ink-muted">Stack</dt>
                <dd className="mt-2 normal-case tracking-normal text-ink">{project.tech.join(" · ")}</dd>
              </div>
              <div className="border-b border-ink/15 py-4 pr-4">
                <dt className="text-ink-muted">Status</dt>
                <dd className="mt-2 flex items-center gap-2 text-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-fill" /> Live
                </dd>
              </div>
              <div className="col-span-2 border-b border-ink/15 py-4 md:col-span-1">
                <dt className="text-ink-muted">URL</dt>
                <dd className="mt-2 truncate normal-case tracking-normal text-ink">{project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</dd>
              </div>
            </dl>

            <div data-cs-reveal className="col-span-12 md:col-span-9 md:col-start-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">Overview</p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">{project.extended}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button as="a" href={project.url} target="_blank" rel="noopener noreferrer" data-cursor-label="Open">
                  Visit live site <ArrowUpRight size={16} aria-hidden="true" />
                </Button>
                {total > 1 && (
                  <Button type="button" variant="secondary" onClick={onNext}>
                    Next project <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>,
    document.body,
  );
});
