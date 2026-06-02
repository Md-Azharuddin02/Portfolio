import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { ThemeContext } from "../../Store/ThemeContext ";
import projects from "./projectsData";
import { Dialog } from "../../components/ui/Dialog";
import { TiltCard } from "../interactive/TiltCard";
import { MagneticButton } from "../interactive/MagneticButton";
import { Button } from "../../components/ui/Button";
import { fadeUp, staggerContainer } from "../../lib/motion";

function Project() {
  const { theme, isDark } = useContext(ThemeContext);
  const [selected, setSelected] = useState(null);

  return (
    <section
      id="project"
      aria-labelledby="projects-title"
      className={`relative overflow-hidden py-20 sm:py-24 ${theme?.themeColor}`}
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />  
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]"
              : "bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)]"
          } bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]`}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Heading */}
          <motion.div variants={fadeUp} className="mx-auto mb-12 max-w-3xl text-center">
            <div
              className={`mx-auto mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold tracking-[0.2em] uppercase ${
                isDark
                  ? "border-white/10 bg-white/5 text-cyan-200"
                  : "border-slate-200 bg-white/80 text-cyan-700 shadow-sm"
              }`}
            >
              <Sparkles size={14} />
              Featured Projects
            </div>

            <h2
              id="projects-title"
              className={`text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              Selected{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                Work
              </span>
            </h2>

            <p
              className={`mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Product facing builds with modern UI, APIs, immersive interactions,
              and real deployment surfaces designed to feel sharp, fast, and memorable.
            </p>
          </motion.div>

          {/* Project grid */}
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {projects.map((project, idx) => (
              <motion.article key={project.name} variants={fadeUp}>
                <TiltCard className="h-full" max={8}>
                  <button
                    type="button"
                    onClick={() => setSelected(project)}
                    className={`group relative h-full w-full overflow-hidden rounded-[28px] border text-left transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      isDark
                        ? "border-white/10 bg-white/[0.05] shadow-[0_10px_40px_rgba(0,0,0,0.28)] hover:border-cyan-300/30 hover:bg-white/[0.07]"
                        : "border-slate-200/80 bg-white/85 shadow-[0_12px_40px_rgba(15,23,42,0.08)] hover:border-cyan-600/30 hover:shadow-[0_18px_55px_rgba(14,165,233,0.16)]"
                    }`}
                  >
                    {/* Fancy border glow */}
                    <span className="pointer-events-none absolute inset-0 rounded-[28px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(34,211,238,.35),transparent_20%,rgba(168,85,247,.28),transparent_55%,rgba(16,185,129,.25),transparent_80%,rgba(34,211,238,.35))] opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />

                    {/* Shine sweep */}
                    <span className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 blur-md transition duration-700 group-hover:left-[120%] group-hover:opacity-100" />

                    <div className="relative m-px h-full overflow-hidden rounded-[27px]">
                      {/* Image */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <img
                          src={project.img}
                          alt={project.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                        {/* Top badges */}
                        <div className="absolute left-4 top-4 right-4 flex items-center justify-between">
                          <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                            Case Study
                          </span>
                          <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] font-bold text-white/90 backdrop-blur-md">
                            0{idx + 1}
                          </span>
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent opacity-80" />

                        {/* Hover CTA */}
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <div className="translate-y-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950 shadow-lg">
                              Explore Project <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div
                        className={`relative px-5 pb-5 pt-4 ${
                          isDark
                            ? "bg-gradient-to-b from-white/[0.03] to-white/[0.015]"
                            : "bg-gradient-to-b from-white to-slate-50/90"
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h3
                            className={`text-lg font-black tracking-tight ${
                              isDark ? "text-white" : "text-slate-950"
                            }`}
                          >
                            {project.name}
                          </h3>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] ${
                              isDark
                                ? "bg-cyan-400/10 text-cyan-200"
                                : "bg-cyan-50 text-cyan-700"
                            }`}
                          >
                            Featured
                          </span>
                        </div>

                        <p
                          className={`line-clamp-3 text-sm leading-6 ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {project.description}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.tech.map((tech, index) => (
                            <span
                              key={tech}
                              className={`rounded-full px-3 py-1 text-[11px] font-bold transition duration-300 ${
                                isDark
                                  ? "border border-cyan-300/10 bg-cyan-300/10 text-cyan-200 hover:bg-cyan-300/15"
                                  : "border border-cyan-100 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                              }`}
                              style={{ transitionDelay: `${index * 35}ms` }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                </TiltCard>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dialog */}
      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name}
      >
        {selected && (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40">
              <img
                src={selected.img}
                alt={`${selected.name} screenshot`}
                className="h-full min-h-[280px] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-cyan-200">
                <Sparkles size={12} />
                Project Spotlight
              </div>

              <p className="text-sm leading-7 text-slate-300">
                {selected.extended}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {selected.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-cyan-300/10 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <MagneticButton>
                  <Button
                    as="a"
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    Live Site
                    <ExternalLink
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Button>
                </MagneticButton>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </section>
  );
}

export default Project;
