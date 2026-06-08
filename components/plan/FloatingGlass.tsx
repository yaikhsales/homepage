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

/** Q&A items shown in the floating glass panel. Each one is a numbered
 *  card. If `anchor` is set, the card is clickable and smooth-scrolls to
 *  that DOM id. If omitted, the card renders as a 'for discussion'
 *  placeholder — no link, dimmer styling, italic note. */
const QA_ITEMS: Array<{ n: number; text: string; anchor?: string; note?: string }> = [
  { n: 1, text: "Sales plan covering at least the next six to twelve months",                          anchor: "sales-expenses-budget" },
  { n: 2, text: "How we plan to market the Texlink platform",                                          anchor: "customers" },
  { n: 3, text: "Exhibitions and events (offline)",                                                    anchor: "gtm" },
  { n: 4, text: "Core Applications retain for YW",                                                     note: "for discussion" },
  { n: 5, text: "A complete list of all Admin modules, together with their current acceptance status", anchor: "traction" },
  { n: 6, text: "A phased approach to starting the business",                                          anchor: "pricing" },
];

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

        {/* Q&A items — numbered clickable jumps, or a 'for discussion'
         *  placeholder when no anchor is set. */}
        <div className="absolute inset-x-0 top-14 px-4 space-y-2.5">
          {QA_ITEMS.map((q) =>
            q.anchor ? (
              <a
                key={q.n}
                href={`#${q.anchor}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(q.anchor!);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.replaceState(null, "", `#${q.anchor}`);
                  }
                }}
                className="block rounded-xl border border-white/45 bg-white/60 backdrop-blur-sm px-3 py-2.5 text-yai-navy hover:bg-white/85 hover:border-yai-blue/40 hover:shadow-md transition group"
              >
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yai-blue text-white text-[10px] font-extrabold shrink-0 mt-0.5">
                    {q.n}
                  </span>
                  <span className="text-[11.5px] leading-snug font-semibold group-hover:text-yai-blue transition">
                    {q.text}
                  </span>
                </div>
              </a>
            ) : (
              <div
                key={q.n}
                className="rounded-xl border border-dashed border-yai-navy/25 bg-white/35 backdrop-blur-sm px-3 py-2.5 text-yai-navy/70"
                title="No link attached — to be discussed"
              >
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yai-navy/40 text-white text-[10px] font-extrabold shrink-0 mt-0.5">
                    {q.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11.5px] leading-snug font-semibold">{q.text}</div>
                    {q.note && (
                      <div className="text-[9.5px] uppercase tracking-[0.15em] italic text-yai-orange/80 mt-0.5">
                        {q.note}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

