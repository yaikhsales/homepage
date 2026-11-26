"use client";

/* "Yai events" tab — only the events we run.
 *
 * Same calendar as the Task tab, but fed solely with our own events: the
 * Telegram and Facebook feed belongs to the other tab, and mixing the two
 * here would make it unclear which events we are actually hosting.
 *
 * Clicking a day opens that day below: the event's details, the QR code
 * and link to put on a handout or post, and everyone who registered
 * through it.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { TaskCalendar, type TaskEvent } from "./TaskCalendar";
import { AddEventCard } from "./AddEventCard";
import { formatDateRange, formatTimeRange, runsOn, cateringItems } from "@/lib/event-format";

type Registration = {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  telegram: string;
  contactMethod: string;
  contactVia?: string[];
  chosenDate: string;
  note: string;
  createdAt: string;
};

function longDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export function YaiEventsPanel({
  events,
  onCreated,
}: {
  events: TaskEvent[];
  onCreated: (e: TaskEvent) => void;
}) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [copied, setCopied] = useState<string | null>(null);

  const ours = useMemo(() => events.filter((e) => e.origin === "manual"), [events]);

  const load = useCallback(() => {
    setState("loading");
    fetch("/api/registrations", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((d) => {
        if (d?.ok && Array.isArray(d.registrations)) { setRegs(d.registrations); setState("ok"); }
        else setState("err");
      })
      .catch(() => setState("err"));
  }, []);
  useEffect(load, [load]);

  // A day shows every event of ours that offers it, not just the one it is
  // pinned to — an event with two candidate dates belongs on both.
  const dayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return ours.filter((e) => runsOn(e, selectedDay));
  }, [ours, selectedDay]);

  const copyLink = async (id: string) => {
    const url = `${window.location.origin}/e/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  };

  return (
    <>
      <TaskCalendar
        events={ours}
        onSelectDay={(iso) => setSelectedDay(iso || null)}
        selectedDay={selectedDay}
        emptyNote="No events of ours yet. Add one below and it appears on this calendar."
      />

      <AddEventCard events={events} onCreated={onCreated} />

      <section className="mt-4 rounded-lg border border-[#d9d3c1] bg-white/70 p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-yai-navy">
            {selectedDay ? longDate(selectedDay) : "Pick a date on the calendar"}
          </h2>
          <button type="button" onClick={load}
            className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-800">
            {state === "loading" ? "Loading…" : "Refresh"}
          </button>
        </div>

        {state === "err" && <p className="text-[12px] text-rose-600">Could not load registrations.</p>}

        {!selectedDay ? (
          <p className="text-[12px] text-gray-500">
            Click a day that has one of our events to see its details, QR code and who registered.
          </p>
        ) : dayEvents.length === 0 ? (
          <p className="text-[12px] text-gray-500">Nothing of ours on this day.</p>
        ) : (
          <div className="space-y-4">
            {dayEvents.map((e) => {
              const list = regs.filter((r) => r.eventId === e.id);
              return (
                <div key={e.id} className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="mb-3">
                    <p className="text-[14px] font-bold text-yai-navy">{e.title}</p>
                    <p className="text-[11px] text-gray-500">
                      {formatDateRange(e)}
                      {formatTimeRange(e) && ` · ${formatTimeRange(e)}`}
                      {e.venue && ` · ${e.venue}`}
                      {e.source && ` · ${e.source}`}
                    </p>
                    {cateringItems(e.catering).length > 0 && (
                      <p className="text-[12px] text-gray-600">
                        {cateringItems(e.catering).map((c) => `${c.icon} ${c.label}`).join("   ")}
                      </p>
                    )}
                    {e.mapUrl && (
                      <a href={e.mapUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-yai-blue underline">
                        View on map ↗
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-5">
                    <div className="shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/api/events/${e.id}/qr`} alt={`QR code for ${e.title}`}
                        className="h-40 w-40 rounded border border-gray-200 bg-white p-1" />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" onClick={() => copyLink(e.id)}
                          className="rounded border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50">
                          {copied === e.id ? "Copied" : "Copy link"}
                        </button>
                        <a href={`/api/events/${e.id}/qr`} download={`event-${e.id}.svg`}
                          className="rounded border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50">
                          Download QR
                        </a>
                      </div>
                      <p className="mt-2 max-w-[10rem] break-all text-[10px] text-gray-400">
                        /e/{e.id}
                      </p>
                    </div>

                    <div className="min-w-[18rem] flex-1">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Registered · {list.length}
                      </p>
                      {list.length === 0 ? (
                        <p className="text-[12px] text-gray-500">Nobody yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[12px]">
                            <thead>
                              <tr className="border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-500">
                                <th className="py-1.5 pr-3 font-bold">Name</th>
                                <th className="py-1.5 pr-3 font-bold">Email</th>
                                <th className="py-1.5 pr-3 font-bold">Phone</th>
                                <th className="py-1.5 pr-3 font-bold">Telegram</th>
                                <th className="py-1.5 pr-3 font-bold">May contact by</th>
                                <th className="py-1.5 font-bold">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {list.map((r) => (
                                <tr key={r.id} className="border-b border-gray-100 last:border-0">
                                  <td className="py-1.5 pr-3 font-semibold text-yai-navy">{r.name}</td>
                                  <td className="py-1.5 pr-3 text-gray-700">{r.email || "—"}</td>
                                  <td className="py-1.5 pr-3 text-gray-700">{r.phone || "—"}</td>
                                  <td className="py-1.5 pr-3 text-gray-700">{r.telegram ? `@${r.telegram}` : "—"}</td>
                                  <td className="py-1.5 pr-3 text-gray-700">
                                    {(r.contactVia && r.contactVia.length ? r.contactVia : [r.contactMethod])
                                      .map((v) => v.charAt(0).toUpperCase() + v.slice(1)).join(", ")}
                                  </td>
                                  <td className="py-1.5 text-gray-700">
                                    {r.chosenDate ? longDate(r.chosenDate).split(",").slice(0, 2).join(",") : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
