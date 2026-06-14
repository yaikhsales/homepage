"use client";

import { useState } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

type ActualsLine = {
  expense: (number | null)[];
  income:  (number | null)[];
  notes:   (string | null)[];
};

type Store = {
  updatedAt: string | null;
  updatedBy: string | null;
  actuals: ActualsLine;
};

const PLAN_EXPENSE = [18675, 16100, 21450, 17300, 28850, 27400, 19750, 17650, 17600, 17600, 17600, 18600];
const PLAN_INCOME  = [    0,     0,     0,     0,     0,     0,     0, 10000,     0, 10000,     0, 10000];

const EMPTY_NUM = () => [null, null, null, null, null, null, null, null, null, null, null, null] as (number | null)[];
const EMPTY_STR = () => [null, null, null, null, null, null, null, null, null, null, null, null] as (string | null)[];

export function AdminBudgetEditor({ initial }: { initial: Store }) {
  const [store, setStore] = useState<Store>({
    updatedAt: initial.updatedAt,
    updatedBy: initial.updatedBy,
    actuals: {
      expense: initial.actuals?.expense ?? EMPTY_NUM(),
      income:  initial.actuals?.income  ?? EMPTY_NUM(),
      notes:   initial.actuals?.notes   ?? EMPTY_STR(),
    },
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const updateCell = (kind: keyof ActualsLine, i: number, value: string) => {
    const next: Store = { ...store, actuals: { ...store.actuals } };
    if (kind === "notes") {
      const arr = [...store.actuals.notes];
      arr[i] = value || null;
      next.actuals.notes = arr;
    } else {
      const arr = [...store.actuals[kind]];
      arr[i] = value === "" ? null : Number(value);
      next.actuals[kind] = arr;
    }
    setStore(next);
  };

  const save = async () => {
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch("/api/admin/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actuals: store.actuals }),
      });
      const j = await r.json();
      if (j.ok) {
        setStore(j.store);
        setMsg(`✓ Published at ${new Date().toLocaleTimeString()} — live on /plan`);
        setTimeout(() => setMsg(""), 6000);
      } else {
        setMsg(`Failed: ${j.error || "unknown"}`);
      }
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  const totalActExpense = store.actuals.expense.reduce<number>((s, v) => s + (v ?? 0), 0);
  const totalActIncome  = store.actuals.income.reduce<number>((s, v) => s + (v ?? 0), 0);
  const totalPlanExpense = PLAN_EXPENSE.reduce((a, b) => a + b, 0);
  const totalPlanIncome  = PLAN_INCOME.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-5">
      {/* Status row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-baseline gap-2">
            <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">Plan</span>
            <span className="font-bold text-yai-navy tabular-nums">${totalPlanExpense.toLocaleString()} exp</span>
            <span className="text-gray-300">/</span>
            <span className="font-bold text-yai-navy tabular-nums">${totalPlanIncome.toLocaleString()} inc</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-emerald-600 uppercase tracking-wider text-[10px] font-bold">Actual</span>
            <span className="font-bold text-emerald-600 tabular-nums">${totalActExpense.toLocaleString()} exp</span>
            <span className="text-gray-300">/</span>
            <span className="font-bold text-emerald-600 tabular-nums">${totalActIncome.toLocaleString()} inc</span>
          </div>
        </div>
        {store.updatedAt && (
          <div className="text-[10px] text-gray-500">
            Last published <strong className="text-yai-navy">{new Date(store.updatedAt).toLocaleString()}</strong>
            {" "}by <strong>{store.updatedBy}</strong>
          </div>
        )}
      </div>

      {/* Editor table */}
      <div className="overflow-x-auto rounded-xl border border-yai-border bg-white shadow-sm">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-yai-navy text-white">
            <tr>
              <th className="text-left px-3 py-2 font-bold uppercase tracking-wider sticky left-0 bg-yai-navy">Month</th>
              <th className="text-right px-3 py-2 font-bold uppercase tracking-wider w-28">Plan Exp $</th>
              <th className="text-right px-3 py-2 font-bold uppercase tracking-wider w-28">Actual Exp $</th>
              <th className="text-right px-3 py-2 font-bold uppercase tracking-wider w-28">Plan Inc $</th>
              <th className="text-right px-3 py-2 font-bold uppercase tracking-wider w-28">Actual Inc $</th>
              <th className="text-left px-3 py-2 font-bold uppercase tracking-wider">Note (public)</th>
            </tr>
          </thead>
          <tbody>
            {MONTHS.map((m, i) => (
              <tr key={m} className="border-t border-yai-border hover:bg-blue-50/30">
                <td className="px-3 py-2 font-extrabold text-yai-navy sticky left-0 bg-white">
                  {m} 2026
                </td>
                <td className="px-2 py-1 text-right text-gray-500 tabular-nums">${PLAN_EXPENSE[i].toLocaleString()}</td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    value={store.actuals.expense[i] ?? ""}
                    onChange={(e) => updateCell("expense", i, e.target.value)}
                    placeholder="—"
                    className="w-full text-right border border-yai-border rounded px-2 py-1.5 text-xs tabular-nums text-yai-navy placeholder:text-gray-300 bg-white focus:outline-none focus:border-yai-blue"
                  />
                </td>
                <td className="px-2 py-1 text-right text-gray-500 tabular-nums">
                  {PLAN_INCOME[i] > 0 ? `$${PLAN_INCOME[i].toLocaleString()}` : "—"}
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    value={store.actuals.income[i] ?? ""}
                    onChange={(e) => updateCell("income", i, e.target.value)}
                    placeholder="—"
                    className="w-full text-right border border-yai-border rounded px-2 py-1.5 text-xs tabular-nums text-yai-navy placeholder:text-gray-300 bg-white focus:outline-none focus:border-yai-blue"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="text"
                    value={store.actuals.notes[i] ?? ""}
                    onChange={(e) => updateCell("notes", i, e.target.value)}
                    placeholder="Optional note — visible on /plan"
                    className="w-full border border-yai-border rounded px-2 py-1.5 text-xs text-yai-navy placeholder:text-gray-300 bg-white focus:outline-none focus:border-yai-blue"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Source link + actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-[11px] text-gray-600">
          Source:{" "}
          <a
            href="https://docs.google.com/spreadsheets/d/1So4r5y8fMWaTYbGt9RSnGWyvOPTykU-3/edit?usp=sharing&ouid=117782760352758034052&rtpof=true&sd=true"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yai-blue font-bold underline decoration-dotted"
          >
            TEXLINK Budget 2026 (Google Sheets) ↗
          </a>
        </div>
        <div className="flex items-center gap-3">
          {msg && (
            <span className={`text-xs font-semibold ${msg.startsWith("✓") ? "text-emerald-600" : "text-red-600"}`}>
              {msg}
            </span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={loading}
            className="bg-yai-orange hover:bg-yai-orange-dark text-white font-extrabold px-6 py-2.5 rounded-lg transition disabled:opacity-50 text-sm"
          >
            {loading ? "Publishing…" : "Save & publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
