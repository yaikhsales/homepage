// Server component — reads the 3 admin stores and renders the public Section 13
// summary as 4 collapsible GTM-style bars (Revenue · Salaries · Expenses · Net).

import { readSalesStore } from "@/lib/sales-store";
import { readSalaryStore } from "@/lib/salary-store";
import { readExpensesStore } from "@/lib/expenses-store";
import { GtmEnablerBar } from "./GtmEnablerBar";

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000)     return `$${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

function fmtMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[Number(m) - 1]} ${y.slice(-2)}`;
}

export async function LiveBudgetSummary() {
  const [sales, salaries, expenses] = await Promise.all([
    readSalesStore(),
    readSalaryStore(),
    readExpensesStore(),
  ]);

  // Aggregate — e-com streams store user counts, not dollars, so SKIP them
  // from the revenue $ total (their numbers belong in a separate user-count chart).
  // Planned and Actual tracked as separate series (green forecast bar + orange
  // booked bar in the chart, two badges on the card).
  const plannedByMonth: Record<string, number> = {};
  const actualByMonth: Record<string, number> = {};
  const revenueByMonth: Record<string, number> = {}; // actual ?? planned — feeds Net
  const revenueByStream = sales.streams.map((st) => {
    let total = 0;
    const isMoney = st.category !== "ecom";
    if (isMoney) {
      for (const [m, cell] of Object.entries(st.monthly)) {
        const p = cell.planned ?? 0;
        const a = cell.actual ?? 0;
        if (p > 0) plannedByMonth[m] = (plannedByMonth[m] ?? 0) + p;
        if (a > 0) actualByMonth[m] = (actualByMonth[m] ?? 0) + a;
        const v = cell.actual ?? cell.planned ?? 0;
        total += v;
        revenueByMonth[m] = (revenueByMonth[m] ?? 0) + v;
      }
    }
    return { ...st, total };
  });
  const totalRevenue = revenueByStream.reduce<number>((s, st) => s + st.total, 0);
  const totalPlanned = Object.values(plannedByMonth).reduce((s, v) => s + v, 0);
  const totalActual = Object.values(actualByMonth).reduce((s, v) => s + v, 0);

  const salaryByMonth: Record<string, number> = {};
  let totalSalary = 0;
  // Exclude resigned / re-aligned members ("dead wood") so the run-rate reflects
  // the current active payroll, not historic outflows for people who've left.
  for (const mem of salaries.members) {
    if (mem.status !== "active") continue;
    for (const [m, v] of Object.entries(mem.monthly)) {
      const n = typeof v === "number" ? v : 0;
      salaryByMonth[m] = (salaryByMonth[m] ?? 0) + n;
      totalSalary += n;
    }
  }

  const expensesByMonth: Record<string, number> = {};
  const expensesByCategory = expenses.categories.map((cat) => {
    let total = 0;
    for (const item of cat.items) {
      for (const [m, cell] of Object.entries(item.monthly)) {
        const n = cell.amount ?? 0;
        total += n;
        expensesByMonth[m] = (expensesByMonth[m] ?? 0) + n;
      }
    }
    return { ...cat, total };
  });
  const totalExpenses = expensesByCategory.reduce<number>((s, c) => s + c.total, 0);
  const netPosition = totalRevenue - totalSalary - totalExpenses;

  const allMonths = Array.from(new Set([
    ...sales.months, ...salaries.months, ...expenses.months,
  ])).sort();

  const lastUpdated = [sales.updatedAt, salaries.updatedAt, expenses.updatedAt]
    .filter(Boolean).sort().reverse()[0];

  return (
    <div className="space-y-3">
      {/* 01 · INCOME — one chart, no sub-card palettes */}
      <GtmEnablerBar
        num="01"
        tag="INCOME"
        title="Sales / Income"
        desc="11 streams — 8 planned packages (Cloud × 3 · Ai Server · Admin Tools · Ops Tools · Agentic · Big Ai Brain) + 3 variable-reach e-com streams. Tracking starts Jun 2026."
        color="#10B981"
        bg="#ECFDF5"
        badge={fmt(totalPlanned)}
        badgeLabel="Planned"
        badge2={fmt(totalActual)}
        badge2Label="Actual"
        badge2Color="#F37021"
      >
        <MonthlySparkline
          label="Income · quarterly"
          months={sales.months}
          values={plannedByMonth}
          color="#10B981"
          values2={actualByMonth}
          color2="#F37021"
          legend={["Planned", "Actual"]}
          trim
        />
        <div className="mt-2 text-right">
          <a
            href="/plan/sales-sheet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-yai-blue hover:text-yai-orange transition-colors"
          >
            Detailed Sheet <span aria-hidden>↗</span>
          </a>
        </div>
      </GtmEnablerBar>

      {/* 02 · SALARIES — one chart */}
      <GtmEnablerBar
        num="02"
        tag="EXPENSES"
        title="Salaries · compensation paid"
        desc={`${salaries.members.length} members tracked from May 2024 onward. Includes bonuses.`}
        color="#1E4DAA"
        bg="#EFF6FF"
        badge={fmt(totalSalary)}
        badgeLabel="Paid"
      >
        <MonthlySparkline label="Salaries · quarterly" months={allMonths} values={salaryByMonth} color="#1E4DAA" />
      </GtmEnablerBar>

      {/* 03 · CAPEX — one chart */}
      <GtmEnablerBar
        num="03"
        tag="CAPEX"
        title="Capex + running costs"
        desc={`${expensesByCategory.length} categories — Computers, Furniture, Dev gear, Admin Shop, Ai Fees, Villa Rent, Petty Cash + Promotion.`}
        color="#F37021"
        bg="#FFF7ED"
        badge={fmt(totalExpenses)}
        badgeLabel="Spent"
      >
        <MonthlySparkline label="Capex · quarterly" months={allMonths} values={expensesByMonth} color="#F37021" />
      </GtmEnablerBar>

      {/* 04 · NET — one chart (revenue up · cost down · net line) */}
      <GtmEnablerBar
        num="04"
        tag="NET"
        title="Net position · investment build"
        desc="Income − (Salaries + Capex). Negative is expected during the platform-build phase — see Section 10 for the asset-value offset."
        color={netPosition >= 0 ? "#10B981" : "#0A1F47"}
        bg="#F8FAFC"
        badge={fmt(netPosition)}
        badgeLabel="Today"
      >
        <NetSparkline months={allMonths} revenueByMonth={revenueByMonth} salaryByMonth={salaryByMonth} expensesByMonth={expensesByMonth} />
      </GtmEnablerBar>

      {/* Footer */}
      <div className="text-[10px] text-gray-500 leading-snug pt-1">
        Sourced live from admin · Sales · Salaries · Expenses.
        {lastUpdated && <> Last update <strong className="text-yai-navy">{new Date(lastUpdated).toLocaleString()}</strong>.</>}
      </div>
    </div>
  );
}

