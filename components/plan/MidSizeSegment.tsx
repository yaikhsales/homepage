"use client";

import { useState } from "react";
import { MilestoneRoadmap, type Milestone } from "./MilestoneRoadmap";
import { usePrintMode } from "@/lib/usePrintMode";

/**
 * Mid-size Cambodia factories segment with INTERACTIVE per-factory pathway.
 * Factories are grouped in cohorts of 3 (Cohort 1 → Q2 2026 live, Cohort 2 → Q3 2026 next 3, ...).
 * Hover any factory card → the pathway area below switches to that factory's specific story.
 */

type Status = "done" | "progress" | "planned";

type Factory = {
  num: string;            // "01", "02", ... — overall position in journey
  cohort: number;         // 1 = first 3, 2 = next 3, etc.
  cohortDate: string;     // "Q2 2026"
  t: string;              // factory name
  loc: string;            // city / SEZ / country
  n: string;              // short one-line summary shown on card
  s: Status;              // current status
  pathway: Milestone[];   // dedicated multi-stage pathway shown when hovered
};

const SEG_COLOR = "#0A3327";   // dark forest green — Mid-size signature colour
const SEG_BG    = "#E8F0EC";

const FACTORIES: Factory[] = [
  // ─── COHORT 1 — Q2 2026 (LIVE) ────────────────────────────────────────────────
  {
    num: "01", cohort: 1, cohortDate: "Q2 2026",
    t: "Yorkmars Cambodia", loc: "Phnom Penh · Garment",
    n: "Anchor pilot. Full Digitalization stack on the floor.",
    s: "done",
    pathway: [
      { d: "Q4 2025", t: "01 · Floor visit + owner demo",        s: "done",     n: "Identified pain points: WIP visibility, payroll." },
      { d: "Q1 2026", t: "02 · 3-month pilot contract signed",  s: "done",     n: "Free pilot to prove platform on real orders." },
      { d: "Q2 2026", t: "03 · YPM order tracking live",         s: "done",     n: "Cutting → sewing → finishing visible owner-side." },
      { d: "Q2 2026", t: "04 · QMS + WIP modules added",         s: "done",     n: "Full Digitalization tier live." },
      { d: "Q3 2026", t: "05 · Convert to paid Cloud Growth",    s: "progress", n: "Move pilot → $1,500/yr Cloud Growth tier." },
      { d: "Q4 2026", t: "06 · YTM machine-control rollout",     s: "planned",  n: "Next step up the ladder — machine telemetry." },
    ],
  },
  {
    num: "02", cohort: 1, cohortDate: "Q2 2026",
    t: "Caswell Cambodia", loc: "Bavet SEZ · Garment + Footwear",
    n: "Sister factory of Yorkmars. Owner-to-owner referral.",
    s: "done",
    pathway: [
      { d: "Q1 2026", t: "01 · Referred via Yorkmars owner",     s: "done",     n: "Trust transfer — saw it working at Yorkmars." },
      { d: "Q2 2026", t: "02 · YPM + QMS baseline rolled out",   s: "done",     n: "Same Digitalization stack as Yorkmars." },
      { d: "Q3 2026", t: "03 · Adding YTM machine control",      s: "progress", n: "Cutting + sewing machine telemetry layer." },
      { d: "Q4 2026", t: "04 · Growth tier subscription",        s: "planned",  n: "Convert to paid tier alongside Yorkmars." },
    ],
  },
  {
    num: "03", cohort: 1, cohortDate: "Q2 2026",
    t: "Yorksky China", loc: "Guangdong · Garment",
    n: "First China customer. Cross-border deployment.",
    s: "done",
    pathway: [
      { d: "Q1 2026", t: "01 · Mandarin demo via WeChat",        s: "done",     n: "Initial product walkthrough in Mandarin." },
      { d: "Q2 2026", t: "02 · Simplified-Chinese UI live",      s: "done",     n: "Localised interface for floor staff." },
      { d: "Q3 2026", t: "03 · USD invoice / RMB settle layer",  s: "planned",  n: "Cross-border payment rail for billing." },
      { d: "Q4 2026", t: "04 · Reference for China expansion",   s: "planned",  n: "Case study to seed 5 more China factories." },
    ],
  },

  // ─── COHORT 2 — Q3 2026 (TBD names — pipeline) ───────────────────────────────
  {
    num: "04", cohort: 2, cohortDate: "Q3 2026",
    t: "— to be confirmed —", loc: "Pipeline",
    n: "Next 3-factory wave. Owner identified, contract pending.",
    s: "planned",
    pathway: [
      { d: "Q3 2026", t: "01 · Pilot agreement", s: "planned", n: "Onboard via seminar series referral." },
    ],
  },
  {
    num: "05", cohort: 2, cohortDate: "Q3 2026",
    t: "— to be confirmed —", loc: "Pipeline",
    n: "Next 3-factory wave.",
    s: "planned",
    pathway: [
      { d: "Q3 2026", t: "01 · Pilot agreement", s: "planned" },
    ],
  },
  {
    num: "06", cohort: 2, cohortDate: "Q3 2026",
    t: "— to be confirmed —", loc: "Pipeline",
    n: "Next 3-factory wave.",
    s: "planned",
    pathway: [
      { d: "Q3 2026", t: "01 · Pilot agreement", s: "planned" },
    ],
  },

  // ─── COHORT 3 — Q4 2026 ──────────────────────────────────────────────────────
  {
    num: "07", cohort: 3, cohortDate: "Q4 2026",
    t: "— to be confirmed —", loc: "Pipeline",
    n: "Cohort 3 — scaling phase begins.",
    s: "planned",
    pathway: [
      { d: "Q4 2026", t: "01 · Pilot agreement", s: "planned" },
    ],
  },
  {
    num: "08", cohort: 3, cohortDate: "Q4 2026",
    t: "— to be confirmed —", loc: "Pipeline",
    n: "Cohort 3 — scaling phase.",
    s: "planned",
    pathway: [
      { d: "Q4 2026", t: "01 · Pilot agreement", s: "planned" },
    ],
  },
  {
    num: "09", cohort: 3, cohortDate: "Q4 2026",
    t: "— to be confirmed —", loc: "Pipeline",
    n: "Cohort 3 — scaling phase.",
    s: "planned",
    pathway: [
      { d: "Q4 2026", t: "01 · Pilot agreement", s: "planned" },
    ],
  },
];

