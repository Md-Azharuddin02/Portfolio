import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { ThemeContext } from "../../Store/ThemeContext ";
import { MagneticButton } from "../interactive/MagneticButton";

const socials = [
  { Icon: FaGithub, href: "https://github.com/Md-Azharuddin02", label: "GitHub" },
  { Icon: FaLinkedin, href: "https://www.linkedin.com/in/mdazharuddin02/", label: "LinkedIn" },
  { Icon: FaTwitter, href: "https://x.com/Md_Azharuddin02", label: "Twitter" },
];

const footerLinks = [
  { href: "#home", label: "Home" },
  { href: "#skills", label: "Skills" },
  { href: "#project", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

function Footer() {
  const { isDark } = useContext(ThemeContext);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className={`w-full border-t ${isDark ? "border-white/10 bg-[#070A12]/95" : "border-slate-200/60 bg-[#F7F7F2]/95"}`}>
      <div className="container mx-auto px-4 pb-6 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <p className={`mb-2 text-xl font-black ${isDark ? "text-white" : "text-slate-950"}`}>Azhar<span className="text-cyan-400">.</span></p>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Full Stack Developer with 2+ years of experience building high performance web apps, scalable APIs, and AI integrated features using React, Next.js, Node.js, FastAPI, and AWS.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`group relative text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-950"}`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-cyan-300 transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div>
            <p className={`mb-3 text-xs font-bold uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>Connect</p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <MagneticButton key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`grid h-10 w-10 place-items-center rounded-full border transition hover:scale-110 hover:text-cyan-300 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isDark ? "border-white/10 text-slate-400 hover:border-cyan-400/40 hover:bg-cyan-400/5" : "border-slate-200 text-slate-500 hover:border-cyan-700/30 hover:bg-cyan-50"
                    }`}
                  >
                    <Icon size={17} />
                  </a>
                </MagneticButton>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`h-px mx-4 sm:mx-6 lg:mx-8 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-center text-xs text-slate-500 sm:text-left">
            © {new Date().getFullYear()} <span className="font-bold text-cyan-400">Md Azharuddin</span> — All Rights Reserved.
          </p>
          <p className="text-center text-xs text-slate-500">Built with React, Next.js, Tailwind CSS, and an AI-first product mindset.</p>
        </div>
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-5 right-5 z-[900] grid h-11 w-11 place-items-center rounded-full bg-cyan-300 text-slate-950 shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.85 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}

export default Footer;
