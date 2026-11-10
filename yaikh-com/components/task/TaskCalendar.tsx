"use client";

/* Monthly calendar grid for /task — matches the Nov 2026 look from the
 * IEWS screen: muted cells, day numbers in top-left, today bordered in
 * blue, event pills inside their cell. Prev / next month arrows in the
 * header. Events are a flat array the caller supplies. */

import { useEffect, useMemo, useRef, useState } from "react";
import { HOLIDAY_BY_ISO } from "./cambodia-holidays";

const KIND_TAB_COLOR: Record<string, string> = {
  funding: "bg-emerald-500",
  expo: "bg-sky-500",
  meeting: "bg-amber-500",
  training: "bg-indigo-500",
  tender: "bg-rose-500",
  other: "bg-gray-400",
};

type DayEntry = { event: TaskEvent; isDeadline: boolean };

function EventTab({ entry, onIgnore, onKeep, onGo }: {
  entry: DayEntry;
  onIgnore: (id: string) => void;
  onKeep: (id: string) => void;
  onGo: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { event: e, isDeadline } = entry;
  const color = KIND_TAB_COLOR[e.kind || "other"] || KIND_TAB_COLOR.other;

  useEffect(() => {
    if (!open) return;
    const onDoc = (ev: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(ev.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const label = isDeadline ? "DL" : "";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        title={`${isDeadline ? "⏰ Deadline — " : ""}${e.title} · ${e.source}`}
        onClick={(ev) => { ev.stopPropagation(); setOpen((o) => !o); }}
        className={`inline-flex items-center justify-center h-2.5 min-w-[8px] rounded-sm cursor-pointer transition hover:ring-2 hover:ring-yai-navy/40 ${color} ${
          isDeadline ? "ring-1 ring-rose-600/70 outline outline-1 outline-offset-0 outline-rose-700/40" : ""
        }`}
      >
        {label && (
          <span className="text-[7px] font-extrabold text-white leading-none px-0.5">{label}</span>
        )}
      </button>
      {open && (
        <div className="absolute z-30 left-0 top-full mt-1 w-64 sm:w-72 bg-white border border-gray-300 rounded-md shadow-xl p-3 text-left">
          <div className="flex items-start gap-2">
            {e.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.logo} alt="" className="w-6 h-6 rounded-full object-cover bg-gray-200 shrink-0" />
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-yai-orange truncate">
                {e.source || "Unknown"}
              </div>
              <div className="mt-0.5 text-[12px] font-semibold text-yai-navy">
                {isDeadline && <span className="text-rose-600">⏰ Deadline — </span>}
                {e.title}
              </div>
            </div>
          </div>
          {e.venue && (
            <div className="mt-2 text-[11px] text-gray-600">📍 {e.venue}</div>
          )}
          {e.time && (
            <div className="mt-1 text-[11px] text-gray-600">🕒 {e.time}</div>
          )}
          {e.link && (
            <a href={e.link} target="_blank" rel="noreferrer" className="mt-1 block text-[11px] text-yai-blue hover:underline break-all">
              {e.link}
            </a>
          )}
          <div className="mt-3 flex items-center gap-1">
            <button
              type="button"
              onClick={() => { onGo(e.id); setOpen(false); }}
              className="flex-1 text-[11px] font-bold uppercase border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50 rounded px-2 py-1"
            >
              Go
            </button>
            <button
              type="button"
              onClick={() => { onKeep(e.id); setOpen(false); }}
              className="flex-1 text-[11px] font-bold uppercase border border-amber-300 bg-white text-amber-700 hover:bg-amber-50 rounded px-2 py-1"
            >
              Later
            </button>
            <button
              type="button"
              onClick={() => { onIgnore(e.id); setOpen(false); }}
              className="flex-1 text-[11px] font-bold uppercase border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded px-2 py-1"
            >
              Ignore
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export type TaskEvent = {
  id: string;
  date: string;               // ISO yyyy-mm-dd — event / posted-on date
  deadline?: string;          // ISO yyyy-mm-dd — optional deadline; renders a follow-up tab
  title: string;
  titleOriginal?: string;
  source?: string;
  sourceSlug?: string;
  logo?: string;              // "/task-logos/<slug>.jpg"
  kind?: "funding" | "expo" | "meeting" | "training" | "tender" | "other";
  status?: "proposed" | "go" | "skip" | "later";
  venue?: string;
  time?: string;
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

function MonthGrid({ year, month, byDay, today, onIgnore, onKeep, onGo }: {
  year: number;
  month: number;
  byDay: Map<string, DayEntry[]>;
  today: Date;
  onIgnore: (id: string) => void;
  onKeep: (id: string) => void;
  onGo: (id: string) => void;
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
          const entries = byDay.get(iso) || [];
          const isToday = isSameDay(today, year, month, day);
          const holiday = HOLIDAY_BY_ISO.get(iso);
          const base = isToday
            ? "border-2 border-yai-blue bg-white"
            : holiday
              ? "border border-rose-300 bg-rose-100/70"
              : "border border-gray-300/70 bg-[#cfcbba]/60";
          const dayColor = isToday
            ? "text-yai-blue"
            : holiday ? "text-rose-700" : "text-gray-700";
          return (
            <div
              key={i}
              className={`h-14 sm:h-16 rounded px-1 py-0.5 overflow-hidden ${base}`}
            >
              <div className={`text-[10px] font-bold leading-none ${dayColor}`}>
                {day}
              </div>
              {holiday && (
                <div
                  title={holiday}
                  className="mt-0.5 truncate text-[8px] leading-tight font-semibold text-rose-700 uppercase tracking-wide"
                >
                  {holiday}
                </div>
              )}
              <div className="mt-0.5 flex flex-wrap gap-0.5">
                {entries.slice(0, 10).map((en, j) => (
                  <EventTab
                    key={`${en.event.id}-${en.isDeadline ? "d" : "e"}-${j}`}
                    entry={en}
                    onIgnore={onIgnore}
                    onKeep={onKeep}
                    onGo={onGo}
                  />
                ))}
                {entries.length > 10 && (
                  <span className="text-[8px] text-gray-600 self-end">+{entries.length - 10}</span>
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

export function TaskCalendar({ events, cursorMonth, overrides, onSetStatus }: {
  events: TaskEvent[];
  cursorMonth?: string;
  overrides?: Record<string, { status?: "proposed" | "go" | "skip" | "later" }>;
  onSetStatus?: (id: string, status: "proposed" | "go" | "skip" | "later") => void;
}) {
  const today = useMemo(() => new Date(), []);
  // Cursor is the MIDDLE month of the three-month strip.
  const [internalCursor, setInternalCursor] = useState(() => ({
    y: today.getFullYear(),
    m: today.getMonth(),
  }));
  const cursor = cursorMonth
    ? (() => {
        const [y, m] = cursorMonth.split("-").map(Number);
        return { y, m: m - 1 };
      })()
    : internalCursor;
  const setCursor = setInternalCursor;

  const byDay = useMemo(() => {
    const m = new Map<string, DayEntry[]>();
    for (const e of events) {
      // Hide events the viewer explicitly ignored — they vanish from both
      // calendar tabs and the follow-up tab on the deadline cell.
      if ((overrides?.[e.id]?.status ?? e.status) === "skip") continue;
      const arr = m.get(e.date) || [];
      arr.push({ event: e, isDeadline: false });
      m.set(e.date, arr);
      if (e.deadline && e.deadline !== e.date) {
        const darr = m.get(e.deadline) || [];
        darr.push({ event: e, isDeadline: true });
        m.set(e.deadline, darr);
      }
    }
    return m;
  }, [events, overrides]);

  const setStatus = onSetStatus || (() => {});
  const onIgnore = (id: string) => setStatus(id, "skip");
  const onKeep   = (id: string) => setStatus(id, "later");
  const onGo     = (id: string) => setStatus(id, "go");

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

  const controlled = Boolean(cursorMonth);

  return (
    <section className="rounded-lg border border-[#d9d3c1] bg-[#eceadf] p-4 sm:p-5">
      <header className="flex items-center justify-between mb-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-700">
          Events · {upcomingCount} upcoming
        </div>
        {!controlled && (
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
        )}
      </header>

      <div className="flex flex-col lg:flex-row gap-4">
        {strip.map(({ y, m }) => (
          <MonthGrid
            key={`${y}-${m}`}
            year={y}
            month={m}
            byDay={byDay}
            today={today}
            onIgnore={onIgnore}
            onKeep={onKeep}
            onGo={onGo}
          />
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
