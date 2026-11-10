"use client";

/* Filter bar for /task.
 *
 * Row 1 — month pills: prev · current · next (same strip as the
 * calendar). Click a pill to scope the list below to that month. Click
 * again to clear. Arrows shift the whole strip by one month.
 *
 * Row 2 — source chips: the Telegram channels that have events in
 * the current scope. Each chip shows the channel's profile photo
 * (downloaded by scout.py into /public/task-logos). Click one to
 * scope further to that source; click again to clear.
 *
 * All scoping is state the parent owns — this component is a view.
 */

import type { TaskEvent } from "./TaskCalendar";

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export type MonthKey = string; // "yyyy-mm"

export function keyOf(year: number, month: number): MonthKey {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function parseKey(key: MonthKey): { y: number; m: number } {
  const [y, m] = key.split("-").map(Number);
  return { y, m: m - 1 };
}

function shiftMonth(y: number, m: number, delta: number): { y: number; m: number } {
  const total = y * 12 + m + delta;
  return { y: Math.floor(total / 12), m: ((total % 12) + 12) % 12 };
}

export function TaskFilterBar({
  cursorMonth,
  onShift,
  selectedMonth,
  onSelectMonth,
  selectedSource,
  onSelectSource,
  events,
}: {
  cursorMonth: MonthKey;                 // middle of the three-month strip
  onShift: (delta: number) => void;
  selectedMonth: MonthKey | null;
  onSelectMonth: (m: MonthKey | null) => void;
  selectedSource: string | null;        // sourceSlug or null
  onSelectSource: (s: string | null) => void;
  events: TaskEvent[];
}) {
  const { y, m } = parseKey(cursorMonth);
  const months: MonthKey[] = [-1, 0, 1].map((d) => {
    const s = shiftMonth(y, m, d);
    return keyOf(s.y, s.m);
  });

  // Sources shown in row 2 come from events in the visible strip (or the
  // selected month if the viewer narrowed it). Chip count reflects that
  // scope too.
  const scopeMonths = selectedMonth ? [selectedMonth] : months;
  const inScope = events.filter((e) => scopeMonths.includes(e.date.slice(0, 7)));

  const srcMap = new Map<string, { slug: string; label: string; logo: string; count: number }>();
  for (const e of inScope) {
    const slug = e.sourceSlug || "";
    if (!slug) continue;
    const prev = srcMap.get(slug);
    if (prev) {
      prev.count += 1;
    } else {
      srcMap.set(slug, {
        slug,
        label: e.source || slug,
        logo: e.logo || "",
        count: 1,
      });
    }
  }
  const sources = Array.from(srcMap.values()).sort((a, b) => b.count - a.count);

  return (
    <section className="mt-4 rounded-lg border border-[#d9d3c1] bg-white/70 p-3 sm:p-4">
      {/* Row 1 — months */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onShift(-1)}
          aria-label="Shift earlier"
          className="w-7 h-7 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center text-sm"
        >
          ‹
        </button>
        {months.map((mk) => {
          const p = parseKey(mk);
          const active = selectedMonth === mk;
          return (
            <button
              key={mk}
              type="button"
              onClick={() => onSelectMonth(active ? null : mk)}
              className={`px-3 py-1.5 rounded-full border text-[12px] font-bold uppercase tracking-wider transition ${
                active
                  ? "bg-yai-navy text-white border-yai-navy"
                  : "bg-white text-yai-navy border-gray-300 hover:bg-gray-50"
              }`}
            >
              {MONTH_SHORT[p.m]} {p.y}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onShift(+1)}
          aria-label="Shift later"
          className="w-7 h-7 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center text-sm"
        >
          ›
        </button>
        {(selectedMonth || selectedSource) && (
          <button
            type="button"
            onClick={() => { onSelectMonth(null); onSelectSource(null); }}
            className="ml-2 text-[11px] text-rose-600 font-semibold uppercase tracking-wider hover:underline"
          >
            clear
          </button>
        )}
      </div>

      {/* Row 2 — sources */}
      {sources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 flex-wrap">
          {sources.map((s) => {
            const active = selectedSource === s.slug;
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => onSelectSource(active ? null : s.slug)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] font-semibold transition ${
                  active
                    ? "bg-yai-orange text-white border-yai-orange"
                    : "bg-white text-yai-navy border-gray-300 hover:bg-gray-50"
                }`}
                title={s.label}
              >
                {s.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.logo}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover bg-gray-200"
                  />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-gray-300 inline-block" />
                )}
                <span className="truncate max-w-[9rem]">{s.label}</span>
                <span className={`text-[10px] font-normal ${active ? "text-white/80" : "text-gray-500"}`}>
                  {s.count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
