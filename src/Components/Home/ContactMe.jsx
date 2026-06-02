import React, { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ThemeContext } from "../../Store/ThemeContext ";
import { MagneticButton } from "../interactive/MagneticButton";
import { Button } from "../ui/Button";
import { fadeUp, staggerContainer } from "../../lib/motion";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  subject: z.string().min(3, "Add a subject"),
  body: z.string().min(10, "Tell me a little more"),
});

function Field({ label, error, as = "input", isDark, ...props }) {
  const Comp = as;
  return (
    <label className="group relative block">
      <Comp
        {...props}
        placeholder=" "
        className={`peer w-full rounded-xl border px-4 pb-2.5 pt-5 text-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-400/35 ${
          isDark ? "border-white/10 bg-white/[0.045] text-white hover:border-cyan-300/30" : "border-slate-200 bg-white text-slate-950 hover:border-cyan-700/25"
        } ${error ? "border-rose-400 focus:ring-rose-400/30" : ""}`}
      />
      <span className={`pointer-events-none absolute left-4 top-3 text-xs font-semibold transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs ${isDark ? "text-slate-400 peer-focus:text-cyan-200" : "text-slate-500 peer-focus:text-cyan-700"}`}>
        {label}
      </span>
      {error && <span className="mt-1 block text-xs font-semibold text-rose-400">{error.message}</span>}
    </label>
  );
}

function ContactMe() {
  const { theme, isDark } = useContext(ThemeContext);
  const [showToast, setShowToast] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    const subject = encodeURIComponent(data.subject || "Portfolio inquiry");
    const body = encodeURIComponent(`Hi Azhar,\n\n${data.body}\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}`);
    window.location.href = `mailto:mdazharuddin02@gmail.com?subject=${subject}&body=${body}`;
    reset();
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <section id="contact" className={`relative overflow-hidden ${theme?.themeColor} py-16 sm:py-20`} aria-labelledby="contact-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(34,211,238,.14),transparent_28rem),radial-gradient(circle_at_80%_80%,rgba(52,211,153,.12),transparent_26rem)]" />
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed left-1/2 top-20 z-[1300] w-[90vw] max-w-sm -translate-x-1/2"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            aria-live="polite"
          >
            <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-xl ${isDark ? "border-white/10 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-950"}`}>
              <CheckCircle2 className="text-emerald-400" />
              <div>
                <p className="text-sm font-black">Email draft prepared</p>
                <p className={`mt-0.5 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Your mail app will open with the details.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <h2 id="contact-title" className={`text-3xl font-black sm:text-4xl lg:text-5xl ${isDark ? "text-white" : "text-slate-950"}`}>
              Start a <span className="text-cyan-400">Project</span>
            </h2>
            <p className={`mt-3 text-sm sm:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>Have a product concept or AI feature in mind? Share the details and let's ship it.</p>
          </motion.div>

          <motion.form
            variants={fadeUp}
            onSubmit={handleSubmit(onSubmit)}
            className={`mx-auto max-w-2xl rounded-2xl border p-5 shadow-[0_24px_90px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8 ${isDark ? "border-white/10 bg-white/[0.045]" : "border-slate-200 bg-white/80"}`}
            noValidate
          >
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" isDark={isDark} error={errors.name} {...register("name")} />
              <Field label="Email Address" isDark={isDark} error={errors.email} type="email" {...register("email")} />
            </div>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Mobile Number" isDark={isDark} error={errors.phone} type="tel" {...register("phone")} />
              <Field label="Email Subject" isDark={isDark} error={errors.subject} {...register("subject")} />
            </div>
            <Field label="Your Message" as="textarea" rows={5} isDark={isDark} error={errors.body} {...register("body")} />
            <div className="mt-6 flex justify-center">
              <MagneticButton>
                <Button type="submit" className="motion-safe:active:scale-95">
                  Prepare Email <Send size={16} />
                </Button>
              </MagneticButton>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactMe;
