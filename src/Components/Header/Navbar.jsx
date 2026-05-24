import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { BsBrightnessHighFill } from "react-icons/bs";
import { MdDarkMode, MdCancel } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { ThemeContext } from '../../Store/ThemeContext ';

const NAV_ITEMS = ['home', 'skills', 'about', 'automation', 'project', 'contact'];
const NAV_LABELS = {
  home: 'Home',
  skills: 'Skills',
  about: 'About',
  automation: 'Automation',
  project: 'Projects',
  contact: 'Contact',
};
const ID_MAP = {
  home: ['home', 'hero', 'banner'],
  about: ['about', 'about-me'],
  skills: ['skills', 'skill'],
  automation: ['automation', 'workflow', 'automations'],
  project: ['project', 'projects', 'portfolio'],
  contact: ['contact', 'contact-me', 'contactme'],
};

function Navbar() {
  const { isDark, handleTheamChange, active, handleSetActive, isOpen, handleMenuBar } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const indicatorRef = useRef(null);
  const navRef = useRef(null);
  const linkRefs = useRef({});

  const scrollToSection = useCallback((item, e) => {
    e?.preventDefault();

    // home always scrolls to very top
    if (item === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      handleSetActive({ target: { name: item } });
      return;
    }

    // Try each possible id alias until one is found
    const candidates = ID_MAP[item] ?? [item];
    const el = candidates.map((id) => document.getElementById(id)).find(Boolean);

    if (el) {
      const navHeight = document.querySelector('header')?.offsetHeight ?? 70;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    handleSetActive({ target: { name: item } });
  }, [handleSetActive]);

  // Shrink navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => {
      const candidates = ID_MAP[item] ?? [item];
      const element = candidates.map((id) => document.getElementById(id)).find(Boolean);
      return { item, element };
    }).filter(({ element }) => element);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          const match = sections.find(({ element }) => element === visible.target);
          if (match) handleSetActive({ target: { name: match.item } });
        }
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, [handleSetActive]);

  // Slide the active indicator under the correct link
  useEffect(() => {
    const el = linkRefs.current[active];
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;
    const { offsetLeft, offsetWidth } = el;
    indicator.style.left = `${offsetLeft}px`;
    indicator.style.width = `${offsetWidth}px`;
  }, [active]);

  return (
    <header className="sticky top-0 z-[999] w-full">
      <nav
        className={`
          relative w-full z-[1000]
          transition-all duration-300
          ${scrolled
            ? isDark
              ? 'bg-[#070A12]/90 shadow-[0_12px_45px_rgba(0,0,0,0.45)] py-2 border-b border-white/10'
              : 'bg-[#F7F7F2]/90 shadow-[0_12px_45px_rgba(15,23,42,0.08)] py-2 border-b border-slate-900/10'
            : isDark
              ? 'bg-[#070A12]/75 py-4'
              : 'bg-[#F7F7F2]/75 py-4'
          }
          backdrop-blur-xl
        `}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => scrollToSection('home', e)}
              className={`
                text-xl font-black tracking-tight relative z-10
                transition-colors duration-200
                ${isDark ? 'text-white' : 'text-gray-900'}
              `}
            >
              Azhar<span className="text-cyan-500">.</span>
            </a>

            {/* Desktop nav — with sliding underline indicator */}
            <div ref={navRef} className="hidden md:flex items-center gap-1 relative">
              {/* Sliding active underline */}
              <span
                ref={indicatorRef}
                className="absolute bottom-0 h-0.5 bg-cyan-400 rounded-full transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]"
              />

              {NAV_ITEMS.map((item) => (
                <a
                  key={item}
                  ref={(el) => (linkRefs.current[item] = el)}
                  href={`#${item}`}
                  onClick={(e) => scrollToSection(item, e)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    hover:text-cyan-400
                    ${active === item
                      ? 'text-cyan-400'
                      : isDark ? 'text-gray-300' : 'text-gray-600'
                    }
                  `}
                >
                  {NAV_LABELS[item]}
                </a>
              ))}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">

              {/* Theme toggle */}
              {!isOpen && (
                <button
                  onClick={handleTheamChange}
                  aria-label="Toggle theme"
                  className={`
                  p-2 rounded-lg text-xl
                  transition-all duration-200
                  hover:scale-110 active:scale-95
                  ${isDark
                      ? 'text-cyan-300 hover:bg-white/10'
                      : 'text-cyan-700 hover:bg-slate-900/5'
                    }
                `}
                >
                  {isDark ? <BsBrightnessHighFill /> : <MdDarkMode />}
                </button>
              )}


              {/* Hamburger — mobile only */}
              <button
                onClick={handleMenuBar}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
                className={`
                  md:hidden p-2 rounded-lg text-xl
                  transition-all duration-200
                  hover:scale-110 active:scale-95
                  ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-slate-900/5'}
                `}
              >
                {isOpen
                  ? <MdCancel size={22} />
                  : <RxHamburgerMenu size={22} />
                }
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <div
        className={`
          fixed inset-0 md:hidden z-[990]
          transition-all duration-300
          ${isOpen ? 'visible' : 'invisible'}
        `}
      >
        {/* Backdrop */}
        <div
          onClick={handleMenuBar}
          className={`
            absolute inset-0 bg-black/50 backdrop-blur-sm
            transition-opacity duration-300
            ${isOpen ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Slide-in panel */}
        <div className={`
          absolute top-0 right-0 h-full w-72
          ${isDark ? 'bg-[#070A12]' : 'bg-[#F7F7F2]'}
          shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>

          {/* Panel header */}
          <div className={`
            flex items-center justify-between px-6 py-5 border-b
            ${isDark ? 'border-gray-800' : 'border-gray-100'}
          `}>
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Azhar<span className="text-cyan-500">.</span>
            </span>
            <button
              onClick={handleMenuBar}
              className={`p-1.5 rounded-lg ${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <MdCancel size={20} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-4 py-4 gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={(e) => {
                  scrollToSection(item, e);
                  handleMenuBar();
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  text-base font-medium
                  transition-all duration-200
                  ${active === item
                    ? isDark
                      ? 'bg-cyan-300/10 text-cyan-300 border-l-2 border-cyan-400'
                      : 'bg-cyan-50 text-cyan-700 border-l-2 border-cyan-500'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {NAV_LABELS[item]}
                {active === item && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </a>
            ))}
          </nav>

          {/* Bottom theme toggle */}
          <div className={`mt-auto px-6 py-5 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
            <button
              onClick={handleTheamChange}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl
                text-sm font-medium transition-all duration-200
                ${isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
              <span className="text-cyan-500 text-lg">
                {isDark ? <BsBrightnessHighFill /> : <MdDarkMode />}
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;
