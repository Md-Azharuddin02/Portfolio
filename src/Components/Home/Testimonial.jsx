import React, { useContext, useMemo } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../Store/ThemeContext ";
import { testimonials } from "../../content/testimonials";
import { fadeUp, staggerContainer } from "../../lib/motion";

function TestimonialCard({ t, isDark }) {
  return (
    <article
      className={`group flex h-[230px] w-[280px] shrink-0 flex-col justify-between rounded-2xl border p-5 transition duration-300 sm:w-[340px] lg:w-[390px] ${
        isDark
          ? "border-white/10 bg-white/[0.045] hover:border-cyan-300/30 hover:bg-white/[0.07]"
          : "border-slate-200 bg-white hover:shadow-xl"
      }`}
    >
      <div>
        <span
          aria-hidden="true"
          className="block origin-left text-5xl font-black leading-none text-cyan-300/35 transition group-hover:scale-110"
        >
          &ldquo;
        </span>
        <p
          className={`line-clamp-4 text-sm italic leading-6 ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {t.text}
        </p>
      </div>

      <div
        className={`flex items-center gap-3 border-t pt-4 ${
          isDark ? "border-white/10" : "border-slate-100"
        }`}
      >
        <img
          src={t.image}
          alt={`${t.name}, ${t.role}`}
          loading="lazy"
          decoding="async"
          width="44"
          height="44"
          className="h-11 w-11 rounded-full object-cover ring-2 ring-cyan-300/40 transition group-hover:ring-cyan-300"
        />
        <div className="min-w-0">
          <p
            className={`truncate text-sm font-black ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            {t.name}
          </p>
          <p className="truncate text-xs font-semibold text-cyan-400">
            {t.role}
          </p>
        </div>
      </div>
    </article>
  );
}

function MarqueeRow({ items, isDark, reverse = false, rowId }) {
  return (
    <div
      className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      role="region"
      aria-label="Testimonials carousel"
    >
      <div
        className={`flex w-max gap-5 motion-safe:animate-marquee ${
          reverse ? "motion-safe:[animation-direction:reverse]" : ""
        }`}
      >
        {items.map((t, index) => (
          <TestimonialCard
            key={`${rowId}-${t.id}-${index}`}
            t={t}
            isDark={isDark}
            aria-hidden={index >= items.length / 2}
          />
        ))}
      </div>
    </div>
  );
}

function Testimonial() {
  const { theme, isDark } = useContext(ThemeContext);

  // Memoized rows — duplicated once for seamless marquee loop
  const { row1, row2 } = useMemo(() => {
    const doubled = [...testimonials, ...testimonials];
    const reversed = [...testimonials].reverse();
    const doubledReverse = [...reversed, ...reversed];
    return { row1: doubled, row2: doubledReverse };
  }, []);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className={`w-full overflow-hidden ${theme?.themeColor} py-16 sm:py-20`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <h2
              id="testimonials-heading"
              className={`text-3xl font-black sm:text-4xl lg:text-5xl ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              Team <span className="text-cyan-400">Endorsements</span>
            </h2>
            <p
              className={`mt-3 text-sm sm:text-base ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              What colleagues and collaborators say about working with me
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="space-y-5">
        <MarqueeRow items={row1} isDark={isDark} rowId="row-1" />
        <MarqueeRow items={row2} isDark={isDark} rowId="row-2" reverse />
      </div>
    </section>
  );
}

export default React.memo(Testimonial);
