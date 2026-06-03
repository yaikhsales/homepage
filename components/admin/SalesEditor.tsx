"use client";

import { useMemo, useState } from "react";

type Category = "cloud" | "hardware" | "addon" | "ecom";
type Certainty = "planned" | "uncertain";
type MonthCell = { customers: number; revenue: number; note?: string };
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

const CAT_VIS: Record<Category, { label: string; bg: string; color: string }> = {
  cloud:    { label: "Cloud",    bg: "#1E4DAA", color: "#FFFFFF" },
  hardware: { label: "Hardware", bg: "#0A3327", color: "#FFFFFF" },
  addon:    { label: "Add-on",   bg: "#6D4FB6", color: "#FFFFFF" },
  ecom:     { label: "E-com",    bg: "#F37021", color: "#FFFFFF" },
};

function fmtMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[Number(m) - 1]} ${y.slice(-2)}`;
}

export function SalesEditor({ initial }: { initial: Store }) {
  const [store, setStore] = useState<Store>(initial);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const totals = useMemo(() => {
    const monthlyTotal = store.months.map((m) =>
      store.streams.reduce<number>((s, st) => s + (st.monthly[m]?.revenue ?? 0), 0)
    );
    const streamTotal = store.streams.map((st) =>
      store.months.reduce<number>((s, m) => s + (st.monthly[m]?.revenue ?? 0), 0)
    );
    const grand = monthlyTotal.reduce<number>((s, v) => s + v, 0);
    return { monthlyTotal, streamTotal, grand };
  }, [store]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const updateCell = (streamIdx: number, ym: string, field: "customers" | "revenue" | "note", value: string) => {
    const next: Store = { ...store, streams: [...store.streams] };
    const stream = { ...next.streams[streamIdx], monthly: { ...next.streams[streamIdx].monthly } };
    const existing = stream.monthly[ym] ?? { customers: 0, revenue: 0 };
    const updated: MonthCell = { ...existing };
    if (field === "note") {
      updated.note = value || undefined;
    } else {
      const n = value === "" ? 0 : Number(value);
      updated[field] = Number.isNaN(n) ? 0 : n;
    }
    if (updated.customers === 0 && updated.revenue === 0 && !updated.note) {
      delete stream.monthly[ym];
    } else {
      stream.monthly[ym] = updated;
    }
    next.streams[streamIdx] = stream;
    setStore(next);
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
          <Stat label="Grand total" value={`$${totals.grand.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="#10B981" />
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

      {/* Stream rows — each collapsible */}
      <div className="space-y-2">
        {store.streams.map((stream, sIdx) => {
          const isOpen = openIds.has(stream.id);
          const cat = CAT_VIS[stream.category];
          const isUncertain = stream.certainty === "uncertain";
          const streamRevenue = totals.streamTotal[sIdx];
          return (
            <div
              key={stream.id}
              className={`rounded-xl border-2 bg-white overflow-hidden ${isUncertain ? "border-amber-300 bg-amber-50/30" : "border-yai-border"}`}
            >
              {/* Header — click to toggle */}
              <button
                type="button"
                onClick={() => toggle(stream.id)}
                className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-blue-50/30 transition"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0"
                    style={{ background: cat.bg }}
                  >
                    {cat.label}
                  </span>
                  {isUncertain && (
                    <span
                      className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0"
                      style={{ background: "#F37021" }}
                      title="User target is planned · revenue per user is variable (take-rate / wholesale margin)"
                    >
                      Variable rev
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-extrabold text-yai-navy">{stream.name}</span>
                      <span className="text-[11px] text-gray-500 font-semibold">{stream.unitLabel}</span>
                      <span className="text-[10px] text-gray-400">· {stream.tierLabel}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total</span>
                  <span className="text-sm font-extrabold tabular-nums" style={{ color: streamRevenue > 0 ? "#10B981" : "#94A3B8" }}>
                    ${streamRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-gray-400 text-sm">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* Body — expanded detail with monthly grid */}
              {isOpen && (
                <div className="border-t border-yai-border bg-gray-50/50 p-3 space-y-3">
                  <p className="text-xs text-gray-700 leading-snug">{stream.detail}</p>

                  <div className="overflow-x-auto rounded-lg border border-yai-border bg-white">
                    <table className="text-[11px] border-collapse w-full">
                      <thead className="bg-yai-navy text-white">
                        <tr>
                          <th className="text-left px-2 py-1.5 font-bold uppercase tracking-wider w-24">Month</th>
                          <th className="text-right px-2 py-1.5 font-bold uppercase tracking-wider w-24">Customers</th>
                          <th className="text-right px-2 py-1.5 font-bold uppercase tracking-wider w-28">Revenue $</th>
                          <th className="text-left px-2 py-1.5 font-bold uppercase tracking-wider">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {store.months.map((m) => {
                          const cell = stream.monthly[m];
                          return (
                            <tr key={m} className="border-t border-yai-border hover:bg-blue-50/30">
                              <td className="px-2 py-1 font-extrabold text-yai-navy">{fmtMonth(m)}</td>
                              <td className="px-1 py-1">
                                <input
                                  type="number"
                                  value={cell?.customers ?? ""}
                                  onChange={(e) => updateCell(sIdx, m, "customers", e.target.value)}
                                  placeholder="—"
                                  className="w-full text-right text-[11px] tabular-nums text-yai-navy placeholder:text-gray-300 border border-yai-border rounded px-2 py-1 bg-white focus:outline-none focus:border-yai-blue"
                                />
                              </td>
                              <td className="px-1 py-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={cell?.revenue ?? ""}
                                  onChange={(e) => updateCell(sIdx, m, "revenue", e.target.value)}
                                  placeholder="—"
                                  className="w-full text-right text-[11px] tabular-nums text-yai-navy placeholder:text-gray-300 border border-yai-border rounded px-2 py-1 bg-white focus:outline-none focus:border-yai-blue"
                                />
                              </td>
                              <td className="px-1 py-1">
                                <input
                                  type="text"
                                  value={cell?.note ?? ""}
                                  onChange={(e) => updateCell(sIdx, m, "note", e.target.value)}
                                  placeholder="Optional — public-visible"
                                  className="w-full text-[11px] text-yai-navy placeholder:text-gray-300 border border-yai-border rounded px-2 py-1 bg-white focus:outline-none focus:border-yai-blue"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save footer */}
      <div className="flex items-center justify-between gap-3 pt-2">
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
