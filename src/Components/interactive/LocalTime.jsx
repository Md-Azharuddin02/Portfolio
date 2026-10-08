import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

// Live clock in my working timezone — tells visitors when a reply is likely.
export function LocalTime({ className = "", showSeconds = true }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = formatter.format(now).split(":");
  const time = showSeconds ? parts.join(":") : parts.slice(0, 2).join(":");

  return (
    <time dateTime={now.toISOString()} className={`tabular-nums ${className}`} aria-label={`Local time ${parts.slice(0, 2).join(":")} IST`}>
      {time} IST
    </time>
  );
}
