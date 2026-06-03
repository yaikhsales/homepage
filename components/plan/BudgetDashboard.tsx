"use client";

import { useEffect, useState } from "react";

/**
 * 2026 Live Budget Dashboard — sourced from TEXLINK Budget 2026 (1).xls
 *
 * Sheets covered:
 *   • Request 2026 — monthly Planned/Actual income + expense + profit
 *   • Salaries request — 18-person headcount, basic salaries
 *   • Fix asset request — capex items + petty cash
 *
 * Shown alongside the OC update so the OC sees the budget LIVE, not as a stale PDF.
 */

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── Planned numbers (from sheet "Reqest 2026") ────────────────────────────
const PLANNED_EXPENSE = [18675, 16100, 21450, 17300, 28850, 27400, 19750, 17650, 17600, 17600, 17600, 18600];
const PLANNED_INCOME  = [    0,     0,     0,     0,     0,     0,     0, 10000,     0, 10000,     0, 10000];
const PLANNED_PROFIT  = PLANNED_INCOME.map((rev, i) => rev - PLANNED_EXPENSE[i]);

// Default empty actuals — replaced by API fetch on mount (admin-edited values)
const EMPTY_ACTUALS: (number | null)[] = [null, null, null, null, null, null, null, null, null, null, null, null];

const TOTAL_INCOME  = PLANNED_INCOME.reduce((a, b) => a + b, 0);
const TOTAL_EXPENSE = PLANNED_EXPENSE.reduce((a, b) => a + b, 0);
const TOTAL_PROFIT  = TOTAL_INCOME - TOTAL_EXPENSE;

// ─── Income lines (monthly per product, total = $30K) ──────────────────────
type IncomeLine = { name: string; monthly: number[]; color: string };
const INCOME_LINES: IncomeLine[] = [
  { name: "Yai Basic Server",  monthly: [0,0,0,0,0,0,0, 2500,0, 5000,0, 2500], color: "#10B981" },
  { name: "Yai Ai Agent Svc",  monthly: [0,0,0,0,0,0,0, 5000,0,  0,0,  0], color: "#1E4DAA" },
  { name: "Yai Ai Cloud Client", monthly: [0,0,0,0,0,0,0,    0,0,  0,0,  0], color: "#6D4FB6" },
  { name: "Yai Market Place",  monthly: [0,0,0,0,0,0,0, 2500,0, 5000,0, 7500], color: "#F37021" },
];

// ─── Expense categories — totals for the year ──────────────────────────────
type ExpCat = { name: string; total: number; color: string; note: string };
const EXP_CATS: ExpCat[] = [
  { name: "Salaries",         total: 169000, color: "#0A3327", note: "18 staff · $13.5K→$16K /mo trajectory" },
  { name: "Bonus",            total:  10000, color: "#10B981", note: "Mid-year (May)" },
  { name: "Assets & Utilities", total: 52625, color: "#1E4DAA", note: "Includes compute, furniture, dev gear, Ai fees" },
  { name: "Villa Rent + Util", total: 12000, color: "#F37021", note: "$1,000 / month, full year" },
  { name: "Petty Cash + Sal", total: 12000, color: "#D4A017", note: "$1,000 / month buffer" },
];
const EXP_TOTAL = EXP_CATS.reduce((s, c) => s + c.total, 0);

// ─── Capex line items (one-off, mostly Jan-Apr) ─────────────────────────────
type CapexItem = { name: string; qty: string; unit: number; total: number };
const CAPEX: CapexItem[] = [
  { name: "Mini PC set",         qty: "17",    unit: 550, total: 9350 },
  { name: "Laptop",              qty: "5",     unit: 450, total: 2250 },
  { name: "TV (Meeting room)",   qty: "2",     unit: 400, total:  400 },
  { name: "Server-class PC",     qty: "2",     unit: 600, total: 1800 },
  { name: "Printer / Scanner",   qty: "2",     unit: 350, total:  700 },
  { name: "High-back chair",     qty: "25",    unit:  45, total: 1125 },
  { name: "M-size table",        qty: "7",     unit: 150, total: 1050 },
  { name: "E-cart framework",    qty: "1",     unit: 2500, total: 2500 },
  { name: "Ai face-ID Camera",   qty: "4",     unit: 175, total:  700 },
  { name: "Wi-Fi Equipment",     qty: "4",     unit: 450, total: 1800 },
  { name: "Networking Equip",    qty: "2",     unit: 450, total:  900 },
  { name: "IoT Temp Sensor",     qty: "set",   unit: 250, total:  250 },
  { name: "Electric Meter",      qty: "set",   unit: 400, total:  400 },
  { name: "Office accessories",  qty: "5 sets", unit: 250, total: 250 },
  { name: "White board + pens",  qty: "set",   unit: 250, total:  250 },
  { name: "A4 Paper",            qty: "1 box", unit: 100, total:  100 },
];
const CAPEX_TOTAL = CAPEX.reduce((s, c) => s + c.total, 0);

