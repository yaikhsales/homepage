// Server component — the admin Dashboard's all-in-one P&L view.
// One quarterly chart with 3 layered series (Income · Salaries · Capex/Expenses)
// + one sheet with the same three streams as monthly rows and a Net row.
// Reads the same three stores the public §11 LiveBudgetSummary aggregates.

import { readSalesStore } from "@/lib/sales-store";
import { readSalaryStore } from "@/lib/salary-store";
import { readExpensesStore } from "@/lib/expenses-store";

const C = {
  income: "#10B981",
  salary: "#1E4DAA",
  capex: "#F37021",
  netPos: "#0A3327",
  netNeg: "#B91C1C",
};

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(Math.abs(n) % 1_000 === 0 ? 0 : 1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function fmtMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[Number(m) - 1]} ${y.slice(-2)}`;
}

function bucketToQuarters(months: string[], values: Record<string, number>) {
  const out = new Map<string, { label: string; total: number }>();
  for (const ym of months) {
    const [y, m] = ym.split("-");
    const q = Math.ceil(Number(m) / 3);
    const key = `${y}-Q${q}`;
    const label = `Q${q}'${y.slice(-2)}`;
    const existing = out.get(key) ?? { label, total: 0 };
    existing.total += values[ym] ?? 0;
    out.set(key, existing);
  }
  return Array.from(out.values());
}

