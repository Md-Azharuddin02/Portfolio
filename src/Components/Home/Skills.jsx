import React from "react";
import { motion } from "framer-motion";
import { stackCategories, skillRows } from "../../content/skills";
import { EASE_OUT, staggerContainer } from "../../lib/motion";
import { SectionHeading } from "../ui/SectionHeading";

const toolsFor = (category) => skillRows.find((row) => row.category === category)?.skills ?? [];

const column = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

function Skills() {
  return (
    <section id="skills" className="w-full bg-canvas py-20 text-ink sm:py-32 lg:py-40" aria-labelledby="skills-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <SectionHeading id="skills-title" index="02" eyebrow="Capabilities" title="One engineer," accent="the whole stack.">
            React interfaces, scalable backend APIs, AWS delivery and AI integration — owned end to end, built for production.
          </SectionHeading>

          <motion.div variants={staggerContainer} className="grid border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
            {stackCategories.map(({ id, Icon, title, copy }, index) => (
              <motion.article
                key={id}
                variants={column}
                className="group/col relative flex flex-col border-b border-ink/15 py-7 sm:px-6 sm:py-8 sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0 lg:first:pl-0"
              >
                {/* Accent rule that draws in on hover */}
                <span aria-hidden="true" className="absolute left-0 top-[-1px] h-px w-full origin-left scale-x-0 bg-brand transition-transform duration-700 ease-out-expo group-hover/col:scale-x-100" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-ink-muted">0{index + 1}</span>
                  <Icon className="h-4 w-4 text-ink-muted transition-colors duration-500 group-hover/col:text-brand" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-medium tracking-tight sm:mt-10">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted sm:mt-3">{copy}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5 sm:mt-8 sm:block sm:space-y-0.5" aria-label={`${title} tools`}>
                  {toolsFor(id).map((tool) => (
                    <li key={tool.name} className="group/tool flex items-center gap-2 rounded-full border border-ink/15 px-2.5 py-1 text-[13px] text-ink sm:gap-3 sm:rounded-none sm:border-0 sm:px-0 sm:py-1.5 sm:text-[15px]">
                      <tool.Icon
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-ink-muted transition-colors duration-300 group-hover/tool:text-[var(--tool)] sm:h-4 sm:w-4"
                        style={{ "--tool": tool.color }}
                      />
                      <span className="transition-transform duration-500 ease-out-expo group-hover/tool:translate-x-1">{tool.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Skills;
