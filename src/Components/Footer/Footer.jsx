import React, { useContext } from 'react';
import { FaArrowUp, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { ThemeContext } from '../../Store/ThemeContext ';

const SOCIAL_LINKS = [
  { Icon: FaGithub,   href: "https://github.com/Md-Azharuddin02",          label: "GitHub"   },
  { Icon: FaLinkedin, href: "https://www.linkedin.com/in/mdazharuddin02/",  label: "LinkedIn" },
  { Icon: FaTwitter,  href: "https://x.com/Md_Azharuddin02",               label: "Twitter"  },
];

const NAV_LINKS = ['Home', 'About', 'Skills', 'Project', 'Contact'];

const Footer = () => {
  const { isDark } = useContext(ThemeContext);

  const handleScrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className={`
      w-full
      ${isDark
        ? 'bg-gray-900/90 border-gray-700/30'
        : 'bg-white/90 border-gray-200/60'
      }
    `}>

      {/* ── Top section ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

          {/* Brand blurb */}
          <div className="max-w-xs">
            <p className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Port<span className="text-amber-500">folio</span>
            </p>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Building scalable, user-focused web experiences with modern JavaScript and cloud-native architecture.
            </p>
          </div>
          {/* Social links */}
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-3
              ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
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
                    hover:scale-110 hover:text-amber-500
                    border
                    ${isDark
                      ? 'border-gray-700/60 text-gray-400 hover:border-amber-500/40 hover:bg-amber-500/5'
                      : 'border-gray-200 text-gray-500 hover:border-amber-400/40 hover:bg-amber-50'
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
      <div className={`h-px mx-4 sm:mx-6 lg:mx-8 ${isDark ? 'bg-gray-700/40' : 'bg-gray-200'}`} />

      {/* ── Bottom bar ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">

          <p className={`text-xs text-center sm:text-left ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            © {new Date().getFullYear()}{' '}
            <span className="text-amber-500 font-medium">Md Azharuddin</span>
            {' '}— All Rights Reserved.
          </p>

          <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
            Built with React & Tailwind CSS
          </p>

          {/* Scroll to top */}
          <button
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
            className={`
              w-9 h-9 rounded-lg flex items-center justify-center
              bg-amber-500 hover:bg-amber-600
              text-white shadow-md
              transition-all duration-300
              hover:scale-110 hover:-translate-y-0.5 hover:shadow-amber-500/30 hover:shadow-lg
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