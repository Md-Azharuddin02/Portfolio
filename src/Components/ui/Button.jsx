import React from "react";
import { cn } from "../../lib/utils";

const variants = {
  primary: "bg-brand-fill text-on-brand hover:bg-ink hover:text-canvas",
  secondary: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-canvas",
  ghost: "text-ink hover:bg-ink/5",
};

/**
 * Pill button with a "text roll" hover: the label slides up and a copy rolls in from below.
 * The duplicate is aria-hidden so assistive tech reads the label once.
 */
export const Button = React.forwardRef(
  ({ as: Comp = "button", variant = "primary", className, children, ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(
        "group/btn relative inline-flex min-h-[48px] cursor-pointer items-center justify-center overflow-hidden rounded-full px-6 text-sm font-medium transition-colors duration-500 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.98]",
        variants[variant],
        className,
      )}
      {...props}
    >
      <span className="relative block overflow-hidden">
        <span className="flex items-center gap-2 transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-full motion-reduce:transition-none">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex translate-y-full items-center gap-2 transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0 motion-reduce:transition-none"
        >
          {children}
        </span>
      </span>
    </Comp>
  ),
);

Button.displayName = "Button";