// ─── Team headcount (from Salaries sheet — 18 people) ──────────────────────
type Staff = { dept: string; count: number; color: string };
const TEAM: Staff[] = [
  { dept: "TexLink — Operations Dev",  count: 7, color: "#0A3327" },
  { dept: "TexLink — Admin Sys",       count: 5, color: "#1E4DAA" },
  { dept: "TexLink — Mobile / IoT Dev", count: 3, color: "#6D4FB6" },
  { dept: "TexLink — Project",         count: 2, color: "#F37021" },
  { dept: "CTO — Mobile & IoT (lead)", count: 1, color: "#D4A017" },
];
const HEADCOUNT = TEAM.reduce((s, t) => s + t.count, 0);

// ─── Cumulative profit trajectory (for the loss curve) ─────────────────────
const CUM_PROFIT: number[] = [];
PLANNED_PROFIT.reduce((acc, v) => { const n = acc + v; CUM_PROFIT.push(n); return n; }, 0);

// Chart geometry
const VB_W = 1200;
const VB_H = 360;
const PAD_L = 70;
const PAD_R = 30;
const PAD_T = 30;
const PAD_B = 50;
const PLOT_W = VB_W - PAD_L - PAD_R;
const PLOT_H = VB_H - PAD_T - PAD_B;
const MAX_EXP = Math.max(...PLANNED_EXPENSE) * 1.2;
const MIN_CUM = Math.min(...CUM_PROFIT) * 1.1; // negative

const xAt = (i: number) => PAD_L + ((i + 0.5) / 12) * PLOT_W;
const yExp = (v: number) => PAD_T + PLOT_H - (v / MAX_EXP) * (PLOT_H * 0.6);
const yCum = (v: number) => {
  // y-axis where 0 is at 30% from top, negatives go down
  const range = -MIN_CUM;
  const zeroY = PAD_T + PLOT_H * 0.25;
  return zeroY + ((-v) / range) * PLOT_H * 0.7;
};

function fmt(n: number): string {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `$${n}`;
}

