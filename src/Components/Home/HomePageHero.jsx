import React, { useContext, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { FaAws, FaGithub, FaLinkedin } from "react-icons/fa";
import { SiFastapi, SiOpenai, SiReact } from "react-icons/si";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { face } from "@cloudinary/url-gen/qualifiers/focusOn";
import { ThemeContext } from "../../Store/ThemeContext ";
import resume from "../../assets/MdAzharuddinFullStackResume.pdf";
import { AnimatedText } from "../interactive/AnimatedText";
import { MagneticButton } from "../interactive/MagneticButton";
import { TiltCard } from "../interactive/TiltCard";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { fadeUp, staggerContainer } from "../../lib/motion";

const cld = new Cloudinary({ cloud: { cloudName: "dqpkciwvo" } });
const img = cld.image("Md-Azharuddin").format("auto").quality("auto").resize(fill().width(600).height(750).gravity(focusOn(face())));

const socials = [
  { Icon: FaLinkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/mdazharuddin02/" },
  { Icon: FaGithub, label: "GitHub", url: "https://github.com/Md-Azharuddin02" },
];

const metrics = [
  { value: "2+", label: "Years building production systems", accent: "from-cyan-300 to-sky-400" },
  { value: "AI", label: "LLM-first product mindset", accent: "from-emerald-300 to-teal-400" },
  { value: "API", label: "Full-stack delivery depth", accent: "from-violet-300 to-cyan-300" },
];


function HomePageHero() {
  const { theme, isDark } = useContext(ThemeContext);
  const bgRef = useRef(null);

  const onBackgroundMove = (event) => {
    if (!bgRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    bgRef.current.style.setProperty("--mx", `${x}%`);
    bgRef.current.style.setProperty("--my", `${y}%`);
  };

  return (
    <section
      id="home"
      onPointerMove={onBackgroundMove}
      className={`relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden ${theme?.themeColor}`}
      aria-labelledby="hero-title"
    >
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 [--mx:50%] [--my:50%]"
        style={{
          background:
            "radial-gradient(circle at var(--mx) var(--my), rgba(34,211,238,.16), transparent 18rem), linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
          backgroundSize: "auto, 58px 58px, 58px 58px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 82%)",
        }}
      />

      <div className="relative w-full py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <div className="space-y-6 text-center lg:text-left">
              <motion.div variants={fadeUp}>
                <Badge className="mx-auto lg:mx-0">
                  <Sparkles className="h-4 w-4" />
                  Experienced Full-Stack Developer
                </Badge>
              </motion.div>

              <h1 id="hero-title" className={`font-display text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl lg:text-[4.5rem] xl:text-[5rem] ${isDark ? "text-white" : "text-slate-950"}`}>
                <AnimatedText text="Full-stack products with cloud scale and AI intelligence." highlight={["cloud", "AI"]} />
              </h1>

              <motion.p variants={fadeUp} className={`text-lg font-semibold sm:text-xl ${isDark ? "text-emerald-100" : "text-emerald-700"}`}>
                Frontend, Backend, AI Integration
              </motion.p>

              <motion.p variants={fadeUp} className={`mx-auto max-w-2xl text-base leading-relaxed sm:text-lg lg:mx-0 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                I build polished user experiences backed by scalable APIs, cloud-ready delivery, and LLM-powered product features that feel fast, useful, and reliable.
              </motion.p>

              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 sm:gap-4">
                {metrics.map((metric) => (
                  <motion.div key={metric.label} variants={fadeUp} className={`relative overflow-hidden rounded-2xl border p-4 ${isDark ? "border-white/10 bg-white/[0.045]" : "border-slate-200 bg-white/80 shadow-sm"}`}>
                    <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${metric.accent}`} />
                    <p className={`bg-gradient-to-br ${metric.accent} bg-clip-text text-2xl font-black text-transparent sm:text-3xl`}>{metric.value}</p>
                    <p className={`mt-1.5 text-[11px] leading-4 sm:text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{metric.label}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2.5 lg:justify-start center-buttons">
                {["React / NextJS", "Node / FastAPI", "AWS cloud", "AI integrations"].map((label) => (
                  <span key={label} className={`rounded-full border px-3.5 py-2 text-xs font-bold ${isDark ? "border-white/10 bg-white/[0.04] text-slate-300" : "border-slate-200 bg-white text-slate-700"}`}>
                    {label}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col justify-center gap-3 pt-2 sm:flex-row lg:justify-start">
                <MagneticButton>
                  <Button as="a" href="#project">
                    View Work <ArrowRight size={17} />
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button as="a" href={resume} download variant="secondary" className={isDark ? "" : "border-slate-300 bg-white text-slate-950"}>
                    <Download size={17} /> Download CV
                  </Button>
                </MagneticButton>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="relative mt-6 lg:mt-0">
              <TiltCard max={8} className="relative mx-auto max-w-[340px] sm:max-w-[410px] lg:max-w-[460px]">
                <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/25 via-transparent to-emerald-400/25" />
                <div className={`relative rounded-[2rem] border p-3  ${isDark ? "border-white/10 bg-white/[0.06] shadow-2xl shadow-cyan-500/10" : "border-slate-200 bg-white/80 shadow-2xl shadow-slate-900/15"}`}>
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className={`absolute -left-3 top-1/3 z-20 hidden items-center gap-2 rounded-full border px-3 py-2 shadow-lg  sm:flex ${isDark ? "border-white/10 bg-slate-950/85 text-cyan-200" : "border-slate-200 bg-white/95 text-cyan-700"}`}>
                    <SiReact />
                    <span className="text-xs font-bold">React</span>
                  </motion.div>
                  <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }} className={`absolute -right-2 bottom-1/3 z-20 hidden items-center gap-2 rounded-full border px-3 py-2 shadow-lg  sm:flex ${isDark ? "border-white/10 bg-slate-950/85 text-orange-300" : "border-slate-200 bg-white/95 text-orange-600"}`}>
                    <FaAws />
                    <span className="text-xs font-bold">AWS</span>
                  </motion.div>
                  <div className={`absolute -right-3 -top-3 z-20 rounded-2xl border px-4 py-3 text-left shadow-xl  sm:-right-5 sm:-top-5 ${isDark ? "border-white/10 bg-slate-950/90" : "border-slate-200 bg-white/95"}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Status</p>
                    <p className={`mt-1 flex items-center gap-1.5 text-sm font-black ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      Available for projects
                    </p>
                  </div>
                  <div className="group relative overflow-hidden rounded-[1.5rem]">
                    <AdvancedImage cldImg={img} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" : "bg-gradient-to-t from-white/70 via-white/5 to-transparent"}`} />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-slate-950/75" : "border-white/70 bg-white/85 shadow-lg"}`}>
                        <p className={`text-sm font-black ${isDark ? "text-white" : "text-slate-950"}`}>Frontend precision with backend depth.</p>
                        <p className={`mt-1.5 text-xs leading-5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>Modern UI, robust APIs, AI Integration, and performance-minded implementation.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HomePageHero;