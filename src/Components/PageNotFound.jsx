import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ScrambleText } from "./interactive/ScrambleText";
import { markReady } from "../lib/preloader";

const ROUTES = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Capabilities" },
  { href: "/#project", label: "Selected work" },
  { href: "/#contact", label: "Contact" },
];

/** 404 in the site's editorial system: the missing path, a giant scrambling "404", and real exits. */
function PageNotFound() {
  const [path, setPath] = useState("");
  useEffect(() => {
    setPath(window.location.pathname);
    // No WebGL scene on this route — release the boot screen as soon as we've mounted.
    markReady("app");
    markReady("scene");
    document.title = "404 — Md Azharuddin";
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-canvas px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
        <a href="/" className="text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          Md Azharuddin
        </a>
        <span>Error 404</span>
      </div>

      <div className="grid flex-1 grid-cols-12 items-end gap-x-6 gap-y-12 py-16">
        <div className="col-span-12 lg:col-span-7">
          <p className="font-display text-[clamp(7rem,26vw,22rem)] font-medium leading-[0.8] tracking-[-0.06em]" aria-hidden="true">
            <ScrambleText text="404" duration={900} />
          </p>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1] tracking-[-0.035em]">
            This page <em className="font-serif font-normal italic text-brand">doesn&apos;t exist.</em>
          </h1>
          <p className="mt-5 text-ink-muted">
            Nothing lives at <code className="rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-sm text-ink">{path || "/"}</code>. It may have moved, or the link had a typo.
          </p>

          <ul className="mt-10 border-t border-ink/15">
            {ROUTES.map((r) => (
              <li key={r.href} className="border-b border-ink/15">
                <a
                  href={r.href}
                  className="group flex items-center justify-between py-4 text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {r.label}
                  <span className="font-mono text-[11px] text-ink-muted transition-transform duration-500 group-hover:translate-x-1">→</span>
                </a>
              </li>
            ))}
          </ul>

          <a
            href="/"
            className="mt-10 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-canvas transition-colors hover:bg-brand-fill hover:text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Back to home
          </a>
        </div>
      </div>
    </main>
  );
}

export default PageNotFound;
