/* /api/events — upcoming task events.
 *
 * GET  lists events dated today or later, sorted by date ascending,
 *      capped at 500.
 * POST creates one of our own events. Scout-ingested rows carry
 *      origin "telegram"; ours carry origin "manual" and the viewer's
 *      name in createdBy, so the two never get confused.
 *
 * Both read/write Mongo collection `yaikh.task_events`. The scout
 * (_strategy-board/telegram/scout.py) populates the telegram rows.
 *
 * Requires a valid yai_session cookie — same gate as the /task page.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { getDb } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const viewer = verifySession(cookies().get(COOKIE_NAME)?.value);
  if (!viewer) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const rows = await db
      .collection("task_events")
      .find({ date: { $gte: iso } })
      .sort({ date: 1 })
      .limit(500)
      .toArray();

    const events = rows.map((r) => {
      const slug: string = r.sourceSlug || "";
      return {
        id: String(r._id),
        date: r.date,
        dates: Array.isArray(r.dates) && r.dates.length ? r.dates : [r.date],
        title: r.titleEn || r.title,       // prefer EN; fallback to original
        titleOriginal: r.title,            // keep the KM original around
        kind: r.kind,
        source: r.source,
        sourceSlug: slug,
        logo: slug ? `/task-logos/${slug}.jpg` : "",
        status: r.status || "proposed",
        venue: r.venue || "",
        time: r.time || "",
        link: r.link || "",
        origin: r.origin || "telegram",
      };
    });

    return NextResponse.json(
      { ok: true, count: events.length, events },
      { headers: { "Cache-Control": "private, max-age=30" } }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

/* An organiser name becomes the sourceSlug the filter chips group by, so
 * "BritCham" and "britcham " land on the same chip instead of two. The
 * scout slugifies the same way, which is what lets a manual event sit on
 * an existing chip rather than creating a duplicate beside it. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const KINDS = ["workshop", "funding", "expo", "meeting", "training", "tender", "other"] as const;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const viewer = verifySession(cookies().get(COOKIE_NAME)?.value);
  if (!viewer) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const date = clean(body.date, 10);
  const title = clean(body.title, 200);
  const source = clean(body.source, 80);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    return NextResponse.json({ ok: false, error: "Pick a valid date." }, { status: 400 });
  }
  if (title.length < 2) {
    return NextResponse.json({ ok: false, error: "Give the event a title." }, { status: 400 });
  }
  if (source.length < 2) {
    return NextResponse.json({ ok: false, error: "Say who is organising it." }, { status: 400 });
  }

  // An event can offer two or three candidate dates for registrants to
  // choose between; `date` is the first and is what the calendar pins it to.
  const extraDates = Array.isArray(body.dateOptions)
    ? body.dateOptions
        .map((d) => clean(d, 10))
        .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d)))
    : [];
  const dates = Array.from(new Set([date, ...extraDates])).sort().slice(0, 3);

  const kindInput = clean(body.kind, 20);
  const kind = (KINDS as readonly string[]).includes(kindInput) ? kindInput : "other";
  const sourceSlug = slugify(source);
  if (!sourceSlug) {
    return NextResponse.json({ ok: false, error: "Say who is organising it." }, { status: 400 });
  }

  const link = clean(body.link, 500);
  if (link && !/^https?:\/\//i.test(link)) {
    return NextResponse.json({ ok: false, error: "The link must start with http:// or https://" }, { status: 400 });
  }

  const doc = {
    date,
    dates,
    title,
    titleEn: title,
    kind,
    source,
    sourceSlug,
    // Ours by definition, so it starts as a commitment rather than a
    // proposal the team still has to triage.
    status: "go" as const,
    venue: clean(body.venue, 200),
    time: clean(body.time, 40),
    link,
    origin: "manual" as const,
    createdBy: viewer,
    createdAt: new Date(),
  };

  try {
    const db = await getDb();
    const result = await db.collection("task_events").insertOne(doc);
    return NextResponse.json({
      ok: true,
      event: {
        id: String(result.insertedId),
        date: doc.date,
        dates: doc.dates,
        title: doc.title,
        titleOriginal: doc.title,
        kind: doc.kind,
        source: doc.source,
        sourceSlug: doc.sourceSlug,
        // Only a slug the scout has already downloaded a photo for has a
        // logo on disk; a brand-new organiser shows the grey circle until
        // someone drops /public/task-logos/<slug>.jpg in.
        logo: `/task-logos/${doc.sourceSlug}.jpg`,
        status: doc.status,
        venue: doc.venue,
        time: doc.time,
        link: doc.link,
        origin: doc.origin,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
