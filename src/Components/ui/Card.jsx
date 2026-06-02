import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.045] shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
