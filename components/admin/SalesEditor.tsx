"use client";

import { useMemo, useState } from "react";

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

type ViewMode = "planned" | "actual";

export function SalesEditor({ initial }: { initial: Store }) {
  const [store, setStore] = useState<Store>(initial);
  const [view, setView] = useState<ViewMode>("planned");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Per-month totals (excluding e-com streams that are uncertain — they're still counted, just visually flagged)
  const monthTotals = useMemo(() => {
    return store.months.map((m) =>
      store.streams.reduce<number>((s, st) => s + (st.monthly[m]?.[view] ?? 0), 0)
    );
  }, [store, view]);

  const streamTotals = useMemo(() => {
    return store.streams.map((st) =>
      store.months.reduce<number>((s, m) => s + (st.monthly[m]?.[view] ?? 0), 0)
    );
  }, [store, view]);

  const grandTotal = monthTotals.reduce<number>((s, v) => s + v, 0);

  const setCell = (streamIdx: number, ym: string, value: string) => {
    const next: Store = { ...store, streams: [...store.streams] };
    const stream = { ...next.streams[streamIdx], monthly: { ...next.streams[streamIdx].monthly } };
    const existing = stream.monthly[ym] ?? {};
    const num = value === "" ? undefined : Number(value);
    const updated: MonthCell = { ...existing };
    if (num === undefined || Number.isNaN(num) || num <= 0) {
      delete updated[view];
    } else {
      updated[view] = num;
    }
    // Strip the cell entirely if everything is empty
    if (!updated.planned && !updated.actual && !updated.customers && !updated.note) {
      delete stream.monthly[ym];
    } else {
      stream.monthly[ym] = updated;
    }
    next.streams[streamIdx] = stream;
    setStore(next);
  };

  const addMonth = () => {
    const last = store.months[store.months.length - 1] ?? "2026-05";
    setStore({ ...store, months: [...store.months, nextMonth(last)] });
  };

  const save = async () => {
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch("/api/admin/sales", {
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
          <Stat label="Streams" value={`${store.streams.length}`} />
          <Stat label="Months tracked" value={`${store.months.length}`} />
          <Stat
            label={view === "planned" ? "Planned total" : "Actual total"}
            value={`$${grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            color={view === "planned" ? "#1E4DAA" : "#10B981"}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Planned / Actual toggle */}
          <div className="inline-flex items-stretch rounded-lg border border-yai-border overflow-hidden">
            <button
              type="button"
              onClick={() => setView("planned")}
              className={`text-xs font-bold px-3 py-1.5 transition ${view === "planned" ? "bg-yai-blue text-white" : "bg-white text-yai-navy hover:bg-blue-50"}`}
            >
              Planned
            </button>
            <button
              type="button"
              onClick={() => setView("actual")}
              className={`text-xs font-bold px-3 py-1.5 transition border-l border-yai-border ${view === "actual" ? "bg-emerald-600 text-white" : "bg-white text-yai-navy hover:bg-emerald-50"}`}
            >
              Actual
            </button>
          </div>
          <button
            type="button"
            onClick={addMonth}
            className="text-xs bg-white border border-yai-border hover:bg-blue-50 px-3 py-1.5 rounded-lg font-bold text-yai-navy"
          >
            + Next month
          </button>
        </div>
      </div>

      {/* Excel grid */}
      <div className="overflow-x-auto rounded-xl border border-yai-border bg-white shadow-sm">
        <table className="text-[11px] border-collapse">
          <thead className="bg-yai-navy text-white">
            <tr>
              <th className="sticky left-0 z-10 bg-yai-navy text-left px-2 py-2 font-bold uppercase tracking-wider w-56">Stream</th>
              <th className="text-left px-2 py-2 font-bold uppercase tracking-wider w-20">Cat</th>
              <th className="text-right px-2 py-2 font-bold uppercase tracking-wider w-24 whitespace-nowrap">Unit price</th>
              {store.months.map((m) => (
                <th key={m} className="text-right px-2 py-2 font-bold uppercase tracking-wider w-20 whitespace-nowrap">
                  {fmtMonth(m)}
                </th>
              ))}
              <th className={`text-right px-2 py-2 font-bold uppercase tracking-wider w-24 ${view === "planned" ? "bg-yai-blue" : "bg-emerald-600"}`}>
                {view === "planned" ? "Planned $" : "Actual $"}
              </th>
            </tr>
          </thead>
          <tbody>
            {store.streams.map((stream, i) => {
              const cat = CAT_VIS[stream.category];
              const isUncertain = stream.certainty === "uncertain";
              return (
                <tr
                  key={stream.id}
                  className={`hover:bg-blue-50/30 border-t-2 ${isUncertain ? "bg-amber-50/30" : ""}`}
                  style={{ borderTopColor: cat.color }}
                >
                  <td className="sticky left-0 bg-white px-2 py-1" style={{ boxShadow: `inset 3px 0 0 0 ${cat.color}` }}>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-yai-navy text-[12px] leading-tight">{stream.name}</span>
                      <span className="text-[9px] text-gray-500 leading-tight mt-0.5">{stream.tierLabel}</span>
                    </div>
                  </td>
                  <td className="px-2 py-1">
                    <div className="flex flex-col gap-1">
                      <span
                        className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0 w-fit"
                        style={{ background: cat.color }}
                      >
                        {cat.label}
                      </span>
                      {isUncertain && (
                        <span className="inline-flex items-center text-[8px] font-extrabold uppercase tracking-wider px-1 py-0.5 rounded text-white bg-amber-500 w-fit">
                          Variable
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-1 text-right text-[10px] text-gray-600 whitespace-nowrap">
                    {stream.unitLabel}
                  </td>
                  {store.months.map((m) => {
                    const cell = stream.monthly[m];
                    const v = cell?.[view] ?? 0;
                    const otherView = view === "planned" ? "actual" : "planned";
                    const otherV = cell?.[otherView] ?? 0;
                    // Each up-arrow click = +1 client = +unitPrice $. E-com streams have unitPrice=0
                    // (variable rev) so fall back to 0.01 step so the user can still type free-form $.
                    const stepSize = stream.unitPrice > 0 ? stream.unitPrice : 0.01;
                    const clients = stream.unitPrice > 0 && v > 0 ? Math.round(v / stream.unitPrice) : 0;
                    return (
                      <td key={m} className="px-1 py-0.5 align-top">
                        <div className="flex flex-col">
                          <input
                            type="number"
                            step={stepSize}
                            min={0}
                            value={v > 0 ? v : ""}
                            onChange={(e) => setCell(i, m, e.target.value)}
                            placeholder="—"
                            title={
                              otherV > 0
                                ? `${otherView}: $${otherV.toLocaleString()}`
                                : stream.unitPrice > 0
                                  ? `↑ adds 1 client = +$${stream.unitPrice}`
                                  : undefined
                            }
                            className={`w-full text-right text-[11px] tabular-nums px-1 py-1 rounded border focus:outline-none focus:border-yai-blue ${
                              v > 0
                                ? view === "planned"
                                  ? "text-yai-blue font-semibold border-transparent bg-blue-50/40 hover:bg-blue-50"
                                  : "text-emerald-700 font-semibold border-transparent bg-emerald-50/40 hover:bg-emerald-50"
                                : "text-gray-300 border-transparent bg-gray-50/50 hover:bg-blue-50"
                            }`}
                          />
                          {clients > 0 && (
                            <span className="text-[8px] text-gray-400 leading-tight pl-1 mt-0.5 text-right tabular-nums">
                              {clients} {clients === 1 ? "client" : "clients"}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className={`px-2 py-1 text-right font-extrabold tabular-nums ${view === "planned" ? "text-yai-blue bg-blue-50/50" : "text-emerald-700 bg-emerald-50/50"}`}>
                    {streamTotals[i] > 0 ? `$${streamTotals[i].toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr className="border-t-2 border-yai-blue">
              <td className="sticky left-0 bg-gray-50 px-2 py-2 font-extrabold text-yai-navy uppercase tracking-wider text-[10px]" colSpan={3}>
                Monthly total ({view})
              </td>
              {monthTotals.map((t, i) => (
                <td key={i} className={`px-2 py-2 text-right font-extrabold tabular-nums ${view === "planned" ? "text-yai-blue" : "text-emerald-700"}`}>
                  {t > 0 ? `$${t.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                </td>
              ))}
              <td className={`px-2 py-2 text-right font-extrabold tabular-nums ${view === "planned" ? "text-yai-blue bg-blue-50" : "text-emerald-700 bg-emerald-50"}`}>
                ${grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="px-3 py-2 text-[10px] text-gray-500 bg-gray-50 border-t border-yai-border">
          Toggle <strong>Planned</strong> = forecast / target · <strong>Actual</strong> = booked / closed.
          Each cell stores both — switch view to edit the other side. Hover a cell to see the opposite-view value.
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] text-gray-500">
          {store.updatedAt && (
            <>Last saved <strong className="text-yai-navy">{new Date(store.updatedAt).toLocaleString()}</strong> by <strong>{store.updatedBy}</strong></>
          )}
        </div>
        <div className="flex items-center gap-3">
          {msg && (
            <span className={`text-xs font-semibold ${msg.startsWith("✓") ? "text-emerald-600" : "text-red-600"}`}>{msg}</span>
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
