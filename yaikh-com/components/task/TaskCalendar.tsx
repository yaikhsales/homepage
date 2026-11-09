"use client";

/* Monthly calendar grid for /task — matches the Nov 2026 look from the
 * IEWS screen: muted cells, day numbers in top-left, today bordered in
 * blue, event pills inside their cell. Prev / next month arrows in the
 * header. Events are a flat array the caller supplies. */

import { useMemo, useState } from "react";

export type TaskEvent = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  title: string;
  source?: string;
  kind?: "funding" | "expo" | "meeting" | "training" | "tender" | "other";
  status?: "proposed" | "go" | "skip" | "later";
  link?: string;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

function fmtMonth(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

function startOfMonthWeekday(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function isoDay(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isSameDay(a: Date, year: number, month: number, day: number): boolean {
  return a.getFullYear() === year && a.getMonth() === month && a.getDate() === day;
}

export function TaskCalendar({ events }: { events: TaskEvent[] }) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => ({
    y: today.getFullYear(),
    m: today.getMonth(),
  }));

  const byDay = useMemo(() => {
    const m = new Map<string, TaskEvent[]>();
    for (const e of events) {
      const arr = m.get(e.date) || [];
      arr.push(e);
      m.set(e.date, arr);
    }
    return m;
  }, [events]);

  const upcomingCount = useMemo(() => {
    const cutoff = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return events.filter((e) => new Date(e.date) >= cutoff).length;
  }, [events, today]);

  const startOffset = startOfMonthWeekday(cursor.y, cursor.m);
  const totalDays = daysInMonth(cursor.y, cursor.m);
  const cells: Array<{ day: number | null }> = [];
  for (let i = 0; i < startOffset; i++) cells.push({ day: null });
  for (let d = 1; d <= totalDays; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push({ day: null });

  const prev = () => {
    setCursor(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }));
  };
  const next = () => {
    setCursor(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }));
  };

  return (
    <section className="rounded-lg border border-[#d9d3c1] bg-[#eceadf] p-4 sm:p-5">
      <header className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-700">
            Events · {upcomingCount} upcoming
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous month"
            onClick={prev}
            className="w-7 h-7 rounded-full border border-gray-400/60 bg-white/60 hover:bg-white text-gray-700 text-sm flex items-center justify-center"
          >
            ‹
          </button>
          <div className="text-sm font-semibold text-yai-navy min-w-[8rem] text-center">
            {fmtMonth(cursor.y, cursor.m)}
          </div>
          <button
            type="button"
            aria-label="Next month"
            onClick={next}
            className="w-7 h-7 rounded-full border border-gray-400/60 bg-white/60 hover:bg-white text-gray-700 text-sm flex items-center justify-center"
          >
            ›
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-1 mb-1 text-[11px] uppercase tracking-wider text-gray-600 font-semibold">
        {DAY_HEADERS.map((d, i) => (
          <div key={i} className="text-center py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (cell.day === null) {
            return <div key={i} className="h-16 sm:h-20" />;
          }
          const day = cell.day;
          const iso = isoDay(cursor.y, cursor.m, day);
          const dayEvents = byDay.get(iso) || [];
          const isToday = isSameDay(today, cursor.y, cursor.m, day);
          return (
            <div
              key={i}
              className={`h-16 sm:h-20 rounded-md px-1.5 py-1 overflow-hidden ${
                isToday
                  ? "border-2 border-yai-blue bg-white"
                  : "border border-gray-300/70 bg-[#cfcbba]/60"
              }`}
            >
              <div className={`text-[11px] font-bold ${isToday ? "text-yai-blue" : "text-gray-700"}`}>
                {day}
              </div>
              <div className="mt-0.5 space-y-0.5">
                {dayEvents.slice(0, 2).map((e) => (
                  <div
                    key={e.id}
                    title={e.title}
                    className="truncate text-[10px] leading-tight rounded px-1 py-0.5 bg-yai-orange/15 text-yai-navy font-medium"
                  >
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[9px] text-gray-600">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <p className="mt-3 text-[11px] text-gray-500 italic">
          Nothing booked yet. Events feed from the Telegram scout is pending.
        </p>
      )}
    </section>
  );
}
