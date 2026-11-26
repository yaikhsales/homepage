/* Shared wording for an event's when, so the public page, the public list
 * and the internal panel all say it the same way. */

type When = { date: string; endDate?: string; startTime?: string; endTime?: string; time?: string };

const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

// Built by hand: toLocaleDateString puts a comma after the weekday in some
// runtimes and not others, which made "Fri 18 – Sat, 19 …" on the page.
function parts(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return { wd: WD[d.getDay()], day: d.getDate(), mon: MON[d.getMonth()], year: d.getFullYear() };
}

/** "Fri 18 December 2026" or "Fri 18 – Sat 19 December 2026". */
export function formatDateRange(e: When): string {
  const a = parts(e.date);
  if (!a) return e.date;
  const b = e.endDate && e.endDate > e.date ? parts(e.endDate) : null;
  if (!b) return `${a.wd} ${a.day} ${a.mon} ${a.year}`;
  if (a.year !== b.year) return `${a.wd} ${a.day} ${a.mon} ${a.year} – ${b.wd} ${b.day} ${b.mon} ${b.year}`;
  if (a.mon !== b.mon) return `${a.wd} ${a.day} ${a.mon} – ${b.wd} ${b.day} ${b.mon} ${b.year}`;
  return `${a.wd} ${a.day} – ${b.wd} ${b.day} ${b.mon} ${b.year}`;
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
