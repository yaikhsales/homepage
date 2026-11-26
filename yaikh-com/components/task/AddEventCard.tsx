"use client";

/* "Add event" card for the Yai events tab.
 *
 * Dates work like a booking form: pick "One day" for a single date, or
 * "Several days" for a from–to range, then a start and end time. A range
 * is one event that runs across those days — registrants sign up for the
 * event, they do not choose between dates.
 *
 * On success the parent folds the new event into its list; the calendar
 * and the organiser chips are derived from that list, so nothing else needs
 * wiring.
 */

import { useMemo, useState } from "react";
import type { TaskEvent } from "./TaskCalendar";
import { CATERING } from "@/lib/event-format";

const KINDS: { value: string; label: string }[] = [
  { value: "workshop", label: "Workshop" },
  { value: "meeting", label: "Meeting" },
  { value: "training", label: "Training" },
  { value: "expo", label: "Expo" },
  { value: "funding", label: "Funding" },
  { value: "tender", label: "Tender" },
  { value: "other", label: "Other" },
];

const FIELD =
  "w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[13px] text-yai-navy " +
  "focus:outline-none focus:ring-2 focus:ring-yai-orange/40 focus:border-yai-orange disabled:opacity-60";
const LABEL = "block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1";

export function AddEventCard({
  events,
  onCreated,
}: {
  events: TaskEvent[];
  onCreated: (event: TaskEvent) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [span, setSpan] = useState<"one" | "several">("one");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [venue, setVenue] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [catering, setCatering] = useState<string[]>([]);
  // Pasted from the handout, which has already been proofread.
  const [titleKm, setTitleKm] = useState("");
  const [kind, setKind] = useState("workshop");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");

  const knownSources = useMemo(() => {
    const seen = new Set<string>();
    for (const e of events) if (e.source) seen.add(e.source);
    return Array.from(seen).sort((a, b) => a.localeCompare(b));
  }, [events]);

  const reset = () => {
    setSpan("one"); setDate(""); setEndDate(""); setStartTime("09:00"); setEndTime("17:00");
    setVenue(""); setMapUrl(""); setCatering([]); setTitleKm(""); setKind("workshop"); setTitle(""); setSource(""); setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (span === "several" && endDate && date && endDate <= date) {
      setError("The end date must be after the start date.");
      return;
    }
    if (startTime && endTime && endTime <= startTime) {
      setError("The end time must be after the start time.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          date,
          endDate: span === "several" ? endDate : date,
          startTime,
          endTime,
          venue,
          mapUrl,
          catering,
          titleKm,
          kind,
          title,
          source,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(
          res.status === 401
            ? "You were signed out. Refresh the page, sign in again, and save."
            : data?.error || "Could not save. Please try again."
        );
        return;
      }
      onCreated(data.event as TaskEvent);
      reset();
      setOpen(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-yai-orange bg-yai-orange px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white transition hover:brightness-95"
        >
          <span className="text-base leading-none">+</span> Add event
        </button>
      </div>
    );
  }

  return (
    <section className="mt-4 rounded-lg border border-[#d9d3c1] bg-white/70 p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-yai-navy">
          Add our own event
        </h2>
        <button
          type="button"
          onClick={() => { reset(); setOpen(false); }}
          className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={submit}>
        {/* One day / several days — booking-form style */}
        <div className="mb-3 inline-flex rounded-lg bg-[#e4dfd0] p-1">
          {([
            ["one", "One day"],
            ["several", "Several days"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              disabled={saving}
              onClick={() => setSpan(value)}
              aria-pressed={span === value}
              className={`rounded-md px-3.5 py-1 text-[12px] font-bold transition ${
                span === value ? "bg-white text-yai-navy shadow-sm" : "text-gray-500 hover:text-yai-navy"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div>
            <label className={LABEL} htmlFor="ev-date">{span === "one" ? "Date" : "From"}</label>
            <input id="ev-date" type="date" required value={date} disabled={saving}
              onChange={(e) => setDate(e.target.value)} className={FIELD} />
          </div>

          {span === "several" && (
            <div>
              <label className={LABEL} htmlFor="ev-end-date">To</label>
              <input id="ev-end-date" type="date" required min={date || undefined} value={endDate}
                disabled={saving} onChange={(e) => setEndDate(e.target.value)} className={FIELD} />
            </div>
          )}

          <div>
            <label className={LABEL} htmlFor="ev-start">Starts</label>
            <input id="ev-start" type="time" required value={startTime} disabled={saving}
              onChange={(e) => setStartTime(e.target.value)} className={FIELD} />
          </div>

          <div>
            <label className={LABEL} htmlFor="ev-end">Ends</label>
            <input id="ev-end" type="time" required value={endTime} disabled={saving}
              onChange={(e) => setEndTime(e.target.value)} className={FIELD} />
          </div>

          <div className={span === "one" ? "lg:col-span-3" : "lg:col-span-2"}>
            <label className={LABEL} htmlFor="ev-venue">Venue</label>
            <input id="ev-venue" type="text" required maxLength={200} placeholder="Where" value={venue}
              disabled={saving} onChange={(e) => setVenue(e.target.value)} className={FIELD} />
          </div>

          <div className="lg:col-span-6">
            <label className={LABEL} htmlFor="ev-map">
              Google Maps link <span className="font-normal normal-case">(optional — paste from Maps → Share)</span>
            </label>
            <input id="ev-map" type="url" maxLength={500} placeholder="https://maps.app.goo.gl/..."
              value={mapUrl} disabled={saving} onChange={(e) => setMapUrl(e.target.value)} className={FIELD} />
          </div>

          <div className="lg:col-span-4">
            <label className={LABEL} htmlFor="ev-title">Title</label>
            <input id="ev-title" type="text" required minLength={2} maxLength={200}
              placeholder="What is happening" value={title} disabled={saving}
              onChange={(e) => setTitle(e.target.value)} className={FIELD} />
          </div>

          <div>
            <label className={LABEL} htmlFor="ev-source">Organiser</label>
            <input id="ev-source" type="text" required minLength={2} maxLength={80}
              list="ev-source-options" placeholder="Yai" value={source} disabled={saving}
              onChange={(e) => setSource(e.target.value)} className={FIELD} />
            <datalist id="ev-source-options">
              {knownSources.map((s) => <option key={s} value={s} />)}
            </datalist>
          </div>

          <div>
            <label className={LABEL} htmlFor="ev-kind">Kind</label>
            <select id="ev-kind" value={kind} disabled={saving}
              onChange={(e) => setKind(e.target.value)} className={FIELD}>
              {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-3">
          <label className={LABEL} htmlFor="ev-title-km">
            Khmer title <span className="font-normal normal-case">(paste from the proofread handout — shown on top)</span>
          </label>
          <input id="ev-title-km" type="text" maxLength={300} lang="km" value={titleKm} disabled={saving}
            onChange={(e) => setTitleKm(e.target.value)}
            placeholder="ចំណងជើងជាភាសាខ្មែរ"
            className={FIELD + " text-[15px]"} />
        </div>

        <div className="mt-3">
          <span className={LABEL}>Provided</span>
          <div className="flex flex-wrap gap-2">
            {CATERING.map((c) => {
              const on = catering.includes(c.value);
              return (
                <label key={c.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition ${
                    on ? "border-yai-orange bg-orange-50 text-yai-navy" : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  }`}>
                  <input type="checkbox" className="h-4 w-4 accent-yai-orange" checked={on} disabled={saving}
                    onChange={() => setCatering((v) => (on ? v.filter((x) => x !== c.value) : [...v, c.value]))} />
                  <span className="text-base leading-none">{c.icon}</span>
                  {c.label}
                </label>
              );
            })}
          </div>
        </div>

        {error && <p className="mt-3 text-[12px] font-semibold text-rose-600">{error}</p>}

        <div className="mt-3 flex items-center gap-3">
          <button type="submit" disabled={saving}
            className="rounded-full border border-yai-navy bg-yai-navy px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:opacity-50">
            {saving ? "Saving…" : "Save event"}
          </button>
          <span className="text-[11px] text-gray-500">
            After saving, click its date on the calendar above to get the QR code.
          </span>
        </div>
      </form>
    </section>
  );
}
