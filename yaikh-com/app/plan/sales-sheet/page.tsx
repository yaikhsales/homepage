/* Read-only full Sales / Income sheet — opened in a new tab from the
 * "Detailed Sheet" link on /plan §11 (OC & Live Budget Update).
 * Same data as /admin/sales but view-only: per stream, three rows —
 * Planned (blue) · Actual (orange) · Clients (name chips).
 * Session-gated by middleware (/plan/*) + the same cookie check as /plan. */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { readSalesStore } from "@/lib/sales-store";

export const dynamic = "force-dynamic";

function fmtMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[Number(m) - 1]} ${y.slice(-2)}`;
}

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

const CAT_COLOR: Record<string, string> = {
  cloud: "#1E4DAA",
  hardware: "#0A3327",
  addon: "#6D4FB6",
  ecom: "#F37021",
};

export default async function SalesSheetPage() {
  const session = cookies().get("yai_session")?.value;
  const viewer = verifySession(session);
  if (!viewer) redirect("/SDTV");

  const store = await readSalesStore();
  const months = store.months;

  const totals = {
    planned: months.map((m) =>
      store.streams.reduce((s, st) => (st.category === "ecom" ? s : s + (st.monthly[m]?.planned ?? 0)), 0)
    ),
    actual: months.map((m) =>
      store.streams.reduce((s, st) => (st.category === "ecom" ? s : s + (st.monthly[m]?.actual ?? 0)), 0)
    ),
  };
  const grandPlanned = totals.planned.reduce((s, v) => s + v, 0);
  const grandActual = totals.actual.reduce((s, v) => s + v, 0);

  return (
    <main className="min-h-screen bg-yai-bg p-6 lg:p-10">
      <div className="mb-5 flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-yai-orange font-bold">
            Yai · Strategic DTV
          </div>
          <h1 className="text-2xl font-extrabold text-yai-navy mt-0.5">Sales / Income — Detailed Sheet</h1>
          <p className="text-xs text-gray-600 mt-1">
            Read-only view. <strong className="text-yai-blue">Planned</strong> = forecast ·{" "}
            <strong className="text-[#F37021]">Actual</strong> = booked / closed ·{" "}
            <strong>Clients</strong> = who signed that month.
          </p>
        </div>
        <div className="flex items-center gap-5 text-right">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">Planned total</div>
            <div className="text-xl font-extrabold tabular-nums text-yai-blue">{money(grandPlanned)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">Actual total</div>
            <div className="text-xl font-extrabold tabular-nums text-[#F37021]">{money(grandActual)}</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-yai-border bg-white shadow-sm">
        <table className="text-[11px] border-collapse">
          <thead className="bg-yai-navy text-white">
            <tr>
              <th className="sticky left-0 z-10 bg-yai-navy text-left px-2 py-2 font-bold uppercase tracking-wider min-w-[180px]">Stream</th>
              <th className="text-right px-2 py-2 font-bold uppercase tracking-wider whitespace-nowrap">Unit price</th>
              <th className="text-left px-2 py-2 font-bold uppercase tracking-wider">Row</th>
              {months.map((m) => (
                <th key={m} className="text-right px-2 py-2 font-bold uppercase tracking-wider whitespace-nowrap min-w-[72px]">
                  {fmtMonth(m)}
                </th>
              ))}
              <th className="text-right px-2 py-2 font-bold uppercase tracking-wider bg-yai-blue">Total</th>
            </tr>
          </thead>
          <tbody>
            {store.streams.map((st) => {
              const color = CAT_COLOR[st.category] ?? "#1E4DAA";
              const isEcom = st.category === "ecom";
              const planned = months.reduce((s, m) => s + (st.monthly[m]?.planned ?? 0), 0);
              const actual = months.reduce((s, m) => s + (st.monthly[m]?.actual ?? 0), 0);
              return (
                <FragmentRows
                  key={st.id}
                  st={st}
                  months={months}
                  color={color}
                  isEcom={isEcom}
                  planned={planned}
                  actual={actual}
                />
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr className="border-t-2 border-yai-blue">
              <td className="sticky left-0 bg-gray-50 px-2 py-1.5 font-extrabold text-yai-navy uppercase tracking-wider text-[10px]" colSpan={3}>
                Monthly total · Planned
              </td>
              {totals.planned.map((t, i) => (
                <td key={i} className="px-2 py-1.5 text-right font-extrabold tabular-nums text-yai-blue">
                  {t > 0 ? money(t) : "—"}
                </td>
              ))}
              <td className="px-2 py-1.5 text-right font-extrabold tabular-nums text-yai-blue bg-blue-50">{money(grandPlanned)}</td>
            </tr>
            <tr>
              <td className="sticky left-0 bg-gray-50 px-2 py-1.5 font-extrabold text-yai-navy uppercase tracking-wider text-[10px]" colSpan={3}>
                Monthly total · Actual
              </td>
              {totals.actual.map((t, i) => (
                <td key={i} className="px-2 py-1.5 text-right font-extrabold tabular-nums text-[#C2410C]">
                  {t > 0 ? money(t) : "—"}
                </td>
              ))}
              <td className="px-2 py-1.5 text-right font-extrabold tabular-nums text-[#C2410C] bg-orange-50">{money(grandActual)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-4 text-[10px] text-gray-500">
        Confidential — Yai / Texlink Technologies Co., Ltd. Sourced live from admin · Sales.
        {store.updatedAt && <> Last update {new Date(store.updatedAt).toLocaleString()}.</>}
      </p>
    </main>
  );
}

/* Three read-only rows per stream: Planned / Actual / Clients. */
function FragmentRows({ st, months, color, isEcom, planned, actual }: {
  st: { id: string; name: string; tierLabel: string; unitLabel: string; unitPrice: number; monthly: Record<string, { planned?: number; actual?: number; note?: string }> };
  months: string[];
  color: string;
  isEcom: boolean;
  planned: number;
  actual: number;
}) {
  return (
    <>
      <tr className="border-t-2" style={{ borderTopColor: color }}>
        <td rowSpan={3} className="sticky left-0 bg-white px-2 py-1 align-top" style={{ boxShadow: `inset 3px 0 0 0 ${color}` }}>
          <div className="font-extrabold text-yai-navy text-[12px] leading-tight">{st.name}</div>
          <div className="text-[10px] text-gray-500 leading-snug mt-0.5">{st.tierLabel}</div>
        </td>
        <td rowSpan={3} className="px-2 py-1 text-right text-[10px] text-gray-600 whitespace-nowrap align-top">{st.unitLabel}</td>
        <td className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-yai-blue whitespace-nowrap">Planned</td>
        {months.map((m) => {
          const v = st.monthly[m]?.planned ?? 0;
          return (
            <td key={m} className={`px-2 py-1 text-right tabular-nums ${v > 0 ? "text-yai-blue font-semibold bg-blue-50/40" : "text-gray-300"}`}>
              {v > 0 ? (isEcom ? v.toLocaleString() : v.toLocaleString()) : "—"}
            </td>
          );
        })}
        <td className="px-2 py-1 text-right font-extrabold tabular-nums text-yai-blue bg-blue-50/50">
          {planned > 0 ? (isEcom ? `${planned.toLocaleString()} users` : money(planned)) : "—"}
        </td>
      </tr>
      <tr>
        <td className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#C2410C] whitespace-nowrap">Actual</td>
        {months.map((m) => {
          const v = st.monthly[m]?.actual ?? 0;
          return (
            <td key={m} className={`px-2 py-1 text-right tabular-nums ${v > 0 ? "text-[#C2410C] font-semibold bg-orange-50/50" : "text-gray-300"}`}>
              {v > 0 ? v.toLocaleString() : "—"}
            </td>
          );
        })}
        <td className="px-2 py-1 text-right font-extrabold tabular-nums text-[#C2410C] bg-orange-50/60">
          {actual > 0 ? (isEcom ? `${actual.toLocaleString()} users` : money(actual)) : "—"}
        </td>
      </tr>
      <tr className="border-b border-gray-100">
        <td className="px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-gray-400 whitespace-nowrap">Clients</td>
        {months.map((m) => {
          const note = st.monthly[m]?.note ?? "";
          const names = note.split(/[,;]+/).map((s) => s.trim()).filter(Boolean);
          return (
            <td key={m} className="px-1.5 py-1 align-top">
              {names.length > 0 ? (
                <span className="flex flex-wrap gap-[3px] justify-end">
                  {names.map((n, i) => (
                    <span key={n + i} className="inline-flex items-center px-1.5 py-[2px] rounded-full bg-yai-blue/10 text-yai-blue text-[8px] font-bold leading-none whitespace-nowrap">
                      {n}
                    </span>
                  ))}
                </span>
              ) : null}
            </td>
          );
        })}
        <td />
      </tr>
    </>
  );
}