export async function PnlOverview() {
  const [sales, salaries, expenses] = await Promise.all([
    readSalesStore(),
    readSalaryStore(),
    readExpensesStore(),
  ]);

  // Income — non-ecom streams only (e-com cells store user counts, not $).
  // actual wins over planned, matching the public §11 roll-up.
  const incomeByMonth: Record<string, number> = {};
  for (const st of sales.streams) {
    if (st.category === "ecom") continue;
    for (const [m, cell] of Object.entries(st.monthly)) {
      const v = cell.actual ?? cell.planned ?? 0;
      if (v > 0) incomeByMonth[m] = (incomeByMonth[m] ?? 0) + v;
    }
  }

  // Salaries — active members only (matches §11).
  const salaryByMonth: Record<string, number> = {};
  for (const mem of salaries.members) {
    if (mem.status !== "active") continue;
    for (const [m, v] of Object.entries(mem.monthly)) {
      const n = typeof v === "number" ? v : 0;
      if (n > 0) salaryByMonth[m] = (salaryByMonth[m] ?? 0) + n;
    }
  }

  // Capex / Equipment / Expenses — all categories, all line items.
  const capexByMonth: Record<string, number> = {};
  for (const cat of expenses.categories) {
    for (const item of cat.items) {
      for (const [m, cell] of Object.entries(item.monthly)) {
        const n = cell.amount ?? 0;
        if (n > 0) capexByMonth[m] = (capexByMonth[m] ?? 0) + n;
      }
    }
  }

  const allMonths = Array.from(
    new Set([
      ...Object.keys(incomeByMonth),
      ...Object.keys(salaryByMonth),
      ...Object.keys(capexByMonth),
    ]),
  ).sort();

  const totalIncome = Object.values(incomeByMonth).reduce((s, v) => s + v, 0);
  const totalSalary = Object.values(salaryByMonth).reduce((s, v) => s + v, 0);
  const totalCapex = Object.values(capexByMonth).reduce((s, v) => s + v, 0);
  const totalNet = totalIncome - totalSalary - totalCapex;

  // ── Quarterly buckets for the 3-layer chart, trimmed to the data window ──
  let qIncome = bucketToQuarters(allMonths, incomeByMonth);
  let qSalary = bucketToQuarters(allMonths, salaryByMonth);
  let qCapex = bucketToQuarters(allMonths, capexByMonth);
  const hasData = (i: number) =>
    (qIncome[i]?.total ?? 0) > 0 || (qSalary[i]?.total ?? 0) > 0 || (qCapex[i]?.total ?? 0) > 0;
  let first = qIncome.findIndex((_, i) => hasData(i));
  if (first < 0) first = 0;
  let last = qIncome.length - 1;
  while (last > first && !hasData(last)) last--;
  qIncome = qIncome.slice(first, last + 1);
  qSalary = qSalary.slice(first, last + 1);
  qCapex = qCapex.slice(first, last + 1);

  const max = Math.max(
    0.0001,
    ...qIncome.map((q) => q.total),
    ...qSalary.map((q) => q.total),
    ...qCapex.map((q) => q.total),
  );

  // Chart geometry — 3 grouped bars per quarter slot.
  const W = 1000;
  const H = 230;
  const PAD_L = 16;
  const PAD_R = 16;
  const PAD_T = 26;
  const PAD_B = 26;
  const PLOT_W = W - PAD_L - PAD_R;
  const PLOT_H = H - PAD_T - PAD_B;
  const N = Math.max(1, qIncome.length);
  const SLOT_W = PLOT_W / N;
  const BAR_W = Math.min(26, SLOT_W * 0.22);

  const series = [
    { key: "income", label: "Income", color: C.income, q: qIncome },
    { key: "salary", label: "Salaries", color: C.salary, q: qSalary },
    { key: "capex", label: "Capex / Expenses", color: C.capex, q: qCapex },
  ];

  return (
    <div className="rounded-xl border-2 border-yai-border bg-white p-5 mb-8">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
        <h2 className="text-lg font-extrabold text-yai-navy">P&amp;L Overview — all streams, one sheet</h2>
        <span className="text-[10px] uppercase tracking-wider text-gray-500">
          Sourced live from Sales · Salaries · Capex/Expenses
        </span>
      </div>

      {/* Headline totals */}
      <div className="flex items-center gap-5 flex-wrap mb-4">
        <span className="text-xs">
          <span className="text-gray-500 uppercase tracking-wider text-[10px] mr-1.5">Income</span>
          <strong className="tabular-nums" style={{ color: C.income }}>{fmt(totalIncome)}</strong>
        </span>
        <span className="text-xs">
          <span className="text-gray-500 uppercase tracking-wider text-[10px] mr-1.5">Salaries</span>
          <strong className="tabular-nums" style={{ color: C.salary }}>{fmt(totalSalary)}</strong>
        </span>
        <span className="text-xs">
          <span className="text-gray-500 uppercase tracking-wider text-[10px] mr-1.5">Capex / Expenses</span>
          <strong className="tabular-nums" style={{ color: C.capex }}>{fmt(totalCapex)}</strong>
        </span>
        <span className="text-xs">
          <span className="text-gray-500 uppercase tracking-wider text-[10px] mr-1.5">Net</span>
          <strong className="tabular-nums" style={{ color: totalNet >= 0 ? C.netPos : C.netNeg }}>
            {fmt(totalNet)}
          </strong>
        </span>
      </div>

      {/* ── 3-layer quarterly chart ── */}
      <div className="rounded-lg border border-yai-border bg-white p-3 mb-4">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
            Quarterly · income vs salaries vs capex
          </span>
          <span className="flex items-center gap-3 text-[10px]">
            {series.map((s) => (
              <span key={s.key} className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                <span className="text-gray-700">{s.label}</span>
              </span>
            ))}
            {allMonths.length > 0 && (
              <span className="text-gray-500">
                {fmtMonth(allMonths[0])} → {fmtMonth(allMonths[allMonths.length - 1])}
              </span>
            )}
          </span>
        </div>
        {allMonths.length === 0 ? (
          <div className="text-[12px] text-gray-400 italic text-center py-6">
            No data yet — the three feeders below fill this in.
          </div>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_B} y2={H - PAD_B} stroke="#9CA3AF" strokeWidth="0.6" />
            {qIncome.map((q, i) => {
              const cx = PAD_L + SLOT_W * (i + 0.5);
              return (
                <g key={q.label}>
                  {series.map((s, si) => {
                    const v = s.q[i]?.total ?? 0;
                    const barH = (v / max) * PLOT_H;
                    const x = cx + (si - 1.5) * (BAR_W + 2) + 1;
                    const y = H - PAD_B - barH;
                    return (
                      <g key={s.key}>
                        <rect
                          x={x}
                          y={y}
                          width={BAR_W}
                          height={Math.max(0.5, barH)}
                          fill={s.color}
                          opacity={v > 0 ? 0.85 : 0.12}
                          rx={2}
                        />
                        {v > 0 && barH > 12 && (
                          <text
                            x={x + BAR_W / 2}
                            y={y - 4}
                            fontSize="9"
                            textAnchor="middle"
                            fill={s.color}
                            fontWeight="800"
                          >
                            {fmt(v)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  <text
                    x={cx}
                    y={H - PAD_B + 16}
                    fontSize="11"
                    textAnchor="middle"
                    fill="#6B7280"
                    fontWeight="700"
                  >
                    {q.label}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* ── One sheet — monthly columns, 4 rows ── */}
      <div className="overflow-x-auto rounded-lg border border-yai-border">
        <table className="text-[11px] border-collapse w-full">
          <thead className="bg-yai-navy text-white">
            <tr>
              <th className="sticky left-0 z-10 bg-yai-navy text-left px-2 py-1.5 font-bold uppercase tracking-wider min-w-[130px]">
                Stream
              </th>
              {allMonths.map((m) => (
                <th key={m} className="text-right px-2 py-1.5 font-bold uppercase tracking-wider whitespace-nowrap min-w-[64px]">
                  {fmtMonth(m)}
                </th>
              ))}
              <th className="text-right px-2 py-1.5 font-bold uppercase tracking-wider bg-yai-blue">Total</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Income", by: incomeByMonth, color: C.income, total: totalIncome },
              { label: "Salaries", by: salaryByMonth, color: C.salary, total: totalSalary },
              { label: "Capex / Expenses", by: capexByMonth, color: C.capex, total: totalCapex },
            ].map((row) => (
              <tr key={row.label} className="border-t border-gray-100">
                <td
                  className="sticky left-0 bg-white px-2 py-1 font-extrabold whitespace-nowrap"
                  style={{ color: row.color, boxShadow: `inset 3px 0 0 0 ${row.color}` }}
                >
                  {row.label}
                </td>
                {allMonths.map((m) => {
                  const v = row.by[m] ?? 0;
                  return (
                    <td key={m} className={`px-2 py-1 text-right tabular-nums ${v > 0 ? "font-semibold" : "text-gray-300"}`} style={v > 0 ? { color: row.color } : undefined}>
                      {v > 0 ? money(v) : "—"}
                    </td>
                  );
                })}
                <td className="px-2 py-1 text-right font-extrabold tabular-nums bg-gray-50" style={{ color: row.color }}>
                  {row.total > 0 ? money(row.total) : "—"}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-yai-navy bg-gray-50">
              <td className="sticky left-0 bg-gray-50 px-2 py-1 font-extrabold text-yai-navy uppercase tracking-wider text-[10px]">
                Net
              </td>
              {allMonths.map((m) => {
                const v = (incomeByMonth[m] ?? 0) - (salaryByMonth[m] ?? 0) - (capexByMonth[m] ?? 0);
                return (
                  <td
                    key={m}
                    className="px-2 py-1 text-right font-extrabold tabular-nums"
                    style={{ color: v === 0 ? "#9CA3AF" : v > 0 ? C.netPos : C.netNeg }}
                  >
                    {v === 0 ? "—" : money(v)}
                  </td>
                );
              })}
              <td className="px-2 py-1 text-right font-extrabold tabular-nums" style={{ color: totalNet >= 0 ? C.netPos : C.netNeg }}>
                {money(totalNet)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
