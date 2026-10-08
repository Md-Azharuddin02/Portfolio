import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import projects from "./projectsData";
import { CaseStudy, slugify } from "./CaseStudy";
import { EASE_OUT } from "../../lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Horizontal layout only where the pinned scroll actually runs.
const HORIZONTAL =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

function ProjectCard({ project, index, onOpen }) {
  return (
    <article className="project-card group relative w-[84%] shrink-0 snap-start sm:w-[58%] lg:w-[44%] lg:motion-safe:w-[min(58vw,920px)]">
      <button
        type="button"
        onClick={() => onOpen(index)}
        data-cursor-label="Open"
        aria-label={`Open case study: ${project.name}`}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
      >
        <div
          data-project-img={index}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-surface lg:motion-safe:aspect-auto lg:motion-safe:h-[56vh]"
        >
          <img
            src={project.img}
            alt=""
            loading="lazy"
            decoding="async"
            className="project-img h-full w-full scale-110 object-cover grayscale-[60%] transition-[transform,filter] duration-[1.2s] ease-out-expo group-hover:scale-[1.14] group-hover:grayscale-0"
          />
          <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-canvas text-ink transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-brand-fill group-hover:text-on-brand">
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>

        <div className="mt-5 grid grid-cols-12 gap-4 border-t border-ink/15 pt-4">
          <span className="col-span-2 font-mono text-[11px] text-ink-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="col-span-10 sm:col-span-6">
            <h3 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-none tracking-[-0.03em] text-ink">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-out-expo group-hover:bg-[length:100%_1px]">
                {project.name}
              </span>
            </h3>
            <p className="mt-3 line-clamp-2 max-w-md text-sm leading-relaxed text-ink-muted">
              {project.description}
            </p>
          </div>
          <ul className="col-span-12 flex flex-wrap content-start gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted sm:col-span-4 sm:justify-end">
            {project.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
      </button>
    </article>
  );
}

const indexFromHash = () => {
  const match = window.location.hash.match(/^#work\/([\w-]+)$/);
  return match ? projects.findIndex((p) => slugify(p.name) === match[1]) : -1;
};

function Project() {
  const [openIndex, setOpenIndex] = useState(null);
  const openRef = useRef(null);
  openRef.current = openIndex;
  const caseStudy = useRef(null);
  const section = useRef(null);
  const track = useRef(null);

  // History is the source of truth: opening pushes #work/<slug>, so Back closes the case study
  // and the URL is shareable (deep link). Closing from the UI goes through history.back().
  const open = useCallback((index) => {
    window.history.pushState({ caseStudy: true }, "", `#work/${slugify(projects[index].name)}`);
    setOpenIndex(index);
  }, []);

  const requestClose = useCallback(() => {
    if (window.history.state?.caseStudy) window.history.back();
    else caseStudy.current?.close();
  }, []);

  const onClosed = useCallback(() => {
    setOpenIndex(null);
    if (window.location.hash.startsWith("#work/")) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  const next = useCallback(() => {
    const n = (openRef.current + 1) % projects.length;
    window.history.replaceState(window.history.state, "", `#work/${slugify(projects[n].name)}`);
    setOpenIndex(n);
  }, []);

  useEffect(() => {
    // Deep link on load: open without a history entry so "close" never navigates off-site.
    const initial = indexFromHash();
    if (initial >= 0) setOpenIndex(initial);
    const onPop = () => {
      const index = indexFromHash();
      if (index >= 0) setOpenIndex(index);
      else if (openRef.current !== null) caseStudy.current?.close();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(HORIZONTAL, () => {
        const distance = () => track.current.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        // Inner image parallax driven by the horizontal movement.
        gsap.utils.toArray(".project-card").forEach((card) => {
          gsap.fromTo(
            card.querySelector(".project-img"),
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section
      id="project"
      ref={section}
      aria-labelledby="projects-title"
      className="relative overflow-hidden bg-canvas text-ink lg:motion-safe:h-screen"
    >
      <div
        ref={track}
        className="flex flex-col gap-10 px-4 py-20 sm:px-6 sm:py-32 lg:px-8 lg:motion-safe:h-full lg:motion-safe:w-max lg:motion-safe:flex-row lg:motion-safe:items-center lg:motion-safe:gap-14 lg:motion-safe:py-0 lg:motion-safe:pl-[max(2rem,calc((100vw-1400px)/2))] lg:motion-safe:pr-[10vw]"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className="shrink-0 lg:motion-safe:w-[34vw] lg:motion-safe:max-w-[520px]"
        >
          <p className="flex items-baseline gap-3 border-t border-ink/15 pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
            <span className="text-ink">03</span> Selected work
          </p>
          <h2
            id="projects-title"
            className="mt-6 font-display sm:mt-8 text-[clamp(2.5rem,5.4vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.035em]"
          >
            Things I&apos;ve{" "}
            <em className="font-serif font-normal italic text-brand">built</em>{" "}
            and shipped.
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-ink-muted">
            Product-facing builds with modern UI, APIs and real deployment
            surfaces — each one live and in use.
          </p>
          <p className="mt-10 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted lg:motion-safe:flex">
            Scroll to explore <span className="h-px w-16 bg-ink/40" />
          </p>
          <p className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted lg:motion-safe:hidden">
            Swipe <span className="h-px w-10 bg-ink/40" />{" "}
            {String(projects.length).padStart(2, "0")} projects
          </p>
        </motion.div>

        {/* Swipeable rail below lg (or with reduced motion); flattens into the pinned track above it */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:gap-8 lg:scroll-px-8 lg:px-8 lg:motion-safe:contents [&::-webkit-scrollbar]:hidden">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
              onOpen={open}
            />
          ))}

          <a
            href="https://github.com/Md-Azharuddin02"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-label="GitHub"
            className="group flex w-[70%] shrink-0 snap-start flex-col justify-between gap-10 rounded-sm bg-ink p-7 text-canvas transition-colors duration-500 hover:bg-brand-fill hover:text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:w-[40%] sm:p-8 lg:w-[30%] lg:motion-safe:h-[56vh] lg:motion-safe:w-[26vw]"
          >
            <FaGithub size={32} aria-hidden="true" />
            <span className="font-display text-3xl font-medium leading-[1] tracking-[-0.03em] sm:text-4xl">
              More experiments <br /> on{" "}
              <em className="font-serif font-normal italic">GitHub</em>
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]">
              Explore repos{" "}
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </a>
        </div>
      </div>

      {openIndex !== null && (
        <CaseStudy
          ref={caseStudy}
          project={projects[openIndex]}
          index={openIndex}
          total={projects.length}
          onRequestClose={requestClose}
          onClosed={onClosed}
          onNext={next}
        />
      )}
    </section>
  );
}

export default Project;
