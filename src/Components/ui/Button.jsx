import React from "react";
import { cn } from "../../lib/utils";

const variants = {
  primary: "bg-accent text-slate-950 shadow-glow hover:bg-cyan-300",
  secondary: "border border-white/15 bg-white/[0.04] text-white hover:border-cyan-300/40 hover:bg-white/[0.08] dark:text-white",
  ghost: "text-current hover:bg-white/10",
};

export const Button = React.forwardRef(
  ({ as: Comp = "button", variant = "primary", className, children, ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-black transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  ),
);

Button.displayName = "Button";
