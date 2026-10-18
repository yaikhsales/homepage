import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/auth";

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

type SourceItem = {
  title?: unknown;
  url?: unknown;
  source?: unknown;
  publishedAt?: unknown;
  category?: unknown;
  detail?: unknown;
  topic?: unknown;
};

function dayInPhnomPenh(value: unknown): string | null {
  const date = value instanceof Date ? value : new Date(value as string | number);
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

  const feedUrl = process.env.NEWSROOM_FEED_URL;
  const feedToken = process.env.NEWSROOM_FEED_TOKEN;
  if (!feedUrl || !feedToken) {
    return NextResponse.json({ ok: false, error: "Newsroom source is not connected." }, { status: 503 });
  }

  try {
    const response = await fetch(feedUrl, {
      headers: { Authorization: `Bearer ${feedToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Newsroom feed returned ${response.status}`);
    const payload = await response.json() as { ok?: boolean; items?: SourceItem[] };
    if (!payload.ok || !Array.isArray(payload.items)) throw new Error("Newsroom feed response was invalid");

    const items = payload.items.map((doc): NewsItem | null => {
      const title = String(doc.title ?? "").trim();
      const url = validStoryUrl(doc.url);
      // Use the original publish time; a later archive/refresh must not move
      // the story to a different calendar day.
      const date = dayInPhnomPenh(doc.publishedAt);
      const category = String(doc.category ?? "Newsroom").trim();
      const detail = String(doc.detail ?? "").trim();
      const topic = String(doc.topic ?? "").trim();
      const label = category === "AI FUNDING" ? `AI ${topic || "NEWS"}` : category;
      if (!title || !url || !date) return null;
      return { title, category: detail ? `${category} · ${detail}` : category, source: String(doc.source ?? "").trim(), url, start: date, end: nextDay(date), label };
    }).filter((item): item is NewsItem => item !== null)
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
