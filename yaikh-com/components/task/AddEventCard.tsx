"use client";

/* "Add event" card for /task.
 *
 * Collapsed it is a single button; open it is a small form. On success the
 * parent folds the new event into its list, which is all the filter bar
 * needs — its organiser chips are derived from the events themselves, so a
 * new organiser appears as a new chip and an existing one just gains a
 * count.
 *
 * The organiser field is a free-text input backed by a datalist of the
 * organisers already on the board, so picking an existing one is one click
 * and lands the event on that chip instead of beside it.
 */

import { useMemo, useState } from "react";
import type { TaskEvent } from "./TaskCalendar";

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

  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [kind, setKind] = useState("workshop");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  // Up to two alternatives beside the main date; registrants pick one.
  const [altDates, setAltDates] = useState<string[]>([]);

  // Organisers already on the board, so the viewer can reuse one rather
  // than retyping it slightly differently and splitting the chip.
  const knownSources = useMemo(() => {
    const seen = new Set<string>();
    for (const e of events) if (e.source) seen.add(e.source);
    return Array.from(seen).sort((a, b) => a.localeCompare(b));
  }, [events]);

  const reset = () => {
    setDate(""); setTitle(""); setSource(""); setKind("workshop");
    setTime(""); setVenue(""); setAltDates([]); setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ date, title, source, kind, time, venue, dateOptions: altDates.filter(Boolean) }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Could not save. Please try again.");
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div>
            <label className={LABEL} htmlFor="ev-date">Date</label>
            <input id="ev-date" type="date" required value={date} disabled={saving}
              onChange={(e) => setDate(e.target.value)} className={FIELD} />
          </div>

          <div>
            <label className={LABEL} htmlFor="ev-time">Time <span className="font-normal normal-case">(optional)</span></label>
            <input id="ev-time" type="text" maxLength={40} placeholder="09:00" value={time}
              disabled={saving} onChange={(e) => setTime(e.target.value)} className={FIELD} />
          </div>

          <div className="lg:col-span-2">
            <label className={LABEL} htmlFor="ev-venue">Venue <span className="font-normal normal-case">(optional)</span></label>
            <input id="ev-venue" type="text" maxLength={200} placeholder="Where" value={venue}
              disabled={saving} onChange={(e) => setVenue(e.target.value)} className={FIELD} />
          </div>

          <div className="lg:col-span-2">
            <label className={LABEL} htmlFor="ev-kind">Kind</label>
            <select id="ev-kind" value={kind} disabled={saving}
              onChange={(e) => setKind(e.target.value)} className={FIELD}>
              {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
            </select>
          </div>

          <div className="lg:col-span-4">
            <label className={LABEL} htmlFor="ev-title">Title</label>
            <input id="ev-title" type="text" required minLength={2} maxLength={200}
              placeholder="What is happening" value={title} disabled={saving}
              onChange={(e) => setTitle(e.target.value)} className={FIELD} />
          </div>

          <div className="lg:col-span-2">
            <label className={LABEL} htmlFor="ev-source">Organiser</label>
            <input id="ev-source" type="text" required minLength={2} maxLength={80}
              list="ev-source-options" placeholder="Yai" value={source} disabled={saving}
              onChange={(e) => setSource(e.target.value)} className={FIELD} />
            <datalist id="ev-source-options">
              {knownSources.map((s) => <option key={s} value={s} />)}
            </datalist>
          </div>
        </div>

        <div className="mt-3">
          <span className={LABEL}>
            Other dates offered <span className="font-normal normal-case">(optional — registrants pick one)</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {altDates.map((d, i) => (
              <span key={i} className="flex items-center gap-1">
                <input type="date" value={d} disabled={saving}
                  onChange={(e) => setAltDates((a) => a.map((v, j) => (j === i ? e.target.value : v)))}
                  className={FIELD + " w-auto"} />
                <button type="button" disabled={saving} aria-label="Remove this date"
                  onClick={() => setAltDates((a) => a.filter((_, j) => j !== i))}
                  className="px-1.5 text-gray-400 hover:text-rose-600">×</button>
              </span>
            ))}
            {altDates.length < 2 && (
              <button type="button" disabled={saving} onClick={() => setAltDates((a) => [...a, ""])}
                className="rounded border border-dashed border-gray-400 px-2.5 py-1.5 text-[12px] font-semibold text-gray-600 hover:bg-gray-50">
                + Add a date
              </button>
            )}
          </div>
        </div>

        {error && <p className="mt-3 text-[12px] font-semibold text-rose-600">{error}</p>}

        <div className="mt-3 flex items-center gap-3">
          <button type="submit" disabled={saving}
            className="rounded-full border border-yai-navy bg-yai-navy px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:opacity-50">
            {saving ? "Saving…" : "Save event"}
          </button>
          <span className="text-[11px] text-gray-500">
            Saved as ours and marked <strong>go</strong>. It joins the organiser chips below.
          </span>
        </div>
      </form>
    </section>
  );
}
