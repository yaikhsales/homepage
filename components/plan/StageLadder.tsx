"use client";

import { motion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Inline SVG icon set                                                        */
/* -------------------------------------------------------------------------- */

const stroke = { fill: "none" as const, stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const Icon = {
  paper: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M9 13h6M9 17h6"/></svg>
  ),
  books: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M4 19V5a2 2 0 0 1 2-2h10v18H6a2 2 0 0 1-2-2z"/><path d="M16 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2"/><path d="M8 7h6M8 11h6M8 15h4"/></svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
  ),
  running: (
    <svg viewBox="0 0 24 24" {...stroke}><circle cx="13" cy="4" r="2"/><path d="M4 22l5-7 3 3 5-2 3 4"/><path d="M9 11l3-3 4 1 1 5-3 3-3-2-2 4"/></svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" {...stroke}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
  ),
  spreadsheet: (
    <svg viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
  ),
  mobile: (
    <svg viewBox="0 0 24 24" {...stroke}><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>
  ),
  tablet: (
    <svg viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M11 19h2"/></svg>
  ),
  barcode: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M3 5v14M6 5v14M9 5v14M12 5v14M15 5v14M18 5v14M21 5v14"/></svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" {...stroke}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/></svg>
  ),
  brain: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M9 4a3 3 0 0 0-3 3v0a3 3 0 0 0-3 3 3 3 0 0 0 1 2.2A3 3 0 0 0 5 16a3 3 0 0 0 3 3 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 3-3 3 3 0 0 0 1-3.8 3 3 0 0 0 1-2.2 3 3 0 0 0-3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 1 3 3 0 0 0-3-1z"/><path d="M12 5v14"/></svg>
  ),
  dashboard: (
    <svg viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M7 13l3-3 3 2 4-5"/><path d="M3 21h18"/></svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M12 22s7-7.6 7-13a7 7 0 0 0-14 0c0 5.4 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>
  ),
  bot: (
    <svg viewBox="0 0 24 24" {...stroke}><rect x="4" y="8" width="16" height="11" rx="2"/><circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/><path d="M12 4v4M9 21l1 1M14 21l1 1"/></svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M3 21V3"/><path d="M3 21h18"/><path d="M7 17V12M11 17V9M15 17V14M19 17V7"/><path d="M19 7l-3-2"/></svg>
  ),
  crown: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M3 19h18l-2-10-5 4-2-7-2 7-5-4z"/></svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" {...stroke}><rect x="4" y="3" width="16" height="18"/><path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2"/><path d="M10 21v-4h4v4"/></svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" {...stroke}><path d="M12 3v3M12 18v3M5 12H2M22 12h-3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  cpu: (
    <svg viewBox="0 0 24 24" {...stroke}><rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3"/><path d="M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3"/></svg>
  ),
  solarRack: (
    <svg viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="4" r="1.6"/><path d="M12 1.4v0.8M12 6.6v0.8M9.6 4h-0.8M15.2 4h-0.8M10.4 2.4l-0.5-0.5M14.1 2.4l0.5-0.5M10.4 5.6l-0.5 0.5M14.1 5.6l0.5 0.5"/><rect x="5" y="10" width="14" height="11" rx="1"/><path d="M5 13.5h14M5 17h14"/><circle cx="7.5" cy="11.75" r="0.4" fill="currentColor"/><circle cx="7.5" cy="15.25" r="0.4" fill="currentColor"/><circle cx="7.5" cy="19" r="0.4" fill="currentColor"/></svg>
  ),
} as const;

type LayerIcon = { node: React.ReactNode; label: string };
type Layer = {
  num: number | "Today";
  name: string;
  subtitle: string;
  blurb: string;
  icons: LayerIcon[];
  variant: "before" | "platform" | "highlight" | "executive";
};

