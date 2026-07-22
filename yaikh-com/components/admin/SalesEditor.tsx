"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";

type Category = "cloud" | "hardware" | "addon" | "ecom";
type Certainty = "planned" | "uncertain";
type MonthCell = { planned?: number; actual?: number; customers?: number; note?: string };
type Stream = {
  id: string;
  name: string;
  category: Category;
  certainty: Certainty;
  unitPrice: number;
  unitLabel: string;
  tierLabel: string;
  detail: string;
  monthly: Record<string, MonthCell>;
};
type Store = {
  updatedAt: string | null;
  updatedBy: string | null;
  months: string[];
  streams: Stream[];
};

const CAT_VIS: Record<Category, { label: string; color: string }> = {
  cloud:    { label: "Cloud",    color: "#1E4DAA" },
  hardware: { label: "Hardware", color: "#0A3327" },
  addon:    { label: "Add-on",   color: "#6D4FB6" },
  ecom:     { label: "E-com",    color: "#F37021" },
};

function fmtMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[Number(m) - 1]} ${y.slice(-2)}`;
}

function nextMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  d.setMonth(d.getMonth() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function SalesEditor({ initial }: { initial: Store }) {
  const [store, setStore] = useState<Store>(initial);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  // Auto-save: any edit marks the store dirty; a debounced effect persists
  // it ~1.5s after the last change. The manual Save button remains as a
  // "save right now" fallback.
  const dirtyRef = useRef(false);
  const [editVersion, setEditVersion] = useState(0);

  // Per-month $ totals for both views — exclude e-com (their cells are user counts)
  const totals = useMemo(() => {
    const planned = store.months.map((m) =>
      store.streams.reduce<number>(
        (s, st) => (st.category === "ecom" ? s : s + (st.monthly[m]?.planned ?? 0)),
        0
      )
    );
    const actual = store.months.map((m) =>
      store.streams.reduce<number>(
        (s, st) => (st.category === "ecom" ? s : s + (st.monthly[m]?.actual ?? 0)),
        0
      )
    );
    return { planned, actual };
  }, [store]);

  const streamTotals = useMemo(() => {
    return store.streams.map((st) => ({
      planned: store.months.reduce<number>((s, m) => s + (st.monthly[m]?.planned ?? 0), 0),
      actual: store.months.reduce<number>((s, m) => s + (st.monthly[m]?.actual ?? 0), 0),
    }));
  }, [store]);

  const grandPlanned = totals.planned.reduce((s, v) => s + v, 0);
  const grandActual = totals.actual.reduce((s, v) => s + v, 0);

  const setCell = (
    streamIdx: number,
    ym: string,
    field: "planned" | "actual" | "note",
    value: string
  ) => {
    const next: Store = { ...store, streams: [...store.streams] };
    const stream = { ...next.streams[streamIdx], monthly: { ...next.streams[streamIdx].monthly } };
    const existing = stream.monthly[ym] ?? {};
    const updated: MonthCell = { ...existing };
    if (field === "note") {
      if (value.trim() === "") delete updated.note;
      else updated.note = value;
    } else {
      const num = value === "" ? undefined : Number(value);
      if (num === undefined || Number.isNaN(num) || num <= 0) {
        delete updated[field];
      } else {
        updated[field] = num;
      }
    }
    if (!updated.planned && !updated.actual && !updated.customers && !updated.note) {
      delete stream.monthly[ym];
    } else {
      stream.monthly[ym] = updated;
    }
    next.streams[streamIdx] = stream;
    setStore(next);
    dirtyRef.current = true;
    setEditVersion((v) => v + 1);
  };

  const addMonth = () => {
    const last = store.months[store.months.length - 1] ?? "2026-05";
    setStore({ ...store, months: [...store.months, nextMonth(last)] });
    dirtyRef.current = true;
    setEditVersion((v) => v + 1);
  };

  const save = async (opts?: { auto?: boolean }) => {
    setLoading(true);
    if (!opts?.auto) setMsg("");
    try {
      const r = await fetch("/api/admin/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store),
      });
      const j = await r.json();
      if (j.ok) {
        dirtyRef.current = false;
        // Don't replace local state on auto-save — the user may be mid-typing.
        if (!opts?.auto) setStore(j.store);
        setMsg(`✓ ${opts?.auto ? "Auto-saved" : "Saved"} at ${new Date().toLocaleTimeString()}`);
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

  // Debounced auto-save — fires 1.5s after the most recent edit.
  useEffect(() => {
    if (!dirtyRef.current) return;
    const t = setTimeout(() => {
      if (dirtyRef.current) save({ auto: true });
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editVersion]);

  // Warn before leaving with unsaved edits (the auto-save may not have fired yet).
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  return (
    <div className="space-y-4">
      {/* Status row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4 text-xs">
          <Stat label="Streams" value={`${store.streams.length}`} />
          <Stat label="Months tracked" value={`${store.months.length}`} />
          <Stat label="Planned total" value={`$${grandPlanned.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="#1E4DAA" />
          <Stat label="Actual total" value={`$${grandActual.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="#10B981" />
        </div>
        <button
          type="button"
          onClick={addMonth}
          className="text-xs bg-white border border-yai-border hover:bg-blue-50 px-3 py-1.5 rounded-lg font-bold text-yai-navy"
        >
          + Next month
        </button>
      </div>

      {/* Excel grid — each cell: Planned (blue) / Actual (green) / client names */}
      <div className="overflow-x-auto rounded-xl border border-yai-border bg-white shadow-sm">
        <table className="text-[11px] border-collapse">
          <thead className="bg-yai-navy text-white">
            <tr>
              <th className="sticky left-0 z-10 bg-yai-navy text-left px-2 py-2 font-bold uppercase tracking-wider w-72">Stream</th>
              <th className="text-right px-2 py-2 font-bold uppercase tracking-wider w-24 whitespace-nowrap">Unit price</th>
              <th className="text-left px-2 py-2 font-bold uppercase tracking-wider w-16">Row</th>
              {store.months.map((m) => (
                <th key={m} className="text-right px-2 py-2 font-bold uppercase tracking-wider w-24 whitespace-nowrap">
                  {fmtMonth(m)}
                </th>
              ))}
              <th className="text-right px-2 py-2 font-bold uppercase tracking-wider w-24 bg-yai-blue">Total</th>
              <th className="text-center px-2 py-2 font-bold uppercase tracking-wider w-20">Cat</th>
            </tr>
          </thead>
          <tbody>
            {store.streams.map((stream, i) => {
              const cat = CAT_VIS[stream.category];
              const isUncertain = stream.certainty === "uncertain";
              const isEcom = stream.category === "ecom";
              const stepSize = isEcom ? 1 : stream.unitPrice > 0 ? stream.unitPrice : 0.01;

              const rowSpanProps = { rowSpan: 3 as const };

              return (
                <Fragment key={stream.id}>
                  {/* ---- PLANNED row ---- */}
                  <tr
                    key={stream.id + "-planned"}
                    className={`border-t-2 ${isUncertain ? "bg-amber-50/30" : ""}`}
                    style={{ borderTopColor: cat.color }}
                  >
                    <td {...rowSpanProps} className="sticky left-0 bg-white px-2 py-1 align-top" style={{ boxShadow: `inset 3px 0 0 0 ${cat.color}` }}>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-yai-navy text-[12px] leading-tight">{stream.name}</span>
                        <span className="text-[10px] text-gray-500 leading-snug mt-0.5">{stream.tierLabel}</span>
                      </div>
                    </td>
                    <td {...rowSpanProps} className="px-2 py-1 text-right text-[10px] text-gray-600 whitespace-nowrap align-top">
                      {stream.unitLabel}
                    </td>
                    <td className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-yai-blue whitespace-nowrap">Planned</td>
                    {store.months.map((m) => {
                      const cell = stream.monthly[m];
                      const v = cell?.planned ?? 0;
                      const clients = !isEcom && stream.unitPrice > 0 && v > 0 ? Math.round(v / stream.unitPrice) : 0;
                      return (
                        <td key={m} className="px-1 py-0.5 align-top">
                          <div className="flex flex-col">
                            <input
                              type="number"
                              step={stepSize}
                              min={0}
                              value={v > 0 ? v : ""}
                              onChange={(e) => setCell(i, m, "planned", e.target.value)}
                              placeholder="—"
                              title={isEcom ? "↑ adds 1 user (planned)" : stream.unitPrice > 0 ? `↑ adds 1 client = +$${stream.unitPrice}` : undefined}
                              className={`w-full text-right text-[11px] tabular-nums px-1 py-1 rounded border focus:outline-none focus:border-yai-blue ${
                                v > 0
                                  ? "text-yai-blue font-semibold border-transparent bg-blue-50/40 hover:bg-blue-50"
                                  : "text-gray-300 border-transparent bg-gray-50/50 hover:bg-blue-50"
                              }`}
                            />
                            {v > 0 && (
                              <span className="text-[8px] text-gray-400 leading-tight pl-1 mt-0.5 text-right tabular-nums">
                                {isEcom ? `${v.toLocaleString()} users` : `${clients} ${clients === 1 ? "client" : "clients"}`}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-2 py-1 text-right font-extrabold tabular-nums text-yai-blue bg-blue-50/50">
                      {streamTotals[i].planned > 0
                        ? isEcom
                          ? `${streamTotals[i].planned.toLocaleString()} users`
                          : `$${streamTotals[i].planned.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                        : "—"}
                    </td>
                    <td {...rowSpanProps} className="px-2 py-1 align-top">
                      <div className="flex flex-col items-center gap-1">
                        <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0" style={{ background: cat.color }}>
                          {cat.label}
                        </span>
                        {isUncertain && (
                          <span className="inline-flex items-center text-[8px] font-extrabold uppercase tracking-wider px-1 py-0.5 rounded text-white bg-amber-500">
                            Variable
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* ---- ACTUAL row ---- */}
                  <tr key={stream.id + "-actual"} className={isUncertain ? "bg-amber-50/30" : ""}>
                    <td className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 whitespace-nowrap">Actual</td>
                    {store.months.map((m) => {
                      const cell = stream.monthly[m];
                      const v = cell?.actual ?? 0;
                      const clients = !isEcom && stream.unitPrice > 0 && v > 0 ? Math.round(v / stream.unitPrice) : 0;
                      return (
                        <td key={m} className="px-1 py-0.5 align-top">
                          <div className="flex flex-col">
                            <input
                              type="number"
                              step={stepSize}
                              min={0}
                              value={v > 0 ? v : ""}
                              onChange={(e) => setCell(i, m, "actual", e.target.value)}
                              placeholder="—"
                              title={isEcom ? "actual users" : "booked / closed $"}
                              className={`w-full text-right text-[11px] tabular-nums px-1 py-1 rounded border focus:outline-none focus:border-emerald-500 ${
                                v > 0
                                  ? "text-emerald-700 font-semibold border-transparent bg-emerald-50/40 hover:bg-emerald-50"
                                  : "text-gray-300 border-transparent bg-gray-50/50 hover:bg-emerald-50"
                              }`}
                            />
                            {v > 0 && (
                              <span className="text-[8px] text-gray-400 leading-tight pl-1 mt-0.5 text-right tabular-nums">
                                {isEcom ? `${v.toLocaleString()} users` : `${clients} ${clients === 1 ? "client" : "clients"}`}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-2 py-1 text-right font-extrabold tabular-nums text-emerald-700 bg-emerald-50/50">
                      {streamTotals[i].actual > 0
                        ? isEcom
                          ? `${streamTotals[i].actual.toLocaleString()} users`
                          : `$${streamTotals[i].actual.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                        : "—"}
                    </td>
                  </tr>

                  {/* ---- CLIENT NAMES row ---- */}
                  <tr key={stream.id + "-note"} className={isUncertain ? "bg-amber-50/30" : ""}>
                    <td className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-400 whitespace-nowrap">Clients</td>
                    {store.months.map((m) => {
                      const cell = stream.monthly[m];
                      return (
                        <td key={m} className="px-1 py-0.5 pb-1.5 align-top">
                          <NoteCell
                            value={cell?.note ?? ""}
                            onChange={(v) => setCell(i, m, "note", v)}
                          />
                        </td>
                      );
                    })}
                    <td className="bg-gray-50/50" />
                  </tr>
                </Fragment>
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
                  {t > 0 ? `$${t.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                </td>
              ))}
              <td className="px-2 py-1.5 text-right font-extrabold tabular-nums text-yai-blue bg-blue-50">
                ${grandPlanned.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
              <td />
            </tr>
            <tr>
              <td className="sticky left-0 bg-gray-50 px-2 py-1.5 font-extrabold text-yai-navy uppercase tracking-wider text-[10px]" colSpan={3}>
                Monthly total · Actual
              </td>
              {totals.actual.map((t, i) => (
                <td key={i} className="px-2 py-1.5 text-right font-extrabold tabular-nums text-emerald-700">
                  {t > 0 ? `$${t.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                </td>
              ))}
              <td className="px-2 py-1.5 text-right font-extrabold tabular-nums text-emerald-700 bg-emerald-50">
                ${grandActual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
        <div className="px-3 py-2 text-[10px] text-gray-500 bg-gray-50 border-t border-yai-border">
          Each stream has three rows: <strong className="text-yai-blue">Planned</strong> = forecast / target ·{" "}
          <strong className="text-emerald-700">Actual</strong> = booked / closed ·{" "}
          <strong>Clients</strong> = short client names for that month (free text, e.g. &ldquo;YW, GGMT&rdquo;).{" "}
          Edits <strong>auto-save</strong> ~1.5s after you stop typing.
        </div>
      </div>

      {/* Auto-save status — the only save path. */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] text-gray-500">
          {store.updatedAt && (
            <>Last saved <strong className="text-yai-navy">{new Date(store.updatedAt).toLocaleString()}</strong> by <strong>{store.updatedBy}</strong></>
          )}
        </div>
        <div className="text-xs font-semibold">
          {loading ? (
            <span className="text-yai-orange">Saving…</span>
          ) : msg ? (
            <span className={msg.startsWith("✓") ? "text-emerald-600" : "text-red-600"}>{msg}</span>
          ) : (
            <span className="text-gray-400">Auto-save on · edits persist ~1.5s after you stop typing</span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Client-names cell: renders comma-separated short names as tag chips
 * (e.g. "3SGS, BICNZ" → two pills). Click to edit as free text — up to
 * 100 chars / ~10 names. Tall enough for two chip rows.
 */
function NoteCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const names = value
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (editing) {
    return (
      <textarea
        autoFocus
        rows={3}
        maxLength={100}
        defaultValue={value}
        placeholder="3SGS, BICNZ, …"
        title="Short client names, comma-separated (max 100 chars)"
        onBlur={(e) => {
          onChange(e.target.value);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLTextAreaElement).blur();
          }
        }}
        className="w-full min-h-[58px] text-left text-[9px] leading-snug px-1 py-1 rounded border border-yai-orange bg-white text-gray-700 focus:outline-none resize-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title={value ? `${value} — click to edit` : "Click to add client names"}
      className={`w-full min-h-[58px] text-left px-1 py-1 rounded border border-transparent hover:border-yai-orange/40 transition ${
        names.length ? "bg-white" : "bg-gray-50/50"
      }`}
    >
      {names.length ? (
        <span className="flex flex-wrap gap-[3px]">
          {names.slice(0, 10).map((n, idx) => (
            <span
              key={n + idx}
              className="inline-flex items-center px-1.5 py-[2px] rounded-full bg-yai-blue/10 text-yai-blue text-[8px] font-bold leading-none whitespace-nowrap"
            >
              {n}
            </span>
          ))}
        </span>
      ) : (
        <span className="text-[9px] text-gray-300">names</span>
      )}
    </button>
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
