"use client";

import { useState } from "react";
import { MilestoneRoadmap, type Milestone } from "./MilestoneRoadmap";
import { usePrintMode } from "@/lib/usePrintMode";

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
  url?: string;         // optional partner / programme URL — renders the title as a link
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
    url: "https://www.anthropic.com/partners",
    pathway: [
      {
        monthLabel: "03-26", d: "Mar 2026", t: "CPN application", s: "done",
        activities: [
          { title: "CPN application submitted to Anthropic", status: "done" },
        ],
      },
      {
        monthLabel: "04-26", d: "Apr 2026", t: "Initial review cleared", s: "done",
        activities: [
          { title: "Anthropic confirmed: approved to move forward", status: "done" },
        ],
      },
      {
        monthLabel: "06-26", d: "Jun 2026", t: "Webinar + enrolment kickoff", s: "progress",
        activities: [
          { week: 1, title: "CPN Services Program webinar (Jun 3 PT / Jun 4 SGT)", status: "progress" },
          { week: 2, title: "Enrol 10 team in Anthropic Academy", status: "planned" },
          { week: 3, title: "Begin CPN learning path modules",     status: "planned" },
          { week: 4, title: "Submit deal-reg test entries",        status: "planned" },
        ],
      },
      {
        monthLabel: "07-26", d: "Jul 2026", t: "Team certification", s: "planned",
        activities: [
          { week: 1, title: "Continue Academy modules", status: "planned" },
          { week: 2, title: "10-member completion target", status: "planned" },
          { week: 4, title: "Submit CCAF readiness check", status: "planned" },
        ],
      },
      {
        monthLabel: "11-26", d: "Nov 2026", t: "CCAF certification achieved", s: "planned",
        activities: [
          { title: "Claude Certified Architect Foundations — org cert", status: "planned" },
        ],
      },
      {
        monthLabel: "12-26", d: "Dec 2026", t: "Partner Portal + Tier assigned", s: "planned",
        activities: [
          { week: 2, title: "Accept Network terms",        status: "planned" },
          { week: 3, title: "Tier assigned (Silver / Gold)", status: "planned" },
        ],
      },
      {
        monthLabel: "03-27", d: "Mar 2027", t: "Featured-customer / case study", s: "planned",
        activities: [
          { title: "Public Yai × Anthropic case study", status: "planned" },
        ],
      },
    ],
  },
  {
    num: "02",
    d: "Q2 2026",
    t: "Google Cloud for Startups",
    n: "Google partner-team outreach booked. Vertex AI credits + cloud hosting in play.",
    s: "progress",
    url: "https://cloud.google.com/startup",
    pathway: [
      {
        monthLabel: "05-26", d: "May 2026", t: "Application submitted", s: "done",
        activities: [
          { title: "Apply to Google for Startups Cloud Program (Ai-startup track)", status: "done" },
        ],
      },
      {
        monthLabel: "06-26", d: "Jun 2026", t: "Google rep outreach", s: "progress",
        activities: [
          { week: 2, title: "Meeting BOOKED — Cindy YEN NHI · Jun 8 · 3:15 PM MYT · Google Meet", status: "progress" },
          { week: 2, title: "Pitch Yai use-case + Vertex usage plan",                              status: "planned" },
          { week: 3, title: "Follow-up + receive credit programme details",                        status: "planned" },
        ],
      },
      {
        monthLabel: "08-26", d: "Aug 2026", t: "Credits granted", s: "planned",
        activities: [
          { title: "$200K Vertex AI + hosting credits · 2-year window", status: "planned" },
        ],
      },
      {
        monthLabel: "11-26", d: "Nov 2026", t: "Migrate to Vertex", s: "planned",
        activities: [
          { week: 1, title: "Move LLM inference onto Vertex", status: "planned" },
          { week: 3, title: "Move Nano Banana onto Vertex",   status: "planned" },
        ],
      },
      {
        monthLabel: "02-27", d: "Feb 2027", t: "Co-marketing", s: "planned",
        activities: [
          { title: "Case study with Google Cloud — Cambodia / SE-Asia garment-tech", status: "planned" },
        ],
      },
    ],
  },
  {
    num: "03",
    d: "Q3 2026",
    t: "JICA · Cambodia-Japan SME programme",
    n: "Bilateral funding + Japanese factory references.",
    s: "planned",
    url: "https://www.jica.go.jp/cambodia",
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
    url: "https://www.ycombinator.com/apply",
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
    url: "https://www.ifc.org/en/what-we-do/products-and-services/how-to-apply-for-financing",
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
    url: "https://www.ababank.com",
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
  const [isOpenState, setIsOpen] = useState(false);
  const printing = usePrintMode();
  const isOpen = isOpenState || printing;
  const active = PARTNERS[activeIdx];

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
              BIG-TECH
            </span>
            <h4 className="font-extrabold text-yai-navy text-base leading-tight">
              Big-tech &amp; strategic partners
            </h4>
          </div>
          <p className="text-xs text-gray-700 leading-snug max-w-3xl">
            Strategic relationships across Ai (Anthropic
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white font-extrabold text-[9px] align-middle mx-0.5"
              style={{ background: "#10B981" }}
              title="Anthropic CPN — initial review cleared, in team-certification phase"
              aria-label="Anthropic — almost done"
            >
              ✓
            </span>
            , Google), capital / programme (JICA, YC, ADB)
            and Cambodia payment rails (ABA, Wing).
            {isOpen && <> <strong>Hover any partner below</strong> to see its dedicated pathway.</>}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">Reachable</div>
            <div className="text-lg font-extrabold tabular-nums text-right" style={{ color: SEG_COLOR }}>Strategic</div>
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
                  <div className="font-bold text-yai-navy leading-tight">
                    {p.t}
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="ml-1 text-[11px] font-bold text-yai-blue hover:underline"
                        title={`Open ${p.t}`}
                      >
                        ↗
                      </a>
                    )}
                  </div>
                  <div className="text-gray-600 leading-snug mt-0.5">{p.n}</div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Active partner's pathway — switches as user hovers a card above.
       *  In print: render EVERY partner's pathway so PDF is complete. */}
      {printing ? (
        <div className="print-pathway-grid">
        {PARTNERS.map((p) => (
          <div
            key={p.num}
            className="px-4 pt-3 pb-4 border-t-2 mt-2"
            style={{ borderColor: `${SEG_COLOR}40`, background: `${SEG_COLOR}08` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
                  Pathway for
                </div>
                <div className="text-sm font-extrabold" style={{ color: SEG_COLOR }}>
                  {p.t}
                </div>
              </div>
              <div className="text-[10px] text-gray-500 italic">
                {p.pathway.length}st
              </div>
            </div>
            <MilestoneRoadmap milestones={p.pathway} color={SEG_COLOR} />
          </div>
        ))}
        </div>
      ) : (
        <div className="px-4 pt-3 pb-4 border-t-2 mt-2" style={{ borderColor: `${SEG_COLOR}40`, background: `${SEG_COLOR}08` }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
                Pathway for
              </div>
              <div className="text-base font-extrabold" style={{ color: SEG_COLOR }}>
                {active.url ? (
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-baseline gap-1"
                  >
                    {active.t}
                    <span className="text-[11px] opacity-70">↗</span>
                  </a>
                ) : (
                  active.t
                )}
              </div>
            </div>
            <div className="text-[10px] text-gray-500 italic">
              Hover a partner above to switch · {active.pathway.length} stages
            </div>
          </div>
          <MilestoneRoadmap milestones={active.pathway} color={SEG_COLOR} />
        </div>
      )}
      </>}
    </div>
  );
}
