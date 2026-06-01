"use client";

import type { ReactNode } from "react";

/* Shared module-roadmap timeline — drives both Capital Efficiency and Financials & Milestones.
 * 12 quarter columns (Q3'24 → Q2'27). Top section is a detailed financial chart
 * (quarterly spend bars + cumulative line + headcount row). Bottom is the module
 * progression bars (Digitalization → Agentic → Full Ai per module). */

const QUARTERS = [
  "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25", "Q4'25",
  "Q1'26", "Q2'26", "Q3'26", "Q4'26", "Q1'27", "Q2'27",
];
const N = QUARTERS.length;        // 12 columns
const TODAY = 8;                  // Q2'26 — current quarter (1-based)

type Group = "admin" | "ops";
type Mod = {
  name: string;
  digStart: number;
  agStart: number;
  fullStart: number;
  group: Group;
};

/* Modules split into ADMINISTRATION (blue) and OPERATIONS (green) groups,
 * each ordered by build chronology. Two modules are already at AGENTIC stage
 * today (★): Car Booking, YPM/CE. */
const MODULES: Mod[] = [
  // ════════ ADMINISTRATION ════════
  { name: "Admin Core · PR · Shop · Approvals · APP",     digStart: 1, agStart: 8,  fullStart: 11, group: "admin" },
  { name: "HR · Pay · Org · LMS · AI CCTV",               digStart: 1, agStart: 8,  fullStart: 11, group: "admin" },
  { name: "Digital Audit · 8S · AIoT · Waste",            digStart: 1, agStart: 8,  fullStart: 11, group: "admin" },
  { name: "Gate Pass · CTPAT",                            digStart: 2, agStart: 8,  fullStart: 11, group: "admin" },
  { name: "Car Booking  ★ AGENTIC",                       digStart: 2, agStart: 6,  fullStart: 11, group: "admin" },
  { name: "Accounting (Full + GDT)",                      digStart: 3, agStart: 9,  fullStart: 11, group: "admin" },
  { name: "Speak Up · Worker Voice",                      digStart: 6, agStart: 8,  fullStart: 11, group: "admin" },
  { name: "Corporate Financials + IEWS",                  digStart: 7, agStart: 9,  fullStart: 12, group: "admin" },
  { name: "Cambodia E-Gov + E-Invoice",                   digStart: 8, agStart: 10, fullStart: 12, group: "admin" },

  // ════════ OPERATIONS ════════
  { name: "YTM · Machine Maintenance + TPM Shop",         digStart: 4, agStart: 8,  fullStart: 11, group: "ops" },
  { name: "YQMS · Quality Mgmt (6 stages + Fini Check)",  digStart: 4, agStart: 8,  fullStart: 11, group: "ops" },
  { name: "YPI · Technical Specs (3-language)",           digStart: 5, agStart: 9,  fullStart: 12, group: "ops" },
  { name: "YPM / CE · Motion · SMV  ★ AGENTIC",           digStart: 5, agStart: 7,  fullStart: 12, group: "ops" },
  { name: "Product Dev · Sample Room",                    digStart: 5, agStart: 9,  fullStart: 12, group: "ops" },
  { name: "4DP · Planning Brain (4 directions × 4 levels)", digStart: 6, agStart: 9,  fullStart: 12, group: "ops" },
  { name: "MRP + Logistics (Inbound + Outbound)",         digStart: 7, agStart: 9,  fullStart: 12, group: "ops" },
  { name: "YWIP · 13-Dept Production Flow",               digStart: 7, agStart: 9,  fullStart: 12, group: "ops" },
];

const GROUP_COLOR: Record<Group, { label: string; tag: string; bg: string }> = {
  admin: { label: "#1E4DAA", tag: "#1E4DAA", bg: "#1E4DAA" },
  ops:   { label: "#0A3327", tag: "#0A3327", bg: "#0A3327" },
};

// Headcount per quarter
const HEADCOUNT = [3, 5, 7, 10, 13, 16, 18, 20, 20, 20, 20, 20];

// Quarterly spend $K — Cambodia fully-loaded rate (~$1,370/eng/mo with 5% overhead +
// office, equipment, software, training, sales). Calibrated to hit $378K cumulative at Q2'26.
const QUARTERLY_SPEND_K = [12, 21, 29, 41, 53, 66, 74, 82, 82, 82, 82, 82];

// Revenue trajectory — illustrative quarterly
const QUARTERLY_REV_K = [0, 0, 0, 0, 0, 0, 8, 12, 25, 35, 50, 50];

// Cumulative
const CUM_SPEND: number[] = QUARTERLY_SPEND_K.reduce<number[]>((acc, q, i) => {
  acc.push((acc[i - 1] || 0) + q);
  return acc;
}, []);
const CUM_REV: number[] = QUARTERLY_REV_K.reduce<number[]>((acc, q, i) => {
  acc.push((acc[i - 1] || 0) + q);
  return acc;
}, []);

