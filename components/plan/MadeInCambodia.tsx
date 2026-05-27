"use client";

/**
 * "Made in Cambodia" badge with a tiny Cambodia flag (blue / red / blue
 * horizontal stripes, mid-stripe wider — true to the actual flag proportions).
 *
 * Two variants:
 *  - "light"  for use on white / light backgrounds (dark text)
 *  - "dark"   for use on the navy/leather backgrounds (white text)
 */
export function MadeInCambodia({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const textClass =
    variant === "dark"
      ? "text-white/85"
      : "text-yai-navy/80";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Mini flag — Cambodia: blue / red(2x) / blue horizontal stripes */}
      <span
        className="flex flex-col w-5 h-3.5 overflow-hidden rounded-[2px] shadow-sm shrink-0 ring-1 ring-black/10"
        aria-hidden
      >
        <span className="flex-1 bg-[#032EA1]" />
        <span className="flex-[2] bg-[#CE1126]" />
        <span className="flex-1 bg-[#032EA1]" />
      </span>
      <span
        className={`text-[11px] font-bold tracking-[0.14em] uppercase ${textClass}`}
      >
        Made in Cambodia
      </span>
    </span>
  );
}
