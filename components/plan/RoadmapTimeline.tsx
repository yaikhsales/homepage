"use client";

import { useState } from "react";
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

type Group = "admin" | "platform" | "ops";
type Mod = {
  name: string;
  digStart: number;
  agStart: number;
  fullStart: number;
  group: Group;
  digValue?: string;  // Cambodian SaaS market value for the Digitalization stage
  agValue?: string;   // Cambodian SaaS market value at Agentic stage
  fullValue?: string; // Cambodian SaaS market value at Full Ai stage
};

/* Modules split into ADMINISTRATION (blue) and OPERATIONS (green) groups,
 * each ordered by build chronology. Two modules are already at AGENTIC stage
 * today (★): Car Booking, YPM/CE. */
const MODULES: Mod[] = [
  // ════════ ADMINISTRATION ════════
  { name: "Admin Core · PR · Shop · Approvals · APP",     digStart: 1, agStart: 8,  fullStart: 11, group: "admin", digValue: "$5K",  agValue: "$8K",  fullValue: "$12K" },
  { name: "HR · Pay · Org · LMS · AI CCTV",               digStart: 1, agStart: 8,  fullStart: 11, group: "admin", digValue: "$9K",  agValue: "$14K", fullValue: "$20K" },
  { name: "Digital Audit · 8S · AIoT · Waste",            digStart: 1, agStart: 8,  fullStart: 11, group: "admin", digValue: "$10K", agValue: "$16K", fullValue: "$24K" },
  { name: "Gate Pass · CTPAT",                            digStart: 2, agStart: 8,  fullStart: 11, group: "admin", digValue: "$5K",  agValue: "$8K",  fullValue: "$12K" },
  { name: "Car Booking  ★ AGENTIC",                       digStart: 2, agStart: 6,  fullStart: 11, group: "admin", digValue: "$1K",  agValue: "$2K",  fullValue: "$3K"  },
  { name: "Accounting (Full + GDT)",                      digStart: 3, agStart: 9,  fullStart: 11, group: "admin", digValue: "$5K",  agValue: "$8K",  fullValue: "$12K" },
  { name: "Speak Up · Worker Voice",                      digStart: 6, agStart: 8,  fullStart: 11, group: "admin", digValue: "$3K",  agValue: "$5K",  fullValue: "$8K"  },
  { name: "Corporate Financials + IEWS",                  digStart: 7, agStart: 9,  fullStart: 12, group: "admin", digValue: "$3K",  agValue: "$5K",  fullValue: "$8K"  },
  { name: "Cambodia E-Gov + E-Invoice",                   digStart: 8, agStart: 10, fullStart: 12, group: "admin", digValue: "$4K",  agValue: "$6K",  fullValue: "$8K"  },

  // ════════ PLATFORM FOUNDATION ════════
  // Dig: Laravel + MongoDB Ai-native · Android & iOS apps · MQTT + TUYA · SMART Gate · SMART Camera
  // Ag:  + LLM APIs (Claude / GPT / Gemini) · Agentic chat in mobile app
  // Full Ai: own Ai server (solar + battery) · 5G bonding for rural factories · 5G internal WiFi for workers
  { name: "Platform · Laravel + Mongo + Mobile + AIoT + Ai Server", digStart: 1, agStart: 6, fullStart: 12, group: "platform", digValue: "$8K", agValue: "$20K", fullValue: "$35K" },

  // ════════ OPERATIONS ════════
  { name: "YTM · Machine Maintenance + TPM Shop",         digStart: 4, agStart: 8,  fullStart: 11, group: "ops",   digValue: "$7K",  agValue: "$11K", fullValue: "$16K" },
  { name: "YQMS · Quality Mgmt (6 stages + Fini Check)",  digStart: 4, agStart: 8,  fullStart: 11, group: "ops",   digValue: "$12K", agValue: "$20K", fullValue: "$30K" },
  { name: "YPI · Technical Specs (3-language)",           digStart: 5, agStart: 9,  fullStart: 12, group: "ops",   digValue: "$6K",  agValue: "$10K", fullValue: "$15K" },
  { name: "YPM / CE · Motion · SMV  ★ AGENTIC",           digStart: 5, agStart: 7,  fullStart: 12, group: "ops",   digValue: "$15K", agValue: "$24K", fullValue: "$36K" },
  { name: "Product Dev · Sample Room",                    digStart: 5, agStart: 9,  fullStart: 12, group: "ops",   digValue: "$2K",  agValue: "$3K",  fullValue: "$5K"  },
  { name: "4DP · Planning Brain (4 directions × 4 levels)", digStart: 6, agStart: 9,  fullStart: 12, group: "ops",   digValue: "$12K", agValue: "$20K", fullValue: "$30K" },
  { name: "MRP + Logistics (Inbound + Outbound)",         digStart: 7, agStart: 9,  fullStart: 12, group: "ops",   digValue: "$4K",  agValue: "$7K",  fullValue: "$10K" },
  { name: "YWIP · 13-Dept Production Flow",               digStart: 7, agStart: 9,  fullStart: 12, group: "ops",   digValue: "$8K",  agValue: "$13K", fullValue: "$20K" },
];

const GROUP_COLOR: Record<Group, { label: string; tag: string; bg: string }> = {
  admin:    { label: "#1E4DAA", tag: "#1E4DAA", bg: "#1E4DAA" },
  platform: { label: "#1F2937", tag: "#1F2937", bg: "#1F2937" }, // slate-800 — neutral infra colour
  ops:      { label: "#0A3327", tag: "#0A3327", bg: "#0A3327" },
};

// Headcount per quarter (representative end-of-quarter HC, derived from monthly
// chart: 2→3→3→4→4→5→5→7→7→10→10→12→15→15→17→17→18→18→19→19→20→20→20…)
const HEADCOUNT = [4, 5, 10, 15, 17, 19, 20, 20, 20, 20, 20, 20];

// Quarterly spend $K — Cambodia engineering salary basis ($500–$600/eng/mo,
// growing as senior Ai-cert engineers joined). Summed monthly per the source
// chart: Jul 24 $1.5K / Aug $1.5K / … / Mar 26 onward $12K/mo.
const QUARTERLY_SPEND_K = [5, 9, 13, 18, 24, 26, 33, 36, 36, 36, 36, 36];

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
const VB_W = 1250;
const VB_H = 540;
const PLOT_LEFT = 95;
const PLOT_RIGHT = 1180;
// Alignment percentages used by both the SVG chart and the module-row bars below.
const LEFT_PCT = (PLOT_LEFT / 1250) * 100;          // matches VB_W
const RIGHT_PCT = ((1250 - PLOT_RIGHT) / 1250) * 100;
const PLOT_TOP = 30;
const PLOT_BOTTOM = 430;
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

type Market = "cambodia" | "asean" | "global";
const MARKETS: Record<Market, { label: string; multiplier: number; color: string; lineWidth: number; labelSize: number; dotR: number; icon: string }> = {
  cambodia: { label: "Cambodia SaaS",     multiplier: 1, color: "#10B981", lineWidth: 2.2, labelSize: 10, dotR: 3, icon: "🇰🇭" },
  asean:    { label: "ASEAN SaaS · 3×",   multiplier: 3, color: "#F37021", lineWidth: 3.0, labelSize: 12, dotR: 4, icon: "🌏" },
  global:   { label: "Global SaaS · 8×",  multiplier: 8, color: "#D4A017", lineWidth: 4.0, labelSize: 14, dotR: 5, icon: "🌐" },
};

// Format a K-value either as "$123K" or "$1.23M" depending on magnitude
function formatK(k: number): string {
  if (k >= 1000) return `$${(k / 1000).toFixed(k >= 10000 ? 1 : 2)}M`;
  return `$${Math.round(k)}K`;
}

