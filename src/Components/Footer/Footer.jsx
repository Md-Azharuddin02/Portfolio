import React, { useContext } from 'react';
import { FaArrowUp, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { ThemeContext } from '../../Store/ThemeContext ';

const SOCIAL_LINKS = [
  { Icon: FaGithub,   href: "https://github.com/Md-Azharuddin02",          label: "GitHub"   },
  { Icon: FaLinkedin, href: "https://www.linkedin.com/in/mdazharuddin02/",  label: "LinkedIn" },
  { Icon: FaTwitter,  href: "https://x.com/Md_Azharuddin02",               label: "Twitter"  },
];

const Footer = () => {
  const { isDark } = useContext(ThemeContext);

  const handleScrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className={`
      w-full
      ${isDark
        ? 'bg-[#070A12]/95 border-white/10'
        : 'bg-[#F7F7F2]/95 border-slate-200/60'
      }
    `}>

      {/* ── Top section ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

          {/* Brand blurb */}
          <div className="max-w-xs">
            <p className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Azhar<span className="text-cyan-500">.</span>
            </p>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Building modern web experiences, scalable APIs, and automation workflows with React, Node.js, and cloud-native tooling.
            </p>
          </div>
          {/* Social links */}
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-3
              ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Connect
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`
                    w-9 h-9 rounded-lg flex items-center justify-center
                    transition-all duration-200
                    hover:scale-110 hover:text-cyan-500
                    border
                    ${isDark
                      ? 'border-white/10 text-slate-400 hover:border-cyan-400/40 hover:bg-cyan-400/5'
                      : 'border-slate-200 text-slate-500 hover:border-cyan-700/30 hover:bg-cyan-50'
                    }
                  `}
                >
                  <Icon className="text-base" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div className={`h-px mx-4 sm:mx-6 lg:mx-8 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

      {/* ── Bottom bar ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">

          <p className={`text-xs text-center sm:text-left ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            © {new Date().getFullYear()}{' '}
            <span className="text-cyan-500 font-medium">Md Azharuddin</span>
            {' '}— All Rights Reserved.
          </p>

          <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            Built with React, Tailwind CSS, and automation-first thinking
          </p>

          {/* Scroll to top */}
          <button
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
            className={`
              w-9 h-9 rounded-lg flex items-center justify-center
              bg-cyan-400 hover:bg-cyan-300
              text-slate-950 shadow-md
              transition-all duration-300
              hover:scale-110 hover:-translate-y-0.5 hover:shadow-cyan-500/30 hover:shadow-lg
              active:scale-95
              group
            `}
          >
            <FaArrowUp className="text-sm transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>

        </div>
      </div>

    </footer>
  );
};

export default Footer;
