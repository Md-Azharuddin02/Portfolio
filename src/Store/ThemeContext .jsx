import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem("portfolio-theme");
        if (savedTheme) return savedTheme === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
    const [active, setActive] = useState('home');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    const handleTheamChange = () => {
        setIsDark(!isDark);
    };


const theme = {
  themeColor: isDark
    ? "bg-[#070A12] text-white"
    : "bg-[#F7F7F2] text-slate-950",

  shadow: isDark
    ? "bg-white/10 border-white/15"
    : "bg-slate-950/5 border-slate-950/10",

  // Accent pill (e.g. "EXPERIENCED FULL-STACK DEVELOPER")
  pill: isDark
    ? "bg-cyan-300/10 text-cyan-300 border border-cyan-300/20"
    : "bg-cyan-500/10 text-cyan-700 border border-cyan-600/20",

  // Tab states
  tabActive: isDark
    ? "bg-cyan-400 text-slate-950"
    : "bg-cyan-500 text-white shadow-md shadow-cyan-500/20",

  tabInactive: isDark
    ? "text-slate-400 hover:text-white"
    : "text-slate-500 hover:text-slate-900",

  // Muted text (subheads, captions)
  muted: isDark ? "text-slate-400" : "text-slate-600",
};


    const handleSetActive = (e) => {
        setActive(e.target.name);
    };

    const handleMenuBar = (next) => {
        setIsOpen((current) => (typeof next === "boolean" ? next : !current));
    };

    return (
        <ThemeContext.Provider
            value={{
                isDark,
                handleTheamChange,
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
