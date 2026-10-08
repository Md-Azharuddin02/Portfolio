import React, { createContext, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export const ThemeContext = createContext(null);

function applyThemeClass(dark) {
    document.documentElement.classList.toggle("dark", dark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0D0D0C" : "#F1EFE9");
}

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        try {
            const savedTheme = localStorage.getItem("portfolio-theme");
            if (savedTheme) return savedTheme === "dark";
        } catch {
            /* storage unavailable — fall through to system preference */
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
    const [active, setActive] = useState('home');
    const [isOpen, setIsOpen] = useState(false);
    const transitionRef = useRef(null);

    // The class must change in the same commit as React state (layout effect, not a passive effect),
    // otherwise the browser paints a frame — and the view transition snapshots it — with stale colours.
    useLayoutEffect(() => {
        applyThemeClass(isDark);
    }, [isDark]);

    useEffect(() => {
        try {
            localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
        } catch {
            /* ignore */
        }
    }, [isDark]);

    /**
     * Toggle theme with a circular reveal from `origin` ({x, y} in viewport px).
     * Falls back to an instant switch without View Transitions or with reduced motion.
     * A rapid second toggle skips the in-flight transition so state never lags the UI.
     */
    const toggleTheme = useCallback((origin) => {
        const html = document.documentElement;
        // Freeze every CSS colour transition for the swap: otherwise text/borders fade at their own
        // speeds while the background flips instantly, producing unreadable in-between frames.
        html.classList.add("theme-switching");
        const unfreeze = () => requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove("theme-switching")));
        // Flip the DOM class *and* React state synchronously inside the update callback.
        const flip = () => {
            const next = !html.classList.contains("dark");
            applyThemeClass(next);
            flushSync(() => setIsDark(next));
        };

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // View Transitions refuse to run in hidden tabs; fall back to an instant (still frozen) swap.
        if (!document.startViewTransition || reduced || document.hidden) {
            flip();
            unfreeze();
            return;
        }

        // A rapid second click finishes the in-flight reveal instantly before starting the next.
        transitionRef.current?.skipTransition();
        const x = origin?.x ?? window.innerWidth / 2;
        const y = origin?.y ?? 0;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        html.style.setProperty("--vt-x", `${x}px`);
        html.style.setProperty("--vt-y", `${y}px`);
        html.style.setProperty("--vt-r", `${radius}px`);

        const transition = document.startViewTransition(flip);
        transitionRef.current = transition;
        // Skipped/aborted transitions reject these promises; that is expected, never an app error.
        transition.ready.catch(() => {});
        transition.updateCallbackDone.catch(() => {});
        transition.finished.catch(() => {}).finally(() => {
            if (transitionRef.current === transition) transitionRef.current = null;
            unfreeze();
        });
    }, []);

    const handleSetActive = useCallback((e) => {
        setActive(e.target.name);
    }, []);

    const handleMenuBar = useCallback((next) => {
        setIsOpen((current) => (typeof next === "boolean" ? next : !current));
    }, []);

    const theme = { themeColor: "bg-canvas text-ink", muted: "text-ink-muted" };

    return (
        <ThemeContext.Provider
            value={{
                isDark,
                toggleTheme,
                handleTheamChange: toggleTheme,
                active,
                handleSetActive,
                isOpen,
                handleMenuBar,
                theme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
