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
  size = "sm",
  className = "",
}: {
  variant?: "light" | "dark";
  size?: "sm" | "lg";
  className?: string;
}) {
  const textClass =
    variant === "dark"
      ? "text-white/85"
      : "text-yai-navy/80";

  const isLg = size === "lg";

  // Flag and text dimensions scale with size variant.
  const flagDim = isLg ? "w-14 h-9" : "w-5 h-3.5";
  const flagRing = isLg ? "ring-2 shadow-md rounded-[3px]" : "ring-1 shadow-sm rounded-[2px]";
  const textSize = isLg
    ? "text-base sm:text-lg font-extrabold tracking-[0.22em]"
    : "text-[11px] font-bold tracking-[0.14em]";
  const gap = isLg ? "gap-3" : "gap-2";

  return (
    <span className={`inline-flex items-center ${gap} ${className}`}>
      {/* Cambodia flag — blue / red(2x) / blue horizontal stripes */}
      <span
        className={`flex flex-col overflow-hidden ring-black/10 shrink-0 ${flagDim} ${flagRing}`}
        aria-hidden
      >
        <span className="flex-1 bg-[#032EA1]" />
        <span className="flex-[2] bg-[#CE1126] flex items-center justify-center">
          {isLg && (
            // Stylised Angkor Wat silhouette — small white shape in the red stripe
            <svg viewBox="0 0 60 20" className="w-9 h-3 opacity-95" aria-hidden>
              <path
                fill="#FFFFFF"
                d="M0 20 L0 14 L6 14 L6 11 L9 11 L9 7 L12 7 L12 11 L16 11 L16 6 L19 6 L19 2 L23 2 L23 6 L26 6 L26 4 L30 0 L34 4 L34 6 L37 6 L37 2 L41 2 L41 6 L44 6 L44 11 L48 11 L48 7 L51 7 L51 11 L54 11 L54 14 L60 14 L60 20 Z"
              />
            </svg>
          )}
        </span>
        <span className="flex-1 bg-[#032EA1]" />
      </span>
      <span className={`uppercase ${textSize} ${textClass}`}>
        Made in Cambodia
      </span>
    </span>
  );
}
