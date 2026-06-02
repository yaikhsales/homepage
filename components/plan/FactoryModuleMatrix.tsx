"use client";

import { Fragment } from "react";

/**
 * Factory × Module adoption matrix.
 * Rows = all modules from Accounting → MRP (full Yai module set).
 * Cols = factory codes (YM, CA, YY, YW, BZ, IDFL, …).
 * Cells = adoption status: full ● green · implementing ◐ orange · planned ○ gray · n/a · — .
 *
 * Status values are placeholders — user will fill in real adoption per factory.
 */

type Status = "full" | "impl" | "hold" | "planned" | "na";

type Row = {
  name: string;
  group: "admin" | "platform" | "ops";
};

// 18 modules in the same order as RoadmapTimeline — Accounting block first, then platform, then ops ending at MRP.
const ROWS: Row[] = [
  // ADMINISTRATION
  { name: "Accounting (Full + GDT)",                       group: "admin" },
  { name: "Admin Core · PR · Shop · Approvals · APP",      group: "admin" },
  { name: "HR · Pay · Org · LMS · AI CCTV",                group: "admin" },
  { name: "Digital Audit · 8S · AIoT · Waste",             group: "admin" },
  { name: "Gate Pass · CTPAT",                             group: "admin" },
  { name: "Car Booking",                                   group: "admin" },
  { name: "Speak Up · Worker Voice",                       group: "admin" },
  { name: "Corporate Financials + IEWS",                   group: "admin" },
  { name: "Cambodia E-Gov + E-Invoice",                    group: "admin" },
  // PLATFORM
  { name: "Platform · Laravel + Mongo + Mobile + AIoT",    group: "platform" },
  // OPERATIONS
  { name: "YTM · Machine Maintenance + TPM Shop",          group: "ops" },
  { name: "YQMS · Quality Mgmt (6 stages + Fini Check)",   group: "ops" },
  { name: "YPI · Technical Specs (3-language)",            group: "ops" },
  { name: "YPM · Production Mgmt",                         group: "ops" },
  { name: "CE · Motion · Ai · Product Dev · Sample Room",  group: "ops" },
  { name: "4DP · Planning Brain (4 dir × 4 levels)",       group: "ops" },
  { name: "YWIP · 13-Dept Production Flow",                group: "ops" },
  { name: "MRP + Logistics (Inbound + Outbound)",          group: "ops" },
];

// Factory codes — user will confirm full names later.
type Factory = { code: string; full: string };
const FACTORIES: Factory[] = [
  { code: "YM",   full: "Yorkmars Cambodia" },
  { code: "CA",   full: "Caswell Cambodia" },
  { code: "YY",   full: "Yorksky (YY)" },
  { code: "YW",   full: "YW Group" },
  { code: "BZ",   full: "BZ Factory" },
  { code: "IDFL", full: "IDFL" },
];

// Pre-fill a default matrix — all cells "planned" so the table is fully visible.
// User will overwrite real values factory-by-factory.
const DEFAULT_STATUS: Status = "planned";
const MATRIX: Record<string, Record<string, Status>> = {};
ROWS.forEach((r) => {
  MATRIX[r.name] = {};
  FACTORIES.forEach((f) => {
    MATRIX[r.name][f.code] = DEFAULT_STATUS;
  });
});

// Seed a few we know — Yorkmars (YM) is the deepest pilot. CA isn't using these yet.
const known: Array<[string, string, Status]> = [
  // YM — deepest pilot, most admin modules + early ops
  ["Accounting (Full + GDT)",                            "YM", "impl"],
  ["Admin Core · PR · Shop · Approvals · APP",           "YM", "full"],
  ["HR · Pay · Org · LMS · AI CCTV",                     "YM", "impl"],
  ["Digital Audit · 8S · AIoT · Waste",                  "YM", "full"],
  ["Gate Pass · CTPAT",                                  "YM", "hold"],
  ["Car Booking",                                        "YM", "hold"],
  ["Platform · Laravel + Mongo + Mobile + AIoT",         "YM", "full"],
  ["YPI · Technical Specs (3-language)",                 "YM", "impl"],
  ["YPM · Production Mgmt",                              "YM", "impl"],
  ["CE · Motion · Ai · Product Dev · Sample Room",       "YM", "impl"],
  ["YQMS · Quality Mgmt (6 stages + Fini Check)",        "YM", "full"],
  ["YTM · Machine Maintenance + TPM Shop",               "YM", "full"],
  // CA + YY also fully use YTM
  ["YTM · Machine Maintenance + TPM Shop",               "CA", "full"],
  ["YTM · Machine Maintenance + TPM Shop",               "YY", "full"],
  // Digital Audit — YW + BZ partly use (not factories), IDFL testing
  ["Digital Audit · 8S · AIoT · Waste",                  "YW",   "impl"],
  ["Digital Audit · 8S · AIoT · Waste",                  "BZ",   "impl"],
  ["Digital Audit · 8S · AIoT · Waste",                  "IDFL", "impl"],
];
known.forEach(([m, f, s]) => {
  if (MATRIX[m]) MATRIX[m][f] = s;
});

