"use client";

import { useEffect, useState } from "react";

/* Pinned floating glass card — Yai brand panel.
 * Locked to the top-right of the viewport with position: fixed.
 * Expands wider when the sidebar is collapsed so it can host more content. */

const PANEL_W = 220;          // width when sidebar visible
const PANEL_W_EXPANDED = 440;  // width when sidebar collapsed
const PANEL_H = 780;
const TOP_OFFSET  = 24;
const RIGHT_OFFSET = 24;

export function FloatingGlass() {
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    try { localStorage.removeItem("yai-glass-pos"); } catch {}

    // React to sidebar collapse so the glass can stretch to use the space.
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("yai-sidebar-collapsed");
        if (saved === "1") setSidebarCollapsed(true);
      }
    } catch {}
    const onSidebar = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      setSidebarCollapsed(Boolean(detail));
    };
    window.addEventListener("yai-sidebar-collapsed", onSidebar);
    return () => window.removeEventListener("yai-sidebar-collapsed", onSidebar);
  }, []);

  if (!mounted) return null;

  const width = sidebarCollapsed ? PANEL_W_EXPANDED : PANEL_W;

  return (
    <div
      className="fixed z-40 no-print select-none"
      style={{ top: `${TOP_OFFSET}px`, right: `${RIGHT_OFFSET}px` }}
    >
      <div
        className="relative rounded-3xl overflow-hidden transition-[width] duration-500 ease-out"
        style={{
          width: `${width}px`,
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
        {/* Q&A header — pinned top-center */}
        <div className="absolute inset-x-0 top-4 flex justify-center pointer-events-none">
          <h2 className="text-yai-navy/85 font-extrabold tracking-[0.18em] text-base sm:text-lg">
            Q&amp;A
          </h2>
        </div>

        {/* Q&A content goes here — reserved */}
      </div>
    </div>
  );
}

