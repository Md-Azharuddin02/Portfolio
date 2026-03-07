import React, { useContext, useState } from "react";
import { ThemeContext } from "../../Store/ThemeContext ";

const inputClass = (isDark) =>
  `w-full px-4 py-3 text-sm sm:text-base rounded-xl border
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
  placeholder:text-gray-400
  ${isDark
    ? "bg-gray-800/50 text-white border-gray-700/50 hover:border-gray-600/60"
    : "bg-white text-gray-900 border-gray-200 hover:border-gray-300"
  }`;

function ContactMe() {
  const { theme, isDark } = useContext(ThemeContext);
  const [showAlert, setShowAlert] = useState(false);
  const [data, setData] = useState({ name: "", email: "", subject: "", phone: "", body: "" });

  const handleFormInput = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(data);
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
          ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}
        `}>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500/15 shrink-0">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm">Message sent!</p>
            <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Thank you for reaching out.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold
            ${isDark ? "text-white" : "text-gray-900"}`}>
            Contact <span className="text-amber-500">Me</span>
          </h2>
          <p className={`mt-3 text-sm sm:text-base
            ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            Have a project in mind? Let's talk.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleFormSubmit}
          className={`
            max-w-2xl mx-auto rounded-2xl border p-5 sm:p-8
            ${isDark
              ? "bg-gray-900/40 border-gray-700/30"
              : "bg-white/60 border-gray-200"
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
              bg-amber-500 hover:bg-amber-600 active:scale-95
              text-white font-semibold
              px-10 py-3 rounded-xl text-sm sm:text-base
              transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/20
            "
          >
            Send Message →
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactMe;