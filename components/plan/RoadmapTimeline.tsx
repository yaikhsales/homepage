"use client";

/* Shared module-roadmap timeline — drives both Capital Efficiency and Financials & Milestones.
 * 12 quarter columns (Q3'24 → Q2'27). Each module shows its Digitalization → Agentic → Full Ai
 * progression as 3 coloured segments across the timeline. */

const QUARTERS = [
  "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25", "Q4'25",
  "Q1'26", "Q2'26", "Q3'26", "Q4'26", "Q1'27", "Q2'27",
];
const N = QUARTERS.length;        // 12 columns
const TODAY = 8;                  // Q2'26 — current quarter (1-based)

type Mod = {
  name: string;
  digStart: number;    // 1-based quarter index where Digitalization begins
  agStart: number;     // Agentic begins
  fullStart: number;   // Full Ai begins
};

const MODULES: Mod[] = [
  { name: "PR · Shop · Approval · Support · APP",        digStart: 1, agStart: 8,  fullStart: 11 },
  { name: "HR · Pay · Org chart",                         digStart: 1, agStart: 8,  fullStart: 11 },
  { name: "Car booking · Gate pass",                      digStart: 1, agStart: 8,  fullStart: 11 },
  { name: "Digital Audit · Waste · AIoT",                 digStart: 1, agStart: 8,  fullStart: 11 },
  { name: "YTM · Machine maintenance",                    digStart: 2, agStart: 8,  fullStart: 11 },
  { name: "QMS · Cutting / Sewing / Packing QC",          digStart: 2, agStart: 8,  fullStart: 11 },
  { name: "Accounting (full · GDT filing)",               digStart: 4, agStart: 9,  fullStart: 11 },
  { name: "Extended Logistics + HR Billing",              digStart: 5, agStart: 9,  fullStart: 12 },
  { name: "Fabric · Accessories warehouse",               digStart: 6, agStart: 9,  fullStart: 12 },
  { name: "Product Dev · Sample room",                    digStart: 6, agStart: 9,  fullStart: 12 },
  { name: "YPI · Technical specs (3 lang)",               digStart: 6, agStart: 9,  fullStart: 12 },
  { name: "YPM · Ai motion · SMV · Allocation",           digStart: 6, agStart: 9,  fullStart: 12 },
  { name: "4DP · Capacity & production planning",         digStart: 6, agStart: 9,  fullStart: 12 },
  { name: "MRP · Sourcing · Procurement · Logistics",     digStart: 6, agStart: 9,  fullStart: 12 },
  { name: "Export Shipping",                              digStart: 6, agStart: 9,  fullStart: 12 },
  { name: "Corporate Financials",                         digStart: 6, agStart: 9,  fullStart: 12 },
];

const HEADCOUNT  = [3, 5, 7, 10, 13, 16, 18, 20, 20, 20, 20, 20];           // engineers / quarter
const SPEND_CUM  = [9, 27, 54, 90, 135, 189, 252, 324, 360, 360, 360, 360]; // cumulative $K (rough)
const REVENUE    = [0, 0, 0, 0, 0, 0, 8, 20, 45, 80, 130, 180];             // $K cumulative (illustrative)

const MILESTONES = [
  { qtr: 8,  label: "Q1 · Foundation",  detail: "3–5 paid contracts" },
  { qtr: 9,  label: "Q2 · Validation",  detail: "10+ customers · Ministry signed" },
  { qtr: 10, label: "Q3 · Expansion",   detail: "20+ customers · regional pilot" },
  { qtr: 11, label: "Q4 · Scale",       detail: "30+ customers · Stage 3 scoped" },
];

const COL = {
  dig:   "#F37021", // orange
  ag:    "#1E4DAA", // blue
  full:  "#0A3327", // dark green
  today: "#0A1F47",
};