const STATUS_ICON: Record<Status, string> = { done: "✓", progress: "◐", planned: "○" };
const STATUS_COLOR: Record<Status, string> = { done: "#10B981", progress: "#F37021", planned: "#94A3B8" };

// Group factories by cohort for the header rows
const COHORTS = Array.from(new Set(FACTORIES.map((f) => f.cohort))).sort((a, b) => a - b);

export function MidSizeSegment() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isOpenState, setIsOpen] = useState(false);
  const printing = usePrintMode();
  const isOpen = isOpenState || printing;
  const active = FACTORIES[activeIdx];

  return (
    <div className={`rounded-xl border border-yai-border bg-white ${isOpen ? "" : "shadow-sm"}`}>
      {/* Segment header — clickable to expand/collapse */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        className={`w-full flex items-start gap-3 p-4 text-left rounded-t-xl transition-colors ${isOpen ? "border-b border-yai-border" : "rounded-b-xl"}`}
        style={{ background: SEG_BG }}
      >
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-1 flex-wrap">
            <span
              className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded text-white"
              style={{ background: SEG_COLOR }}
            >
              MID-SIZE
            </span>
            <h4 className="font-extrabold text-yai-navy text-base leading-tight">
              Mid-size Cambodia factories
            </h4>
          </div>
          <p className="text-xs text-gray-700 leading-snug max-w-3xl">
            $120 → $15,000 / yr · Garment, bag, footwear. ~300 may stop at Digitalization, ~500 climb
            the full ladder to Ai. We onboard in <strong>cohorts of 3</strong> — each factory has its
            own pathway.
            {isOpen && <> <strong>Hover any factory</strong> below to see its specific story.</>}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">Reachable</div>
            <div className="text-lg font-extrabold tabular-nums text-right" style={{ color: SEG_COLOR }}>~800</div>
          </div>
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-sm"
            style={{ background: SEG_COLOR }}
          >
            {isOpen ? "Hide detail" : "Detail"}
            <span className="text-[10px] leading-none">{isOpen ? "▲" : "▼"}</span>
          </span>
        </div>
      </button>

      {!isOpen ? null : <>
      {/* Factory cards — grouped by cohort row */}
      <div className="px-4 pt-4 pb-2 space-y-3">
        {COHORTS.map((cohortNum) => {
          const cohortFactories = FACTORIES.map((f, i) => ({ ...f, idx: i })).filter((f) => f.cohort === cohortNum);
          const cohortLabel =
            cohortNum === 1 ? "Cohort 1 · Live anchors" :
            cohortNum === 2 ? "Cohort 2 · Next 3 (pipeline)" :
            `Cohort ${cohortNum} · Scaling`;
          return (
            <div key={cohortNum}>
              <div className="flex items-baseline gap-2 mb-1.5">
                <div
                  className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-white"
                  style={{ background: SEG_COLOR }}
                >
                  {cohortLabel}
                </div>
                <div className="text-[10px] text-gray-500">{cohortFactories[0].cohortDate}</div>
              </div>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cohortFactories.map((p) => {
                  const isActive = p.idx === activeIdx;
                  return (
                    <li key={p.num}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIdx(p.idx)}
                        onFocus={() => setActiveIdx(p.idx)}
                        onClick={() => setActiveIdx(p.idx)}
                        className={`group w-full text-left flex items-start gap-2 text-xs rounded-lg p-2.5 transition-all duration-200 cursor-pointer focus:outline-none ${
                          isActive
                            ? "shadow-lg scale-[1.02] relative z-10"
                            : "hover:bg-gray-50"
                        }`}
                        style={isActive ? { background: "#FFFFFF", border: `2px solid ${SEG_COLOR}` } : { border: "2px solid transparent" }}
                      >
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white font-extrabold text-[12px] shrink-0"
                          style={{ background: SEG_COLOR }}
                        >
                          {p.num}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white font-bold text-[9px] shrink-0"
                              style={{ background: STATUS_COLOR[p.s] }}
                            >
                              {STATUS_ICON[p.s]}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">{p.cohortDate}</span>
                          </div>
                          <div className="font-bold text-yai-navy leading-tight">{p.t}</div>
                          <div className="text-[10px] text-gray-500 italic mt-0.5">{p.loc}</div>
                          <div className="text-gray-600 leading-snug mt-0.5">{p.n}</div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Active factory's pathway — switches as user hovers a card above.
       *  In print: render EVERY factory's pathway so PDF is complete. */}
      {printing ? (
        FACTORIES.map((f) => (
          <div
            key={f.num}
            className="px-4 pt-3 pb-4 border-t-2 mt-2"
            style={{ borderColor: `${SEG_COLOR}40`, background: `${SEG_COLOR}08` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
                  Pathway for
                </div>
                <div className="text-base font-extrabold" style={{ color: SEG_COLOR }}>
                  {f.t} <span className="text-gray-500 font-normal text-xs">· {f.loc}</span>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 italic">
                {f.pathway.length} stage{f.pathway.length === 1 ? "" : "s"}
              </div>
            </div>
            <MilestoneRoadmap milestones={f.pathway} color={SEG_COLOR} />
          </div>
        ))
      ) : (
        <div className="px-4 pt-3 pb-4 border-t-2 mt-2" style={{ borderColor: `${SEG_COLOR}40`, background: `${SEG_COLOR}08` }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
                Pathway for
              </div>
              <div className="text-base font-extrabold" style={{ color: SEG_COLOR }}>
                {active.t} <span className="text-gray-500 font-normal text-xs">· {active.loc}</span>
              </div>
            </div>
            <div className="text-[10px] text-gray-500 italic">
              Hover a factory above to switch · {active.pathway.length} stage{active.pathway.length === 1 ? "" : "s"}
            </div>
          </div>
          <MilestoneRoadmap milestones={active.pathway} color={SEG_COLOR} />
        </div>
      )}
      </>}
    </div>
  );
}
