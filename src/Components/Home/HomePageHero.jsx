import React, { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../Store/ThemeContext ";
import { gsap } from "gsap";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";  
import img from "../../assets/images/img.png";
import resume from "../../assets/MdAzharuddinFullStackResume.pdf";

const SOCIAL_LINKS = [
  { Icon: FaFacebook, label: "Facebook",  url: "https://www.facebook.com/prince.sainger02" },
  { Icon: FaInstagram, label: "Instagram", url: "https://www.instagram.com/__clay__02" },
  { Icon: FaTwitter,  label: "Twitter",   url: "https://x.com/Md_Azharuddin02" },
  { Icon: FaLinkedin, label: "LinkedIn",  url: "https://www.linkedin.com/in/mdazharuddin02/" },
  { Icon: FaGithub,   label: "GitHub",    url: "https://github.com/Md-Azharuddin02" },
];

function HomePageHero() {
  const { theme, isDark } = useContext(ThemeContext);

  // Separate refs per animated group — avoids targeting .children which breaks if markup changes
  const headingSmallRef = useRef(null);
  const headingNameRef  = useRef(null);
  const headingRoleRef  = useRef(null);
  const descRef         = useRef(null);
  const socialRef       = useRef(null);
  const buttonRef       = useRef(null);
  const imageRef        = useRef(null);

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
      .to(socialRef.current?.children ?? [], { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08 }, "-=0.4")
      .to(buttonRef.current, { y: 0, opacity: 1, duration: 0.4 }, "-=0.2");

    return () => tl.kill();
  }, []);

  const textColor    = isDark ? "text-gray-200"  : "text-gray-700";
  const headingColor = isDark ? "text-white"      : "text-gray-900";
  const accentColor  = isDark ? "text-amber-500"  : "text-amber-600";
  const descColor    = isDark ? "text-gray-300"   : "text-gray-600";

  return (
    <section className={`flex items-center w-full ${theme?.themeColor}`}>
      <div className="w-full py-5 sm:py-14 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* ── Text content ── */}
              <div className="space-y-6 md:space-y-8 text-center md:text-left">
                <div className="space-y-3 md:space-y-4">
                  <h1
                    ref={headingSmallRef}
                    className={`text-xl sm:text-2xl lg:text-3xl font-bold ${textColor} tracking-wide`}
                  >
                    Hello, It's Me
                  </h1>
                  <h2
                    ref={headingNameRef}
                    className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold ${headingColor} leading-tight`}
                  >
                    Md Azharuddin
                  </h2>
                  <p
                    ref={headingRoleRef}
                    className={`text-lg sm:text-xl lg:text-2xl font-medium ${accentColor}`}
                  >
                    A Full Stack Developer
                  </p>
                </div>

                <p
                  ref={descRef}
                  className={`text-base sm:text-lg max-w-2xl mx-auto md:mx-0 ${descColor} leading-relaxed`}
                >
                  I am passionate about building excellent software that improves the lives of those around me.
                </p>

                {/* Social icons */}
                <div
                  ref={socialRef}
                  className="flex justify-center md:justify-start gap-4 sm:gap-5"
                >
                  {SOCIAL_LINKS.map(({ Icon, label, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="group relative p-2"
                    >
                      <Icon className={`text-2xl sm:text-3xl transition-all duration-300 group-hover:scale-110 group-hover:text-amber-400 ${accentColor}`} />
                      <span className="absolute -inset-2 bg-amber-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </a>
                  ))}
                </div>

                <div className="pt-2" ref={buttonRef}>
                  <a
                    href={resume}
                    download
                    className="
                      inline-block
                      bg-amber-500 hover:bg-amber-600
                      text-white
                      px-6 sm:px-8 py-3 sm:py-4
                      rounded-lg text-base sm:text-lg font-medium
                      transition-all duration-300
                      hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl
                      active:scale-[0.98]
                      shadow-lg
                      focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                    "
                  >
                    Download CV
                  </a>
                </div>
              </div>

              {/* ── Image ── */}
              <div className="relative mt-8 md:mt-0" ref={imageRef}>
                <div className="relative max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] mx-auto">
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-2xl animate-pulse" />
                  <div className="relative group">
                    <img
                      src={img}
                      alt="Md Azharuddin"
                      className="w-full h-auto object-cover rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePageHero;