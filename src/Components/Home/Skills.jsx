import React, { useContext, useRef } from "react";
import { ThemeContext } from "../../Store/ThemeContext ";
import {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaBootstrap,
  FaNodeJs, FaGit, FaAws, FaDocker, FaPython,
  FaDatabase, FaServer, FaCloud, FaDesktop,
} from "react-icons/fa";
import { TbBrandRedux, TbApi } from "react-icons/tb";
import {
  SiJest, SiTypescript, SiExpress, SiMysql, SiMongodb,
  SiRedis, SiNextdotjs, SiTailwindcss, SiFastapi, SiDjango,
  SiGraphql, SiPostgresql, SiGithubactions, SiReactquery,
  SiMui, SiVercel, SiNetlify, SiPostman, SiSwagger,
} from "react-icons/si";

const FRONTEND = [
  { Icon: FaHtml5,       name: "HTML5",          color: "#f97316" },
  { Icon: FaCss3Alt,     name: "CSS3",           color: "#3b82f6" },
  { Icon: FaJs,          name: "JavaScript",     color: "#facc15" },
  { Icon: SiTypescript,  name: "TypeScript",     color: "#60a5fa" },
  { Icon: FaReact,       name: "React.js",       color: "#22d3ee" },
  { Icon: SiNextdotjs,   name: "Next.js",        color: "#d1d5db" },
  { Icon: TbBrandRedux,  name: "Redux Toolkit",  color: "#a78bfa" },
  { Icon: SiReactquery,  name: "TanStack Query", color: "#f87171" },
  { Icon: FaBootstrap,   name: "Bootstrap",      color: "#a855f7" },
  { Icon: SiTailwindcss, name: "Tailwind CSS",   color: "#2dd4bf" },
  { Icon: SiMui,         name: "Material-UI",    color: "#3b82f6" },
  { Icon: SiJest,        name: "Jest",           color: "#ef4444" },
  { Icon: TbApi,         name: "WebSockets",     color: "#4ade80" },
];

const BACKEND = [
  { Icon: FaNodeJs,     name: "Node.js",     color: "#22c55e" },
  { Icon: SiExpress,    name: "Express.js",  color: "#9ca3af" },
  { Icon: SiFastapi,    name: "FastAPI",     color: "#14b8a6" },
  { Icon: SiDjango,     name: "Django",      color: "#16a34a" },
  { Icon: FaPython,     name: "Python",      color: "#facc15" },
  { Icon: SiGraphql,    name: "GraphQL",     color: "#ec4899" },
  { Icon: TbApi,        name: "REST APIs",   color: "#4ade80" },
  { Icon: SiPostgresql, name: "PostgreSQL",  color: "#60a5fa" },
  { Icon: SiMongodb,    name: "MongoDB",     color: "#22c55e" },
  { Icon: SiMysql,      name: "MySQL",       color: "#eab308" },
  { Icon: SiRedis,      name: "Redis",       color: "#ef4444" },
  { Icon: FaDatabase,   name: "SQL Server",  color: "#93c5fd" },
];

const DEVOPS = [
  { Icon: FaAws,           name: "AWS",            color: "#fbbf24" },
  { Icon: FaDocker,        name: "Docker",         color: "#60a5fa" },
  { Icon: SiGithubactions, name: "GitHub Actions", color: "#d1d5db" },
  { Icon: FaGit,           name: "Git",            color: "#f97316" },
  { Icon: SiVercel,        name: "Vercel",         color: "#f3f4f6" },
  { Icon: SiNetlify,       name: "Netlify",        color: "#2dd4bf" },
  { Icon: SiPostman,       name: "Postman",        color: "#fb923c" },
  { Icon: SiSwagger,       name: "Swagger",        color: "#4ade80" },
];

const ROWS = [
  { skills: FRONTEND, direction: "left",  label: "Frontend",           Icon: FaDesktop, iconColor: "#f59e0b" },
  { skills: BACKEND,  direction: "right", label: "Backend & Databases", Icon: FaServer,  iconColor: "#22c55e" },
  { skills: DEVOPS,   direction: "left",  label: "Cloud & DevOps",     Icon: FaCloud,   iconColor: "#60a5fa" },
];

const MarqueeRow = ({ skills, direction, isDark, label, Icon, iconColor }) => {
  const trackRef = useRef(null);
  const pause  = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "paused"; };
  const resume = () => { if (trackRef.current) trackRef.current.style.animationPlayState = "running"; };

  const doubled   = [...skills, ...skills];
  const animName  = direction === "left" ? "marqueeLeft" : "marqueeRight";
  const duration  = `${skills.length * 3.5}s`;

  return (
    <div className="w-full">
      {/* Label row */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0
          ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
          <Icon style={{ color: iconColor }} className="text-sm" />
        </div>
        <span className={`text-xs font-semibold uppercase tracking-widest whitespace-nowrap
          ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {label}
        </span>
        <div className={`flex-1 h-px ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0
          ${isDark ? "bg-gray-800 text-gray-600" : "bg-gray-100 text-gray-400"}`}>
          {skills.length} skills
        </span>
      </div>

      {/* Scroll strip */}
      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div
          ref={trackRef}
          className="flex gap-3 w-max py-1"
          style={{ animation: `${animName} ${duration} linear infinite` }}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
        >
          {doubled.map((skill, i) => (
            <div
              key={`${skill.name}-${i}`}
              className={`
                group flex items-center gap-2 sm:gap-2.5
                px-3 sm:px-4 py-2 sm:py-2.5
                rounded-xl border-l-[3px] shrink-0 cursor-default
                transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.04]
                ${isDark
                  ? "bg-gray-800/50 hover:bg-gray-800 shadow-sm hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                  : "bg-white/80 hover:bg-white shadow-sm hover:shadow-md"
                }
              `}
              style={{ borderLeftColor: skill.color }}
            >
              <skill.Icon
                className="text-base sm:text-lg shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ color: skill.color }}
                aria-hidden="true"
              />
              <span className={`text-xs sm:text-sm font-medium whitespace-nowrap
                ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Skills = () => {
  const { theme, isDark } = useContext(ThemeContext);

  return (
    <>
      <style>{`
        @keyframes marqueeLeft  { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marqueeRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
      `}</style>

      <section
        id="skills"
        className={`w-full ${theme?.themeColor} py-12 overflow-hidden`}
        aria-labelledby="skills-title"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 id="skills-title"
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold
                ${isDark ? "text-white" : "text-gray-900"}`}>
              My <span className="text-amber-500">Skills</span>
            </h2>
             <p className={`mt-3 text-sm sm:text-base
              ${isDark ? "text-gray-100" : "text-gray-800"}`}>
              Technologies I work with every day
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
            {ROWS.map((row) => (
              <MarqueeRow key={row.label} isDark={isDark} {...row} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Skills;