export function RoadmapTimeline({ mode }: { mode: "spend" | "revenue" }) {
  const isSpend = mode === "spend";
  // Interactive scrubber — which quarter is the indicator currently pointing at?
  // Defaults to TODAY (Q2'26 = 8). User can click any quarter to "scrub" it.
  const [scrubQ, setScrubQ] = useState<number>(TODAY);
  // Which SaaS market rate to use for the GREEN (asset value) line and bar labels.
  const [market, setMarket] = useState<Market>("cambodia");
  const mkt = MARKETS[market];
  const mult = mkt.multiplier;
  const scaleK = (s?: string) => {
    if (!s) return "";
    const n = Number(s.replace(/[^\d.]/g, ""));
    return formatK(n * mult);
  };
  const quarterly = isSpend ? QUARTERLY_SPEND_K : QUARTERLY_REV_K;
  const cumulative = isSpend ? CUM_SPEND : CUM_REV;
  const cumToday = isSpend ? SPEND_TODAY : REV_TODAY;
  const cumProjected = isSpend ? SPEND_PROJECTED : REV_PROJECTED;
  const curveColor = isSpend ? "#1E4DAA" : "#10B981";
  const barColor = isSpend ? "#94A3B8" : "#6EE7B7";
  const barFutureColor = isSpend ? "#CBD5E1" : "#A7F3D0";
  const showMilestones = !isSpend;

  // Cumulative platform asset value per quarter (Cambodian SaaS market value).
  // Same logic the scrubber uses. Only drawn in spend mode so we can compare
  // "what we spent" (blue) vs "what we earned as asset" (green).
  const parseK = (s?: string) => (s ? Number(s.replace(/[^\d.]/g, "")) : 0);
  const valueAtQuarter = (q: number) => {
    let total = 0;
    MODULES.forEach((m) => {
      if (q >= m.fullStart) total += parseK(m.fullValue);
      else if (q >= m.agStart) total += parseK(m.agValue);
      else if (q >= m.digStart) total += parseK(m.digValue);
    });
    return total;
  };
  const assetValuesBase = QUARTERS.map((_, i) => valueAtQuarter(i + 1));
  const assetValues = assetValuesBase.map((v) => v * mult);
  const assetColor = mkt.color;
  const assetToday = assetValues[TODAY - 1];
  const assetProjected = assetValues[N - 1];

  // Dual y-axis for spend mode:
  //   LEFT  → quarterly salary bars
  //   RIGHT → cumulative line + green platform-value line
  //   Right-axis max expands when ASEAN / Global rates are selected so the green line still fits.
  const barAxisMax = isSpend ? 50 : Math.max(...quarterly) * 1.3 || 1;
  const maxRight = isSpend
    ? Math.max(cumProjected, Math.max(...assetValues))
    : cumProjected;
  const cumAxisMax = isSpend
    ? Math.max(500, Math.ceil((maxRight * 1.05) / 500) * 500)
    : Math.ceil((cumProjected * 1.05) / 100) * 100 || 100;
  const yMax = cumAxisMax; // alias for code that still references yMax

  // Tick arrays — keep left fixed; right scales with cumAxisMax so gridlines stay aligned.
  const leftTicks: number[]  = isSpend ? [0, 10, 20, 30, 40, 50] : [];
  const rightTicks: number[] = isSpend
    ? leftTicks.map((t) => Math.round((t / barAxisMax) * cumAxisMax))
    : (() => {
        const ticks: number[] = [];
        const step = cumAxisMax / 4;
        for (let v = 0; v <= cumAxisMax; v += step) ticks.push(Math.round(v));
        return ticks;
      })();
  // For revenue mode there's only a single axis — show its ticks on the left.
  const yTicks = isSpend ? leftTicks : rightTicks;

  const todayX = xForQuarter(TODAY - 1);

  return (
    <div className="rounded-xl border border-yai-border bg-white p-4 sm:p-6">
      {/* Chart key */}
      <div className="flex items-center justify-end gap-x-5 mb-3 flex-wrap">
        {isSpend ? (
          <>
            <span className="flex items-center gap-1.5 text-[12px] font-bold text-gray-600 uppercase tracking-wide">
              <span className="inline-block w-3.5 h-2.5 rounded-sm" style={{ background: barColor }} />
              Quarterly expenses
            </span>
            <span className="flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-wide" style={{ color: curveColor }}>
              <span className="inline-block w-4 h-[3px]" style={{ background: curveColor }} />
              Total spend
            </span>
            <span className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-wide" style={{ color: assetColor }}>
              <span className="inline-block w-4 h-[3px] shrink-0" style={{ background: assetColor }} />
              Platform value ·
              <span className="inline-flex gap-1">
                {(Object.keys(MARKETS) as Market[]).map((k) => {
                  const m = MARKETS[k];
                  const selected = market === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setMarket(k)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full border-2 text-[10px] font-extrabold uppercase tracking-wide transition-all cursor-pointer focus:outline-none focus:ring-2"
                      style={{
                        borderColor: selected ? m.color : "#D1D5DB",
                        background: selected ? m.color : "transparent",
                        color: selected ? "#FFFFFF" : "#94A3B8",
                      }}
                      aria-pressed={selected}
                      aria-label={m.label}
                    >
                      <span className="text-[13px] leading-none" aria-hidden>{m.icon}</span>
                      {m.label}
                    </button>
                  );
                })}
              </span>
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5 text-[12px] font-bold text-gray-600 uppercase tracking-wide">
              <span className="inline-block w-3.5 h-2.5 rounded-sm" style={{ background: barColor }} />
              Quarterly revenue
            </span>
            <span className="flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-wide" style={{ color: curveColor }}>
              <span className="inline-block w-4 h-[3px]" style={{ background: curveColor }} />
              Cumulative revenue
            </span>
          </>
        )}
      </div>

      {/* Main detailed chart */}
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full block" preserveAspectRatio="xMidYMid meet">
        {/* Y-axis gridlines + dual-axis labels (LEFT = bars / RIGHT = cumulative)
            — top tick label hidden to reduce clutter, gridline preserved */}
        {yTicks.map((v, i) => {
          const isTop = i === yTicks.length - 1;
          const y = isSpend
            ? PLOT_BOTTOM - (v / barAxisMax) * PLOT_H
            : PLOT_BOTTOM - (v / cumAxisMax) * PLOT_H;
          const rightVal = isSpend ? rightTicks[i] : null;
          return (
            <g key={v}>
              <line x1={PLOT_LEFT} x2={PLOT_RIGHT} y1={y} y2={y} stroke="#E5E7EB" strokeWidth="0.6" strokeDasharray="2 3" />
              {!isTop && (
                <text x={PLOT_LEFT - 8} y={y + 4} fontSize="13" textAnchor="end" fill="#64748B" fontWeight="600">
                  ${v}K
                </text>
              )}
              {!isTop && rightVal !== null && (
                <text x={PLOT_RIGHT + 8} y={y + 4} fontSize="13" textAnchor="start" fill={curveColor} fontWeight="700">
                  {formatK(rightVal)}
                </text>
              )}
            </g>
          );
        })}

        {/* Axis titles */}
        {isSpend && (
          <>
            <text x={PLOT_LEFT - 8} y={PLOT_TOP - 8} fontSize="11" textAnchor="end" fill="#64748B" fontWeight="700">
              Quarterly expenses
            </text>
            <text x={PLOT_RIGHT + 8} y={PLOT_TOP - 8} fontSize="11" textAnchor="start" fill={curveColor} fontWeight="700">
              Cumulative
            </text>
          </>
        )}

        {/* Today marker — vertical dashed line through the plot */}
        <line x1={todayX} x2={todayX} y1={PLOT_TOP - 10} y2={PLOT_BOTTOM + 5} stroke={COL.today} strokeWidth="1.2" strokeDasharray="3 3" />
        <rect x={todayX - 22} y={PLOT_TOP - 18} width={44} height={14} rx={3} fill="#F37021" />
        <text x={todayX} y={PLOT_TOP - 7} fontSize="10" textAnchor="middle" fill="#FFFFFF" fontWeight="700">TODAY</text>

        {/* Past-fill backdrop on cumulative area (very light) */}
        <path d={curvePath(cumulative, yMax) + ` L ${xForQuarter(N - 1)},${PLOT_BOTTOM} L ${xForQuarter(0)},${PLOT_BOTTOM} Z`}
              fill={curveColor} opacity="0.06" />

        {/* Quarterly spend bars — scaled to the LEFT (bar / salary) axis using full plot height */}
        {quarterly.map((spend, i) => {
          const barH = (spend / barAxisMax) * PLOT_H;
          const barW = (PLOT_W / N) * 0.55;
          const barX = xForQuarter(i) - barW / 2;
          const barY = PLOT_BOTTOM - barH;
          const isPast = i + 1 <= TODAY;
          return (
            <g key={`bar-${i}`}>
              <rect x={barX} y={barY} width={barW} height={barH} fill={isPast ? barColor : barFutureColor} opacity="0.75" rx={1.5} />
              {spend > 0 && (
                <text x={xForQuarter(i)} y={barY - 5} fontSize="13" textAnchor="middle" fill="#475569" fontWeight="700">
                  ${spend}K
                </text>
              )}
            </g>
          );
        })}

        {/* Cumulative SPEND line + dots + labels (blue) */}
        <path d={curvePath(cumulative, yMax)} fill="none" stroke={curveColor} strokeWidth="2.2" />
        {cumulative.map((c, i) => {
          const x = xForQuarter(i);
          const y = PLOT_BOTTOM - (c / yMax) * PLOT_H;
          const isToday = i + 1 === TODAY;
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

        {/* Cumulative ASSET VALUE line + dots — only in spend mode. Colour, line width,
            dot size and label font all scale with the selected SaaS market. */}
        {isSpend && (
          <>
            <path d={curvePath(assetValues, yMax)} fill="none" stroke={assetColor} strokeWidth={mkt.lineWidth} strokeDasharray="0" />
            {assetValues.map((v, i) => {
              const x = xForQuarter(i);
              const y = PLOT_BOTTOM - (v / yMax) * PLOT_H;
              const isToday = i + 1 === TODAY;
              const showLabel = i === 0 || isToday || i === N - 1 || i % 2 === 0;
              return (
                <g key={`asset-${i}`}>
                  <circle cx={x} cy={y} r={isToday ? mkt.dotR + 1.5 : mkt.dotR} fill={assetColor} stroke="#fff" strokeWidth={isToday ? 2 : 1} />
                  {showLabel && (
                    <text x={x} y={y + 18} fontSize={isToday ? mkt.labelSize + 2 : mkt.labelSize} textAnchor="middle"
                          fill={assetColor} fontWeight={isToday ? "800" : "700"}>
                      {formatK(v)}
                    </text>
                  )}
                </g>
              );
            })}
          </>
        )}

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
            <text key={`q-${i}`} x={x} y={PLOT_BOTTOM + 22} fontSize="15" textAnchor="middle"
                  fill={isToday ? "#0A1F47" : "#6B7280"} fontWeight={isToday ? "800" : "600"}>
              {q}
            </text>
          );
        })}

        {/* Row label: Headcount */}
        <text x={PLOT_LEFT - 6} y={PLOT_BOTTOM + 52} fontSize="13" textAnchor="end" fill="#6B7280" fontWeight="700">Head Count</text>
        {HEADCOUNT.map((hc, i) => {
          const x = xForQuarter(i);
          const isPeak = hc === 20;
          return (
            <text key={`hc-${i}`} x={x} y={PLOT_BOTTOM + 52} fontSize="16" textAnchor="middle"
                  fill={isPeak ? "#F37021" : "#0A1F47"} fontWeight="800">
              {hc}
            </text>
          );
        })}

        {/* Row label: per-Q burn (spend mode only — repeated here as cleaner row below the bars) */}
        {isSpend && (
          <>
            <text x={PLOT_LEFT - 6} y={PLOT_BOTTOM + 76} fontSize="13" textAnchor="end" fill="#6B7280" fontWeight="700">Spend / Qtr</text>
            {quarterly.map((q, i) => (
              <text key={`qs-${i}`} x={xForQuarter(i)} y={PLOT_BOTTOM + 76} fontSize="14" textAnchor="middle" fill="#475569" fontWeight="700">
                ${q}K
              </text>
            ))}
          </>
        )}

        {/* Row label: cumulative */}
        <text x={PLOT_LEFT - 6} y={PLOT_BOTTOM + 100} fontSize="13" textAnchor="end" fill="#6B7280" fontWeight="700">Cumulative</text>
        {cumulative.map((c, i) => (
          <text key={`cum-${i}`} x={xForQuarter(i)} y={PLOT_BOTTOM + 100} fontSize="14" textAnchor="middle"
                fill={i + 1 === TODAY ? "#0A1F47" : curveColor} fontWeight={i + 1 === TODAY ? "800" : "700"}>
            ${c}K
          </text>
        ))}
      </svg>

      {/* Module-progression rows — split into ADMINISTRATION + OPERATIONS groups */}
      <div className="pt-2 border-t border-yai-border">
        {(() => {
          const parseK = (s?: string) => (s ? Number(s.replace(/[^\d.]/g, "")) : 0);
          // NEW value generated only at quarter q (per-quarter delta, not cumulative).
          // = digValue for each module that STARTS at q
          //   + (agValue - digValue) for each module that TRANSITIONS to Agentic at q
          //   + (fullValue - agValue) for each module that TRANSITIONS to Full Ai at q
          const valueAddedAt = (q: number) => {
            let total = 0;
            MODULES.forEach((m) => {
              if (q === m.fullStart) total += parseK(m.fullValue) - parseK(m.agValue);
              else if (q === m.agStart) total += parseK(m.agValue) - parseK(m.digValue);
              else if (q === m.digStart) total += parseK(m.digValue);
            });
            return total * mult;
          };
          const scrubValue = valueAddedAt(scrubQ);
          const isToday = scrubQ === TODAY;
          return (
            <>
              <div className="flex items-end justify-between gap-2 mb-1">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-extrabold text-yai-navy">
                    Module progression across the same timeline
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Each $ = annual SaaS value <strong>added that quarter alone</strong> (modules starting / transitioning that quarter). Click any quarter dot to scrub the indicator.
                  </div>
                </div>
              </div>

              {/* Scrubber row — clickable dots per quarter + the floating indicator */}
              <div className="relative h-16 mt-2" style={{ marginLeft: `${LEFT_PCT}%`, marginRight: `${RIGHT_PCT}%` }}>
                {/* Per-quarter dots with the cumulative value at that quarter */}
                {QUARTERS.map((q, i) => {
                  const qNum = i + 1;
                  const v = valueAddedAt(qNum);
                  const selected = qNum === scrubQ;
                  return (
                    <button
                      key={`scrub-${qNum}`}
                      onClick={() => setScrubQ(qNum)}
                      type="button"
                      className="absolute -translate-x-1/2 group cursor-pointer flex flex-col items-center"
                      style={{ left: `${((qNum - 1) / N) * 100}%`, top: 40 }}
                      title={`${q} · +$${v}K added this quarter`}
                    >
                      <span
                        className={`block rounded-full transition-all ${
                          selected ? "w-3 h-3" : "w-1.5 h-1.5 group-hover:w-2.5 group-hover:h-2.5"
                        }`}
                        style={{ background: selected ? "#0A1F47" : "#94A3B8" }}
                      />
                      <span
                        className={`mt-0.5 text-[9px] tabular-nums ${selected ? "font-extrabold text-yai-navy" : "text-gray-400 group-hover:text-gray-700"}`}
                      >
                        +{formatK(v)}
                      </span>
                    </button>
                  );
                })}

                {/* Big floating indicator at the selected quarter */}
                <div
                  className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none"
                  style={{ left: `${((scrubQ - 1) / N) * 100}%`, top: 0 }}
                >
                  <span
                    className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                    style={{ background: isToday ? "#F37021" : "#0A1F47" }}
                  >
                    {isToday ? `TODAY · ${QUARTERS[scrubQ - 1]}` : QUARTERS[scrubQ - 1]}
                  </span>
                  <span
                    className="text-xl font-extrabold tabular-nums leading-none mt-1"
                    style={{ color: isToday ? "#F37021" : "#0A1F47" }}
                  >
                    +{formatK(scrubValue)}
                  </span>
                  <span className="text-[9px] text-gray-500 mt-0.5">added this quarter</span>
                </div>
              </div>
            </>
          );
        })()}
        {(() => {
          const rows: ReactNode[] = [];
          let lastGroup: Group | null = null;
          // Align the bars with the chart's plot area (leftPct/rightPct already computed above)
          MODULES.forEach((m, idx) => {
            if (m.group !== lastGroup) {
              const gc = GROUP_COLOR[m.group];
              const label =
                m.group === "admin"    ? "Administration" :
                m.group === "platform" ? "Platform Foundation" :
                                         "Operations";
              rows.push(
                <div key={`hdr-${m.group}`} className={`flex items-center gap-3 ${idx > 0 ? "mt-4" : ""} mb-2`}>
                  <span
                    className="inline-block text-[10px] font-extrabold uppercase tracking-[0.15em] px-2.5 py-1 rounded text-white shrink-0"
                    style={{ background: gc.bg }}
                  >
                    {label}
                  </span>
                  {idx === 0 && (
                    <div className="flex items-center gap-3 text-[10px] text-gray-600 shrink-0">
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ background: COL.dig }} />Digitalization
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ background: COL.ag }} />Agentic
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ background: COL.full }} />Full Ai
                      </span>
                    </div>
                  )}
                  <div className="flex-1 h-px" style={{ background: gc.bg, opacity: 0.25 }} />
                </div>
              );
              lastGroup = m.group;
            }
            const gc = GROUP_COLOR[m.group];
            rows.push(
              <div key={m.name} className="mb-2.5">
                <div
                  className="text-[12px] font-semibold leading-tight mb-1"
                  style={{ color: gc.label, paddingLeft: `${LEFT_PCT}%` }}
                >
                  {m.name}
                </div>
                <div
                  className="relative h-7 rounded bg-gray-50 overflow-hidden"
                  style={{ marginLeft: `${LEFT_PCT}%`, marginRight: `${RIGHT_PCT}%` }}
                >
                  <div
                    className="absolute top-0 bottom-0 flex items-center justify-center text-white text-[12px] font-extrabold tracking-wide overflow-hidden whitespace-nowrap px-1"
                    style={{
                      left: `${((m.digStart - 1) / N) * 100}%`,
                      width: `${((m.agStart - m.digStart) / N) * 100}%`,
                      background: COL.dig,
                    }}
                    title={`Digitalization · ${m.digValue ?? ""} Cambodian SaaS / yr / factory`}
                  >
                    {scaleK(m.digValue)}
                  </div>
                  <div
                    className="absolute top-0 bottom-0 flex items-center justify-center text-white text-[12px] font-extrabold tracking-wide overflow-hidden whitespace-nowrap px-1"
                    style={{
                      left: `${((m.agStart - 1) / N) * 100}%`,
                      width: `${((m.fullStart - m.agStart) / N) * 100}%`,
                      background: COL.ag,
                    }}
                    title={`Agentic · ${m.agValue ?? ""} Cambodian SaaS / yr / factory`}
                  >
                    {scaleK(m.agValue)}
                  </div>
                  <div
                    className="absolute top-0 bottom-0 flex items-center justify-center text-white text-[12px] font-extrabold tracking-wide overflow-hidden whitespace-nowrap px-1"
                    style={{
                      left: `${((m.fullStart - 1) / N) * 100}%`,
                      width: `${((N - m.fullStart + 1) / N) * 100}%`,
                      background: COL.full,
                    }}
                    title={`Full Ai · ${m.fullValue ?? ""} Cambodian SaaS / yr / factory`}
                  >
                    {scaleK(m.fullValue)}
                  </div>
                  <div
                    className="absolute top-0 bottom-0 pointer-events-none"
                    style={{
                      left: `calc(${((scrubQ - 1) / N) * 100}% - 1.5px)`,
                      width: "3px",
                      background: "#0A1F47",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.9)",
                    }}
                  />
                </div>
              </div>
            );
          });
          return rows;
        })()}
      </div>

    </div>
  );
}
