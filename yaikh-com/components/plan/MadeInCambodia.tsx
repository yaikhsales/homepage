"use client";

/**
 * "Made in Cambodia" badge — uses the real Cambodian flag PNG (with proper
 * Angkor Wat detail) instead of a hand-drawn SVG silhouette.
 *
 * Source: /public/images/flag-cambodia.png (official-quality PNG).
 *
 * Variants:
 *  - "light"  → dark text (white/light backgrounds)
 *  - "dark"   → white text (navy/dark backgrounds)
 * Sizes: "sm" (inline chip) · "lg" (hero banner)
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

  // Flag dimensions (Cambodian flag is 2:1 — wide).
  const flagDim = isLg ? "w-20 h-10" : "w-7 h-3.5";
  const flagFx  = isLg ? "ring-2 shadow-md rounded-[3px]" : "ring-1 shadow-sm rounded-[2px]";
  const textSize = isLg
    ? "text-base sm:text-lg font-extrabold tracking-[0.22em]"
    : "text-[11px] font-bold tracking-[0.14em]";
  const gap = isLg ? "gap-3" : "gap-2";

  return (
    <span className={`inline-flex items-center ${gap} ${className}`}>
      <img
        src="/images/flag-cambodia.png"
        alt="Flag of Cambodia"
        className={`shrink-0 ring-black/10 object-cover ${flagDim} ${flagFx}`}
      />
      <span className={`uppercase ${textSize} ${textClass}`}>
        Made in Cambodia
      </span>
    </span>
  );
}
