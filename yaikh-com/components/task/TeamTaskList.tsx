"use client";

/* Team task list for /task — lives below the calendar.
 *
 * Each row is one event the TG scout surfaced (startup funding window,
 * expo, MEF/MISTI training, TAFTAC call, meeting). Team marks it GO /
 * SKIP / LATER and assigns a handler. Status + handler sit in Mongo
 * (phase 2); for now the component is UI-only and takes an events[]
 * prop. GO rows roll up to "we go to X" counters elsewhere.
 */

import { useMemo, useState } from "react";
import type { TaskEvent } from "./TaskCalendar";

type Status = "proposed" | "go" | "skip" | "later";

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

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short", day: "numeric", weekday: "short",
  });
}

function daysFromNow(iso: string): number {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

export function TeamTaskList({ events, teamOptions = [] }: {
  events: TaskEvent[];
  teamOptions?: string[];
}) {
  // Local state only — real persistence comes from Mongo in phase 2.
  const [overrides, setOverrides] = useState<Record<string, { status?: Status; assignee?: string }>>({});

  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [...events]
      .filter((e) => new Date(e.date) >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events]);

  const setStatus = (id: string, status: Status) => {
    setOverrides((o) => ({ ...o, [id]: { ...(o[id] || {}), status } }));
  };
  const setAssignee = (id: string, assignee: string) => {
    setOverrides((o) => ({ ...o, [id]: { ...(o[id] || {}), assignee } }));
  };

  const statusOf = (e: TaskEvent): Status =>
    (overrides[e.id]?.status ?? e.status ?? "proposed") as Status;
  const assigneeOf = (e: TaskEvent): string =>
    overrides[e.id]?.assignee ?? "";

  return (
    <section className="mt-6 rounded-lg border border-[#d9d3c1] bg-white/70 p-4 sm:p-5">
      <header className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-yai-orange">
            Team Task List
          </div>
          <h2 className="mt-0.5 text-lg font-extrabold text-yai-navy">
            What are we going to? Who handles it?
          </h2>
        </div>
        <div className="text-[11px] text-gray-500">
          {upcoming.length} upcoming
        </div>
      </header>

      {upcoming.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 bg-white/60 p-6 text-center">
          <p className="text-sm text-gray-600">
            Nothing booked yet.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Events will fill in once the Telegram scout starts harvesting the
            GOV · STARTUP folder (21 channels) and TAFTAC MEMBERS topics.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {upcoming.map((e) => {
            const status = statusOf(e);
            const inDays = daysFromNow(e.date);
            return (
              <li key={e.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-3">
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
                  <div className="mt-1 text-[11px] text-gray-600 flex items-center gap-2">
                    <span>{fmtDate(e.date)}</span>
                    <span>·</span>
                    <span className={inDays <= 7 ? "text-rose-600 font-semibold" : ""}>
                      {inDays === 0 ? "today" : inDays === 1 ? "tomorrow" : `in ${inDays} days`}
                    </span>
                    {e.source && (<>
                      <span>·</span>
                      <span className="truncate">{e.source}</span>
                    </>)}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:justify-end">
                  <select
                    value={assigneeOf(e)}
                    onChange={(ev) => setAssignee(e.id, ev.target.value)}
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
                        onClick={() => setStatus(e.id, s)}
                        className={`text-[11px] font-bold uppercase tracking-wide border rounded px-2 py-1 transition ${colors[s]}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
