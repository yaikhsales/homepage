import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { getNewsroomDb } from "@/lib/newsroom-mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type NewsItem = {
  title: string;
  category: string;
  source: string;
  url: string;
  start: string;
  end: string;
  label: string;
};

function dayInPhnomPenh(value: unknown): string | null {
  const date = value instanceof Date ? value : new Date(Number(value));
  if (!Number.isFinite(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Phnom_Penh", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  const y = part("year"), m = part("month"), d = part("day");
  return y && m && d ? `${y}-${m}-${d}` : null;
}

function validStoryUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function GET() {
  if (!verifySession(cookies().get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: "unauthorised" }, { status: 401 });
  }

  if (!process.env.NEWSROOM_MONGO_URL) {
    return NextResponse.json({ ok: false, error: "Newsroom source is not connected." }, { status: 503 });
  }

  try {
    const db = await getNewsroomDb();
    const [funding, brands, garments] = await Promise.all([
      db.collection("ai_country_items")
        .find({ relevant: { $ne: false } }, { projection: { title: 1, country: 1, topic: 1, source: 1, url: 1, publishedAt: 1, createdAt: 1 } })
        .sort({ publishedAt: -1 }).limit(300).toArray(),
      db.collection("brand_signals")
        .find({ signal: true }, { projection: { title: 1, brand: 1, source: 1, url: 1, publishedAt: 1, createdAt: 1 } })
        .sort({ publishedAt: -1 }).limit(300).toArray(),
      db.collection("garment_press_items")
        .find({}, { projection: { title: 1, source: 1, url: 1, publishedAt: 1, createdAt: 1 } })
        .sort({ publishedAt: -1 }).limit(300).toArray(),
    ]);

    const toItem = (doc: Record<string, unknown>, category: string, label: string): NewsItem | null => {
      const title = String(doc.title ?? "").trim();
      const url = validStoryUrl(doc.url);
      // Place stories on the day they were published, not the day the daily
      // Newsroom job first archived or refreshed them.
      const date = dayInPhnomPenh(doc.publishedAt ?? doc.createdAt ?? doc.seenAt);
      if (!title || !url || !date) return null;
      return { title, category, source: String(doc.source ?? "").trim(), url, start: date, end: nextDay(date), label };
    };

    const items = [
      ...funding.map((doc) => toItem(doc, `AI FUNDING · ${String(doc.country ?? "AI news")}`, `AI ${String(doc.topic ?? "NEWS").toUpperCase()}`)),
      ...brands.map((doc) => toItem(doc, `BRAND AI · ${String(doc.brand ?? "Brand signal")}`, "BRAND AI")),
      ...garments.map((doc) => toItem(doc, `GARMENTS · ${String(doc.source ?? "Trade press")}`, "GARMENTS")),
    ].filter((item): item is NewsItem => item !== null)
      .filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index)
      .sort((a, b) => b.start.localeCompare(a.start) || a.title.localeCompare(b.title));

    return NextResponse.json({ ok: true, items }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("strategy newsroom feed failed", error);
    return NextResponse.json({ ok: false, error: "Could not load Newsroom stories." }, { status: 500 });
  }
}

function nextDay(day: string): string {
  const [year, month, date] = day.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, date + 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
}
