import React, { useRef, useContext } from "react";
import { ThemeContext } from "../../Store/ThemeContext ";
import vivek       from "../../assets/people/Vivek.jfif";
import saurabh     from "../../assets/people/saurabh.jfif";
import simran      from "../../assets/people/Simran.jfif";
import shruthi     from "../../assets/people/one.jpg";
import SaurabhRay  from "../../assets/people/SaurabhRay.jpeg";
import ChandanPrakash from "../../assets/people/ChandanPrakash.webp";

const TESTIMONIALS = [
  { id: 1, name: "Vivek Kumar Mishra",  role: "Senior Software Engineer",          image: vivek,          text: "Working with him has been a pleasure. His attention to detail, strong problem-solving skills, and commitment to quality make him a reliable and valuable team member." },
  { id: 2, name: "Simran Bharti",       role: "Automation Tester",                 image: simran,         text: "One of the most dedicated developers I've worked with. Their ability to grasp complex requirements is impressive." },
  { id: 3, name: "Saurabh Sharma",      role: "Software Engineer",                 image: saurabh,        text: "An exceptional team player with strong technical skills. They brought innovative ideas to every project." },
  { id: 4, name: "Faznah Mehrin",       role: "Scrum Master",                      image: shruthi,        text: "Great collaboration skills and attention to design details. They understand both aesthetics and functionality." },
  { id: 5, name: "Saurabh Ray",         role: "Application Support Engineer",      image: SaurabhRay,     text: "Worked with Azhar for 2 years — adaptable, hardworking, and eager to learn. He consistently delivers his best and collaborates effectively." },
  { id: 6, name: "Chandan Prakash",     role: "Software Engineer",                 image: ChandanPrakash, text: "I've worked with Md Azharuddin for 2+ years. He's hardworking, dependable, and eager to learn. A great team player who communicates well." },
];

function TestimonialCard({ t, isDark }) {
  return (
    <div className={`
      flex-shrink-0
      w-[260px] sm:w-[300px] md:w-[340px] lg:w-[380px]
      h-[200px] sm:h-[210px] md:h-[220px]
      rounded-[1.35rem] border
      flex flex-col justify-between
      p-4 sm:p-5
      transition-all duration-300
      ${isDark
        ? "bg-white/[0.045] border-white/10 hover:bg-white/[0.07]"
        : "bg-white border-slate-200 hover:shadow-lg"
      }
      shadow-[0_2px_20px_rgba(0,0,0,0.07)]
    `}>
      {/* Top: quote + text */}
      <div className="flex flex-col gap-2">
        <span className="text-cyan-400/50 text-3xl font-serif leading-none select-none">"</span>
        <p className={`text-xs sm:text-sm leading-relaxed italic line-clamp-4
          ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          {t.text}
        </p>
      </div>

      {/* Bottom: divider + person */}
      <div className="flex flex-col gap-3 mt-2">
        <div className={`h-px ${isDark ? "bg-white/10" : "bg-slate-100"}`} />
        <div className="flex items-center gap-3">
          <img
            src={t.image}
            alt={t.name}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-cyan-400/40 shrink-0"
          />
          <div className="min-w-0">
            <p className={`font-semibold text-xs sm:text-sm truncate
              ${isDark ? "text-white" : "text-slate-950"}`}>
              {t.name}
            </p>
            <p className="text-cyan-500 text-[11px] sm:text-xs truncate">{t.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Testimonial() {
  const { theme, isDark } = useContext(ThemeContext);
  const trackRef = useRef(null);

  const pause  = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "paused"; };
  const resume = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "running"; };

  // Duplicate for seamless loop
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <>
      <style>{`
        @keyframes testimonialScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .testimonial-track {
          animation: testimonialScroll ${TESTIMONIALS.length * 5}s linear infinite;
        }
      `}</style>

      <section
        id="testimonials"
        className={`w-full ${theme?.themeColor} md:py-12 sm:py-4 lg:py-12 overflow-hidden`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-10 sm:mb-12">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold
              ${isDark ? "text-white" : "text-slate-950"}`}>
              Team <span className="text-cyan-400">Endorsements</span>
            </h2>
            <p className={`mt-3 text-sm sm:text-base
              ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              What my colleagues say about working with me
            </p>
          </div>
        </div>

        {/* Scroll strip — contained to same width as the projects grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
            }}
          >
            <div
              ref={trackRef}
              className="testimonial-track flex items-stretch gap-4 sm:gap-5 lg:gap-6 w-max"
              onMouseEnter={pause}
              onMouseLeave={resume}
              onTouchStart={pause}
              onTouchEnd={resume}
            >
              {doubled.map((t, i) => (
                <TestimonialCard key={`${t.id}-${i}`} t={t} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Testimonial;
