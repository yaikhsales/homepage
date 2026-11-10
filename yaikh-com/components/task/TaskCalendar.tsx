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

function MonthGrid({ year, month, byDay, today }: {
  year: number;
  month: number;
  byDay: Map<string, TaskEvent[]>;
  today: Date;
}) {
  const startOffset = startOfMonthWeekday(year, month);
  const totalDays = daysInMonth(year, month);
  const cells: Array<{ day: number | null }> = [];
  for (let i = 0; i < startOffset; i++) cells.push({ day: null });
  for (let d = 1; d <= totalDays; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push({ day: null });

  return (
    <div className="flex-1 min-w-0">
      <div className="text-center text-sm font-semibold text-yai-navy mb-2">
        {fmtMonth(year, month)}
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-0.5 text-[10px] uppercase tracking-wider text-gray-600 font-semibold">
        {DAY_HEADERS.map((d, i) => (
          <div key={i} className="text-center py-0.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, i) => {
          if (cell.day === null) {
            return <div key={i} className="h-14 sm:h-16" />;
          }
          const day = cell.day;
          const iso = isoDay(year, month, day);
          const dayEvents = byDay.get(iso) || [];
          const isToday = isSameDay(today, year, month, day);
          return (
            <div
              key={i}
              className={`h-14 sm:h-16 rounded px-1 py-0.5 overflow-hidden ${
                isToday
                  ? "border-2 border-yai-blue bg-white"
                  : "border border-gray-300/70 bg-[#cfcbba]/60"
              }`}
            >
              <div className={`text-[10px] font-bold leading-none ${isToday ? "text-yai-blue" : "text-gray-700"}`}>
                {day}
              </div>
              <div className="mt-0.5 space-y-0.5">
                {dayEvents.slice(0, 2).map((e) => (
                  <div
                    key={e.id}
                    title={e.title}
                    className="truncate text-[9px] leading-tight rounded px-0.5 py-px bg-yai-orange/15 text-yai-navy font-medium"
                  >
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[8px] text-gray-600">+{dayEvents.length - 2}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function shiftMonth(y: number, m: number, delta: number): { y: number; m: number } {
  const total = y * 12 + m + delta;
  return { y: Math.floor(total / 12), m: ((total % 12) + 12) % 12 };
}

export function TaskCalendar({ events }: { events: TaskEvent[] }) {
  const today = useMemo(() => new Date(), []);
  // Cursor is the MIDDLE month of the three-month strip.
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

  const prev = shiftMonth(cursor.y, cursor.m, -1);
  const next = shiftMonth(cursor.y, cursor.m, +1);
  const strip = [prev, cursor, next];

  const bump = (delta: number) => () => {
    setCursor((c) => shiftMonth(c.y, c.m, delta));
  };

  return (
    <section className="rounded-lg border border-[#d9d3c1] bg-[#eceadf] p-4 sm:p-5">
      <header className="flex items-center justify-between mb-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-700">
          Events · {upcomingCount} upcoming
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Shift earlier"
            onClick={bump(-1)}
            className="w-7 h-7 rounded-full border border-gray-400/60 bg-white/60 hover:bg-white text-gray-700 text-sm flex items-center justify-center"
          >
            ‹
          </button>
          <div className="text-xs font-semibold text-yai-navy">
            {fmtMonth(prev.y, prev.m)} — {fmtMonth(next.y, next.m)}
          </div>
          <button
            type="button"
            aria-label="Shift later"
            onClick={bump(+1)}
            className="w-7 h-7 rounded-full border border-gray-400/60 bg-white/60 hover:bg-white text-gray-700 text-sm flex items-center justify-center"
          >
            ›
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4">
        {strip.map(({ y, m }) => (
          <MonthGrid key={`${y}-${m}`} year={y} month={m} byDay={byDay} today={today} />
        ))}
      </div>

      {events.length === 0 && (
        <p className="mt-3 text-[11px] text-gray-500 italic">
          Nothing booked yet. Events feed from the Telegram scout is pending.
        </p>
      )}
    </section>
  );
}
