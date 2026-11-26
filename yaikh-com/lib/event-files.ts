/* Rules for an event's attachments.
 *
 *   handout — up to 3 A4 images (JPEG/PNG). Public at all times: they are
 *             the advert, the same thing that goes on paper and Facebook.
 *   slides  — up to 3 PDFs. Open to the public only from the event's first
 *             day until 7 days after its last day (Phnom Penh time); locked
 *             before and after. Signed-in staff can always open them. */

export type FileKind = "handout" | "slides";

export type EventFile = {
  id: string;
  kind: FileKind;
  name: string;
  size: number;
  type: string;
  key: string;      // R2 object key — server only, never sent to the browser
  at: string;       // ISO upload time
};

export const FILE_RULES: Record<FileKind, { max: number; bytes: number; types: string[]; label: string }> = {
  handout: { max: 3, bytes: 8 * 1024 * 1024, types: ["image/jpeg", "image/png"], label: "A4 handout (JPG/PNG)" },
  slides: { max: 3, bytes: 30 * 1024 * 1024, types: ["application/pdf"], label: "Slides (PDF)" },
};

export const SLIDES_OPEN_DAYS_AFTER = 7;

/** Sniff the real type from the first bytes; the browser's claim is not trusted. */
export function sniffType(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return "application/pdf";
  return null;
}

/** Today's date in Phnom Penh as yyyy-mm-dd. */
export function todayPhnomPenh(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Phnom_Penh" }).format(now);
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type SlidesState = { open: boolean; opensOn: string; closesAfter: string };

/** Whether an event's slides are open to the public right now. */
export function slidesWindow(date: string, endDate?: string, now = new Date()): SlidesState {
  const last = endDate && endDate > date ? endDate : date;
  const closesAfter = addDays(last, SLIDES_OPEN_DAYS_AFTER);
  const today = todayPhnomPenh(now);
  return { open: today >= date && today <= closesAfter, opensOn: date, closesAfter };
}

/** What the browser may see of a file. */
export function publicFile(f: EventFile) {
  return { id: f.id, kind: f.kind, name: f.name, size: f.size, type: f.type };
}
