"use client";

import { useMemo, useState } from "react";

type Status = "active" | "resigned" | "realigned";
type GroupId = "admin" | "architecture" | "neural-net" | "mobile-apps" | "ops-systems";
type GroupRole = "lead" | "member";
type Member = {
  name: string;
  status: Status;
  startMonth: string;
  endMonth?: string | null;
  monthly: Record<string, number>;
  group?: GroupId;
  groupRole?: GroupRole;
  empId?: string;
};
type Store = {
  updatedAt: string | null;
  updatedBy: string | null;
  months: string[];
  members: Member[];
};

const GROUP_META: Record<GroupId, { name: string; sub: string; color: string }> = {
  "admin":        { name: "Texlink Admin",        sub: "HR · Sales · Training",            color: "#1E4DAA" },
  "architecture": { name: "Architecture",         sub: "HR systems · Pay systems",         color: "#F37021" },
  "neural-net":   { name: "Neural Net + Finance", sub: "Financial · Administration",       color: "#0A3327" },
  "mobile-apps":  { name: "Mobile Apps",          sub: "Android · iOS · Worker apps",      color: "#14B8A6" },
  "ops-systems":  { name: "Operations Systems",   sub: "Production · QA · MRP · YPI · YTM", color: "#1E3A8A" },
};

const STATUS_LABEL: Record<Status, string> = {
  active: "Active",
  resigned: "Resigned",
  realigned: "Re-aligned",
};
const STATUS_COLOR: Record<Status, string> = {
  active: "#10B981",
  resigned: "#EF4444",
  realigned: "#F37021",
};

function fmtMonth(ym: string): string {
  // "2024-05" → "May 24"
  const [y, m] = ym.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[Number(m) - 1]} ${y.slice(-2)}`;
}

function nextMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  d.setMonth(d.getMonth() + 1);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yy}-${mm}`;
}

type ViewMode = "monthly" | "quarterly";

type QuarterBucket = {
  key: string;          // "Q3 2024"
  shortLabel: string;   // "Q3·24"
  months: string[];     // ["2024-07", "2024-08", "2024-09"]
  isPrediction: boolean;
};

/** Group store.months into quarter buckets, then append 2 predicted quarters past the latest. */
function buildQuarters(monthList: string[]): QuarterBucket[] {
  const byKey: Record<string, { months: string[]; year: number; quarter: number }> = {};
  for (const ym of monthList) {
    const [y, m] = ym.split("-").map(Number);
    const q = Math.ceil(m / 3);
    const key = `Q${q} ${y}`;
    if (!byKey[key]) byKey[key] = { months: [], year: y, quarter: q };
    byKey[key].months.push(ym);
  }
  const sorted = Object.entries(byKey)
    .sort(([, a], [, b]) => a.year - b.year || a.quarter - b.quarter)
    .map(([key, b]) => ({
      key,
      shortLabel: `Q${b.quarter}·${String(b.year).slice(-2)}`,
      months: b.months,
      isPrediction: false,
      year: b.year,
      quarter: b.quarter,
    }));
  if (!sorted.length) return [];
  // Append 2 prediction quarters after the latest
  const last = sorted[sorted.length - 1];
  const out: QuarterBucket[] = sorted.map(({ year, quarter, ...rest }) => rest);
  let y = last.year;
  let q = last.quarter;
  for (let i = 0; i < 2; i++) {
    q++;
    if (q > 4) { q = 1; y++; }
    out.push({
      key: `Q${q} ${y}`,
      shortLabel: `Q${q}·${String(y).slice(-2)}`,
      months: [],
      isPrediction: true,
    });
  }
  return out;
}

