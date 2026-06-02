"use client";

import { useState } from "react";

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

// Today's actuals — left blank for now (user fills in monthly)
const ACTUAL_EXPENSE: (number | null)[] = [null, null, null, null, null, null, null, null, null, null, null, null];
const ACTUAL_INCOME:  (number | null)[] = [null, null, null, null, null, null, null, null, null, null, null, null];

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

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid sm:grid-cols-4 gap-3">
        <Kpi label="2026 Revenue (planned)" value={fmt(TOTAL_INCOME)} color="#10B981" note="Starts Aug 2026" />
        <Kpi label="2026 Expenses (planned)" value={fmt(TOTAL_EXPENSE)} color="#F37021" note="Salaries 71% · Capex 22%" />
        <Kpi label="2026 Net Result" value={fmt(TOTAL_PROFIT)} color="#EF4444" note="Year-end position" />
        <Kpi label="Headcount" value={`${HEADCOUNT}`} color="#1E4DAA" note="5 depts · Phnom Penh" />
      </div>

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
          <h5 className="font-extrabold text-yai-navy text-sm mb-2">Monthly planned P&amp;L</h5>
          <p className="text-[11px] text-gray-600 leading-snug mb-3">
            Bars = monthly expense · green dots = monthly income · red line = cumulative net (loss
            trajectory). First revenue lands <strong>August 2026</strong>; year ends at <strong>{fmt(TOTAL_PROFIT)}</strong>.
          </p>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full block">
            {/* Y axis label */}
            <text x={PAD_L - 8} y={PAD_T + 12} fontSize="11" textAnchor="end" fill="#64748B" fontWeight="700">Monthly $</text>
            <text x={PAD_L - 8} y={PAD_T + PLOT_H * 0.25 + 4} fontSize="11" textAnchor="end" fill="#EF4444" fontWeight="700">$0</text>
            <line x1={PAD_L} x2={VB_W - PAD_R} y1={PAD_T + PLOT_H * 0.25} y2={PAD_T + PLOT_H * 0.25} stroke="#94A3B8" strokeWidth="0.6" strokeDasharray="3 3" />

            {/* Expense bars */}
            {PLANNED_EXPENSE.map((v, i) => {
              const x = xAt(i);
              const yTop = yExp(v);
              const barH = PAD_T + PLOT_H * 0.25 - yTop;
              const barW = (PLOT_W / 12) * 0.55;
              return (
                <g key={`bar-${i}`}>
                  <rect x={x - barW / 2} y={yTop} width={barW} height={barH} fill="#F37021" opacity="0.8" rx={2} />
                  <text x={x} y={yTop - 4} fontSize="10" textAnchor="middle" fill="#9A4D14" fontWeight="700">
                    {fmt(v)}
                  </text>
                </g>
              );
            })}

            {/* Income dots */}
            {PLANNED_INCOME.map((v, i) => {
              if (v === 0) return null;
              const x = xAt(i);
              return (
                <g key={`inc-${i}`}>
                  <circle cx={x} cy={PAD_T + PLOT_H * 0.18} r={7} fill="#10B981" />
                  <text x={x} y={PAD_T + PLOT_H * 0.18 - 12} fontSize="11" textAnchor="middle" fill="#10B981" fontWeight="800">
                    +{fmt(v)}
                  </text>
                </g>
              );
            })}

            {/* Cumulative loss line */}
            <path
              d={CUM_PROFIT.map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yCum(v)}`).join(" ")}
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.5"
            />
            {CUM_PROFIT.map((v, i) => (
              <g key={`cum-${i}`}>
                <circle cx={xAt(i)} cy={yCum(v)} r={3.5} fill="#EF4444" />
                {(i === 0 || i === 11 || i % 3 === 0) && (
                  <text x={xAt(i)} y={yCum(v) + 14} fontSize="10" textAnchor="middle" fill="#EF4444" fontWeight="800">
                    {fmt(v)}
                  </text>
                )}
              </g>
            ))}

            {/* X axis */}
            {MONTHS.map((m, i) => (
              <text key={m} x={xAt(i)} y={VB_H - PAD_B + 18} fontSize="12" textAnchor="middle" fill="#475569" fontWeight="700">
                {m}
              </text>
            ))}
          </svg>
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
