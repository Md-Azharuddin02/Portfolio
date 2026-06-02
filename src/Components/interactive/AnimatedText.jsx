import { motion } from "framer-motion";

export function AnimatedText({ text, className = "", highlight = [] }) {
  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055 } } }}
    >
      {words.map((word, index) => {
        const clean = word.replace(/[.,]/g, "");
        const isHighlight = highlight.includes(clean);
        return (
          <motion.span
            key={`${word}-${index}`}
            className={isHighlight ? "animated-gradient-text inline-block" : "inline-block"}
            variants={{
              hidden: { opacity: 0, y: 28 },
              show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00a0" : ""}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
