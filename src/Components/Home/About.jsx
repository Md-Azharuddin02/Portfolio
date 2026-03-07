import React, { useState, useContext } from "react";
import { ThemeContext } from "../../Store/ThemeContext ";

const ABOUT_DATA = {
  education: [
    {
      year: "2019 - 2023",
      title: "Bachelor of Technology",
      institution: "Maharishi Markandeshwar University",
      description: ["Computer Science and Engineering"],
    },
    {
      year: "2016 - 2018",
      title: "Higher Secondary",
      institution: "Marwari College",
      description: ["Science with Computer Science"],
    },
  ],
  experience: [
    {
      year: "2023 - Present",
      title: "Software Engineer",
      institution: "M&S Consulting Noida",
      description: [
        "Built and maintained scalable full-stack web applications using React, Next.js, Node.js, and FastAPI.",
        "Designed and developed RESTful APIs and microservices handling thousands of daily requests.",
        "Implemented JWT and OAuth2 authentication with RBAC authorization.",
        "Optimized database queries across PostgreSQL, MongoDB, and MySQL.",
        "Automated CI/CD pipelines using GitHub Actions and Docker.",
        "Collaborated in Agile teams to deliver scalable features.",
      ],
    },
    {
      year: "2022 - 2023",
      title: "Software Engineering Virtual Experience",
      institution: "JPMorgan Chase & Co.",
      description: [
        "Integrated real-time stock market data feeds using Python.",
        "Processed large market datasets to identify trends and patterns.",
        "Developed data visualizations for financial insights.",
        "Used Git for version control following industry-standard practices.",
      ],
    },
  ],
};

const TabButton = ({ isActive, onClick, children, isDark }) => (
  <button
    onClick={onClick}
    className={`
      px-5 sm:px-7 py-2.5 rounded-xl font-semibold text-sm sm:text-base
      transition-all duration-300
      ${isActive
        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.03]"
        : isDark
          ? "bg-gray-800/60 text-gray-300 hover:bg-gray-700/70 hover:text-white border border-gray-700/40"
          : "bg-white/60 text-gray-600 hover:bg-white border border-gray-200 hover:text-gray-900"
      }
    `}
  >
    {children}
  </button>
);

const InfoCard = ({ item, isDark }) => {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW = 3;
  const hasMore = item.description.length > PREVIEW;
  const visible = expanded ? item.description : item.description.slice(0, PREVIEW);

  return (
    <div className={`
      rounded-xl border p-4 sm:p-5 lg:p-6
      transition-all duration-300 hover:scale-[1.01]
      ${isDark
        ? "bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50"
        : "bg-white/60 border-gray-200 hover:bg-white shadow-sm hover:shadow-md"
      }
    `}>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-base sm:text-lg leading-snug
            ${isDark ? "text-white" : "text-gray-900"}`}>
            {item.title}
          </h3>
          <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {item.institution}
          </p>
        </div>
        <span className="text-amber-500 font-semibold text-xs sm:text-sm whitespace-nowrap shrink-0 mt-0.5">
          {item.year}
        </span>
      </div>

      {/* Divider */}
      <div className={`h-px mb-3 ${isDark ? "bg-gray-700/40" : "bg-gray-100"}`} />

      {/* Description list */}
      <ul className="space-y-1.5">
        {visible.map((line, i) => (
          <li key={i} className={`flex gap-2 text-sm leading-relaxed
            ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            <span className="text-amber-500 mt-0.5 shrink-0">▸</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-amber-500 hover:text-amber-400 text-xs font-semibold
            transition-colors duration-200 flex items-center gap-1"
        >
          {expanded ? "Show less ↑" : `Show ${item.description.length - PREVIEW} more ↓`}
        </button>
      )}
    </div>
  );
};

function About() {
  const [activeTab, setActiveTab] = useState("education");
  const { theme, isDark } = useContext(ThemeContext);

  return (
    <section
      id="about"
      className={`w-full ${theme?.themeColor} md:py-12 sm:py-4 lg:py-12`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-6 ">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold
            ${isDark ? "text-white" : "text-gray-900"}`}>
            About <span className="text-amber-500">Me</span>
          </h2>
           <p className={`mt-3 text-sm sm:text-base ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            {activeTab === "education"
              ? "Where I built my foundation in computer science"
              : "Where I've applied my skills in the real world"
            }
          </p>
        </div>

        {/* Card */}
        <div className={`
          max-w-4xl mx-auto rounded-2xl border p-5 sm:p-8
          ${isDark
            ? "bg-gray-900/40 border-gray-700/30"
            : "bg-white/40 border-gray-200"
          }
          shadow-[0_4px_30px_rgba(0,0,0,0.08)]
        `}>

          {/* Tab bar */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-8">
            <TabButton isActive={activeTab === "education"} onClick={() => setActiveTab("education")} isDark={isDark}>
              🎓 Education
            </TabButton>
            <TabButton isActive={activeTab === "experience"} onClick={() => setActiveTab("experience")} isDark={isDark}>
              💼 Experience
            </TabButton>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {ABOUT_DATA[activeTab].map((item, i) => (
              <InfoCard key={`${activeTab}-${i}`} item={item} isDark={isDark} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;