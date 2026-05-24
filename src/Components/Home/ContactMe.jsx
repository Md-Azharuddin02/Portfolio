import React, { useContext, useState } from "react";
import { ThemeContext } from "../../Store/ThemeContext ";

const inputClass = (isDark) =>
  `w-full px-4 py-3 text-sm sm:text-base rounded-xl border
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-cyan-500/35 focus:border-cyan-500
  placeholder:text-gray-400
  ${isDark
    ? "bg-white/[0.045] text-white border-white/10 hover:border-cyan-300/30"
    : "bg-white text-slate-950 border-slate-200 hover:border-cyan-700/25"
  }`;

function ContactMe() {
  const { theme, isDark } = useContext(ThemeContext);
  const [showAlert, setShowAlert] = useState(false);
  const [data, setData] = useState({ name: "", email: "", subject: "", phone: "", body: "" });

  const handleFormInput = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(data.subject || "Portfolio inquiry");
    const body = encodeURIComponent(
      `Hi Azhar,\n\n${data.body}\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}`,
    );
    window.location.href = `mailto:mdazharuddin02@gmail.com?subject=${subject}&body=${body}`;
    setData({ name: "", email: "", subject: "", phone: "", body: "" });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <section
      id="contact"
      className={`${theme?.themeColor} py-12 relative`}
    >
      {/* Toast */}
      <div
        aria-live="polite"
        className={`
          fixed left-1/2 -translate-x-1/2 top-20 z-[60] w-[90vw] max-w-sm
          transition-all duration-300 ease-in-out
          ${showAlert ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"}
        `}
      >
        <div className={`
          flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl
          ${isDark ? "bg-slate-950 border-white/10 text-white" : "bg-white border-slate-200 text-slate-950"}
        `}>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500/15 shrink-0">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm">Email draft prepared</p>
            <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Your mail app will open with the details.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold
            ${isDark ? "text-white" : "text-slate-950"}`}>
            Start a <span className="text-cyan-400">Project</span>
          </h2>
          <p className={`mt-3 text-sm sm:text-base
            ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Have a product, workflow, or automation idea? Send the details.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleFormSubmit}
          className={`
            max-w-2xl mx-auto rounded-2xl border p-5 sm:p-8
            ${isDark
              ? "bg-white/[0.04] border-white/10"
              : "bg-white/75 border-slate-200"
            }
            shadow-[0_4px_30px_rgba(0,0,0,0.08)]
          `}
        >
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <input onChange={handleFormInput} type="text"  name="name"    value={data.name}    placeholder="Full Name"      required className={inputClass(isDark)} />
            <input onChange={handleFormInput} type="email" name="email"   value={data.email}   placeholder="Email Address"  required className={inputClass(isDark)} />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <input onChange={handleFormInput} type="tel"  name="phone"   value={data.phone}   placeholder="Mobile Number"  required className={inputClass(isDark)} />
            <input onChange={handleFormInput} type="text" name="subject" value={data.subject} placeholder="Email Subject"  required className={inputClass(isDark)} />
          </div>

          {/* Textarea */}
          <textarea
            onChange={handleFormInput}
            name="body"
            value={data.body}
            placeholder="Your Message"
            required
            rows={5}
            className={`${inputClass(isDark)} resize-none mb-5`}
          />

          {/* Submit */}
          <button
            type="submit"
            className="
              w-full sm:w-auto block sm:mx-auto
              bg-cyan-400 hover:bg-cyan-300 active:scale-95
              text-slate-950 font-black
              px-10 py-3 rounded-full text-sm sm:text-base
              transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20
            "
          >
            Prepare Email
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactMe;
