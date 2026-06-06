import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from "@/lib/admin";
import { readEventsStore, writeEventsStore, type EventsStore, type EventAlbum } from "@/lib/events-store";

export const runtime = "nodejs";

function getAdmin(req: Request): string | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return verifyAdminCookie(value);
}

export async function GET() {
  const store = await readEventsStore();
  return NextResponse.json(store);
}

export async function POST(req: Request) {
  const admin = getAdmin(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Not authorised" }, { status: 401 });
  }

  let body: Partial<EventsStore> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const next: EventsStore = {
    updatedAt: new Date().toISOString(),
    updatedBy: admin,
    albums: Array.isArray(body.albums)
      ? body.albums.map((a): EventAlbum => ({
          id: String(a?.id ?? `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
          date: String(a?.date ?? ""),
          title: String(a?.title ?? ""),
          description: String(a?.description ?? ""),
          category: a?.category ? String(a.category) : undefined,
          photos: Array.isArray(a?.photos) ? a.photos.filter((p): p is string => typeof p === "string" && p.length > 0) : [],
          pinned: Boolean(a?.pinned),
        }))
      : [],
  };

  await writeEventsStore(next);
  return NextResponse.json({ ok: true, store: next });
}