const STATUS_VIS: Record<Status, { ch: string; bg: string; fg: string; label: string }> = {
  full:    { ch: "●", bg: "#10B981", fg: "#FFFFFF", label: "Full" },
  impl:    { ch: "◐", bg: "#F37021", fg: "#FFFFFF", label: "Implementing" },
  hold:    { ch: "⏸", bg: "#FBBF24", fg: "#FFFFFF", label: "On hold (temp)" },
  planned: { ch: "○", bg: "#F1F5F9", fg: "#94A3B8", label: "Planned" },
  na:      { ch: "—", bg: "#FFFFFF", fg: "#CBD5E1", label: "N/A" },
};

const GROUP_BG: Record<Row["group"], string> = {
  admin:    "#E8EEF8",
  platform: "#F1F5F9",
  ops:      "#E8F0EC",
};
const GROUP_LABEL: Record<Row["group"], string> = {
  admin:    "ADMINISTRATION",
  platform: "PLATFORM",
  ops:      "OPERATIONS",
};
const GROUP_COLOR: Record<Row["group"], string> = {
  admin:    "#1E4DAA",
  platform: "#1F2937",
  ops:      "#0A3327",
};

export function FactoryModuleMatrix() {
  return (
    <div className="rounded-xl border border-yai-border bg-white overflow-hidden">
      <div className="p-4 border-b border-yai-border bg-gray-50">
        <h4 className="font-extrabold text-yai-navy text-base leading-tight">
          Module adoption — factories &amp; partners
        </h4>
        <p className="text-xs text-gray-600 leading-snug mt-1">
          Per-entity module status across the full Yai stack (Accounting → MRP). Includes both production
          factories and non-factory partners (labs, group entities). Hover a code in the top row for the
          full name.
        </p>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px]">
          {(Object.keys(STATUS_VIS) as Status[]).map((k) => {
            const s = STATUS_VIS[k];
            return (
              <span key={k} className="flex items-center gap-1.5">
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full font-extrabold text-[10px]"
                  style={{ background: s.bg, color: s.fg }}
                >
                  {s.ch}
                </span>
                <span className="text-gray-700 font-semibold">{s.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-yai-navy text-white">
              <th className="text-left font-bold uppercase tracking-wider text-[10px] px-3 py-2 sticky left-0 z-10 bg-yai-navy">
                Module
              </th>
              {FACTORIES.map((f) => (
                <th
                  key={f.code}
                  title={f.full}
                  className="text-center font-extrabold text-[12px] px-2 py-2 min-w-[58px]"
                >
                  {f.code}
                </th>
              ))}
            </tr>
            <tr className="bg-gray-100 text-gray-500">
              <th className="text-left font-semibold uppercase tracking-wider text-[9px] px-3 py-1 sticky left-0 z-10 bg-gray-100">
                Full name
              </th>
              {FACTORIES.map((f) => (
                <th key={f.code} className="text-center text-[9px] px-1 py-1 font-normal italic">
                  {f.full}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => {
              const prev = i > 0 ? ROWS[i - 1] : null;
              const showGroupHeader = !prev || prev.group !== r.group;
              return (
                <Fragment key={r.name}>
                  {showGroupHeader && (
                    <tr style={{ background: GROUP_BG[r.group] }}>
                      <td
                        colSpan={1 + FACTORIES.length}
                        className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em]"
                        style={{ color: GROUP_COLOR[r.group] }}
                      >
                        {GROUP_LABEL[r.group]}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-yai-border last:border-b-0 hover:bg-blue-50/30">
                    <td className="px-3 py-2 font-semibold text-yai-navy whitespace-normal sticky left-0 bg-white">
                      {r.name}
                    </td>
                    {FACTORIES.map((f) => {
                      const v = MATRIX[r.name]?.[f.code] ?? "planned";
                      const s = STATUS_VIS[v];
                      return (
                        <td key={f.code} className="text-center px-2 py-2">
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full font-extrabold text-[14px]"
                            style={{ background: s.bg, color: s.fg }}
                            title={`${r.name} · ${f.full}: ${s.label}`}
                          >
                            {s.ch}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
