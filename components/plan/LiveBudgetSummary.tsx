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

  // Aggregate
  const revenueByMonth: Record<string, number> = {};
  const revenueByStream = sales.streams.map((st) => {
    let total = 0;
    for (const [m, cell] of Object.entries(st.monthly)) {
      total += cell.revenue ?? 0;
      revenueByMonth[m] = (revenueByMonth[m] ?? 0) + (cell.revenue ?? 0);
    }
    return { ...st, total };
  });
  const totalRevenue = revenueByStream.reduce<number>((s, st) => s + st.total, 0);

  const salaryByMonth: Record<string, number> = {};
  let totalSalary = 0;
  for (const mem of salaries.members) {
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
      {/* 01 · NET (summary on top) */}
      <GtmEnablerBar
        num="01"
        tag="NET"
        title="Net position · investment build"
        desc="Revenue − (Salaries + Expenses). Negative is expected during the platform-build phase — see Section 10 for the asset-value offset."
        color={netPosition >= 0 ? "#10B981" : "#0A1F47"}
        bg="#F8FAFC"
        badge={fmt(netPosition)}
        badgeLabel="Today"
      >
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <MiniStat label="In" value={fmt(totalRevenue)} sub="Revenue booked" color="#10B981" />
          <MiniStat label="Out" value={fmt(totalSalary + totalExpenses)} sub={`Salaries ${fmt(totalSalary)} + Expenses ${fmt(totalExpenses)}`} color="#F37021" />
          <MiniStat label="Net" value={fmt(netPosition)} sub={netPosition >= 0 ? "Surplus" : "Investment build"} color={netPosition >= 0 ? "#10B981" : "#0A1F47"} />
        </div>
        <NetSparkline months={allMonths} revenueByMonth={revenueByMonth} salaryByMonth={salaryByMonth} expensesByMonth={expensesByMonth} />
      </GtmEnablerBar>

      {/* 02 · Revenue */}
      <GtmEnablerBar
        num="02"
        tag="REVENUE"
        title="Sales / Income"
        desc="9 streams — 6 planned packages (Cloud Starter→Big Ai Brain) + 3 variable-revenue e-com streams."
        color="#10B981"
        bg="#ECFDF5"
        badge={fmt(totalRevenue)}
        badgeLabel="Booked"
      >
        <StreamGrid streams={revenueByStream} totalLabel="Streams active" />
        <MonthlySparkline label="Revenue · monthly" months={allMonths} values={revenueByMonth} color="#10B981" />
      </GtmEnablerBar>

      {/* 03 · Salaries */}
      <GtmEnablerBar
        num="03"
        tag="SALARIES"
        title="Compensation paid"
        desc={`${salaries.members.length} members tracked from May 2024 onward. Includes bonuses.`}
        color="#1E4DAA"
        bg="#EFF6FF"
        badge={fmt(totalSalary)}
        badgeLabel="Paid"
      >
        <div className="grid sm:grid-cols-3 gap-3">
          <MiniStat label="Members on roll" value={`${salaries.members.filter((m) => m.status === "active").length}`} sub={`${salaries.members.length} total · ${salaries.members.filter((m) => m.status !== "active").length} resigned / re-aligned`} color="#1E4DAA" />
          <MiniStat label="Months tracked" value={`${salaries.months.length}`} sub={`May 2024 → today`} color="#1E4DAA" />
          <MiniStat label="Avg / month" value={fmt(salaries.months.length ? totalSalary / salaries.months.length : 0)} sub="Burn pace" color="#1E4DAA" />
        </div>
        <MonthlySparkline label="Salaries · monthly" months={allMonths} values={salaryByMonth} color="#1E4DAA" />
      </GtmEnablerBar>

      {/* 04 · Other expenses */}
      <GtmEnablerBar
        num="04"
        tag="EXPENSES"
        title="Other expenses · capex + running"
        desc={`${expensesByCategory.length} categories — Computers, Furniture, Dev gear, Admin Shop, Ai Fees, Villa Rent, Petty Cash + Promotion.`}
        color="#F37021"
        bg="#FFF7ED"
        badge={fmt(totalExpenses)}
        badgeLabel="Spent"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {expensesByCategory.map((cat) => (
            <div
              key={cat.id}
              className="rounded-lg border border-yai-border bg-white p-2.5"
              style={{ borderLeftWidth: 3, borderLeftColor: cat.color }}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-extrabold text-yai-navy leading-tight">{cat.name}</span>
                <span className="text-[11px] font-extrabold tabular-nums shrink-0" style={{ color: cat.total > 0 ? cat.color : "#94A3B8" }}>
                  {cat.total > 0 ? fmt(cat.total) : "—"}
                </span>
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">{cat.items.length} line item{cat.items.length === 1 ? "" : "s"}</div>
            </div>
          ))}
        </div>
        <MonthlySparkline label="Expenses · monthly" months={allMonths} values={expensesByMonth} color="#F37021" />
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

/** Fat quarterly bar chart — bars with $ labels on top + axis. Matches Section 10 visual. */
function MonthlySparkline({ label, months, values, color }: {
  label: string;
  months: string[];
  values: Record<string, number>;
  color: string;
}) {
  const quarters = bucketToQuarters(months, values);
  const data = quarters.map((q) => q.total);
  const max = Math.max(0.0001, ...data);
  const hasAny = data.some((v) => v > 0);

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
  const BAR_W = SLOT_W * 0.65;

  return (
    <div className="mt-3 rounded-lg bg-white border border-yai-border p-3">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500">{label}</span>
        {months.length > 0 && (
          <span className="text-[10px] text-gray-500">
            {fmtMonth(months[0])} → {fmtMonth(months[months.length - 1])}
          </span>
        )}
      </div>
      {!hasAny ? (
        <div className="text-[12px] text-gray-400 italic text-center py-6">No data yet — admin posts will appear here.</div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* Baseline */}
          <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_B} y2={H - PAD_B} stroke="#9CA3AF" strokeWidth="0.6" />

          {quarters.map((q, i) => {
            const barH = (q.total / max) * PLOT_H;
            const cx = PAD_L + SLOT_W * (i + 0.5);
            const x  = cx - BAR_W / 2;
            const y  = H - PAD_B - barH;
            return (
              <g key={q.label}>
                <rect x={x} y={y} width={BAR_W} height={Math.max(0.5, barH)} fill={color} opacity={q.total > 0 ? 0.85 : 0.15} rx={2} />
                {q.total > 0 && (
                  <text x={cx} y={y - 5} fontSize="12" textAnchor="middle" fill="#1E3A8A" fontWeight="800">
                    {fmt(q.total)}
                  </text>
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