const SPEND_TODAY = CUM_SPEND[TODAY - 1];
const SPEND_PROJECTED = CUM_SPEND[N - 1];
const REV_TODAY = CUM_REV[TODAY - 1];
const REV_PROJECTED = CUM_REV[N - 1];

const MILESTONES = [
  { qtr: 8,  label: "Q1 · Foundation",  detail: "3–5 paid contracts" },
  { qtr: 9,  label: "Q2 · Validation",  detail: "10+ customers · Ministry signed" },
  { qtr: 10, label: "Q3 · Expansion",   detail: "20+ customers · regional pilot" },
  { qtr: 11, label: "Q4 · Scale",       detail: "30+ customers · Stage 3 scoped" },
];

const COL = {
  dig:   "#F37021",
  ag:    "#1E4DAA",
  full:  "#0A3327",
  today: "#0A1F47",
};

// SVG chart constants
const VB_W = 1200;
const VB_H = 380;
const PLOT_LEFT = 60;
const PLOT_RIGHT = 1180;
const PLOT_TOP = 30;
const PLOT_BOTTOM = 230;
const PLOT_W = PLOT_RIGHT - PLOT_LEFT;
const PLOT_H = PLOT_BOTTOM - PLOT_TOP;

function xForQuarter(i: number) {
  // Center of each quarter slot
  return PLOT_LEFT + ((i + 0.5) / N) * PLOT_W;
}

function curvePath(values: number[], yMax: number) {
  const pts = values.map((v, i) => [xForQuarter(i), PLOT_BOTTOM - (v / yMax) * PLOT_H] as const);
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return d;
}