/* ─── Helper presentation components (all server-side) ──────────────────── */

function MiniStat({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div
      className="rounded-lg border border-yai-border bg-white p-3"
      style={{ borderTopWidth: 3, borderTopColor: color }}
    >
      <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500">{label}</div>
      <div className="text-xl font-extrabold tabular-nums" style={{ color }}>{value}</div>
      <div className="text-[10px] text-gray-600 italic mt-0.5">{sub}</div>
    </div>
  );
}

const CAT_VIS: Record<string, { label: string; bg: string }> = {
  cloud:    { label: "Cloud",    bg: "#1E4DAA" },
  hardware: { label: "Hardware", bg: "#0A3327" },
  addon:    { label: "Add-on",   bg: "#6D4FB6" },
  ecom:     { label: "E-com",    bg: "#F37021" },
};

type SimpleStream = {
  id: string;
  name: string;
  category: string;
  certainty: string;
  unitLabel: string;
  tierLabel: string;
  total: number;
};

function StreamGrid({ streams, totalLabel }: { streams: SimpleStream[]; totalLabel: string }) {
  const active = streams.filter((s) => s.total > 0).length;
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500 mb-2">
        {active} of {streams.length} {totalLabel.toLowerCase()}
      </div>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {streams.map((st) => {
          const cat = CAT_VIS[st.category] ?? CAT_VIS.cloud;
          const isUncertain = st.certainty === "uncertain";
          return (
            <li
              key={st.id}
              className={`rounded-lg border bg-white p-2.5 ${isUncertain ? "border-orange-200" : "border-yai-border"}`}
              style={{ borderLeftWidth: 3, borderLeftColor: cat.bg }}
            >
              <div className="flex items-baseline justify-between gap-2 mb-0.5 flex-wrap">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span
                    className="text-[8px] font-extrabold uppercase tracking-wider px-1 py-0.5 rounded text-white"
                    style={{ background: cat.bg }}
                  >
                    {cat.label}
                  </span>
                  <span className="text-[12px] font-extrabold text-yai-navy">{st.name}</span>
                </div>
                <span className="text-[11px] font-extrabold tabular-nums" style={{ color: st.total > 0 ? "#10B981" : "#94A3B8" }}>
                  {st.total > 0 ? fmt(st.total) : "—"}
                </span>
              </div>
              <div className="text-[10px] text-gray-500">{st.unitLabel} · <span className="text-gray-400">{st.tierLabel}</span></div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Bucket month-keyed values into Q1/Q2/Q3/Q4 of each year. */
function bucketToQuarters(months: string[], values: Record<string, number>) {
  const out = new Map<string, { label: string; total: number; months: string[] }>();
  for (const ym of months) {
    const [y, m] = ym.split("-");
    const q = Math.ceil(Number(m) / 3);
    const key = `${y}-Q${q}`;
    const label = `Q${q}'${y.slice(-2)}`;
    const existing = out.get(key) ?? { label, total: 0, months: [] };
    existing.total += values[ym] ?? 0;
    existing.months.push(ym);
    out.set(key, existing);
  }
  return Array.from(out.values());
}

/** Fat quarterly bar chart — bars with $ labels on top + axis. Matches Section 10 visual.
 *  Pass values2/color2 for a grouped second series (e.g. Planned vs Actual). */
function MonthlySparkline({ label, months, values, color, values2, color2, legend, trim }: {
  label: string;
  months: string[];
  values: Record<string, number>;
  color: string;
  values2?: Record<string, number>;
  color2?: string;
  legend?: [string, string];
  /** Drop leading + trailing quarters with no data in either series, so the
   *  bars get the full width (labels stop colliding). */
  trim?: boolean;
}) {
  let quarters = bucketToQuarters(months, values);
  let quarters2 = values2 ? bucketToQuarters(months, values2) : null;
  if (trim) {
    const hasData = (i: number) =>
      (quarters[i]?.total ?? 0) > 0 || ((quarters2?.[i]?.total ?? 0) > 0);
    let first = quarters.findIndex((_, i) => hasData(i));
    if (first < 0) first = 0;
    let last = quarters.length - 1;
    while (last > first && !hasData(last)) last--;
    quarters = quarters.slice(first, last + 1);
    if (quarters2) quarters2 = quarters2.slice(first, last + 1);
  }
  const data = quarters.map((q) => q.total);
  const data2 = quarters2 ? quarters2.map((q) => q.total) : [];
  const max = Math.max(0.0001, ...data, ...data2);
  const hasAny = data.some((v) => v > 0) || data2.some((v) => v > 0);
  const grouped = !!quarters2;

  // Chart geometry — fatter bars, room for $ labels above + quarter labels below
  const W = 1000;
  const H = 220;
  const PAD_L = 40;
  const PAD_R = 20;
  const PAD_T = 24;   // room for $ label above each bar
  const PAD_B = 28;   // room for quarter label below
  const PLOT_W = W - PAD_L - PAD_R;
  const PLOT_H = H - PAD_T - PAD_B;
  const N = Math.max(1, quarters.length);
  const SLOT_W = PLOT_W / N;
  const BAR_W = grouped ? SLOT_W * 0.32 : SLOT_W * 0.65;

  return (
    <div className="mt-3 rounded-lg bg-white border border-yai-border p-3">
      <div className="flex items-baseline justify-between gap-2 mb-2 flex-wrap">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500">{label}</span>
        <div className="flex items-center gap-3">
          {grouped && legend && (
            <span className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                <span className="text-gray-700">{legend[0]}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: color2 }} />
                <span className="text-gray-700">{legend[1]}</span>
              </span>
            </span>
          )}
          {months.length > 0 && (
            <span className="text-[10px] text-gray-500">
              {fmtMonth(months[0])} → {fmtMonth(months[months.length - 1])}
            </span>
          )}
        </div>
      </div>
      {!hasAny ? (
        <div className="text-[12px] text-gray-400 italic text-center py-6">No data yet — admin posts will appear here.</div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* Baseline */}
          <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_B} y2={H - PAD_B} stroke="#9CA3AF" strokeWidth="0.6" />

          {quarters.map((q, i) => {
            const cx = PAD_L + SLOT_W * (i + 0.5);
            const barH = (q.total / max) * PLOT_H;
            const v2 = quarters2 ? (quarters2[i]?.total ?? 0) : 0;
            const barH2 = (v2 / max) * PLOT_H;
            // Grouped: series-1 bar sits left of centre, series-2 right.
            const x1 = grouped ? cx - BAR_W - 1.5 : cx - BAR_W / 2;
            const x2 = cx + 1.5;
            const y1 = H - PAD_B - barH;
            const y2 = H - PAD_B - barH2;
            return (
              <g key={q.label}>
                <rect x={x1} y={y1} width={BAR_W} height={Math.max(0.5, barH)} fill={color} opacity={q.total > 0 ? 0.85 : 0.15} rx={2} />
                {q.total > 0 && (
                  <text x={x1 + BAR_W / 2} y={y1 - 5} fontSize={grouped ? "10" : "12"} textAnchor="middle" fill="#1E3A8A" fontWeight="800">
                    {fmt(q.total)}
                  </text>
                )}
                {grouped && (
                  <>
                    <rect x={x2} y={y2} width={BAR_W} height={Math.max(0.5, barH2)} fill={color2} opacity={v2 > 0 ? 0.9 : 0.12} rx={2} />
                    {v2 > 0 && (
                      <text x={x2 + BAR_W / 2} y={y2 - 5} fontSize="10" textAnchor="middle" fill="#9A3412" fontWeight="800">
                        {fmt(v2)}
                      </text>
                    )}
                  </>
                )}
                <text x={cx} y={H - PAD_B + 16} fontSize="12" textAnchor="middle" fill="#475569" fontWeight="700">
                  {q.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

/** Net position quarterly bar chart — Revenue above mid-line (green up) · Cost below (orange down). */
function NetSparkline({ months, revenueByMonth, salaryByMonth, expensesByMonth }: {
  months: string[];
  revenueByMonth: Record<string, number>;
  salaryByMonth: Record<string, number>;
  expensesByMonth: Record<string, number>;
}) {
  const revQ  = bucketToQuarters(months, revenueByMonth);
  const costByMonth: Record<string, number> = {};
  for (const m of months) costByMonth[m] = (salaryByMonth[m] ?? 0) + (expensesByMonth[m] ?? 0);
  const costQ = bucketToQuarters(months, costByMonth);

  const maxRev  = Math.max(0.0001, ...revQ.map((q) => q.total));
  const maxCost = Math.max(0.0001, ...costQ.map((q) => q.total));
  const peak = Math.max(maxRev, maxCost);
  const hasAny = revQ.some((q) => q.total > 0) || costQ.some((q) => q.total > 0);

  const W = 1000;
  const H = 280;
  const PAD_L = 40;
  const PAD_R = 20;
  const PAD_T = 20;
  const PAD_B = 28;
  const PLOT_W = W - PAD_L - PAD_R;
  const PLOT_H = H - PAD_T - PAD_B;
  const midY = PAD_T + PLOT_H / 2;
  const halfH = (PLOT_H / 2) - 16; // leave room for $ labels above/below bars
  const N = Math.max(1, revQ.length);
  const SLOT_W = PLOT_W / N;
  const BAR_W = SLOT_W * 0.6;

  return (
    <div className="rounded-lg bg-white border border-yai-border p-3">
      <div className="flex items-baseline justify-between gap-2 mb-2 flex-wrap">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500">Quarterly · revenue vs cost</span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500" /> <span className="text-gray-700">Revenue (up)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-yai-orange" /> <span className="text-gray-700">Cost (down)</span>
          </span>
        </div>
      </div>
      {!hasAny ? (
        <div className="text-[12px] text-gray-400 italic text-center py-6">No data yet — admin posts will appear here.</div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* Zero line */}
          <line x1={PAD_L} x2={W - PAD_R} y1={midY} y2={midY} stroke="#475569" strokeWidth="0.8" />

          {revQ.map((q, i) => {
            const cost = costQ[i]?.total ?? 0;
            const rev = q.total;
            const cx = PAD_L + SLOT_W * (i + 0.5);
            const x  = cx - BAR_W / 2;
            const rH = (rev / peak) * halfH;
            const cH = (cost / peak) * halfH;

            return (
              <g key={q.label}>
                {/* Revenue bar going up */}
                {rev > 0 && <rect x={x} y={midY - rH} width={BAR_W} height={rH} fill="#10B981" opacity={0.9} rx={2} />}
                {rev > 0 && (
                  <text x={cx} y={midY - rH - 5} fontSize="11" textAnchor="middle" fill="#047857" fontWeight="800">
                    {fmt(rev)}
                  </text>
                )}
                {/* Cost bar going down */}
                {cost > 0 && <rect x={x} y={midY} width={BAR_W} height={cH} fill="#F37021" opacity={0.85} rx={2} />}
                {cost > 0 && (
                  <text x={cx} y={midY + cH + 14} fontSize="11" textAnchor="middle" fill="#9A3412" fontWeight="800">
                    {fmt(cost)}
                  </text>
                )}
                {/* Quarter label below the cost bar (or below the zero line if no cost) */}
                <text x={cx} y={H - PAD_B + 16} fontSize="12" textAnchor="middle" fill="#475569" fontWeight="700">
                  {q.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