export function SalaryEditor({ initial }: { initial: Store }) {
  const [store, setStore] = useState<Store>(initial);
  const [view, setView] = useState<ViewMode>("quarterly");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Totals row + grand total exclude resigned/realigned members ("dead wood").
  // Their individual numbers still show in the per-row Total column for audit purposes.
  const monthTotals = useMemo(() => {
    return store.months.map((m) =>
      store.members
        .filter((mem) => mem.status === "active")
        .reduce<number>((s, mem) => s + (mem.monthly[m] ?? 0), 0)
    );
  }, [store]);

  const memberTotals = useMemo(() => {
    return store.members.map((mem) =>
      store.months.reduce<number>((s, m) => s + (mem.monthly[m] ?? 0), 0)
    );
  }, [store]);

  const grandTotal = monthTotals.reduce<number>((s, v) => s + v, 0);

  // Quarterly buckets + predicted forecast for the next 2 quarters
  const quarters = useMemo(() => buildQuarters(store.months), [store.months]);

  /** Per-member quarterly sums. For prediction quarters, project using the avg of the last 2 actual quarters with non-zero data. */
  const memberQuarters = useMemo(() => {
    return store.members.map((mem) => {
      const actuals: number[] = [];
      const sums = quarters.map((q) => {
        if (q.isPrediction) return null; // fill after we know actuals
        const s = q.months.reduce<number>((acc, m) => acc + (mem.monthly[m] ?? 0), 0);
        if (s > 0) actuals.push(s);
        return s;
      });
      // Predicted = avg of last 2 non-zero actual quarters
      const recent = actuals.slice(-2);
      const projection = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
      return sums.map((s) => (s === null ? projection : s));
    });
  }, [quarters, store.members]);

  /** Active-only per-quarter total + grand. Prediction quarters use same active-only filter. */
  const quarterTotals = useMemo(() => {
    return quarters.map((_, qi) =>
      store.members.reduce<number>(
        (s, mem, mi) => (mem.status === "active" ? s + memberQuarters[mi][qi] : s),
        0
      )
    );
  }, [quarters, store.members, memberQuarters]);

  /** Sum of actual quarters only (not predictions) — the "Total up to now" figure. */
  const actualGrandTotal = useMemo(() => {
    return quarters.reduce<number>(
      (s, q, qi) => (q.isPrediction ? s : s + quarterTotals[qi]),
      0
    );
  }, [quarters, quarterTotals]);

  const setCell = (memberIdx: number, ym: string, value: string) => {
    const next: Store = { ...store, members: [...store.members] };
    const mem = { ...next.members[memberIdx], monthly: { ...next.members[memberIdx].monthly } };
    const num = value === "" ? null : Number(value);
    if (num === null || Number.isNaN(num) || num <= 0) {
      delete mem.monthly[ym];
    } else {
      mem.monthly[ym] = num;
    }
    next.members[memberIdx] = mem;
    setStore(next);
  };

  const updateMember = (idx: number, key: keyof Member, value: string) => {
    const next: Store = { ...store, members: [...store.members] };
    next.members[idx] = { ...next.members[idx], [key]: value || null };
    setStore(next);
  };

  const addMember = () => {
    const next: Store = {
      ...store,
      members: [
        ...store.members,
        { name: "New person", status: "active", startMonth: store.months[store.months.length - 1] ?? "2024-05", monthly: {} },
      ],
    };
    setStore(next);
  };

  const removeMember = (idx: number) => {
    if (!confirm(`Delete ${store.members[idx]?.name}? (Their cost history will be removed)`)) return;
    const next: Store = { ...store, members: store.members.filter((_, i) => i !== idx) };
    setStore(next);
  };

  const addMonth = () => {
    const last = store.months[store.months.length - 1] ?? "2024-04";
    const nm = nextMonth(last);
    setStore({ ...store, months: [...store.months, nm] });
  };

  const save = async () => {
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch("/api/admin/salaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store),
      });
      const j = await r.json();
      if (j.ok) {
        setStore(j.store);
        setMsg(`✓ Saved at ${new Date().toLocaleTimeString()}`);
        setTimeout(() => setMsg(""), 5000);
      } else {
        setMsg(`Failed: ${j.error || "unknown"}`);
      }
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4 text-xs">
          <Stat label="Members" value={`${store.members.length}`} />
          <Stat label={view === "quarterly" ? "Quarters" : "Months tracked"} value={`${view === "quarterly" ? quarters.length - 2 : store.months.length}${view === "quarterly" ? " + 2 forecast" : ""}`} />
          <Stat
            label={view === "quarterly" ? "Total up to now" : "Grand total"}
            value={`$${(view === "quarterly" ? actualGrandTotal : grandTotal).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            color="#10B981"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="inline-flex items-stretch rounded-lg border border-yai-border overflow-hidden">
            <button
              type="button"
              onClick={() => setView("monthly")}
              className={`text-xs font-bold px-3 py-1.5 transition ${view === "monthly" ? "bg-yai-navy text-white" : "bg-white text-yai-navy hover:bg-blue-50"}`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setView("quarterly")}
              className={`text-xs font-bold px-3 py-1.5 transition border-l border-yai-border ${view === "quarterly" ? "bg-yai-navy text-white" : "bg-white text-yai-navy hover:bg-blue-50"}`}
            >
              Quarterly + Forecast
            </button>
          </div>
          {view === "monthly" && (
            <button
              type="button"
              onClick={addMonth}
              className="text-xs bg-white border border-yai-border hover:bg-blue-50 px-3 py-1.5 rounded-lg font-bold text-yai-navy"
            >
              + Next month
            </button>
          )}
          <button
            type="button"
            onClick={addMember}
            className="text-xs bg-white border border-yai-border hover:bg-blue-50 px-3 py-1.5 rounded-lg font-bold text-yai-navy"
          >
            + Add person
          </button>
        </div>
      </div>

      {/* Quarterly compact view */}
      {view === "quarterly" && (
        <div className="overflow-x-auto rounded-xl border border-yai-border bg-white shadow-sm">
          <table className="text-[11px] border-collapse w-full">
            <thead className="bg-yai-navy text-white">
              <tr>
                <th className="sticky left-0 z-10 bg-yai-navy text-left px-2 py-2 font-bold uppercase tracking-wider w-48">Name</th>
                {quarters.filter((q) => !q.isPrediction).map((q) => (
                  <th
                    key={q.key}
                    className="text-right px-2 py-2 font-bold uppercase tracking-wider w-24 whitespace-nowrap"
                    title={`${q.months.length} month${q.months.length === 1 ? "" : "s"}: ${q.months.join(", ")}`}
                  >
                    {q.shortLabel}
                  </th>
                ))}
                <th className="text-right px-2 py-2 font-bold uppercase tracking-wider w-28 bg-yai-blue">Actual total</th>
                {quarters.filter((q) => q.isPrediction).map((q) => (
                  <th
                    key={q.key}
                    className="text-right px-2 py-2 font-bold uppercase tracking-wider w-24 whitespace-nowrap bg-amber-600 text-white"
                    title="Forecast — avg of last 2 actual quarters"
                  >
                    {q.shortLabel}
                    <span className="block text-[8px] font-normal opacity-80">forecast</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {store.members.map((mem, i) => {
                const isInactive = mem.status === "resigned" || mem.status === "realigned";
                const groupMeta = mem.group ? GROUP_META[mem.group] : null;
                const isGroupStart = !!mem.group && (i === 0 || store.members[i - 1]?.group !== mem.group);
                const actualSum = quarters.reduce<number>((s, q, qi) => (q.isPrediction ? s : s + memberQuarters[i][qi]), 0);
                return (
                  <tr
                    key={i}
                    className={`border-t hover:bg-blue-50/30 ${isInactive ? "bg-red-50/30" : ""} ${isGroupStart ? "border-t-2" : "border-yai-border"}`}
                    style={groupMeta && isGroupStart ? { borderTopColor: groupMeta.color } : undefined}
                  >
                    <td
                      className="sticky left-0 bg-white px-2 py-1"
                      style={groupMeta ? { boxShadow: `inset 3px 0 0 0 ${groupMeta.color}` } : undefined}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`flex-1 min-w-0 font-extrabold px-1 py-1 ${isInactive ? "text-red-700 line-through" : "text-yai-navy"}`}>
                          {mem.name}
                        </span>
                        {mem.groupRole === "lead" && groupMeta && (
                          <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0" style={{ background: groupMeta.color }}>★ LEAD</span>
                        )}
                        {mem.groupRole === "member" && groupMeta && (
                          <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 border" style={{ borderColor: groupMeta.color, color: groupMeta.color, background: `${groupMeta.color}10` }}>
                            {groupMeta.name.split(" ")[0]}
                          </span>
                        )}
                        {mem.status === "resigned" && (
                          <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0" style={{ background: STATUS_COLOR.resigned }}>RESIGN</span>
                        )}
                        {mem.status === "realigned" && (
                          <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0" style={{ background: STATUS_COLOR.realigned }}>RE-ALIGN</span>
                        )}
                      </div>
                    </td>
                    {quarters.map((q, qi) => {
                      if (q.isPrediction) return null;
                      const v = memberQuarters[i][qi];
                      return (
                        <td
                          key={q.key}
                          className={`px-2 py-1 text-right text-[11px] tabular-nums font-semibold ${v > 0 ? "text-yai-navy" : "text-gray-300"}`}
                        >
                          {v > 0 ? `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                        </td>
                      );
                    })}
                    <td
                      className={`px-2 py-1 text-right font-extrabold tabular-nums ${
                        isInactive ? "text-gray-400 bg-gray-50/40" : "text-yai-blue bg-blue-50/50"
                      }`}
                      title={isInactive ? "Historic — excluded from grand totals" : "Sum of actual quarters only"}
                    >
                      {actualSum > 0 ? `$${actualSum.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                    </td>
                    {quarters.map((q, qi) => {
                      if (!q.isPrediction) return null;
                      const v = memberQuarters[i][qi];
                      return (
                        <td
                          key={q.key}
                          className="px-2 py-1 text-right text-[11px] tabular-nums font-semibold text-amber-700 bg-amber-50/60 italic"
                          title={`Forecast: $${v.toFixed(0)}`}
                        >
                          {v > 0 ? `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr className="border-t-2 border-yai-blue">
                <td className="sticky left-0 bg-gray-50 px-2 py-2 font-extrabold text-yai-navy uppercase tracking-wider text-[10px]">
                  Quarterly total
                </td>
                {quarters.map((q, qi) => {
                  if (q.isPrediction) return null;
                  return (
                    <td key={q.key} className="px-2 py-2 text-right font-extrabold tabular-nums text-yai-navy">
                      {quarterTotals[qi] > 0 ? `$${quarterTotals[qi].toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                    </td>
                  );
                })}
                <td className="px-2 py-2 text-right font-extrabold text-yai-orange tabular-nums bg-orange-50">
                  ${actualGrandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
                {quarters.map((q, qi) => {
                  if (!q.isPrediction) return null;
                  return (
                    <td key={q.key} className="px-2 py-2 text-right font-extrabold tabular-nums text-amber-700 bg-amber-50/60">
                      {quarterTotals[qi] > 0 ? `$${quarterTotals[qi].toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
          <div className="px-3 py-2 text-[10px] text-gray-500 bg-gray-50 border-t border-yai-border">
            <strong className="text-amber-700">Amber columns</strong> = 2-quarter forecast based on the average of each row&apos;s last 2 actual quarters with non-zero data.
            Switch to <strong>Monthly</strong> view to edit cells — quarterly view is read-only.
          </div>
        </div>
      )}

      {/* Excel grid (monthly view) */}
      {view === "monthly" && (
      <div className="overflow-x-auto rounded-xl border border-yai-border bg-white shadow-sm">
        <table className="text-[11px] border-collapse">
          <thead className="bg-yai-navy text-white">
            <tr>
              <th className="sticky left-0 z-10 bg-yai-navy text-left px-2 py-2 font-bold uppercase tracking-wider w-40">Name</th>
              <th className="text-left px-2 py-2 font-bold uppercase tracking-wider w-24">Status</th>
              <th className="text-center px-2 py-2 font-bold uppercase tracking-wider w-20">Start</th>
              {store.months.map((m) => (
                <th key={m} className="text-right px-2 py-2 font-bold uppercase tracking-wider w-20 whitespace-nowrap">
                  {fmtMonth(m)}
                </th>
              ))}
              <th className="text-right px-2 py-2 font-bold uppercase tracking-wider w-24 bg-yai-blue">Total $</th>
              <th className="text-center px-2 py-2 font-bold uppercase tracking-wider w-10"> </th>
            </tr>
          </thead>
          <tbody>
            {store.members.map((mem, i) => {
              const isInactive = mem.status === "resigned" || mem.status === "realigned";
              const groupMeta = mem.group ? GROUP_META[mem.group] : null;
              const isGroupStart = !!mem.group && (i === 0 || store.members[i - 1]?.group !== mem.group);
              return (
              <tr
                key={i}
                className={`border-t hover:bg-blue-50/30 ${isInactive ? "bg-red-50/30" : ""} ${isGroupStart ? "border-t-2" : "border-yai-border"}`}
                style={groupMeta && isGroupStart ? { borderTopColor: groupMeta.color } : undefined}
              >
                <td
                  className="sticky left-0 bg-white px-2 py-1"
                  style={groupMeta ? { boxShadow: `inset 3px 0 0 0 ${groupMeta.color}` } : undefined}
                >
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={mem.name}
                      onChange={(e) => updateMember(i, "name", e.target.value)}
                      className={`flex-1 min-w-0 font-extrabold bg-transparent border-0 focus:outline-none focus:bg-blue-50 px-1 py-1 rounded ${
                        isInactive ? "text-red-700 line-through" : "text-yai-navy"
                      }`}
                    />
                    {mem.groupRole === "lead" && groupMeta && (
                      <span
                        className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0"
                        style={{ background: groupMeta.color }}
                        title={`${groupMeta.name} — Lead`}
                      >
                        ★ LEAD
                      </span>
                    )}
                    {mem.groupRole === "member" && groupMeta && (
                      <span
                        className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 border"
                        style={{ borderColor: groupMeta.color, color: groupMeta.color, background: `${groupMeta.color}10` }}
                        title={`${groupMeta.name} — Member`}
                      >
                        {groupMeta.name.split(" ")[0]}
                      </span>
                    )}
                    {mem.status === "resigned" && (
                      <span
                        className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0"
                        style={{ background: STATUS_COLOR.resigned }}
                        title="Resigned"
                      >
                        RESIGN
                      </span>
                    )}
                    {mem.status === "realigned" && (
                      <span
                        className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0"
                        style={{ background: STATUS_COLOR.realigned }}
                        title="Re-aligned"
                      >
                        RE-ALIGN
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-1">
                  <select
                    value={mem.status}
                    onChange={(e) => updateMember(i, "status", e.target.value)}
                    className={`w-full text-[10px] font-extrabold border rounded px-1 py-1 bg-white uppercase tracking-wider ${
                      isInactive ? "border-red-300" : "border-yai-border"
                    }`}
                    style={{ color: STATUS_COLOR[mem.status] }}
                  >
                    <option value="active">{STATUS_LABEL.active}</option>
                    <option value="resigned">{STATUS_LABEL.resigned}</option>
                    <option value="realigned">{STATUS_LABEL.realigned}</option>
                  </select>
                </td>
                <td className="px-2 py-1 text-center">
                  <input
                    type="text"
                    value={mem.startMonth}
                    onChange={(e) => updateMember(i, "startMonth", e.target.value)}
                    placeholder="YYYY-MM"
                    className="w-20 text-[10px] tabular-nums text-yai-navy bg-transparent border-0 focus:outline-none focus:bg-blue-50 px-1 py-1 rounded text-center"
                  />
                </td>
                {store.months.map((m) => (
                  <td key={m} className="px-1 py-0.5">
                    <input
                      type="number"
                      step="0.01"
                      value={mem.monthly[m] ?? ""}
                      onChange={(e) => setCell(i, m, e.target.value)}
                      placeholder="—"
                      className={`w-full text-right text-[11px] tabular-nums px-1 py-1 rounded border focus:outline-none focus:border-yai-blue ${
                        mem.monthly[m] !== undefined
                          ? "text-yai-navy font-semibold border-transparent bg-white hover:bg-blue-50"
                          : "text-gray-300 border-transparent bg-gray-50/50 hover:bg-blue-50"
                      }`}
                    />
                  </td>
                ))}
                <td
                  className={`px-2 py-1 text-right font-extrabold tabular-nums ${
                    isInactive ? "text-gray-400 bg-gray-50/40" : "text-yai-blue bg-blue-50/50"
                  }`}
                  title={isInactive ? "Historic — excluded from monthly + grand totals" : undefined}
                >
                  {memberTotals[i] > 0 ? `$${memberTotals[i].toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—"}
                </td>
                <td className="px-1 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeMember(i)}
                    className="text-gray-400 hover:text-red-500 text-sm leading-none"
                    title="Delete person"
                    aria-label="Delete"
                  >
                    ×
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr className="border-t-2 border-yai-blue">
              <td className="sticky left-0 bg-gray-50 px-2 py-2 font-extrabold text-yai-navy uppercase tracking-wider text-[10px]" colSpan={3}>
                Monthly total
              </td>
              {monthTotals.map((t, i) => (
                <td key={i} className="px-2 py-2 text-right font-extrabold text-yai-navy tabular-nums">
                  {t > 0 ? `$${t.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                </td>
              ))}
              <td className="px-2 py-2 text-right font-extrabold text-yai-orange tabular-nums bg-orange-50">
                ${grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] text-gray-500">
          {store.updatedAt && (
            <>Last saved <strong className="text-yai-navy">{new Date(store.updatedAt).toLocaleString()}</strong> by <strong>{store.updatedBy}</strong></>
          )}
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
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color = "#0A1F47" }: { label: string; value: string; color?: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">{label}</span>
      <span className="font-extrabold tabular-nums" style={{ color }}>{value}</span>
    </span>
  );
}