function curvePath(values: number[]) {
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => {
    const x = (i / (N - 1)) * 100;
    const y = 100 - (v / max) * 90;
    return [x, y];
  });
  // Smooth path via cubic bezier
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
  const series = mode === "spend" ? SPEND_CUM : REVENUE;
  const seriesMax = Math.max(...series);
  const showMilestones = mode === "revenue";
  const curveColor = mode === "spend" ? COL.ag : "#10B981"; // emerald for revenue

  return (
    <div className="rounded-xl border border-yai-border bg-white p-4 sm:p-5">
      {/* Header — series curve + axis */}
      <div className="relative">
        {/* Series label */}
        <div className="flex items-baseline justify-between mb-1.5">
          <div className="text-[10px] uppercase tracking-wider font-extrabold" style={{ color: curveColor }}>
            {mode === "spend" ? "Cumulative spend (Cambodia rate, $K)" : "Cumulative revenue (illustrative, $K)"}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400">
            {mode === "spend" ? `Peak ${HEADCOUNT[N - 1]} engineers · ~$360K total` : "Year-1 trajectory"}
          </div>
        </div>

        {/* Curve area + module-name gutter spacer */}
        <div className="flex gap-2">
          <div className="w-[200px] shrink-0" aria-hidden />
          <div className="flex-1 relative">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-20">
              {/* Today marker */}
              <line
                x1={((TODAY - 1) / (N - 1)) * 100}
                x2={((TODAY - 1) / (N - 1)) * 100}
                y1={0}
                y2={100}
                stroke={COL.today}
                strokeWidth="0.4"
                strokeDasharray="1 1"
              />
              {/* Curve fill */}
              <path d={curvePath(series) + ` L 100,100 L 0,100 Z`} fill={curveColor} opacity="0.12" />
              {/* Curve stroke */}
              <path d={curvePath(series)} fill="none" stroke={curveColor} strokeWidth="0.8" />
              {/* Endpoint dots */}
              {series.map((v, i) => (
                <circle
                  key={i}
                  cx={(i / (N - 1)) * 100}
                  cy={100 - (v / Math.max(seriesMax, 1)) * 90}
                  r="0.7"
                  fill={curveColor}
                />
              ))}
            </svg>

            {/* Milestone markers (revenue mode only) */}
            {showMilestones && (
              <div className="absolute inset-x-0 top-0 h-20 pointer-events-none">
                {MILESTONES.map((m) => {
                  const left = ((m.qtr - 1) / (N - 1)) * 100;
                  return (
                    <div key={m.qtr} className="absolute top-0 -translate-x-1/2" style={{ left: `${left}%` }}>
                      <div className="bg-amber-400 text-[#0A3327] text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                        {m.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quarter axis labels */}
        <div className="flex gap-2 mt-1.5">
          <div className="w-[200px] shrink-0" aria-hidden />
          <div className="flex-1 grid grid-cols-12">
            {QUARTERS.map((q, i) => (
              <div
                key={q}
                className={`text-[9px] text-center font-semibold ${
                  i + 1 === TODAY ? "text-yai-navy" : "text-gray-400"
                }`}
              >
                {q}
                {i + 1 === TODAY && <div className="text-[8px] font-bold text-yai-orange leading-none">TODAY</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module rows */}
      <div className="space-y-1 mt-3">
        {MODULES.map((m) => (
          <div key={m.name} className="flex items-center gap-2 group">
            <div className="w-[200px] shrink-0 text-[10px] font-semibold text-yai-navy leading-tight pr-2">
              {m.name}
            </div>
            <div className="flex-1 relative h-5 rounded bg-gray-50 overflow-hidden">
              {/* Digitalization segment */}
              <div
                className="absolute top-0 bottom-0 flex items-center justify-center text-white text-[9px] font-bold"
                style={{
                  left:  `${((m.digStart - 1) / N) * 100}%`,
                  width: `${((m.agStart - m.digStart) / N) * 100}%`,
                  background: COL.dig,
                }}
                title="Digitalization"
              />
              {/* Agentic segment */}
              <div
                className="absolute top-0 bottom-0"
                style={{
                  left:  `${((m.agStart - 1) / N) * 100}%`,
                  width: `${((m.fullStart - m.agStart) / N) * 100}%`,
                  background: COL.ag,
                }}
                title="Agentic"
              />
              {/* Full Ai segment */}
              <div
                className="absolute top-0 bottom-0"
                style={{
                  left:  `${((m.fullStart - 1) / N) * 100}%`,
                  width: `${((N - m.fullStart + 1) / N) * 100}%`,
                  background: COL.full,
                }}
                title="Full Ai"
              />
              {/* Today line over the row */}
              <div
                className="absolute top-0 bottom-0 border-l-2 border-dashed pointer-events-none"
                style={{ left: `${((TODAY - 1) / N) * 100}%`, borderColor: COL.today, opacity: 0.6 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 text-[10px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: COL.dig }} />
          Digitalization
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: COL.ag }} />
          Agentic
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: COL.full }} />
          Full Ai
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          <span className="inline-block w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: COL.today }} />
          Today (Q2&rsquo;26)
        </span>
      </div>
    </div>
  );
}