const LAYERS: Layer[] = [
  // top → bottom (Yai Layer 3 at top, "Today" at bottom)
  {
    num: 3,
    name: "Full Ai",
    subtitle: "Strategic management & growth",
    blurb: "Executive layer — senior management decisions, multi-factory control, expansion to new countries. At this level companies run their own Ai compute on solar-powered mini data centres — cost down, sustainability up.",
    variant: "executive",
    icons: [
      { node: Icon.globe,     label: "Multi-country" },
      { node: Icon.chart,     label: "Predictive growth" },
      { node: Icon.crown,     label: "Executive decisions" },
      { node: Icon.spark,     label: "Strategic Ai insights" },
      { node: Icon.building,  label: "Multi-factory" },
      { node: Icon.cpu,       label: "Own Ai computing" },
      { node: Icon.solarRack, label: "Solar-powered mini data centre" },
    ],
  },
  {
    num: 2,
    name: "Agentic",
    subtitle: "LLM-powered intelligent agents",
    blurb: "Ai agents refine workflows. Voice, text, dashboards and digital-twin visualisation on every device.",
    variant: "highlight",
    icons: [
      { node: Icon.mic,       label: "Voice-to-workflow" },
      { node: Icon.brain,     label: "LLM agents" },
      { node: Icon.dashboard, label: "Dashboards & DTV" },
      { node: Icon.bot,       label: "Real-time guidance" },
      { node: Icon.pin,       label: "Geo & logistics" },
    ],
  },
  {
    num: 1,
    name: "Digitalization",
    subtitle: "Centralised data",
    blurb: "Excel dashboards and digital records flow into one database. The foundation for everything above.",
    variant: "platform",
    icons: [
      { node: Icon.database,    label: "One database" },
      { node: Icon.spreadsheet, label: "Digital records" },
      { node: Icon.mobile,      label: "Mobile apps" },
      { node: Icon.tablet,      label: "Tablets" },
      { node: Icon.barcode,     label: "AIoT & scanners" },
    ],
  },
  {
    num: "Today",
    name: "Traditional Factory Work",
    subtitle: "Disconnected & manual — what Yai replaces",
    blurb: "The reality most garment factories are stuck in today. Yai doesn't deliver this layer; it replaces it.",
    variant: "before",
    icons: [
      { node: Icon.paper,   label: "Paper reports" },
      { node: Icon.books,   label: "Ledger books" },
      { node: Icon.chat,    label: "Scattered chat" },
      { node: Icon.pen,     label: "Manual signing" },
      { node: Icon.running, label: "Chasing approvals" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Per-variant styling                                                        */
/* -------------------------------------------------------------------------- */

function panelClass(v: Layer["variant"]) {
  switch (v) {
    case "before":
      return "bg-gray-50 border-2 border-dashed border-gray-300 text-gray-600";
    case "highlight":
      return "bg-gradient-to-r from-yai-blue to-[#2A5DC4] border-2 border-yai-blue text-white shadow-blue-glow";
    case "executive":
      return "bg-gradient-to-r from-[#0A3327] to-[#1A5742] border-2 border-[#0E3B2E] text-white";
    default: // platform — Layer 1 Digitalization (orange)
      return "bg-gradient-to-r from-[#FFF1E0] to-[#FFD9B5] border-2 border-yai-orange/40 text-yai-navy";
  }
}

function badgeClass(v: Layer["variant"]) {
  switch (v) {
    case "before":     return "bg-gray-300 text-gray-700";
    case "highlight":  return "bg-white text-yai-blue";
    case "executive":  return "bg-amber-400 text-[#0A3327]";
    default:           return "bg-yai-orange text-white";
  }
}

function iconColor(v: Layer["variant"]) {
  switch (v) {
    case "before":    return "text-gray-400";
    case "highlight": return "text-white";
    case "executive": return "text-white";
    default:          return "text-yai-orange";
  }
}

function blurbColor(v: Layer["variant"]) {
  switch (v) {
    case "before":    return "text-gray-500";
    case "highlight": return "text-white/85";
    case "executive": return "text-white/80";
    default:          return "text-yai-navy/70";
  }
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function StageLadder() {
  return (
    <div className="relative">
      {/* Evolution arrow rail (desktop only) */}
      <div className="hidden md:flex absolute -left-2 top-0 bottom-0 w-10 flex-col items-center pointer-events-none select-none z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-yai-blue"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </motion.div>
        <div className="flex-1 w-px bg-gradient-to-b from-yai-blue via-yai-blue/40 to-gray-300 my-2"></div>
        <div className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-bold tracking-[0.25em] uppercase text-yai-blue/60 py-2">
          Evolution
        </div>
        <div className="flex-1 w-px bg-gradient-to-b from-gray-300 to-gray-200 my-2"></div>
      </div>

      <div className="md:ml-10 space-y-3">
        {LAYERS.map((l, i) => (
          <motion.div
            key={l.num}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            className={`rounded-2xl overflow-hidden ${panelClass(l.variant)}`}
          >
            <div className="flex flex-col md:flex-row">
              {/* Left badge / title block */}
              <div className="md:w-72 shrink-0 p-5 md:p-6 md:border-r md:border-current/10">
                <div className={`inline-block text-[10px] font-extrabold tracking-[0.18em] px-2 py-1 rounded ${badgeClass(l.variant)}`}>
                  {l.num === "Today" ? "TODAY" : `LAYER ${l.num}`}
                </div>
                <h3 className={`text-2xl font-extrabold mt-3 ${l.variant === "before" ? "text-gray-600" : ""}`}>
                  {l.name}
                </h3>
                <p className={`text-[11px] italic mt-1 ${l.variant === "before" ? "text-gray-500" : "opacity-80"}`}>
                  {l.subtitle}
                </p>
                <p className={`text-sm leading-relaxed mt-3 ${blurbColor(l.variant)}`}>
                  {l.blurb}
                </p>
              </div>

              {/* Right icons row */}
              <div className={`flex-1 p-5 md:p-6 flex flex-wrap items-center justify-around gap-4 md:gap-2 ${iconColor(l.variant)}`}>
                {l.icons.map((ic, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: i * 0.1 + j * 0.08 }}
                    className="flex flex-col items-center text-center min-w-[64px] max-w-[110px]"
                  >
                    <div className="w-10 h-10">{ic.node}</div>
                    <div className={`text-[10.5px] leading-tight mt-2 ${l.variant === "before" ? "text-gray-500" : "opacity-90"}`}>
                      {ic.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
