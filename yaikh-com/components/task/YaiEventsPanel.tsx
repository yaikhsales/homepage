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
import { EventFiles } from "./EventFiles";
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
  attendDays?: string[];
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
  onUpdated,
  filesReady = false,
}: {
  events: TaskEvent[];
  onCreated: (e: TaskEvent) => void;
  onUpdated?: (id: string, patch: Partial<TaskEvent>) => void;
  filesReady?: boolean;
}) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [copied, setCopied] = useState<string | null>(null);
  // Editing the Khmer title of one saved event.
  const [kmEdit, setKmEdit] = useState<{ id: string; km: string } | null>(null);
  const [kmBusy, setKmBusy] = useState(false);
  // The error belongs to the event it happened on, not every event shown.
  const [kmError, setKmError] = useState<{ id: string; msg: string } | null>(null);

  const saveKhmer = async () => {
    if (!kmEdit) return;
    setKmBusy(true); setKmError(null);
    try {
      const res = await fetch(`/api/events/${kmEdit.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ titleKm: kmEdit.km }),
      });
      const d = await res.json();
      if (!res.ok || !d?.ok) { setKmError({ id: kmEdit.id, msg: d?.error || "Could not save." }); return; }
      onUpdated?.(kmEdit.id, { titleKm: d.titleKm });
      setKmEdit(null);
    } catch { setKmError({ id: kmEdit.id, msg: "Network error." }); } finally { setKmBusy(false); }
  };

  const ours = useMemo(() => events.filter((e) => e.origin === "manual"), [events]);

  // Open on the next event of ours, so the QR, sign-ups and files show
  // without hunting for the day first. A click on the calendar takes over.
  const [picked, setPicked] = useState(false);
  useEffect(() => {
    if (picked || selectedDay) return;
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Phnom_Penh" });
    const next = ours
      .filter((e) => (e.endDate || e.date) >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    if (next) setSelectedDay(next.date >= today ? next.date : today);
  }, [ours, picked, selectedDay]);

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

  const linkOf = (e: TaskEvent) => `${window.location.origin}/${e.slug || `e/${e.id}`}`;

  const copyLink = async (e: TaskEvent) => {
    const id = e.id;
    const url = linkOf(e);
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
        onSelectDay={(iso) => { setPicked(true); setSelectedDay(iso || null); }}
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
                <div key={e.id} className="rounded-lg border border-gray-200 bg-white p-3 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-6">
                  {/* Left: details, QR and who registered. Right: handouts and slides,
                      so the files sit in the empty space beside the table on wide screens. */}
                  <div className="min-w-0">
                  <div className="mb-3">
                    {kmEdit?.id === e.id ? (
                      <div className="mb-1">
                        <input lang="km" value={kmEdit.km} disabled={kmBusy}
                          placeholder="Paste from the proofread handout"
                          onChange={(ev) => setKmEdit({ ...kmEdit, km: ev.target.value })}
                          className="w-full rounded border border-gray-300 px-2 py-1 text-[15px] text-yai-navy" />
                        <div className="mt-1 flex gap-2">
                          <button type="button" onClick={saveKhmer} disabled={kmBusy}
                            className="rounded bg-yai-navy px-2 py-0.5 text-[11px] font-bold text-white disabled:opacity-50">Save Khmer</button>
                          <button type="button" onClick={() => setKmEdit(null)}
                            className="px-1 text-[11px] text-gray-500">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p lang="km" className="text-[15px] font-bold text-yai-navy">
                        {e.titleKm || <span className="text-[12px] font-normal italic text-rose-600">No Khmer title yet</span>}
                        <button type="button" disabled={kmBusy}
                          onClick={() => setKmEdit({ id: e.id, km: e.titleKm || "" })}
                          className="ml-2 rounded border border-gray-300 px-1.5 py-0.5 align-middle text-[10px] font-semibold text-gray-600 hover:bg-gray-50">
                          {e.titleKm ? "Edit" : "Add Khmer"}
                        </button>
                      </p>
                    )}
                    {kmError?.id === e.id && <p className="text-[11px] text-rose-600">{kmError.msg}</p>}
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

                  {/* QR first, then who registered right under it. */}
                  <div className="space-y-4">
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/api/events/${e.id}/qr`} alt={`QR code for ${e.title}`}
                        className="h-40 w-40 rounded border border-gray-200 bg-white p-1" />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" onClick={() => copyLink(e)}
                          className="rounded border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50">
                          {copied === e.id ? "Copied" : "Copy link"}
                        </button>
                        <a href={`/api/events/${e.id}/qr`} download={`${e.slug || `event-${e.id}`}-qr.svg`}
                          className="rounded border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50">
                          Download QR
                        </a>
                      </div>
                      <p className="mt-2 max-w-[10rem] break-all text-[10px] text-gray-400">
                        yaikh.com/{e.slug || `e/${e.id}`}
                      </p>
                    </div>

                    <div className="min-w-0">
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
                                <th className="py-1.5 pr-3 font-bold">Contact by</th>
                                <th className="py-1.5 font-bold">Day</th>
                              </tr>
                            </thead>
                            <tbody>
                              {list.map((r) => {
                                const via = r.contactVia && r.contactVia.length ? r.contactVia : [r.contactMethod];
                                const detail: Record<string, string> = {
                                  email: r.email, phone: r.phone, telegram: r.telegram ? `@${r.telegram}` : "",
                                };
                                return (
                                  <tr key={r.id} className="border-b border-gray-100 align-top last:border-0">
                                    <td className="py-1.5 pr-3 font-semibold text-yai-navy">{r.name}</td>
                                    <td className="py-1.5 pr-3 text-gray-700">
                                      {via.map((v) => (
                                        <div key={v}>
                                          <span className="text-gray-500">{v.charAt(0).toUpperCase() + v.slice(1)}:</span>{" "}
                                          {detail[v] || "—"}
                                        </div>
                                      ))}
                                    </td>
                                    <td className="py-1.5 text-gray-700">
                                      {(r.attendDays && r.attendDays.length ? r.attendDays : r.chosenDate ? [r.chosenDate] : [])
                                        .map((d) => {
                                          const x = new Date(`${d}T00:00:00`);
                                          return x.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
                                        })
                                        .join(" + ") || "—"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>

                  <EventFiles event={e} ready={filesReady}
                    onChange={(files) => onUpdated?.(e.id, { files })} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
