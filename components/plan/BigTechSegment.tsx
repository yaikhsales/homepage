"use client";

import { useState } from "react";
import { MilestoneRoadmap, type Milestone } from "./MilestoneRoadmap";

/**
 * Big-tech & strategic partners segment with INTERACTIVE per-partner pathway.
 * Hover a partner card on top → the pathway area below switches to that partner's
 * specific multi-stage timeline. Each partner has its own pathway[] of sub-milestones.
 */

type Status = "done" | "progress" | "planned";

type Partner = {
  num: string;          // "01", "02", ...
  d: string;            // headline date e.g. "Q2 2026"
  t: string;            // partner title
  n: string;            // short summary visible on the card
  s: Status;            // overall status (highest stage reached)
  pathway: Milestone[]; // the dedicated multi-stage pathway shown when hovered
};

const SEG_COLOR = "#D4A017";
const SEG_BG    = "#FAF3DC";

const PARTNERS: Partner[] = [
  {
    num: "01",
    d: "Q2 2026",
    t: "Anthropic · Claude Partner Network",
    n: "Application cleared initial review. In team-certification phase.",
    s: "progress",
    pathway: [
      { d: "Q1 2026", t: "01 · CPN application submitted",       s: "done",     n: "Application sent to Claude Partner Network." },
      { d: "Q2 2026", t: "02 · Initial review cleared",          s: "done",     n: "Anthropic confirmed: approved to move forward." },
      { d: "Q3 2026", t: "03 · Team certification — 10 members", s: "progress", n: "Enrol 10 team in Anthropic Academy. CPN learning path." },
      { d: "Q3 2026", t: "04 · CPN learning path complete",      s: "planned",  n: "Confirm completions. Triggers CCAF unlock." },
      { d: "Q4 2026", t: "05 · CCAF certification achieved",     s: "planned",  n: "Claude Certified Architect Foundations — org cert." },
      { d: "Q4 2026", t: "06 · Partner Portal access",           s: "planned",  n: "Accept Network terms. Tier assigned." },
      { d: "Q1 2027", t: "07 · Featured-customer / case study",  s: "planned",  n: "Only after portal launch + tier confirmed." },
    ],
  },
  {
    num: "02",
    d: "Q3 2026",
    t: "Google Cloud for Startups",
    n: "Vertex AI credits + cloud hosting.",
    s: "planned",
    pathway: [
      { d: "Q2 2026", t: "01 · Apply to Google for Startups Cloud Program",     s: "progress", n: "Application form + AI-startup track." },
      { d: "Q3 2026", t: "02 · $200K Vertex AI + hosting credits granted",      s: "planned",  n: "2-year credit window." },
      { d: "Q4 2026", t: "03 · Move LLM inference + Nano Banana onto Vertex",  s: "planned",  n: "Migrate from Anthropic-direct to Vertex routing." },
      { d: "Q1 2027", t: "04 · Co-marketing case study with Google Cloud",     s: "planned",  n: "Cambodia / SE-Asia garment-tech reference." },
    ],
  },
  {
    num: "03",
    d: "Q3 2026",
    t: "JICA · Cambodia-Japan SME programme",
    n: "Bilateral funding + Japanese factory references.",
    s: "planned",
    pathway: [
      { d: "Q3 2026", t: "01 · Meeting with JICA Cambodia office",             s: "planned", n: "Position Yai inside the SME digital-transformation track." },
      { d: "Q4 2026", t: "02 · Apply to JICA innovation funding scheme",      s: "planned", n: "Joint Cambodia-Japan SME bilateral programme." },
      { d: "Q1 2027", t: "03 · Pilot with Japanese-owned Cambodian factory",  s: "planned", n: "Yokohama-owned garment factory in PP / Bavet." },
      { d: "Q2 2027", t: "04 · Featured in JICA case-study book",             s: "planned", n: "Cross-border tech success story." },
    ],
  },
  {
    num: "04",
    d: "Q4 2026",
    t: "Y Combinator / Antler / SE-Asia accelerator",
    n: "Brand validation + investor + intro network.",
    s: "planned",
    pathway: [
      { d: "Q3 2026", t: "01 · Apply to YC W27 (or Antler / Iterative)", s: "planned", n: "Investor + global intro network." },
      { d: "Q4 2026", t: "02 · Interview + decision",                    s: "planned", n: "If accepted, batch starts Jan 2027." },
      { d: "Q1 2027", t: "03 · 3-month accelerator program",             s: "planned", n: "Demo Day pitch to global investors." },
      { d: "Q2 2027", t: "04 · Demo Day · seed round closing",           s: "planned", n: "$500K–$2M seed, SAFE / convertible." },
    ],
  },
  {
    num: "05",
    d: "Q1 2027",
    t: "ADB / IFC garment-sector digital track",
    n: "Multilateral grant or financing for digital transformation.",
    s: "planned",
    pathway: [
      { d: "Q4 2026", t: "01 · Outreach to ADB Cambodia + IFC SEA office", s: "planned", n: "Garment-sector digital transformation case." },
      { d: "Q1 2027", t: "02 · Position inside Better Factories Cambodia",  s: "planned", n: "Joint ILO + IFC programme already running." },
      { d: "Q2 2027", t: "03 · Grant or concessional financing approved",   s: "planned", n: "$500K – $2M digital-transformation fund." },
      { d: "Q3 2027", t: "04 · Deploy across 20 GMAC member factories",     s: "planned", n: "Subsidised platform roll-out." },
    ],
  },
  {
    num: "06",
    d: "Q1 2026",
    t: "ABA + Wing · Cambodia payment rails",
    n: "Payroll auto-disbursement live. B2B + worker P2P next.",
    s: "progress",
    pathway: [
      { d: "Q4 2025", t: "01 · ABA payroll API integration",         s: "done",     n: "Cambodia's largest bank — direct disbursement." },
      { d: "Q4 2025", t: "02 · Wing wallet integration",             s: "done",     n: "Dominant mobile-money network for workers." },
      { d: "Q2 2026", t: "03 · Worker mobile-app payroll receipt",   s: "progress", n: "Workers see payslip + payment land in-app." },
      { d: "Q3 2026", t: "04 · B2B / factory-supply payments",       s: "planned",  n: "Yai marketplace orders settle via ABA / Wing." },
      { d: "Q4 2026", t: "05 · Worker P2P e-commerce settlement",    s: "planned",  n: "Worker-to-worker marketplace inside Yai app." },
    ],
  },
];

