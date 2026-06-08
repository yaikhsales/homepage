"use client";

import { useEffect, useState } from "react";

/* Pinned floating glass card — Yai brand panel.
 * Locked to the top-right of the viewport with position: fixed, no longer
 * draggable. Stays put when the page scrolls. */

const PANEL_W = 220;
const PANEL_H = 780;
const TOP_OFFSET  = 24;   // gap from the very top of the viewport
const RIGHT_OFFSET = 24;  // gap from the right edge

export function FloatingGlass() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Clean up any stale dragged position from when the panel was draggable.
    try { localStorage.removeItem("yai-glass-pos"); } catch {}
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed z-40 no-print select-none"
      style={{ top: `${TOP_OFFSET}px`, right: `${RIGHT_OFFSET}px` }}
    >
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          width: `${PANEL_W}px`,
          height: `${PANEL_H}px`,
          maxWidth: "calc(100vw - 40px)",
          // Much lighter blur so text behind is still legible, no white wash.
          backdropFilter: "blur(8px) saturate(160%)",
          WebkitBackdropFilter: "blur(8px) saturate(160%)",
          // Nearly invisible tint — content behind dominates the look.
          background: "rgba(255, 255, 255, 0.04)",
          // Soft outer shadow for floating elevation; subtle inner highlight only.
          boxShadow:
            "0 20px 50px -20px rgba(10,31,71,0.3), 0 2px 6px rgba(10,31,71,0.05), inset 0 1px 0 rgba(255,255,255,0.45)",
          border: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        {/* Soft specular sheen at the top — only ~15% opacity so it doesn't block content */}
        <div
          className="absolute inset-x-0 top-0 h-[20%] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
          }}
        />
        {/* Left-edge highlight */}
        <div
          className="absolute inset-y-0 left-0 w-px pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.2) 70%, transparent 100%)",
          }}
        />
        {/* Right-edge highlight */}
        <div
          className="absolute inset-y-0 right-0 w-px pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.1) 70%, transparent 100%)",
          }}
        />
        {/* Empty — reserved for a different purpose */}
      </div>
    </div>
  );
}

