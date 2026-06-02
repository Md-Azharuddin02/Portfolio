import { useContext } from "react";
import { ThemeContext } from "../../Store/ThemeContext ";
import { cn } from "../../lib/utils";

export function Badge({ children, className = "" }) {
  const { isDark } = useContext(ThemeContext);
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-sm ${
        isDark
          ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
          : "border-cyan-600/30 bg-cyan-500/10 text-cyan-800"
      } ${className}`}
    >
      {children}
    </span>
  );
}
