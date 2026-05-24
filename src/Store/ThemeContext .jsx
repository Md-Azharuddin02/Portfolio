import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem("portfolio-theme");
        return savedTheme ? savedTheme === "dark" : true;
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
        themeColor: isDark ? 'bg-[#070A12] text-white' : 'bg-[#F7F7F2] text-slate-950',
        shadow: isDark ? "bg-white/10 border-white/15" : 'bg-slate-950/5 border-slate-950/10'
    };

    const handleSetActive = (e) => {
        setActive(e.target.name);
    };

    const handleMenuBar = () => {
        setIsOpen(!isOpen);
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
