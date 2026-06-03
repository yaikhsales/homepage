"use client";

import { useMemo, useState } from "react";

type Frequency = "one-off" | "recurring";
type MonthCell = { amount: number; qty?: number; note?: string };
type LineItem = {
  id: string;
  name: string;
  unitPrice?: number;
  unitLabel?: string;
  frequency: Frequency;
  monthly: Record<string, MonthCell>;
};
type Category = {
  id: string;
  name: string;
  detail: string;
  color: string;
  items: LineItem[];
};
type Store = {
  updatedAt: string | null;
  updatedBy: string | null;
  months: string[];
  categories: Category[];
};

function fmtMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${names[Number(m) - 1]} ${y.slice(-2)}`;
}

export function ExpensesEditor({ initial }: { initial: Store }) {
  const [store, setStore] = useState<Store>(initial);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const totals = useMemo(() => {
    const catTotals: number[] = store.categories.map((c) =>
      c.items.reduce<number>((s, it) =>
        s + Object.values(it.monthly).reduce<number>((ss, m) => ss + (m.amount ?? 0), 0)
      , 0)
    );
    const grand = catTotals.reduce<number>((s, v) => s + v, 0);
    return { catTotals, grand };
  }, [store]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const updateCell = (catIdx: number, itemIdx: number, ym: string, field: "amount" | "qty" | "note", value: string) => {
    const next: Store = { ...store, categories: [...store.categories] };
    const cat = { ...next.categories[catIdx], items: [...next.categories[catIdx].items] };
    const item = { ...cat.items[itemIdx], monthly: { ...cat.items[itemIdx].monthly } };
    const existing = item.monthly[ym] ?? { amount: 0 };
    const updated: MonthCell = { ...existing };
    if (field === "note") {
      updated.note = value || undefined;
    } else if (field === "qty") {
      const n = value === "" ? 0 : Number(value);
      updated.qty = Number.isNaN(n) || n === 0 ? undefined : n;
    } else {
      const n = value === "" ? 0 : Number(value);
      updated.amount = Number.isNaN(n) ? 0 : n;
    }
    if (!updated.amount && !updated.qty && !updated.note) {
      delete item.monthly[ym];
    } else {
      item.monthly[ym] = updated;
    }
    cat.items[itemIdx] = item;
    next.categories[catIdx] = cat;
    setStore(next);
  };

  const save = async () => {
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch("/api/admin/expenses", {
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
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4 text-xs">
          <Stat label="Categories" value={`${store.categories.length}`} />
          <Stat label="Line items" value={`${store.categories.reduce((s, c) => s + c.items.length, 0)}`} />
          <Stat label="Months" value={`${store.months.length}`} />
          <Stat label="Grand total" value={`$${totals.grand.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="#EF4444" />
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

      {/* Category rows */}
      <div className="space-y-2">
        {store.categories.map((cat, cIdx) => {
          const isOpen = openIds.has(cat.id);
          const catTotal = totals.catTotals[cIdx];
          return (
            <div
              key={cat.id}
              className="rounded-xl border-2 border-yai-border bg-white overflow-hidden"
              style={isOpen ? { borderColor: cat.color } : {}}
            >
              {/* Header */}
              <button
                type="button"
                onClick={() => toggle(cat.id)}
                className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-gray-50 transition"
                style={{ background: isOpen ? `${cat.color}10` : "transparent" }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white font-extrabold text-xs shrink-0"
                    style={{ background: cat.color }}
                  >
                    {cat.items.length}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold text-yai-navy">{cat.name}</div>
                    <div className="text-[10px] text-gray-500 leading-snug truncate">{cat.detail}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total</span>
                  <span className="text-sm font-extrabold tabular-nums" style={{ color: catTotal > 0 ? cat.color : "#94A3B8" }}>
                    ${catTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-gray-400 text-sm">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* Items table when expanded */}
              {isOpen && (
                <div className="border-t border-yai-border bg-gray-50/50 p-3 space-y-3">
                  {cat.items.map((item, iIdx) => {
                    const itemTotal = Object.values(item.monthly).reduce<number>((s, c) => s + (c.amount ?? 0), 0);
                    return (
                      <div key={item.id} className="bg-white rounded-lg border border-yai-border">
                        {/* Item header */}
                        <div className="flex items-baseline justify-between gap-3 p-2.5 border-b border-yai-border bg-gray-50/40">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-[12px] font-extrabold text-yai-navy">{item.name}</span>
                            {item.unitLabel && (
                              <span className="text-[10px] text-gray-500">· {item.unitLabel}</span>
                            )}
                            <span
                              className="text-[8px] font-extrabold uppercase tracking-wider px-1 py-0.5 rounded text-white"
                              style={{ background: item.frequency === "recurring" ? "#1E4DAA" : "#0A3327" }}
                            >
                              {item.frequency === "recurring" ? "monthly" : "one-off"}
                            </span>
                          </div>
                          <span className="text-[11px] font-extrabold tabular-nums" style={{ color: itemTotal > 0 ? cat.color : "#94A3B8" }}>
                            ${itemTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>

                        {/* Monthly grid */}
                        <div className="overflow-x-auto">
                          <table className="text-[10px] border-collapse w-full">
                            <thead className="bg-gray-100 text-gray-600">
                              <tr>
                                <th className="text-left px-2 py-1 font-bold uppercase tracking-wider w-20">Month</th>
                                <th className="text-right px-2 py-1 font-bold uppercase tracking-wider w-16">Qty</th>
                                <th className="text-right px-2 py-1 font-bold uppercase tracking-wider w-24">Amount $</th>
                                <th className="text-left px-2 py-1 font-bold uppercase tracking-wider">Note</th>
                              </tr>
                            </thead>
                            <tbody>
                              {store.months.map((m) => {
                                const cell = item.monthly[m];
                                return (
                                  <tr key={m} className="border-t border-yai-border hover:bg-blue-50/30">
                                    <td className="px-2 py-0.5 font-bold text-yai-navy">{fmtMonth(m)}</td>
                                    <td className="px-1 py-0.5">
                                      <input
                                        type="number"
                                        value={cell?.qty ?? ""}
                                        onChange={(e) => updateCell(cIdx, iIdx, m, "qty", e.target.value)}
                                        placeholder="—"
                                        className="w-full text-right text-[10px] tabular-nums text-yai-navy placeholder:text-gray-300 border border-yai-border rounded px-1 py-0.5 bg-white focus:outline-none focus:border-yai-blue"
                                      />
                                    </td>
                                    <td className="px-1 py-0.5">
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={cell?.amount ?? ""}
                                        onChange={(e) => updateCell(cIdx, iIdx, m, "amount", e.target.value)}
                                        placeholder="—"
                                        className="w-full text-right text-[10px] tabular-nums text-yai-navy placeholder:text-gray-300 border border-yai-border rounded px-1 py-0.5 bg-white focus:outline-none focus:border-yai-blue"
                                      />
                                    </td>
                                    <td className="px-1 py-0.5">
                                      <input
                                        type="text"
                                        value={cell?.note ?? ""}
                                        onChange={(e) => updateCell(cIdx, iIdx, m, "note", e.target.value)}
                                        placeholder="optional"
                                        className="w-full text-[10px] text-yai-navy placeholder:text-gray-300 border border-yai-border rounded px-1 py-0.5 bg-white focus:outline-none focus:border-yai-blue"
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 pt-2">
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
