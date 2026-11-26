/* Shared wording for an event's when, so the public page, the public list
 * and the internal panel all say it the same way. */

type When = { date: string; endDate?: string; startTime?: string; endTime?: string; time?: string };

function day(iso: string, opts: Intl.DateTimeFormatOptions): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", opts);
}

/** "Fri 18 December 2026" or "Fri 18 – Sat 19 December 2026". */
export function formatDateRange(e: When): string {
  const end = e.endDate && e.endDate > e.date ? e.endDate : "";
  if (!end) return day(e.date, { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const sameMonth = e.date.slice(0, 7) === end.slice(0, 7);
  const from = sameMonth
    ? day(e.date, { weekday: "short", day: "numeric" })
    : day(e.date, { weekday: "short", day: "numeric", month: "long" });
  return `${from} – ${day(end, { weekday: "short", day: "numeric", month: "long", year: "numeric" })}`;
}

/** "09:00 – 17:00", or whatever older rows stored in `time`. */
export function formatTimeRange(e: When): string {
  if (e.startTime && e.endTime) return `${e.startTime} – ${e.endTime}`;
  return e.startTime || e.time || "";
}

/** True when `iso` falls on one of the event's days. */
export function runsOn(e: When, iso: string): boolean {
  const end = e.endDate && e.endDate > e.date ? e.endDate : e.date;
  return iso >= e.date && iso <= end;
}

/* What the event provides. Order is the order of the day. Emoji rather than
 * an icon set so it reads the same on every phone and in a shared link. */
export const CATERING = [
  { value: "morning", icon: "☕🍰", label: "Coffee & snack" },
  { value: "lunch", icon: "🍽️", label: "Lunch" },
  { value: "afternoon", icon: "🫖", label: "Afternoon tea" },
] as const;

export type CateringValue = (typeof CATERING)[number]["value"];

export function cateringItems(values: unknown): (typeof CATERING)[number][] {
  const set = new Set(Array.isArray(values) ? values : []);
  return CATERING.filter((c) => set.has(c.value));
}
