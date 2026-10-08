import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { face } from "@cloudinary/url-gen/qualifiers/focusOn";
import { aboutData } from "../../content/about";
import { Tabs } from "../ui/Tabs";
import { EASE_OUT, staggerContainer } from "../../lib/motion";
import { SectionHeading } from "../ui/SectionHeading";
import { ScrollRevealText } from "../interactive/ScrollRevealText";
import { CountUp } from "../interactive/CountUp";

const cld = new Cloudinary({ cloud: { cloudName: "dqpkciwvo" } });
const portrait = cld.image("Md-Azharuddin").format("auto").quality("auto").resize(fill().width(720).height(900).gravity(focusOn(face())));

const STATEMENT =
  "I turn complex product ideas into fast, reliable software — pixel-precise React interfaces, scalable APIs, cloud delivery on AWS, and LLM features that solve real problems for real users.";

const STATS = [
  { value: "2+", label: "Years shipping production systems" },
  { value: "10K+", label: "Daily API requests served" },
  { value: "99.9%", label: "Uptime on delivered services" },
  { value: "40%", label: "Faster release cycles via CI/CD" },
];

const tabItems = [
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
];

function JourneyRow({ item, index }) {
  const [open, setOpen] = useState(() => index === 0 && window.matchMedia("(min-width: 768px)").matches);
  const panelId = `journey-${item.title.replace(/\W+/g, "-")}-${index}`;

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay: index * 0.06 }}
      className="border-b border-ink/10"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-5 text-left sm:py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:grid-cols-[120px_1fr_auto]"
      >
        <span className="order-2 col-span-2 font-mono text-xs text-ink-muted sm:order-none sm:col-span-1">{item.year}</span>
        <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
          <span className="block font-display text-xl font-medium tracking-tight text-ink sm:text-[1.65rem]">{item.title}</span>
          <span className="mt-1 block text-sm text-ink-muted">{item.institution}</span>
        </span>
        <span
          className={`grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 ${
            open ? "rotate-45 border-ink bg-ink text-canvas" : "border-ink/20 text-ink group-hover:border-ink"
          }`}
        >
          <Plus size={18} aria-hidden="true" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <ul className="space-y-2.5 pb-7 sm:pl-[120px]">
              {item.description.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                  <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-brand" />
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function About() {
  const [activeTab, setActiveTab] = useState("experience");
  const photoRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section id="about" className="relative w-full bg-canvas py-20 text-ink sm:py-32 lg:py-40" aria-labelledby="about-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <SectionHeading id="about-title" index="01" eyebrow="About" title="Engineering with" accent="intent." />
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div ref={photoRef} className="group relative overflow-hidden rounded-sm bg-ink/5" data-cursor-label="Hello">
              <motion.div style={{ scale: photoScale, y: photoY }}>
                <AdvancedImage
                  cldImg={portrait}
                  alt="Portrait of Md Azharuddin"
                  width="720"
                  height="900"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover object-[50%_20%] grayscale transition-[filter] duration-1000 ease-out-expo group-hover:grayscale-0 sm:aspect-[4/5]"
                />
              </motion.div>
            </div>
            <div className="mt-4 flex items-start justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              <span>
                Fig. 01 — Md Azharuddin
                <br />
                Full-stack developer
              </span>
              <span className="text-right">
                B.Tech CSE
                <br />
                2+ yrs in production
              </span>
            </div>
          </div>

          <div>
            <ScrollRevealText
              text={STATEMENT}
              className="font-display text-[clamp(1.6rem,3vw,2.75rem)] font-normal leading-[1.18] tracking-[-0.025em] text-ink"
            />

            <dl className="mt-10 grid grid-cols-2 border-t border-ink/15 sm:mt-16">
              {STATS.map((stat) => (
                <div key={stat.label} className="border-b border-ink/15 py-5 pr-4 [&:nth-child(even)]:pl-5 [&:nth-child(odd)]:border-r sm:py-9 sm:[&:nth-child(even)]:pl-6">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <CountUp value={stat.value} className="block font-display text-4xl font-medium tracking-[-0.04em] text-ink sm:text-6xl" />
                    <span className="mt-2 block text-sm text-ink-muted">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-12 sm:mt-16">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">Journey</p>
                <Tabs tabs={tabItems} active={activeTab} onChange={setActiveTab} />
              </div>
              <ul key={activeTab} className="border-t border-ink/10">
                {aboutData[activeTab].map((item, index) => (
                  <JourneyRow key={`${activeTab}-${item.title}`} item={item} index={index} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
