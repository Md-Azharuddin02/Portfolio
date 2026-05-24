import React, { useContext } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { ThemeContext } from "../../Store/ThemeContext ";
import projects from "./projectsData";

function Project() {
  const { theme, isDark } = useContext(ThemeContext);

  return (
    <section
      id="project"
      className={`${theme?.themeColor} py-12`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold
            ${isDark ? "text-white" : "text-slate-950"}`}>
            Selected <span className="text-cyan-400">Work</span>
          </h2>
          <p className={`mt-3 text-sm sm:text-base
            ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Product-facing builds with modern UI, APIs, and real deployment surfaces
          </p>
        </div>

        {/* Grid — 1 col on mobile, 2 on sm, 3 on lg */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <article
              key={index}
              className={`
                group relative rounded-[1.35rem] overflow-hidden
                border transition-all duration-300
                hover:-translate-y-1 hover:shadow-2xl
                ${isDark
                  ? "border-white/10 bg-white/[0.045] hover:border-cyan-300/35"
                  : "border-slate-200 bg-white hover:border-cyan-700/30 shadow-sm"
                }
              `}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={project.img}
                  alt={project.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className={`
                  absolute inset-0 flex flex-col items-center justify-center gap-3 p-4
                  opacity-0 group-hover:opacity-100
                  transition-all duration-300
                  ${isDark ? "bg-slate-950/88" : "bg-slate-950/78"}
                `}>
                  <p className={`text-center text-xs sm:text-sm leading-relaxed line-clamp-3
                    ${isDark ? "text-slate-300" : "text-slate-100"}`}>
                    {project.description}
                  </p>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.name}`}
                    className="
                      inline-flex items-center gap-2
                      bg-cyan-400 hover:bg-cyan-300
                      text-slate-950 text-xs sm:text-sm font-black
                      px-4 py-2 rounded-full
                      transition-all duration-200 hover:scale-105
                    "
                  >
                    <FaExternalLinkAlt className="text-xs" />
                    View Project
                  </a>
                </div>
              </div>

              {/* Card footer */}
              <div className={`px-4 py-3 sm:px-5 sm:py-4 border-t
                ${isDark ? "border-white/10" : "border-slate-100"}`}>
                <h3 className={`font-semibold text-sm sm:text-base truncate
                  ${isDark ? "text-white" : "text-slate-950"}`}>
                  {project.name}
                </h3>
                {project.tech && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.tech.slice(0, 3).map((t) => (
                      <span key={t} className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full
                        ${isDark ? "bg-cyan-300/10 text-cyan-200" : "bg-cyan-50 text-cyan-700"}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Project;
