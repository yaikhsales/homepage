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

type FlatRow = {
  catIdx: number;
  itemIdx: number;
  cat: Category;
  item: LineItem;
  isGroupStart: boolean;
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
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yy}-${mm}`;
}

export function ExpensesEditor({ initial }: { initial: Store }) {
  const [store, setStore] = useState<Store>(initial);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Flatten categories → line items, tracking group boundaries
  const rows: FlatRow[] = useMemo(() => {
    const out: FlatRow[] = [];
    store.categories.forEach((cat, catIdx) => {
      cat.items.forEach((item, itemIdx) => {
        out.push({ catIdx, itemIdx, cat, item, isGroupStart: itemIdx === 0 });
      });
    });
    return out;
  }, [store]);

  const itemTotals = useMemo(
    () => rows.map((r) =>
      Object.values(r.item.monthly).reduce<number>((s, c) => s + (c.amount ?? 0), 0)
    ),
    [rows]
  );

  const monthTotals = useMemo(() => {
    return store.months.map((m) =>
      rows.reduce<number>((s, r) => s + (r.item.monthly[m]?.amount ?? 0), 0)
    );
  }, [rows, store.months]);

  const grandTotal = monthTotals.reduce<number>((s, v) => s + v, 0);

  const setCell = (catIdx: number, itemIdx: number, ym: string, value: string) => {
    const next: Store = { ...store, categories: [...store.categories] };
    const cat = { ...next.categories[catIdx], items: [...next.categories[catIdx].items] };
    const item = { ...cat.items[itemIdx], monthly: { ...cat.items[itemIdx].monthly } };
    const existing = item.monthly[ym] ?? { amount: 0 };
    const num = value === "" ? null : Number(value);
    if (num === null || Number.isNaN(num) || num <= 0) {
      // keep qty/note if present but drop if all empty
      if (existing.qty || existing.note) {
        item.monthly[ym] = { ...existing, amount: 0 };
      } else {
        delete item.monthly[ym];
      }
    } else {
      item.monthly[ym] = { ...existing, amount: num };
    }
    cat.items[itemIdx] = item;
    next.categories[catIdx] = cat;
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
      {/* Status row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4 text-xs">
          <Stat label="Categories" value={`${store.categories.length}`} />
          <Stat label="Line items" value={`${rows.length}`} />
          <Stat label="Months tracked" value={`${store.months.length}`} />
          <Stat label="Grand total" value={`$${grandTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} color="#EF4444" />
        </div>
        <div className="flex items-center gap-2">
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
              <th className="sticky left-0 z-10 bg-yai-navy text-left px-2 py-2 font-bold uppercase tracking-wider w-56">Line item</th>
              <th className="text-left px-2 py-2 font-bold uppercase tracking-wider w-28">Category</th>
              <th className="text-center px-2 py-2 font-bold uppercase tracking-wider w-16">Freq</th>
              {store.months.map((m) => (
                <th key={m} className="text-right px-2 py-2 font-bold uppercase tracking-wider w-20 whitespace-nowrap">
                  {fmtMonth(m)}
                </th>
              ))}
              <th className="text-right px-2 py-2 font-bold uppercase tracking-wider w-24 bg-yai-blue">Total $</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={`${r.cat.id}-${r.item.id}`}
                className={`hover:bg-blue-50/30 ${r.isGroupStart ? "border-t-2" : "border-t border-yai-border"}`}
                style={r.isGroupStart ? { borderTopColor: r.cat.color } : undefined}
              >
                <td
                  className="sticky left-0 bg-white px-2 py-1"
                  style={{ boxShadow: `inset 3px 0 0 0 ${r.cat.color}` }}
                >
                  <div className="flex flex-col">
                    <span className="font-extrabold text-yai-navy text-[12px] leading-tight">{r.item.name}</span>
                    {r.item.unitLabel && (
                      <span className="text-[9px] text-gray-500 leading-tight mt-0.5">{r.item.unitLabel}</span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-1">
                  <span
                    className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 border"
                    style={{ borderColor: r.cat.color, color: r.cat.color, background: `${r.cat.color}10` }}
                    title={r.cat.detail}
                  >
                    {r.cat.name.split(" ")[0]}
                  </span>
                </td>
                <td className="px-2 py-1 text-center">
                  <span
                    className="inline-flex items-center text-[8px] font-extrabold uppercase tracking-wider px-1 py-0.5 rounded text-white"
                    style={{ background: r.item.frequency === "recurring" ? "#1E4DAA" : "#0A3327" }}
                  >
                    {r.item.frequency === "recurring" ? "mo" : "1×"}
                  </span>
                </td>
                {store.months.map((m) => {
                  const cell = r.item.monthly[m];
                  const amt = cell?.amount ?? 0;
                  return (
                    <td key={m} className="px-1 py-0.5">
                      <input
                        type="number"
                        step="0.01"
                        value={amt > 0 ? amt : ""}
                        onChange={(e) => setCell(r.catIdx, r.itemIdx, m, e.target.value)}
                        placeholder="—"
                        title={cell?.note || undefined}
                        className={`w-full text-right text-[11px] tabular-nums px-1 py-1 rounded border focus:outline-none focus:border-yai-blue ${
                          amt > 0
                            ? "text-yai-navy font-semibold border-transparent bg-white hover:bg-blue-50"
                            : "text-gray-300 border-transparent bg-gray-50/50 hover:bg-blue-50"
                        }`}
                      />
                    </td>
                  );
                })}
                <td className="px-2 py-1 text-right font-extrabold text-yai-blue tabular-nums bg-blue-50/50">
                  {itemTotals[i] > 0 ? `$${itemTotals[i].toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—"}
                </td>
              </tr>
            ))}
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
            </tr>
          </tfoot>
        </table>
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
