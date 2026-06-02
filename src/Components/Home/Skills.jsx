import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../Store/ThemeContext ";
import { MarqueeRow } from "../interactive/MarqueeRow";
import { TiltCard } from "../interactive/TiltCard";
import { stackCategories, skillRows } from "../../content/skills";
import { fadeUp, staggerContainer } from "../../lib/motion";
import { cn } from "../../lib/utils";

function Skills() {
  const { theme, isDark } = useContext(ThemeContext);
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <section id="skills" className={`w-full overflow-hidden ${theme?.themeColor} py-16 sm:py-20`} aria-labelledby="skills-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-7xl"
        >
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <h2 id="skills-title" className={`text-3xl font-black sm:text-4xl lg:text-5xl ${isDark ? "text-white" : "text-slate-950"}`}>
              Full-stack <span className="text-cyan-400">Cloud + AI</span> Stack
            </h2>
            <p className={`mt-3 text-sm sm:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              React interfaces, scalable backend APIs, AWS delivery, and AI integration workflows built for production.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stackCategories.map(({ Icon, title, copy }) => (
              <motion.div key={title} variants={fadeUp}>
                <TiltCard className={`group h-full rounded-2xl border p-5 transition duration-300 ${isDark ? "border-white/10 bg-white/[0.045] hover:border-cyan-300/35" : "border-slate-200 bg-white hover:border-cyan-700/25 hover:shadow-xl"}`}>
                  <Icon className="mb-4 h-8 w-8 text-cyan-300 transition group-hover:rotate-6 group-hover:scale-110" />
                  <h3 className={`text-base font-black ${isDark ? "text-white" : "text-slate-950"}`}>{title}</h3>
                  <p className={`mt-2 text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{copy}</p>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mb-10 flex flex-wrap justify-center gap-2" aria-label="Stack filter">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                activeCategory === "all" ? "border-cyan-300 bg-cyan-300 text-slate-950" : isDark ? "border-white/10 text-slate-300 hover:text-white" : "border-slate-200 text-slate-600 hover:text-slate-950",
              )}
            >
              All
            </button>
            {stackCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  activeCategory === category.id ? "border-cyan-300 bg-cyan-300 text-slate-950" : isDark ? "border-white/10 text-slate-300 hover:text-white" : "border-slate-200 text-slate-600 hover:text-slate-950",
                )}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          <div className="flex flex-col gap-8 sm:gap-10">
            {skillRows.map((row) => (
              <MarqueeRow key={row.label} isDark={isDark} activeCategory={activeCategory} {...row} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Skills;
