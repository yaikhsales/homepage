"use client";

/* Event Registry — our own events, their QR codes, and who signed up.
 *
 * Only events we created (origin "manual") appear here: a scout-found
 * event is somebody else's, so there is nothing for us to hand out or
 * collect. Each one shows the QR to drop into a handout or advert, the
 * link it encodes, and the people who have registered through it.
 *
 * The rows hold guests' contact details and arrive from a session-gated
 * route, so this component lives inside /task and nowhere public.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { TaskEvent } from "./TaskCalendar";

type Registration = {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  telegram: string;
  contactMethod: string;
  chosenDate: string;
  note: string;
  status: string;
  createdAt: string;
};

const METHOD_LABEL: Record<string, string> = {
  email: "Email", sms: "SMS", phone: "Phone", telegram: "Telegram",
};

function shortDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function contactOf(r: Registration): string {
  if (r.contactMethod === "telegram" && r.telegram) return `@${r.telegram}`;
  if ((r.contactMethod === "sms" || r.contactMethod === "phone") && r.phone) return r.phone;
  return r.email || r.phone || (r.telegram ? `@${r.telegram}` : "—");
}

export function EventRegistry({ events }: { events: TaskEvent[] }) {
  const [regs, setRegs] = useState<Registration[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [openEvent, setOpenEvent] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const ours = useMemo(
    () => events.filter((e) => e.origin === "manual").sort((a, b) => a.date.localeCompare(b.date)),
    [events]
  );

  const load = useCallback(() => {
    setState("loading");
    fetch("/api/registrations", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((d) => {
        if (d?.ok && Array.isArray(d.registrations)) {
          setRegs(d.registrations);
          setState("ok");
        } else setState("err");
      })
      .catch(() => setState("err"));
  }, []);

  useEffect(load, [load]);

  const byEvent = useMemo(() => {
    const m = new Map<string, Registration[]>();
    for (const r of regs) {
      const list = m.get(r.eventId);
      if (list) list.push(r); else m.set(r.eventId, [r]);
    }
    return m;
  }, [regs]);

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
    <section className="mt-6 rounded-lg border border-[#d9d3c1] bg-white/70 p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-yai-navy">
          Event registry
          {state === "ok" && (
            <span className="ml-2 font-normal text-gray-500">
              {regs.length} {regs.length === 1 ? "registration" : "registrations"}
            </span>
          )}
        </h2>
        <button type="button" onClick={load}
          className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-800">
          {state === "loading" ? "Loading…" : "Refresh"}
        </button>
      </div>

      {state === "err" && (
        <p className="text-[12px] text-rose-600">Could not load registrations.</p>
      )}

      {ours.length === 0 ? (
        <p className="text-[12px] text-gray-500">
          No events of ours yet. Add one above and its QR code appears here.
        </p>
      ) : (
        <div className="space-y-3">
          {ours.map((e) => {
            const list = byEvent.get(e.id) || [];
            const open = openEvent === e.id;
            return (
              <div key={e.id} className="rounded-lg border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-yai-navy">{e.title}</p>
                    <p className="text-[11px] text-gray-500">
                      {shortDate(e.date)}
                      {e.dates && e.dates.length > 1 && ` · ${e.dates.length} dates offered`}
                      {e.venue && ` · ${e.venue}`}
                    </p>
                  </div>
                  <span className="rounded-full bg-yai-navy px-2.5 py-1 text-[11px] font-bold text-white">
                    {list.length} registered
                  </span>
                  <button type="button" onClick={() => setOpenEvent(open ? null : e.id)}
                    className="rounded border border-gray-300 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-700 hover:bg-gray-50">
                    {open ? "Hide" : "Open"}
                  </button>
                </div>

                {open && (
                  <div className="border-t border-gray-200 p-3">
                    <div className="flex flex-wrap gap-5">
                      <div className="shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/api/events/${e.id}/qr`} alt={`QR code for ${e.title}`}
                          className="h-40 w-40 rounded border border-gray-200 bg-white p-1" />
                        <div className="mt-2 flex gap-2">
                          <button type="button" onClick={() => copyLink(e.id)}
                            className="rounded border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50">
                            {copied === e.id ? "Copied" : "Copy link"}
                          </button>
                          <a href={`/api/events/${e.id}/qr`} download={`event-${e.id}.svg`}
                            className="rounded border border-gray-300 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50">
                            Download SVG
                          </a>
                        </div>
                        <p className="mt-2 max-w-[10rem] text-[10px] leading-snug text-gray-500">
                          Put this on the handout or advert. Scanning it opens the sign-up page.
                        </p>
                      </div>

                      <div className="min-w-[18rem] flex-1">
                        {list.length === 0 ? (
                          <p className="text-[12px] text-gray-500">Nobody has registered yet.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-[12px]">
                              <thead>
                                <tr className="border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-500">
                                  <th className="py-1.5 pr-3 font-bold">Name</th>
                                  <th className="py-1.5 pr-3 font-bold">Contact</th>
                                  <th className="py-1.5 pr-3 font-bold">Via</th>
                                  <th className="py-1.5 pr-3 font-bold">Date</th>
                                  <th className="py-1.5 font-bold">Note</th>
                                </tr>
                              </thead>
                              <tbody>
                                {list.map((r) => (
                                  <tr key={r.id} className="border-b border-gray-100 last:border-0">
                                    <td className="py-1.5 pr-3 font-semibold text-yai-navy">{r.name}</td>
                                    <td className="py-1.5 pr-3 text-gray-700">{contactOf(r)}</td>
                                    <td className="py-1.5 pr-3 text-gray-500">
                                      {METHOD_LABEL[r.contactMethod] || r.contactMethod}
                                    </td>
                                    <td className="py-1.5 pr-3 text-gray-700">{shortDate(r.chosenDate)}</td>
                                    <td className="py-1.5 text-gray-500">{r.note || "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
