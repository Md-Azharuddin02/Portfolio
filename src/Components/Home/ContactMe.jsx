import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MagneticButton } from "../interactive/MagneticButton";
import { LocalTime } from "../interactive/LocalTime";
import { Button } from "../ui/Button";
import { fadeUp, staggerContainer } from "../../lib/motion";
import { SectionHeading } from "../ui/SectionHeading";

const EMAIL = "mdazharuddin02@gmail.com";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  subject: z.string().min(3, "Add a subject"),
  body: z.string().min(10, "Tell me a little more"),
});

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Md-Azharuddin02", handle: "@Md-Azharuddin02" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mdazharuddin02/", handle: "in/mdazharuddin02" },
  { label: "X / Twitter", href: "https://x.com/Md_Azharuddin02", handle: "@Md_Azharuddin02" },
];

// Underlined editorial field with a persistent visible label (never placeholder-only).
const Field = React.forwardRef(function Field({ label, error, as = "input", name, className = "", ...props }, ref) {
  const Comp = as;
  const errorId = `${name}-error`;
  return (
    <label className={`group block ${className}`}>
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted transition-colors group-focus-within:text-ink">{label}</span>
      <Comp
        {...props}
        ref={ref}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 w-full resize-none border-b bg-transparent pb-3 text-lg text-ink transition-colors duration-300 placeholder:text-ink-muted/60 focus:outline-none ${
          error ? "border-red-500" : "border-ink/20 hover:border-ink/50 focus:border-ink"
        }`}
      />
      {error && (
        <span id={errorId} role="alert" className="mt-2 block text-xs text-red-600 dark:text-red-400">
          {error.message}
        </span>
      )}
    </label>
  );
});

function ContactMe() {
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const onSubmit = (data) => {
    const subject = encodeURIComponent(data.subject || "Portfolio inquiry");
    const body = encodeURIComponent(`Hi Azhar,\n\n${data.body}\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    reset();
    setToast("Email draft prepared — your mail app will open with the details.");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setToast(EMAIL);
    }
  };

  return (
    <section id="contact" className="relative bg-canvas py-20 text-ink sm:py-32 lg:py-40" aria-labelledby="contact-title">
      <AnimatePresence>
        {toast && (
          <motion.p
            role="status"
            className="fixed bottom-6 left-1/2 z-[1300] w-[90vw] max-w-md -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-center text-sm text-canvas"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <SectionHeading id="contact-title" index="05" eyebrow="Contact" title="Have an idea?" accent="Let's build it." />

          <div className="grid grid-cols-12 gap-x-6 gap-y-12 sm:gap-y-16">
            <motion.div variants={fadeUp} className="col-span-12 lg:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">Write to me</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${EMAIL}`}
                  data-cursor-label="Email"
                  className="group font-display text-[clamp(1.4rem,2.4vw,2.25rem)] font-medium tracking-[-0.02em] text-ink [overflow-wrap:anywhere] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-out-expo group-hover:bg-[length:0%_1px]">
                    {EMAIL}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                  className="grid h-10 w-10 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={copied ? "ok" : "copy"} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.2 }}>
                      {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
              <p className="mt-4 text-sm text-ink-muted">
                My local time is <LocalTime showSeconds={false} className="text-ink" />.
              </p>

              <ul className="mt-14 hidden border-t border-ink/15 sm:block">
                {SOCIALS.map((s) => (
                  <li key={s.label} className="border-b border-ink/15">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <span className="text-[15px] text-ink">{s.label}</span>
                      <span className="flex items-center gap-3 font-mono text-[11px] text-ink-muted transition-colors group-hover:text-ink">
                        {s.handle}
                        <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.form
              id="contact-form"
              variants={fadeUp}
              onSubmit={handleSubmit(onSubmit)}
              className="col-span-12 grid grid-cols-2 gap-x-8 gap-y-7 sm:gap-y-10 lg:col-span-6 lg:col-start-7"
              noValidate
            >
              <Field label="Name" autoComplete="name" error={errors.name} className="col-span-2 sm:col-span-1" {...register("name")} />
              <Field label="Email" type="email" autoComplete="email" error={errors.email} className="col-span-2 sm:col-span-1" {...register("email")} />
              <Field label="Phone" type="tel" autoComplete="tel" error={errors.phone} className="col-span-2 sm:col-span-1" {...register("phone")} />
              <Field label="Subject" error={errors.subject} className="col-span-2 sm:col-span-1" {...register("subject")} />
              <Field label="Project details" as="textarea" rows={3} error={errors.body} className="col-span-2" {...register("body")} />
              <div className="col-span-2 flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-[16rem] text-xs leading-relaxed text-ink-muted">Opens your mail app with everything pre-filled — nothing is stored on a server.</p>
                <MagneticButton>
                  <Button type="submit" data-cursor-label="Send">
                    Send message <Send size={15} aria-hidden="true" />
                  </Button>
                </MagneticButton>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactMe;