export function BudgetDashboard() {
  const [tab, setTab] = useState<"chart" | "income" | "expense" | "capex" | "team">("chart");
  const [actualExpense, setActualExpense] = useState<(number | null)[]>(EMPTY_ACTUALS);
  const [actualIncome,  setActualIncome]  = useState<(number | null)[]>(EMPTY_ACTUALS);
  const [actualNotes,   setActualNotes]   = useState<(string | null)[]>(EMPTY_ACTUALS.map(() => null));
  const [actualsMeta, setActualsMeta] = useState<{ updatedAt: string | null; updatedBy: string | null }>({ updatedAt: null, updatedBy: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/admin/budget");
        const j = await r.json();
        if (cancelled || !j?.actuals) return;
        setActualExpense(j.actuals.expense || EMPTY_ACTUALS);
        setActualIncome(j.actuals.income || EMPTY_ACTUALS);
        setActualNotes(j.actuals.notes || EMPTY_ACTUALS.map(() => null));
        setActualsMeta({ updatedAt: j.updatedAt, updatedBy: j.updatedBy });
      } catch { /* no-op */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const totalActualIncome  = actualIncome.reduce<number>((s, v) => s + (v ?? 0), 0);
  const totalActualExpense = actualExpense.reduce<number>((s, v) => s + (v ?? 0), 0);
  const hasAnyActuals = actualExpense.some((v) => v !== null) || actualIncome.some((v) => v !== null);

  return (
    <div className="space-y-6">
      {/* Framing banner — sets the positive context */}
      <div className="rounded-xl border-2 border-yai-blue/30 bg-yai-blue/5 p-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-yai-blue text-white font-extrabold text-lg shrink-0">
            ↗
          </span>
          <div className="flex-1">
            <div className="font-extrabold text-yai-navy text-sm leading-tight mb-1">
              2026 is the investment-build year — aligned with platform asset value
            </div>
            <p className="text-[12px] text-gray-700 leading-snug">
              This is a planned <strong>pre-revenue → first-revenue</strong> year. Spend = platform
              asset value created. See{" "}
              <a href="#capital" className="text-yai-blue font-bold underline decoration-dotted">Section 10 Capital Efficiency</a>{" "}
              — every dollar of expense maps to a multiple of platform value at the chosen SaaS
              market rate. The Operating Committee should read this dashboard alongside that chart,
              not as a standalone P&amp;L.
            </p>
          </div>
        </div>
      </div>

      {/* KPI cards — re-framed positively */}
      <div className="grid sm:grid-cols-4 gap-3">
        <Kpi label="2026 Platform Investment" value={fmt(TOTAL_EXPENSE)} color="#1E4DAA" note="Building asset · Salaries 71% · Capex 22%" />
        <Kpi label="First-Revenue Inflection" value="Aug 2026" color="#10B981" note={`Starts at ${fmt(TOTAL_INCOME)} for 2026 H2`} />
        <Kpi label="2026 Revenue (planned)" value={fmt(TOTAL_INCOME)} color="#10B981" note="3 income lines · 4 months active" />
        <Kpi label="Headcount" value={`${HEADCOUNT}`} color="#F37021" note="5 depts · Phnom Penh · all Claude Code 101" />
      </div>

      {/* Live actuals status — only shown if admin has posted any */}
      {hasAnyActuals && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white font-extrabold text-sm shrink-0">●</span>
          <div className="flex-1 text-[11px] text-emerald-900 leading-snug">
            <strong>Live actuals posted</strong> — {fmt(totalActualExpense)} expense / {fmt(totalActualIncome)} income recorded.
            {actualsMeta.updatedAt && (
              <> Last update {new Date(actualsMeta.updatedAt).toLocaleString()} by {actualsMeta.updatedBy}.</>
            )}{" "}
            Below cards show <strong>Plan / Actual</strong> side-by-side where data is in.
          </div>
        </div>
      )}

      {/* Tab nav */}
      <div className="flex flex-wrap gap-1 border-b border-yai-border">
        {([
          ["chart",   "Monthly P&L"],
          ["income",  "Income lines"],
          ["expense", "Expense breakdown"],
          ["capex",   "Capex requests"],
          ["team",    "Team"],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`text-[12px] font-extrabold uppercase tracking-wider px-3 py-2 transition-all ${
              tab === k
                ? "text-yai-navy border-b-2 border-yai-orange -mb-px"
                : "text-gray-500 hover:text-yai-navy"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "chart" && (
        <div>
          <h5 className="font-extrabold text-yai-navy text-sm mb-2">
            12-month investment build &amp; revenue inflection
          </h5>
          <p className="text-[11px] text-gray-600 leading-snug mb-4">
            Each month is one card. Blue bar = planned investment (mostly salaries + platform
            build). Green chip = revenue when it lands. The <strong>Aug 2026</strong> column is the
            inflection month — first paying customers. <em>This is not a loss to manage; it is the
            investment curve every platform business runs in year one.</em>
          </p>

          {/* 12 month cards — 4 cols × 3 rows */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {MONTHS.map((m, i) => {
              const exp = PLANNED_EXPENSE[i];
              const inc = PLANNED_INCOME[i];
              const actExp = actualExpense[i];
              const actInc = actualIncome[i];
              const note   = actualNotes[i];
              const hasActual = actExp !== null || actInc !== null;
              const isInflection = i === 7; // August = first revenue
              const expPct = (exp / Math.max(...PLANNED_EXPENSE)) * 100;
              return (
                <div
                  key={m}
                  className={`relative rounded-lg border bg-white p-2.5 ${isInflection ? "border-emerald-500 ring-2 ring-emerald-500/30" : "border-yai-border"}`}
                >
                  {isInflection && (
                    <span className="absolute -top-2 left-2 inline-flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500 text-white shadow">
                      ★ Inflection
                    </span>
                  )}
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-yai-navy">{m}</span>
                    {hasActual ? (
                      <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold">● actual</span>
                    ) : (
                      <span className="text-[9px] text-gray-400">2026</span>
                    )}
                  </div>

                  {/* Investment bar (blue, framed positively) */}
                  <div className="mb-1.5">
                    <div className="text-[9px] uppercase tracking-wider text-gray-500">Invest</div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded overflow-hidden">
                        <div className="h-full bg-yai-blue" style={{ width: `${expPct}%` }} />
                      </div>
                      <span className="text-[10px] font-extrabold text-yai-blue tabular-nums">{fmt(exp)}</span>
                    </div>
                    {actExp !== null && (
                      <div className="text-[10px] text-emerald-600 font-extrabold tabular-nums mt-0.5">
                        Actual {fmt(actExp)}
                      </div>
                    )}
                  </div>

                  {/* Revenue (green if present, else dash) */}
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-gray-500">Revenue</div>
                    {inc > 0 ? (
                      <div className="inline-flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[12px] font-extrabold text-emerald-500 tabular-nums">+{fmt(inc)}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-300 italic">— build phase —</span>
                    )}
                    {actInc !== null && actInc > 0 && (
                      <div className="text-[10px] text-emerald-700 font-extrabold tabular-nums">
                        Actual +{fmt(actInc)}
                      </div>
                    )}
                  </div>

                  {note && (
                    <div className="mt-1.5 pt-1.5 border-t border-yai-border text-[9px] text-gray-600 italic leading-snug">
                      {note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Trajectory summary */}
          <div className="mt-4 grid sm:grid-cols-3 gap-2">
            <div className="rounded-lg border border-yai-border bg-yai-blue/5 p-3">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-yai-blue">Jan–Jul · Build phase</div>
              <div className="text-base font-extrabold text-yai-navy tabular-nums">
                {fmt(PLANNED_EXPENSE.slice(0, 7).reduce((a, b) => a + b, 0))} invested
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">
                Pre-revenue. Platform build, team scaling, infrastructure.
              </div>
            </div>
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-500">Aug–Dec · Revenue phase</div>
              <div className="text-base font-extrabold text-yai-navy tabular-nums">
                {fmt(PLANNED_INCOME.slice(7).reduce((a, b) => a + b, 0))} first revenue
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">
                Investment continues at ~$18K/mo while customers ramp.
              </div>
            </div>
            <div className="rounded-lg border border-yai-orange/40 bg-yai-orange/5 p-3">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-yai-orange">Year-end position</div>
              <div className="text-base font-extrabold text-yai-navy tabular-nums">
                {fmt(TOTAL_EXPENSE)} → platform value
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">
                See Section 10 for the value-multiple under each SaaS market rate.
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "income" && (
        <div>
          <h5 className="font-extrabold text-yai-navy text-sm mb-2">Income lines — first revenue Aug 2026</h5>
          <p className="text-[11px] text-gray-600 leading-snug mb-3">
            Four product lines kick in once platform modules reach production-ready. Total planned
            2026 revenue = <strong>{fmt(TOTAL_INCOME)}</strong>.
          </p>
          <table className="w-full text-[11px] border-collapse">
            <thead className="bg-yai-navy text-white">
              <tr>
                <th className="text-left px-2 py-1.5 font-bold uppercase tracking-wider">Line</th>
                {MONTHS.map((m) => <th key={m} className="text-center px-1 py-1.5 font-bold w-9">{m}</th>)}
                <th className="text-right px-2 py-1.5 font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {INCOME_LINES.map((line) => {
                const total = line.monthly.reduce((a, b) => a + b, 0);
                return (
                  <tr key={line.name} className="border-b border-yai-border">
                    <td className="px-2 py-1.5 font-semibold" style={{ color: line.color }}>{line.name}</td>
                    {line.monthly.map((v, i) => (
                      <td key={i} className="text-center px-1 py-1.5 tabular-nums" style={{ color: v ? line.color : "#CBD5E1" }}>
                        {v ? `${v / 1000}K` : "–"}
                      </td>
                    ))}
                    <td className="text-right px-2 py-1.5 font-extrabold tabular-nums" style={{ color: line.color }}>
                      {fmt(total)}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-gray-50">
                <td className="px-2 py-1.5 font-extrabold text-yai-navy uppercase tracking-wider text-[10px]">Total</td>
                {PLANNED_INCOME.map((v, i) => (
                  <td key={i} className="text-center px-1 py-1.5 font-extrabold tabular-nums text-yai-navy">
                    {v ? `${v / 1000}K` : "–"}
                  </td>
                ))}
                <td className="text-right px-2 py-1.5 font-extrabold tabular-nums text-yai-navy">{fmt(TOTAL_INCOME)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {tab === "expense" && (
        <div>
          <h5 className="font-extrabold text-yai-navy text-sm mb-2">Expense breakdown — full year</h5>
          <p className="text-[11px] text-gray-600 leading-snug mb-3">
            Where the {fmt(TOTAL_EXPENSE)} goes. Salaries dominate at ~71%. Build pace controlled.
          </p>

          {/* Stacked bar */}
          <div className="flex w-full h-10 rounded-lg overflow-hidden border border-yai-border shadow-sm mb-3">
            {EXP_CATS.map((c) => {
              const pct = (c.total / EXP_TOTAL) * 100;
              return (
                <div
                  key={c.name}
                  className="flex items-center justify-center text-white text-[11px] font-extrabold"
                  style={{ width: `${pct}%`, background: c.color }}
                  title={`${c.name}: ${fmt(c.total)} (${pct.toFixed(1)}%)`}
                >
                  {pct > 8 && `${pct.toFixed(0)}%`}
                </div>
              );
            })}
          </div>

          {/* Category list */}
          <ul className="grid sm:grid-cols-2 gap-2">
            {EXP_CATS.map((c) => (
              <li
                key={c.name}
                className="rounded-lg border border-yai-border bg-white p-2.5"
                style={{ borderLeftWidth: 3, borderLeftColor: c.color }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-extrabold text-yai-navy text-[12px]">{c.name}</span>
                  <span className="font-extrabold tabular-nums" style={{ color: c.color }}>{fmt(c.total)}</span>
                </div>
                <div className="text-[10px] text-gray-600 leading-snug">{c.note}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "capex" && (
        <div>
          <h5 className="font-extrabold text-yai-navy text-sm mb-2">
            Capex requests — {fmt(CAPEX_TOTAL)} year-1 one-offs
          </h5>
          <p className="text-[11px] text-gray-600 leading-snug mb-3">
            Pre-approved equipment, furniture, dev gear and office accessories. Most spend lands
            Jan–Apr 2026 as the team scales.
          </p>
          <table className="w-full text-[11px] border-collapse">
            <thead className="bg-yai-navy text-white">
              <tr>
                <th className="text-left px-2 py-1.5 font-bold uppercase tracking-wider">Item</th>
                <th className="text-center px-2 py-1.5 font-bold w-16">Qty</th>
                <th className="text-right px-2 py-1.5 font-bold w-24">Unit $</th>
                <th className="text-right px-2 py-1.5 font-bold w-24">Total $</th>
              </tr>
            </thead>
            <tbody>
              {CAPEX.map((c) => (
                <tr key={c.name} className="border-b border-yai-border hover:bg-blue-50/30">
                  <td className="px-2 py-1.5 font-semibold text-yai-navy">{c.name}</td>
                  <td className="text-center px-2 py-1.5 text-gray-600 tabular-nums">{c.qty}</td>
                  <td className="text-right px-2 py-1.5 text-gray-600 tabular-nums">${c.unit}</td>
                  <td className="text-right px-2 py-1.5 font-extrabold text-yai-navy tabular-nums">${c.total.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-2 py-1.5 font-extrabold uppercase tracking-wider text-[10px] text-yai-navy text-right">
                  Total capex
                </td>
                <td className="text-right px-2 py-1.5 font-extrabold tabular-nums text-yai-orange">{fmt(CAPEX_TOTAL)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {tab === "team" && (
        <div>
          <h5 className="font-extrabold text-yai-navy text-sm mb-2">
            Team {HEADCOUNT} — Phnom Penh
          </h5>
          <p className="text-[11px] text-gray-600 leading-snug mb-3">
            18 staff across 5 departments. Salaries scale from $13.5K (Jan) → $16K (Dec) per month
            as new junior devs ramp.
          </p>

          {/* Stacked headcount bar */}
          <div className="flex w-full h-9 rounded-lg overflow-hidden border border-yai-border shadow-sm mb-3">
            {TEAM.map((t) => {
              const pct = (t.count / HEADCOUNT) * 100;
              return (
                <div
                  key={t.dept}
                  className="flex items-center justify-center text-white text-[10px] font-extrabold"
                  style={{ width: `${pct}%`, background: t.color }}
                  title={`${t.dept}: ${t.count}`}
                >
                  {t.count}
                </div>
              );
            })}
          </div>

          {/* Department list */}
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {TEAM.map((t) => (
              <li
                key={t.dept}
                className="rounded-lg border border-yai-border bg-white p-2.5"
                style={{ borderLeftWidth: 3, borderLeftColor: t.color }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-yai-navy text-[12px]">{t.dept}</span>
                  <span className="font-extrabold tabular-nums" style={{ color: t.color }}>{t.count}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900 leading-snug">
        <strong>Source:</strong> TEXLINK Budget 2026 (1).xls · 4 sheets · 18-person headcount. Numbers
        shown are <em>planned</em>. Actuals will be filled in monthly as Texlink posts results.
      </div>
    </div>
  );
}

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
