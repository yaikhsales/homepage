// Server component — reads admin stores directly from disk and renders
// the public roll-up shown to viewers in Section 13.

import { readSalesStore } from "@/lib/sales-store";
import { readSalaryStore } from "@/lib/salary-store";
import { readExpensesStore } from "@/lib/expenses-store";

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

  // Build a master month list across all 3 stores
  const allMonths = Array.from(new Set([
    ...sales.months, ...salaries.months, ...expenses.months,
  ])).sort();

  // Sum revenue by month + stream
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

  // Sum salaries by month
  const salaryByMonth: Record<string, number> = {};
  let totalSalary = 0;
  for (const mem of salaries.members) {
    for (const [m, v] of Object.entries(mem.monthly)) {
      const n = typeof v === "number" ? v : 0;
      salaryByMonth[m] = (salaryByMonth[m] ?? 0) + n;
      totalSalary += n;
    }
  }

  // Sum non-salary expenses by month + by category
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

  const totalCost = totalSalary + totalExpenses;
  const netPosition = totalRevenue - totalCost;
  const hasAnyData = totalRevenue > 0 || totalCost > 0;

  // Determine the data window — first month with any data → today
  const windowMonths = allMonths.filter((m) =>
    revenueByMonth[m] || salaryByMonth[m] || expensesByMonth[m]
  );

  const lastUpdated = [
    sales.updatedAt,
    salaries.updatedAt,
    expenses.updatedAt,
  ].filter(Boolean).sort().reverse()[0];

  if (!hasAnyData) {
    return (
      <div className="rounded-xl border-2 border-dashed border-yai-border bg-white/50 p-6 text-center">
        <div className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 mb-1">
          Live P&amp;L · awaiting admin entries
        </div>
        <div className="text-sm text-gray-500 max-w-xl mx-auto">
          Once the admin posts Sales / Salaries / Capex actuals, this view rebuilds itself
          automatically with KPI cards, per-stream summaries, and a monthly trend.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid sm:grid-cols-4 gap-3">
        <Kpi label="Revenue booked"      value={fmt(totalRevenue)}    color="#10B981" note={`${revenueByStream.filter((s) => s.total > 0).length} of ${revenueByStream.length} streams active`} />
        <Kpi label="Salaries paid"       value={fmt(totalSalary)}     color="#1E4DAA" note={`${salaries.members.length} members · ${windowMonths.length} months`} />
        <Kpi label="Other expenses"      value={fmt(totalExpenses)}   color="#F37021" note={`${expensesByCategory.filter((c) => c.total > 0).length} of ${expensesByCategory.length} categories active`} />
        <Kpi label="Net position"        value={fmt(netPosition)}     color={netPosition >= 0 ? "#10B981" : "#1E4DAA"} note="Revenue − (Salaries + Expenses)" />
      </div>

      {/* Stream summary — Sales */}
      <div>
        <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-yai-navy mb-2">
          Income streams · planned vs booked
        </h4>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {revenueByStream.map((st) => {
            const isUncertain = st.certainty === "uncertain";
            const cat = CAT_VIS[st.category] ?? CAT_VIS.cloud;
            return (
              <li
                key={st.id}
                className={`rounded-lg border bg-white p-2.5 ${isUncertain ? "border-orange-200 bg-orange-50/30" : "border-yai-border"}`}
                style={{ borderLeftWidth: 3, borderLeftColor: cat.bg }}
              >
                <div className="flex items-baseline justify-between gap-2 mb-1 flex-wrap">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span
                      className="text-[8px] font-extrabold uppercase tracking-wider px-1 py-0.5 rounded text-white"
                      style={{ background: cat.bg }}
                    >
                      {cat.label}
                    </span>
                    <span className="text-[12px] font-extrabold text-yai-navy leading-tight">{st.name}</span>
                  </div>
                  <span className="text-[11px] font-extrabold tabular-nums" style={{ color: st.total > 0 ? "#10B981" : "#94A3B8" }}>
                    {st.total > 0 ? fmt(st.total) : "—"}
                  </span>
                </div>
                <div className="text-[10px] text-gray-600 leading-snug">
                  <span className="font-semibold text-gray-700">{st.unitLabel}</span>
                  <span className="text-gray-400"> · {st.tierLabel}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Expense category summary */}
      <div>
        <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-yai-navy mb-2">
          Expense categories · spent so far
        </h4>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <li
            className="rounded-lg border border-yai-border bg-white p-2.5"
            style={{ borderLeftWidth: 3, borderLeftColor: "#1E4DAA" }}
          >
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="text-[12px] font-extrabold text-yai-navy">Salaries</span>
              <span className="text-[11px] font-extrabold text-yai-blue tabular-nums">{fmt(totalSalary)}</span>
            </div>
            <div className="text-[10px] text-gray-600">{salaries.members.length} members · auto-sums from per-person grid</div>
          </li>
          {expensesByCategory.map((cat) => (
            <li
              key={cat.id}
              className="rounded-lg border border-yai-border bg-white p-2.5"
              style={{ borderLeftWidth: 3, borderLeftColor: cat.color }}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-[12px] font-extrabold text-yai-navy">{cat.name}</span>
                <span className="text-[11px] font-extrabold tabular-nums" style={{ color: cat.total > 0 ? cat.color : "#94A3B8" }}>
                  {cat.total > 0 ? fmt(cat.total) : "—"}
                </span>
              </div>
              <div className="text-[10px] text-gray-600">{cat.items.length} line item{cat.items.length === 1 ? "" : "s"}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Monthly trend table — compact */}
      {windowMonths.length > 0 && (
        <div>
          <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-yai-navy mb-2">
            Monthly trend · {fmtMonth(windowMonths[0])} → {fmtMonth(windowMonths[windowMonths.length - 1])}
          </h4>
          <div className="overflow-x-auto rounded-lg border border-yai-border bg-white">
            <table className="text-[11px] border-collapse w-full">
              <thead className="bg-yai-navy text-white">
                <tr>
                  <th className="text-left px-2 py-1.5 font-bold uppercase tracking-wider sticky left-0 bg-yai-navy">Month</th>
                  <th className="text-right px-2 py-1.5 font-bold uppercase tracking-wider">Revenue</th>
                  <th className="text-right px-2 py-1.5 font-bold uppercase tracking-wider">Salaries</th>
                  <th className="text-right px-2 py-1.5 font-bold uppercase tracking-wider">Other exp.</th>
                  <th className="text-right px-2 py-1.5 font-bold uppercase tracking-wider bg-yai-blue">Net</th>
                </tr>
              </thead>
              <tbody>
                {windowMonths.map((m) => {
                  const rev = revenueByMonth[m] ?? 0;
                  const sal = salaryByMonth[m] ?? 0;
                  const exp = expensesByMonth[m] ?? 0;
                  const net = rev - sal - exp;
                  return (
                    <tr key={m} className="border-t border-yai-border">
                      <td className="px-2 py-1 font-bold text-yai-navy sticky left-0 bg-white">{fmtMonth(m)}</td>
                      <td className="px-2 py-1 text-right tabular-nums" style={{ color: rev > 0 ? "#10B981" : "#94A3B8" }}>
                        {rev > 0 ? fmt(rev) : "—"}
                      </td>
                      <td className="px-2 py-1 text-right tabular-nums" style={{ color: sal > 0 ? "#1E4DAA" : "#94A3B8" }}>
                        {sal > 0 ? fmt(sal) : "—"}
                      </td>
                      <td className="px-2 py-1 text-right tabular-nums" style={{ color: exp > 0 ? "#F37021" : "#94A3B8" }}>
                        {exp > 0 ? fmt(exp) : "—"}
                      </td>
                      <td className="px-2 py-1 text-right font-extrabold tabular-nums bg-blue-50/30" style={{ color: net >= 0 ? "#10B981" : "#1E4DAA" }}>
                        {fmt(net)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-yai-blue bg-gray-50">
                  <td className="px-2 py-2 font-extrabold uppercase tracking-wider text-[10px] text-yai-navy sticky left-0 bg-gray-50">Total</td>
                  <td className="px-2 py-2 text-right font-extrabold text-emerald-600 tabular-nums">{fmt(totalRevenue)}</td>
                  <td className="px-2 py-2 text-right font-extrabold text-yai-blue tabular-nums">{fmt(totalSalary)}</td>
                  <td className="px-2 py-2 text-right font-extrabold text-yai-orange tabular-nums">{fmt(totalExpenses)}</td>
                  <td className="px-2 py-2 text-right font-extrabold tabular-nums bg-blue-50" style={{ color: netPosition >= 0 ? "#10B981" : "#1E4DAA" }}>
                    {fmt(netPosition)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-[10px] text-gray-500 leading-snug">
        Sourced live from the admin back-end (Sales / Salaries / Capex feeders).
        {lastUpdated && <> Last update <strong className="text-yai-navy">{new Date(lastUpdated).toLocaleString()}</strong>.</>}
      </div>
    </div>
  );
}

const CAT_VIS: Record<string, { label: string; bg: string }> = {
  cloud:    { label: "Cloud",    bg: "#1E4DAA" },
  hardware: { label: "Hardware", bg: "#0A3327" },
  addon:    { label: "Add-on",   bg: "#6D4FB6" },
  ecom:     { label: "E-com",    bg: "#F37021" },
};

function Kpi({ label, value, color, note }: { label: string; value: string; color: string; note: string }) {
  return (
    <div
      className="rounded-xl border border-yai-border bg-white p-3 shadow-sm"
      style={{ borderTopWidth: 3, borderTopColor: color }}
    >
      <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500">{label}</div>
      <div className="text-2xl font-extrabold tabular-nums" style={{ color }}>{value}</div>
      <div className="text-[10px] text-gray-600 italic mt-0.5">{note}</div>
    </div>
  );
}