const STATUS_ICON: Record<Status, string> = { done: "✓", progress: "◐", planned: "○" };
const STATUS_COLOR: Record<Status, string> = { done: "#10B981", progress: "#F37021", planned: "#94A3B8" };

export function BigTechSegment() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = PARTNERS[activeIdx];

  return (
    <div className="rounded-xl border border-yai-border bg-white">
      {/* Segment header */}
      <div className="flex items-start gap-3 p-4 border-b border-yai-border rounded-t-xl" style={{ background: SEG_BG }}>
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-1">
            <span
              className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded text-white"
              style={{ background: SEG_COLOR }}
            >
              BIG-TECH
            </span>
            <h4 className="font-extrabold text-yai-navy text-base leading-tight">
              Big-tech &amp; strategic partners
            </h4>
          </div>
          <p className="text-xs text-gray-700 leading-snug max-w-3xl">
            Strategic relationships across Ai (Anthropic, Google), capital / programme (JICA, YC, ADB)
            and Cambodia payment rails (ABA, Wing). <strong>Hover any partner below</strong> to see its
            dedicated pathway.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase tracking-wider text-gray-500">Reachable</div>
          <div className="text-lg font-extrabold tabular-nums" style={{ color: SEG_COLOR }}>Strategic</div>
        </div>
      </div>

      {/* Partner cards — hover to switch pathway below */}
      <ul className="px-4 pt-4 pb-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PARTNERS.map((p, i) => {
          const isActive = i === activeIdx;
          return (
            <li key={p.num}>
              <button
                type="button"
                onMouseEnter={() => setActiveIdx(i)}
                onFocus={() => setActiveIdx(i)}
                onClick={() => setActiveIdx(i)}
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
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">{p.d}</span>
                  </div>
                  <div className="font-bold text-yai-navy leading-tight">{p.t}</div>
                  <div className="text-gray-600 leading-snug mt-0.5">{p.n}</div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Active partner's pathway — switches as user hovers a card above */}
      <div className="px-4 pt-3 pb-4 border-t-2 mt-2" style={{ borderColor: `${SEG_COLOR}40`, background: `${SEG_COLOR}08` }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
              Pathway for
            </div>
            <div className="text-base font-extrabold" style={{ color: SEG_COLOR }}>
              {active.t}
            </div>
          </div>
          <div className="text-[10px] text-gray-500 italic">
            Hover a partner above to switch · {active.pathway.length} stages
          </div>
        </div>

        <MilestoneRoadmap milestones={active.pathway} color={SEG_COLOR} />
      </div>
    </div>
  );
}
