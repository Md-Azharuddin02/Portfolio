import React, { useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeContext } from "../../Store/ThemeContext ";
import { aboutData } from "../../content/about";
import { Tabs } from "../../components/ui/Tabs";
import { fadeUp, staggerContainer } from "../../lib/motion";

const tabItems = [
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
];

function InfoCard({ item, isDark, index }) {
  const [expanded, setExpanded] = useState(false);
  const preview = 3;
  const hasMore = item.description.length > preview;
  const visible = expanded
    ? item.description
    : item.description.slice(0, preview);

  return (
    <motion.article
      layout
      variants={{
        hidden: { opacity: 0, x: -28 },
        show: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.55,
            delay: index * 0.06,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={`relative rounded-2xl border p-5 sm:p-6 ${
        isDark
          ? "border-white/10 bg-white/[0.045]"
          : "border-slate-200 bg-white/80 shadow-sm"
      }`}
    >
      <span className="absolute -left-[37px] top-7 hidden h-4 w-4 rounded-full border-4 border-slate-950 bg-cyan-300 shadow-glow md:block" />

      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3
            className={`text-lg font-black ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            {item.title}
          </h3>
          <p
            className={`mt-1 text-sm ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {item.institution}
          </p>
        </div>

        <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-300">
          {item.year}
        </span>
      </div>

      <div className={`mb-4 h-px ${isDark ? "bg-white/10" : "bg-slate-100"}`} />

      <motion.ul layout className="space-y-2">
        <AnimatePresence initial={false}>
          {visible.map((line, lineIndex) => (
            <motion.li
              key={`${item.title}-${lineIndex}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`flex gap-2 text-sm leading-relaxed ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <span className="mt-0.5 shrink-0 text-cyan-300">▸</span>
              <span>{line}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {hasMore && (
        <button
          onClick={() => setExpanded((value) => !value)}
          className="mt-4 text-sm font-bold text-cyan-300 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {expanded ? "Show less" : `Show ${item.description.length - preview} more`}
        </button>
      )}
    </motion.article>
  );
}

function About() {
  const [activeTab, setActiveTab] = useState("experience");
  const { theme, isDark } = useContext(ThemeContext);

  return (
    <section
      id="about"
      className={`w-full ${theme?.themeColor} py-16 sm:py-20`}
      aria-labelledby="about-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <h2
              id="about-title"
              className={`text-3xl font-black sm:text-4xl lg:text-5xl ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              About <span className="text-cyan-400">Me</span>
            </h2>

            <p
              className={`mt-3 text-sm sm:text-base ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Experienced Full-Stack Developer focused on Frontend, Backend, and AI Integration.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-8 flex justify-center">
            <Tabs
              tabs={tabItems}
              active={activeTab}
              onChange={setActiveTab}
            />
          </motion.div>

          <motion.div
            layout
            transition={{
              layout: {
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            className="relative overflow-hidden"
          >
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="relative space-y-4 md:pl-10"
              >
                <span
                  className={`absolute left-[11px] top-2 bottom-2 hidden w-px overflow-hidden rounded-full md:block ${
                    isDark ? "bg-white/10" : "bg-slate-200"
                  }`}
                >
                  <motion.span
                    className="block h-full w-full origin-top rounded-full bg-gradient-to-b from-cyan-300 to-emerald-300"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </span>

                {aboutData[activeTab].map((item, index) => (
                  <InfoCard
                    key={`${activeTab}-${item.title}`}
                    item={item}
                    isDark={isDark}
                    index={index}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