export function RoadmapTimeline({ mode }: { mode: "spend" | "revenue" }) {
  const isSpend = mode === "spend";
  const quarterly = isSpend ? QUARTERLY_SPEND_K : QUARTERLY_REV_K;
  const cumulative = isSpend ? CUM_SPEND : CUM_REV;
  const cumToday = isSpend ? SPEND_TODAY : REV_TODAY;
  const cumProjected = isSpend ? SPEND_PROJECTED : REV_PROJECTED;
  const curveColor = isSpend ? "#1E4DAA" : "#10B981";
  const barColor = isSpend ? "#94A3B8" : "#6EE7B7";
  const barFutureColor = isSpend ? "#CBD5E1" : "#A7F3D0";
  const showMilestones = !isSpend;

  // Y-axis max — use cumulative projected max with some headroom
  const yMax = Math.ceil((cumProjected * 1.05) / 100) * 100 || 100;

  // Bars use a smaller scale so they read as a separate visual layer
  const barYMax = Math.max(...quarterly) * 1.3 || 1;
  const BAR_AREA_TOP = PLOT_BOTTOM - 70; // bars occupy bottom 70px of plot

  // Y-axis tick values
  const yTicks: number[] = [];
  const tickStep = yMax / 4;
  for (let v = 0; v <= yMax; v += tickStep) yTicks.push(Math.round(v));

  const todayX = xForQuarter(TODAY - 1);

  return (
    <div className="rounded-xl border border-yai-border bg-white p-4 sm:p-6">
      {/* Big header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-extrabold" style={{ color: curveColor }}>
            {isSpend
              ? "Cumulative spend + quarterly burn + headcount (Cambodia rate, $K)"
              : "Cumulative revenue + quarterly inflow ($K · illustrative)"}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 max-w-2xl">
            {isSpend
              ? "Engineering build-up across 12 quarters. Blended ~$1,370/eng/mo fully loaded (salaries + 5% overhead + office / equipment / software / training / sales). Team plateaus at 20 engineers."
              : "Forward revenue trajectory layered on the same timeline as Capital Efficiency. Year-1 quarterly milestones pinned on the curve."}
          </p>
        </div>
        <div className="flex gap-4 shrink-0">
          <div className="text-right">
            <div className="text-2xl font-extrabold text-yai-navy tabular-nums leading-none">${cumToday}K</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">{isSpend ? "Invested today" : "Booked today"} · Q2&rsquo;26</div>
          </div>
          <div className="text-right border-l border-yai-border pl-4">
            <div className="text-2xl font-extrabold tabular-nums leading-none" style={{ color: curveColor }}>${cumProjected}K</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">Projected · Q2&rsquo;27</div>
          </div>
        </div>
      </div>

      {/* Main detailed chart */}
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full" style={{ minHeight: 320 }}>
        {/* Y-axis gridlines + labels (cumulative scale on LEFT) */}
        {yTicks.map((v) => {
          const y = PLOT_BOTTOM - (v / yMax) * PLOT_H;
          return (
            <g key={v}>
              <line x1={PLOT_LEFT} x2={PLOT_RIGHT} y1={y} y2={y} stroke="#E5E7EB" strokeWidth="0.6" strokeDasharray="2 3" />
              <text x={PLOT_LEFT - 6} y={y + 3} fontSize="10" textAnchor="end" fill="#9CA3AF">
                ${v}K
              </text>
            </g>
          );
        })}

        {/* Today marker — vertical dashed line through the plot */}
        <line x1={todayX} x2={todayX} y1={PLOT_TOP - 10} y2={PLOT_BOTTOM + 5} stroke={COL.today} strokeWidth="1.2" strokeDasharray="3 3" />
        <rect x={todayX - 22} y={PLOT_TOP - 18} width={44} height={14} rx={3} fill="#F37021" />
        <text x={todayX} y={PLOT_TOP - 7} fontSize="10" textAnchor="middle" fill="#FFFFFF" fontWeight="700">TODAY</text>

        {/* Past-fill backdrop on cumulative area (very light) */}
        <path d={curvePath(cumulative, yMax) + ` L ${xForQuarter(N - 1)},${PLOT_BOTTOM} L ${xForQuarter(0)},${PLOT_BOTTOM} Z`}
              fill={curveColor} opacity="0.06" />

        {/* Quarterly spend bars (lower band of plot area) */}
        {quarterly.map((spend, i) => {
          const barH = (spend / barYMax) * (PLOT_BOTTOM - BAR_AREA_TOP);
          const barW = (PLOT_W / N) * 0.55;
          const barX = xForQuarter(i) - barW / 2;
          const barY = PLOT_BOTTOM - barH;
          const isPast = i + 1 <= TODAY;
          return (
            <g key={`bar-${i}`}>
              <rect x={barX} y={barY} width={barW} height={barH} fill={isPast ? barColor : barFutureColor} opacity="0.75" rx={1.5} />
              {spend > 0 && (
                <text x={xForQuarter(i)} y={barY - 4} fontSize="10" textAnchor="middle" fill="#475569" fontWeight="700">
                  ${spend}K
                </text>
              )}
            </g>
          );
        })}

        {/* Cumulative line + dots + labels */}
        <path d={curvePath(cumulative, yMax)} fill="none" stroke={curveColor} strokeWidth="2.2" />
        {cumulative.map((c, i) => {
          const x = xForQuarter(i);
          const y = PLOT_BOTTOM - (c / yMax) * PLOT_H;
          const isToday = i + 1 === TODAY;
          // Only show $ label every other point to reduce clutter, but always show TODAY
          const showLabel = i === 0 || isToday || i === N - 1 || i % 2 === 1;
          return (
            <g key={`pt-${i}`}>
              <circle cx={x} cy={y} r={isToday ? 4.5 : 3} fill={curveColor} stroke="#fff" strokeWidth={isToday ? 2 : 1} />
              {showLabel && (
                <text x={x} y={y - 9} fontSize={isToday ? 11 : 10} textAnchor="middle"
                      fill={isToday ? "#0A1F47" : curveColor} fontWeight={isToday ? "800" : "700"}>
                  ${c}K
                </text>
              )}
            </g>
          );
        })}

        {/* Milestones (revenue mode only) — above the curve */}
        {showMilestones && MILESTONES.map((m) => {
          const x = xForQuarter(m.qtr - 1);
          return (
            <g key={`ms-${m.qtr}`}>
              <rect x={x - 38} y={PLOT_TOP + 15} width={76} height={14} rx={2} fill="#FBBF24" />
              <text x={x} y={PLOT_TOP + 25} fontSize="9" textAnchor="middle" fill="#0A3327" fontWeight="800">{m.label}</text>
            </g>
          );
        })}

        {/* X-axis baseline */}
        <line x1={PLOT_LEFT} x2={PLOT_RIGHT} y1={PLOT_BOTTOM} y2={PLOT_BOTTOM} stroke="#9CA3AF" strokeWidth="0.8" />

        {/* Quarter labels */}
        {QUARTERS.map((q, i) => {
          const x = xForQuarter(i);
          const isToday = i + 1 === TODAY;
          return (
            <text key={`q-${i}`} x={x} y={PLOT_BOTTOM + 18} fontSize="11" textAnchor="middle"
                  fill={isToday ? "#0A1F47" : "#6B7280"} fontWeight={isToday ? "800" : "600"}>
              {q}
            </text>
          );
        })}

        {/* Row label: Headcount */}
        <text x={PLOT_LEFT - 6} y={PLOT_BOTTOM + 45} fontSize="10" textAnchor="end" fill="#6B7280" fontWeight="700">HC</text>
        {HEADCOUNT.map((hc, i) => {
          const x = xForQuarter(i);
          const isPeak = hc === 20;
          return (
            <text key={`hc-${i}`} x={x} y={PLOT_BOTTOM + 45} fontSize="13" textAnchor="middle"
                  fill={isPeak ? "#F37021" : "#0A1F47"} fontWeight="800">
              {hc}
            </text>
          );
        })}

        {/* Row label: per-Q burn (spend mode only — repeated here as cleaner row below the bars) */}
        {isSpend && (
          <>
            <text x={PLOT_LEFT - 6} y={PLOT_BOTTOM + 65} fontSize="10" textAnchor="end" fill="#6B7280" fontWeight="700">$ / Q</text>
            {quarterly.map((q, i) => (
              <text key={`qs-${i}`} x={xForQuarter(i)} y={PLOT_BOTTOM + 65} fontSize="11" textAnchor="middle" fill="#475569" fontWeight="700">
                ${q}K
              </text>
            ))}
          </>
        )}

        {/* Row label: cumulative */}
        <text x={PLOT_LEFT - 6} y={PLOT_BOTTOM + 90} fontSize="10" textAnchor="end" fill="#6B7280" fontWeight="700">CUM</text>
        {cumulative.map((c, i) => (
          <text key={`cum-${i}`} x={xForQuarter(i)} y={PLOT_BOTTOM + 90} fontSize="11" textAnchor="middle"
                fill={i + 1 === TODAY ? "#0A1F47" : curveColor} fontWeight={i + 1 === TODAY ? "800" : "700"}>
            ${c}K
          </text>
        ))}
      </svg>

      {/* Legend / interpretation strip */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-600">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: barColor }} />
          Quarterly {isSpend ? "burn" : "revenue"}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5" style={{ background: curveColor }} />
          Cumulative
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: COL.today }} />
          Today (Q2&rsquo;26)
        </span>
        <span className="ml-auto font-bold" style={{ color: curveColor }}>
          {isSpend
            ? `Avg per-Q burn at peak: $${QUARTERLY_SPEND_K[N - 1]}K · ~$${Math.round((QUARTERLY_SPEND_K[N - 1] * 1000) / 3 / 20)}/eng/mo blended`
            : `Year-1 quarterly milestones pinned on the curve`}
        </span>
      </div>

      {/* Module-progression rows — split into ADMINISTRATION + OPERATIONS groups */}
      <div className="mt-6 pt-4 border-t border-yai-border">
        <div className="text-[10px] uppercase tracking-wider font-extrabold text-yai-navy mb-3">
          Module progression across the same timeline
        </div>
        {(() => {
          const rows: ReactNode[] = [];
          let lastGroup: Group | null = null;
          MODULES.forEach((m, idx) => {
            if (m.group !== lastGroup) {
              const gc = GROUP_COLOR[m.group];
              const label = m.group === "admin" ? "Administration" : "Operations";
              rows.push(
                <div key={`hdr-${m.group}`} className={`flex items-center gap-2 ${idx > 0 ? "mt-4" : ""} mb-2`}>
                  <div className="w-[200px] shrink-0">
                    <span
                      className="inline-block text-[10px] font-extrabold uppercase tracking-[0.15em] px-2.5 py-1 rounded text-white"
                      style={{ background: gc.bg }}
                    >
                      {label}
                    </span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: gc.bg, opacity: 0.25 }} />
                </div>
              );
              lastGroup = m.group;
            }
            const gc = GROUP_COLOR[m.group];
            rows.push(
              <div key={m.name} className="flex items-center gap-2 py-0.5">
                <div
                  className="w-[200px] shrink-0 text-[10px] font-semibold leading-tight pr-2"
                  style={{ color: gc.label }}
                >
                  {m.name}
                </div>
                <div className="flex-1 relative h-5 rounded bg-gray-50 overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      left: `${((m.digStart - 1) / N) * 100}%`,
                      width: `${((m.agStart - m.digStart) / N) * 100}%`,
                      background: COL.dig,
                    }}
                    title="Digitalization"
                  />
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      left: `${((m.agStart - 1) / N) * 100}%`,
                      width: `${((m.fullStart - m.agStart) / N) * 100}%`,
                      background: COL.ag,
                    }}
                    title="Agentic"
                  />
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      left: `${((m.fullStart - 1) / N) * 100}%`,
                      width: `${((N - m.fullStart + 1) / N) * 100}%`,
                      background: COL.full,
                    }}
                    title="Full Ai"
                  />
                  <div
                    className="absolute top-0 bottom-0 border-l-2 border-dashed pointer-events-none"
                    style={{ left: `${((TODAY - 1) / N) * 100}%`, borderColor: COL.today, opacity: 0.6 }}
                  />
                </div>
              </div>
            );
          });
          return rows;
        })()}
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4 text-[10px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: COL.dig }} />Digitalization
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: COL.ag }} />Agentic
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: COL.full }} />Full Ai
        </span>
      </div>
    </div>
  );
}
