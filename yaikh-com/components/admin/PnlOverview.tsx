// Server component — the admin Dashboard's all-in-one P&L sheet.
// One big Excel-style READ-ONLY grid (no charts, numbers only):
//   1. Summary block — per-month totals: Sales Planned · Sales Actual ·
//      Salaries · Capex, then P&L = Actual sales − Salaries − Capex.
//   2. Sales / Income — every stream cloned (Planned + Actual rows).
//   3. Salaries — every active member's monthly pay.
//   4. Capex / Expenses — every category's monthly spend.
// Data is cloned live from the three feeder stores on each page load;
// nothing here is editable — edit in the feeders.

import { readSalesStore } from "@/lib/sales-store";
import { readSalaryStore } from "@/lib/salary-store";
import { readExpensesStore } from "@/lib/expenses-store";

const C = {
  income: "#10B981",
  plan: "#1E4DAA",
  salary: "#1E4DAA",
  capex: "#F37021",
  netPos: "#0A3327",
  netNeg: "#B91C1C",
};

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function fmtMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[Number(m) - 1]} ${y.slice(-2)}`;
}

const sum = (r: Record<string, number>) => Object.values(r).reduce((s, v) => s + v, 0);

export async function PnlOverview() {
  const [sales, salaries, expenses] = await Promise.all([
    readSalesStore(),
    readSalaryStore(),
    readExpensesStore(),
  ]);

  // ── Aggregates (matching the public §11 roll-up rules) ──────────────────
  // Sales $ totals exclude e-com streams (their cells store user counts).
  const salesPlanByMonth: Record<string, number> = {};
  const salesActualByMonth: Record<string, number> = {};
  for (const st of sales.streams) {
    if (st.category === "ecom") continue;
    for (const [m, cell] of Object.entries(st.monthly)) {
      if ((cell.planned ?? 0) > 0) salesPlanByMonth[m] = (salesPlanByMonth[m] ?? 0) + cell.planned!;
      if ((cell.actual ?? 0) > 0) salesActualByMonth[m] = (salesActualByMonth[m] ?? 0) + cell.actual!;
    }
  }

  const activeMembers = salaries.members.filter((m) => m.status === "active");
  const salaryByMonth: Record<string, number> = {};
  for (const mem of activeMembers) {
    for (const [m, v] of Object.entries(mem.monthly)) {
      const n = typeof v === "number" ? v : 0;
      if (n > 0) salaryByMonth[m] = (salaryByMonth[m] ?? 0) + n;
    }
  }

  const capexByMonth: Record<string, number> = {};
  const capexByCategory = expenses.categories.map((cat) => {
    const byMonth: Record<string, number> = {};
    for (const item of cat.items) {
      for (const [m, cell] of Object.entries(item.monthly)) {
        const n = cell.amount ?? 0;
        if (n > 0) {
          byMonth[m] = (byMonth[m] ?? 0) + n;
          capexByMonth[m] = (capexByMonth[m] ?? 0) + n;
        }
      }
    }
    return { name: cat.name, byMonth, total: sum(byMonth) };
  });

  // Month columns — every month any store knows about, in order.
  const allMonths = Array.from(
    new Set([
      ...sales.months,
      ...salaries.months,
      ...expenses.months,
      ...Object.keys(salesPlanByMonth),
      ...Object.keys(salesActualByMonth),
      ...Object.keys(salaryByMonth),
      ...Object.keys(capexByMonth),
    ]),
  ).sort();

  const totalPlan = sum(salesPlanByMonth);
  const totalActual = sum(salesActualByMonth);
  const totalSalary = sum(salaryByMonth);
  const totalCapex = sum(capexByMonth);
  const totalPnl = totalActual - totalSalary - totalCapex;

  // ── Row renderers ────────────────────────────────────────────────────────
  const th = "text-right px-2 py-1.5 font-bold uppercase tracking-wider whitespace-nowrap min-w-[64px]";
  const labelTd = "sticky left-0 z-[1] px-2 py-1 whitespace-nowrap";

  function NumberRow({
    label,
    byMonth,
    color,
    bold,
    money$ = true,
    bg = "bg-white",
    indent,
    total,
  }: {
    label: string;
    byMonth: Record<string, number>;
    color?: string;
    bold?: boolean;
    money$?: boolean;
    bg?: string;
    indent?: boolean;
    total?: number;
  }) {
    const t = total ?? sum(byMonth);
    return (
      <tr className={`border-t border-gray-100 ${bg}`}>
        <td
          className={`${labelTd} ${bg} ${bold ? "font-extrabold" : "font-semibold"} ${indent ? "pl-5 text-[10px]" : "text-[11px]"}`}
          style={color ? { color, boxShadow: `inset 3px 0 0 0 ${color}` } : undefined}
        >
          {label}
        </td>
        {allMonths.map((m) => {
          const v = byMonth[m] ?? 0;
          return (
            <td
              key={m}
              className={`px-2 py-1 text-right tabular-nums ${v !== 0 ? (bold ? "font-extrabold" : "font-semibold") : "text-gray-300"}`}
              style={v !== 0 && color ? { color } : undefined}
            >
              {v !== 0 ? (money$ ? money(v) : v.toLocaleString()) : "—"}
            </td>
          );
        })}
        <td className={`px-2 py-1 text-right tabular-nums bg-gray-50 ${bold ? "font-extrabold" : "font-bold"}`} style={color ? { color } : undefined}>
          {t !== 0 ? (money$ ? money(t) : t.toLocaleString()) : "—"}
        </td>
      </tr>
    );
  }

  function SectionRow({ label, color }: { label: string; color: string }) {
    return (
      <tr>
        <td
          colSpan={allMonths.length + 2}
          className="px-2 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white"
          style={{ background: color }}
        >
          {label}
        </td>
      </tr>
    );
  }

  return (
    <div className="rounded-xl border-2 border-yai-border bg-white p-5 mb-8">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
        <h2 className="text-lg font-extrabold text-yai-navy">P&amp;L — all streams, one sheet</h2>
        <span className="text-[10px] uppercase tracking-wider text-gray-500">
          Read-only clone · sourced live from Sales · Salaries · Capex/Expenses
        </span>
      </div>
      <div className="flex items-center gap-5 flex-wrap mb-4 text-xs">
        <span><span className="text-gray-500 uppercase tracking-wider text-[10px] mr-1.5">Sales Plan</span><strong className="tabular-nums" style={{ color: C.plan }}>{money(totalPlan)}</strong></span>
        <span><span className="text-gray-500 uppercase tracking-wider text-[10px] mr-1.5">Sales Actual</span><strong className="tabular-nums" style={{ color: C.income }}>{money(totalActual)}</strong></span>
        <span><span className="text-gray-500 uppercase tracking-wider text-[10px] mr-1.5">Salaries</span><strong className="tabular-nums" style={{ color: C.salary }}>{money(totalSalary)}</strong></span>
        <span><span className="text-gray-500 uppercase tracking-wider text-[10px] mr-1.5">Capex</span><strong className="tabular-nums" style={{ color: C.capex }}>{money(totalCapex)}</strong></span>
        <span><span className="text-gray-500 uppercase tracking-wider text-[10px] mr-1.5">P&amp;L</span><strong className="tabular-nums" style={{ color: totalPnl >= 0 ? C.netPos : C.netNeg }}>{money(totalPnl)}</strong></span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-yai-border">
        <table className="text-[11px] border-collapse w-full">
          <thead className="bg-yai-navy text-white">
            <tr>
              <th className="sticky left-0 z-10 bg-yai-navy text-left px-2 py-1.5 font-bold uppercase tracking-wider min-w-[170px]">
                Stream
              </th>
              {allMonths.map((m) => (
                <th key={m} className={th}>{fmtMonth(m)}</th>
              ))}
              <th className={`${th} bg-yai-blue`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {/* ── 1 · SUMMARY ── */}
            <SectionRow label="Summary · company / month" color="#0A1F47" />
            <NumberRow label="Total Sales · Planned" byMonth={salesPlanByMonth} color={C.plan} bold />
            <NumberRow label="Total Sales · Actual" byMonth={salesActualByMonth} color={C.income} bold />
            <NumberRow label="Salaries" byMonth={salaryByMonth} color={C.salary} bold />
            <NumberRow label="Capex / Expenses" byMonth={capexByMonth} color={C.capex} bold />
            <NumberRow
              label="P&L · Actual − Salaries − Capex"
              byMonth={Object.fromEntries(
                allMonths.map((m) => [
                  m,
                  (salesActualByMonth[m] ?? 0) - (salaryByMonth[m] ?? 0) - (capexByMonth[m] ?? 0),
                ]),
              )}
              color={totalPnl >= 0 ? C.netPos : C.netNeg}
              bold
              bg="bg-red-50/40"
              total={totalPnl}
            />

            {/* ── 2 · SALES / INCOME — every stream cloned ── */}
            <SectionRow label="Sales / Income · per stream" color={C.income} />
            {sales.streams.map((st) => {
              const isEcom = st.category === "ecom";
              const planned: Record<string, number> = {};
              const actual: Record<string, number> = {};
              for (const [m, cell] of Object.entries(st.monthly)) {
                if ((cell.planned ?? 0) > 0) planned[m] = cell.planned!;
                if ((cell.actual ?? 0) > 0) actual[m] = cell.actual!;
              }
              return (
                <NumberRow key={st.id + "-p"} label={`${st.name} · Plan${isEcom ? " (users)" : ""}`} byMonth={planned} color="#64748B" money$={!isEcom} indent />
              );
            })}
            {sales.streams.map((st) => {
              const isEcom = st.category === "ecom";
              const actual: Record<string, number> = {};
              for (const [m, cell] of Object.entries(st.monthly)) {
                if ((cell.actual ?? 0) > 0) actual[m] = cell.actual!;
              }
              if (Object.keys(actual).length === 0) return null;
              return (
                <NumberRow key={st.id + "-a"} label={`${st.name} · Actual${isEcom ? " (users)" : ""}`} byMonth={actual} color={C.income} money$={!isEcom} indent />
              );
            })}

            {/* ── 3 · SALARIES — every active member ── */}
            <SectionRow label="Salaries · per member" color={C.salary} />
            {activeMembers.map((mem) => {
              const byMonth: Record<string, number> = {};
              for (const [m, v] of Object.entries(mem.monthly)) {
                const n = typeof v === "number" ? v : 0;
                if (n > 0) byMonth[m] = n;
              }
              return <NumberRow key={mem.name} label={mem.name} byMonth={byMonth} color="#475569" indent />;
            })}

            {/* ── 4 · CAPEX / EXPENSES — per category ── */}
            <SectionRow label="Capex / Expenses · per category" color={C.capex} />
            {capexByCategory.map((cat) => (
              <NumberRow key={cat.name} label={cat.name} byMonth={cat.byMonth} color="#9A3412" indent total={cat.total} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
