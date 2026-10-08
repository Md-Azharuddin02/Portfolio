import { useEffect, useState } from "react";

/*
 * Bridge to the inline boot screen in index.html (window.__preloader).
 * Components report readiness with markReady(); entrance animations wait for usePreloaderDone().
 */

export function markReady(step) {
  if (typeof window !== "undefined") window.__preloader?.mark(step);
}

export function isPreloaderDone() {
  return typeof window === "undefined" || Boolean(window.__preloaderDoneAt) || !document.getElementById("preloader");
}

/** performance.now() timestamp when the boot screen finished (or now, if it never ran). */
export function preloaderDoneAt() {
  return window.__preloaderDoneAt ?? (isPreloaderDone() ? performance.now() : null);
}

export function onPreloaderDone(callback) {
  if (isPreloaderDone()) {
    callback();
    return () => {};
  }
  window.addEventListener("preloader:done", callback, { once: true });
  return () => window.removeEventListener("preloader:done", callback);
}

export function usePreloaderDone() {
  const [done, setDone] = useState(isPreloaderDone);
  useEffect(() => onPreloaderDone(() => setDone(true)), []);
  return done;
}
