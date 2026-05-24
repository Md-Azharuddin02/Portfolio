import React, { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../Store/ThemeContext ";
import { gsap } from "gsap";
import {
  FaLinkedin,
  FaGithub,
  FaArrowRight,
  FaDownload,
  FaRobot,
  FaServer,
  FaAws,
} from "react-icons/fa";
import { SiFastapi, SiGithubactions, SiOpenai, SiReact } from "react-icons/si";
import resume from "../../assets/MdAzharuddinFullStackResume.pdf";

import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";

const cld = new Cloudinary({ cloud: { cloudName: "dqpkciwvo" } });

const img = cld
  .image("Md-Azharuddin")
  .format("auto")
  .quality("auto")
  .resize(auto().gravity(autoGravity()).width(500).height(500));

const SOCIAL_LINKS = [
  {
    Icon: FaLinkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/mdazharuddin02/",
  },
  {
    Icon: FaGithub,
    label: "GitHub",
    url: "https://github.com/Md-Azharuddin02",
  },
];

const HERO_METRICS = [
  { value: "2+", label: "Years building production systems" },
  { value: "AWS", label: "Cloud-ready deployment mindset" },
  { value: "AI", label: "Automation-first product workflows" },
];

const CAPABILITIES = [
  { Icon: SiReact, label: "React & Next.js" },
  { Icon: FaServer, label: "Node/FastAPI backends" },
  { Icon: FaAws, label: "AWS cloud delivery" },
  { Icon: SiOpenai, label: "AI integrations" },
  { Icon: SiGithubactions, label: "CI/CD automation" },
];

const SPECIALTIES = [
  {
    Icon: SiReact,
    title: "Frontend systems",
    text: "Responsive interfaces, reusable components, and polished user journeys.",
  },
  {
    Icon: SiFastapi,
    title: "Full-stack APIs",
    text: "Auth, databases, REST services, and production-ready integration layers.",
  },
  {
    Icon: FaAws,
    title: "AWS cloud",
    text: "Deployment thinking across compute, storage, pipelines, and monitoring.",
  },
  {
    Icon: SiOpenai,
    title: "AI automation",
    text: "Assistant workflows, smart task handling, and AI-powered product features.",
  },
];

function HomePageHero() {
  const { theme, isDark } = useContext(ThemeContext);

  const headingSmallRef = useRef(null);
  const headingNameRef = useRef(null);
  const headingRoleRef = useRef(null);
  const descRef = useRef(null);
  const socialRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const textEls = [
      headingSmallRef.current,
      headingNameRef.current,
      headingRoleRef.current,
      descRef.current,
    ].filter(Boolean);

    gsap.set(textEls, { y: 30, opacity: 0 });
    gsap.set(socialRef.current?.children ?? [], { scale: 0, opacity: 0 });
    gsap.set(buttonRef.current, { y: 20, opacity: 0 });
    gsap.set(imageRef.current, { x: 60, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(textEls, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15 })
      .to(imageRef.current, { x: 0, opacity: 1, duration: 0.9 }, "-=0.5")
      .to(
        socialRef.current?.children ?? [],
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08 },
        "-=0.4",
      )
      .to(buttonRef.current, { y: 0, opacity: 1, duration: 0.4 }, "-=0.2");

    return () => tl.kill();
  }, []);

  const eyebrowColor = isDark ? "text-cyan-200" : "text-cyan-800";
  const headingColor = isDark ? "text-white" : "text-slate-950";
  const descColor = isDark ? "text-slate-300" : "text-slate-600";

  return (
    <section id="home" className={`relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden w-full ${theme?.themeColor}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute left-[-12rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full blur-3xl ${isDark ? "bg-cyan-500/12" : "bg-cyan-300/25"}`} />
        <div className={`absolute bottom-[-12rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full blur-3xl ${isDark ? "bg-emerald-500/10" : "bg-emerald-300/25"}`} />
        <div className={`absolute inset-0 ${isDark ? "bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)]" : "bg-[linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)]"} bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]`} />
      </div>

      <div className="relative w-full py-8 sm:py-12 lg:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr] gap-8 lg:gap-12 items-center">
              <div className="space-y-5 text-center lg:text-left">
                <div className="space-y-3">
                  <h1
                    ref={headingSmallRef}
                    className={`mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] lg:mx-0
                      ${isDark ? "border-cyan-300/20 bg-cyan-300/10" : "border-cyan-700/20 bg-cyan-50"} ${eyebrowColor}`}
                  >
                    Full-stack developer | AWS | AI automation
                  </h1>
                  <h2
                    ref={headingNameRef}
                    className={`text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.6rem] font-black ${headingColor} leading-[0.96] tracking-tight`}
                  >
                    Full-stack products with cloud scale and AI intelligence.
                  </h2>
                  <p
                    ref={headingRoleRef}
                    className={`text-lg sm:text-xl lg:text-2xl font-semibold ${isDark ? "text-emerald-200" : "text-emerald-700"}`}
                  >
                    React, Node.js, FastAPI, AWS, CI/CD, and AI-powered workflows.
                  </p>
                </div>

                <p
                  ref={descRef}
                  className={`text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 ${descColor} leading-7`}
                >
                  I build polished user experiences backed by scalable APIs,
                  AWS-ready delivery pipelines, and AI automations that make
                  products smarter and teams faster.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {HERO_METRICS.map((metric) => (
                    <div key={metric.label} className={`rounded-2xl border p-3
                      ${isDark ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white/75 shadow-sm"}`}>
                      <p className={`text-xl font-black ${isDark ? "text-white" : "text-slate-950"}`}>{metric.value}</p>
                      <p className={`mt-1 text-[11px] leading-4 sm:text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{metric.label}</p>
                    </div>
                  ))}
                </div>

                <div
                  ref={socialRef}
                  className="flex flex-wrap justify-center lg:justify-start gap-3"
                >
                  {CAPABILITIES.map(({ Icon, label }) => (
                    <span key={label} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold
                      ${isDark ? "border-white/10 bg-white/[0.04] text-slate-300" : "border-slate-200 bg-white/80 text-slate-600"}`}>
                      <Icon className={isDark ? "text-cyan-300" : "text-cyan-700"} aria-hidden="true" />
                      {label}
                    </span>
                  ))}
                  {SOCIAL_LINKS.map(({ Icon, label, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`group inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-0.5
                        ${isDark ? "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/40 hover:text-cyan-200" : "border-slate-200 bg-white text-slate-600 hover:border-cyan-700/30 hover:text-cyan-700"}`}
                    >
                      <Icon className="text-base transition-all duration-300 group-hover:scale-110" />
                    </a>
                  ))}
                </div>

                <div className="flex flex-col justify-center gap-3 pt-1 sm:flex-row lg:justify-start" ref={buttonRef}>
                  <a
                    href="#project"
                    className="
                      inline-flex items-center justify-center gap-2 rounded-full
                      bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950
                      transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-xl hover:shadow-cyan-500/20
                      active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950
                    "
                  >
                    View work <FaArrowRight aria-hidden="true" />
                  </a>
                  <a
                    href={resume}
                    download
                    className="
                      inline-flex items-center justify-center gap-2 rounded-full border
                      border-current/20 px-6 py-3 text-sm font-black
                      transition-all duration-300
                      hover:-translate-y-1 hover:shadow-xl
                      active:scale-[0.98]
                      focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950
                    "
                  >
                    <FaDownload aria-hidden="true" /> Download CV
                  </a>
                </div>
              </div>

              <div className="relative mt-4 lg:mt-0" ref={imageRef}>
                <div className={`relative mx-auto max-w-[340px] sm:max-w-[400px] lg:max-w-[455px] rounded-[2rem] border p-3
                  ${isDark ? "border-white/10 bg-white/[0.04]" : "border-slate-200 bg-white/80 shadow-2xl shadow-slate-900/10"}`}>
                  <div className={`absolute -right-5 -top-5 z-10 rounded-2xl border px-4 py-3 text-left shadow-xl
                    ${isDark ? "border-white/10 bg-slate-950/90" : "border-slate-200 bg-white"}`}>
                    <p className={`text-xs font-bold uppercase tracking-[0.18em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Status</p>
                    <p className={`mt-1 text-sm font-black ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>Available for projects</p>
                  </div>
                  <div className="relative overflow-hidden rounded-[1.5rem]">
                    <AdvancedImage
                      cldImg={img}
                      className="aspect-[4/5] w-full object-cover transition-all duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className={`rounded-2xl border p-4 backdrop-blur-xl
                        ${isDark ? "border-white/10 bg-slate-950/70" : "border-white/60 bg-white/75"}`}>
                        <p className={`text-sm font-black ${isDark ? "text-white" : "text-slate-950"}`}>Frontend precision with backend depth.</p>
                        <p className={`mt-1 text-xs leading-5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>Modern UI, robust APIs, deployment automation, and performance-minded implementation.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SPECIALTIES.map(({ Icon, title, text }) => (
                <article key={title} className={`rounded-[1.25rem] border p-4 text-left transition duration-300 hover:-translate-y-1
                  ${isDark ? "border-white/10 bg-white/[0.035] hover:border-cyan-300/30" : "border-slate-200 bg-white/75 hover:border-cyan-700/25 hover:shadow-lg"}`}>
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-2xl
                    ${isDark ? "bg-cyan-300/10 text-cyan-200" : "bg-cyan-50 text-cyan-700"}`}>
                    <Icon aria-hidden="true" />
                  </div>
                  <h3 className={`text-sm font-black ${isDark ? "text-white" : "text-slate-950"}`}>
                    {title}
                  </h3>
                  <p className={`mt-2 text-xs leading-5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePageHero;
