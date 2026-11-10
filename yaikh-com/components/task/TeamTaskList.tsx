"use client";

/* Team task list for /task — lives below the calendar.
 *
 * Grouped Month → Source. Each row is one event the TG scout surfaced
 * (startup funding window, expo, MEF/MISTI training, TAFTAC call,
 * meeting). Team marks it GO / SKIP / LATER and assigns a handler.
 * Status + handler sit in Mongo (phase 2); for now overrides are
 * client-local until the write-back route lands.
 *
 * A sort toggle switches between the grouped view and a flat
 * chronological view.
 */

import { useMemo, useState } from "react";
import type { TaskEvent } from "./TaskCalendar";

type Status = "proposed" | "go" | "skip" | "later";
type SortMode = "month-source" | "flat";

const KIND_LABEL: Record<string, string> = {
  funding: "Funding",
  expo: "Expo",
  meeting: "Meeting",
  training: "Training",
  tender: "Tender",
  other: "Other",
};

const KIND_COLOR: Record<string, string> = {
  funding: "bg-emerald-100 text-emerald-800 border-emerald-200",
  expo: "bg-sky-100 text-sky-800 border-sky-200",
  meeting: "bg-amber-100 text-amber-800 border-amber-200",
  training: "bg-indigo-100 text-indigo-800 border-indigo-200",
  tender: "bg-rose-100 text-rose-800 border-rose-200",
  other: "bg-gray-100 text-gray-700 border-gray-200",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function monthKey(iso: string): string {
  // yyyy-mm → "2026-11"
  return iso.slice(0, 7);
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

function fmtDay(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
}

function daysFromNow(iso: string): number {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

export function TeamTaskList({ events, teamOptions = [], overrides: overridesProp, onSetStatus, onSetAssignee }: {
  events: TaskEvent[];
  teamOptions?: string[];
  overrides?: Record<string, { status?: Status; assignee?: string }>;
  onSetStatus?: (id: string, status: Status) => void;
  onSetAssignee?: (id: string, assignee: string) => void;
}) {
  const [localOverrides, setLocalOverrides] = useState<Record<string, { status?: Status; assignee?: string }>>({});
  const overrides = overridesProp ?? localOverrides;
  const [sort, setSort] = useState<SortMode>("month-source");

  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [...events]
      .filter((e) => new Date(e.date) >= today)
      .filter((e) => (overrides[e.id]?.status ?? e.status) !== "skip")
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, overrides]);

  // Group: month → source → [events]
  const grouped = useMemo(() => {
    const byMonth = new Map<string, Map<string, TaskEvent[]>>();
    for (const e of upcoming) {
      const mk = monthKey(e.date);
      if (!byMonth.has(mk)) byMonth.set(mk, new Map());
      const bySrc = byMonth.get(mk)!;
      const src = e.source || "Unknown";
      if (!bySrc.has(src)) bySrc.set(src, []);
      bySrc.get(src)!.push(e);
    }
    // Sorted arrays
    return Array.from(byMonth.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([mk, bySrc]) => ({
        month: mk,
        sources: Array.from(bySrc.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([src, evs]) => ({ source: src, events: evs })),
      }));
  }, [upcoming]);

  const setStatus = (id: string, status: Status) => {
    if (onSetStatus) onSetStatus(id, status);
    else setLocalOverrides((o) => ({ ...o, [id]: { ...(o[id] || {}), status } }));
  };
  const setAssignee = (id: string, assignee: string) => {
    if (onSetAssignee) onSetAssignee(id, assignee);
    else setLocalOverrides((o) => ({ ...o, [id]: { ...(o[id] || {}), assignee } }));
  };

  const statusOf = (e: TaskEvent): Status =>
    (overrides[e.id]?.status ?? e.status ?? "proposed") as Status;
  const assigneeOf = (e: TaskEvent): string =>
    overrides[e.id]?.assignee ?? "";

  return (
    <section className="mt-6 rounded-lg border border-[#d9d3c1] bg-white/70 p-4 sm:p-5">
      <header className="flex items-end justify-between mb-3 flex-wrap gap-2">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-yai-orange">
            Team Task List
          </div>
          <h2 className="mt-0.5 text-lg font-extrabold text-yai-navy">
            What are we going to? Who handles it?
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500">{upcoming.length} upcoming</span>
          <div className="flex rounded border border-gray-300 overflow-hidden text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setSort("month-source")}
              className={`px-2 py-1 transition ${sort === "month-source" ? "bg-yai-navy text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              Month · Source
            </button>
            <button
              type="button"
              onClick={() => setSort("flat")}
              className={`px-2 py-1 border-l border-gray-300 transition ${sort === "flat" ? "bg-yai-navy text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              Chrono
            </button>
          </div>
        </div>
      </header>

      {upcoming.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 bg-white/60 p-6 text-center">
          <p className="text-sm text-gray-600">Nothing booked yet.</p>
          <p className="mt-1 text-xs text-gray-500">
            Events will fill in once the Telegram scout starts harvesting the
            GOV · STARTUP folder (21 channels) and TAFTAC MEMBERS topics.
          </p>
        </div>
      ) : sort === "month-source" ? (
        <div className="space-y-5">
          {grouped.map(({ month, sources }) => (
            <div key={month}>
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur px-1 py-1 border-b border-gray-200">
                <div className="text-sm font-extrabold text-yai-navy uppercase tracking-wide">
                  {monthLabel(month)}
                </div>
              </div>
              <div className="pl-1">
                {sources.map(({ source, events }) => (
                  <div key={source} className="mt-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-yai-orange mb-1">
                      {source} <span className="text-gray-400 font-medium">· {events.length}</span>
                    </div>
                    <ul className="divide-y divide-gray-200 border-l-2 border-gray-200 pl-3">
                      {events.map((e) => (
                        <EventRow
                          key={e.id}
                          event={e}
                          status={statusOf(e)}
                          assignee={assigneeOf(e)}
                          teamOptions={teamOptions}
                          onStatus={(s) => setStatus(e.id, s)}
                          onAssignee={(a) => setAssignee(e.id, a)}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {upcoming.map((e) => (
            <EventRow
              key={e.id}
              event={e}
              status={statusOf(e)}
              assignee={assigneeOf(e)}
              teamOptions={teamOptions}
              onStatus={(s) => setStatus(e.id, s)}
              onAssignee={(a) => setAssignee(e.id, a)}
              showSource
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function EventRow({ event: e, status, assignee, teamOptions, onStatus, onAssignee, showSource }: {
  event: TaskEvent;
  status: Status;
  assignee: string;
  teamOptions: string[];
  onStatus: (s: Status) => void;
  onAssignee: (a: string) => void;
  showSource?: boolean;
}) {
  const inDays = daysFromNow(e.date);
  return (
    <li className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {e.kind && (
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${KIND_COLOR[e.kind] || KIND_COLOR.other}`}>
              {KIND_LABEL[e.kind] || e.kind}
            </span>
          )}
          <div className="text-[13px] font-semibold text-yai-navy truncate">
            {e.link ? (
              <a href={e.link} target="_blank" rel="noreferrer" className="hover:underline">
                {e.title}
              </a>
            ) : e.title}
          </div>
        </div>
        <div className="mt-0.5 text-[11px] text-gray-600 flex items-center gap-2 flex-wrap">
          <span>{fmtDay(e.date)}</span>
          <span>·</span>
          <span className={inDays <= 7 ? "text-rose-600 font-semibold" : ""}>
            {inDays === 0 ? "today" : inDays === 1 ? "tomorrow" : `in ${inDays} days`}
          </span>
          {showSource && e.source && (<>
            <span>·</span>
            <span>{e.source}</span>
          </>)}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:justify-end flex-wrap">
        <select
          value={assignee}
          onChange={(ev) => onAssignee(ev.target.value)}
          className="text-[12px] rounded border border-gray-300 bg-white px-2 py-1 text-gray-700"
        >
          <option value="">unassigned</option>
          {teamOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {(["go", "skip", "later"] as Status[]).map((s) => {
          const active = status === s;
          const colors: Record<Status, string> = {
            go: active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50",
            skip: active ? "bg-gray-500 text-white border-gray-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50",
            later: active ? "bg-amber-500 text-white border-amber-500" : "bg-white text-amber-700 border-amber-300 hover:bg-amber-50",
            proposed: "",
          };
          return (
            <button
              key={s}
              type="button"
              onClick={() => onStatus(s)}
              className={`text-[11px] font-bold uppercase tracking-wide border rounded px-2 py-1 transition ${colors[s]}`}
            >
              {s}
            </button>
          );
        })}
      </div>
    </li>
  );
}
