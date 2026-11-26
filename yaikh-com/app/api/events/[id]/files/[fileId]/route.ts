/* GET    /api/events/<id>/files/<fileId> — open a handout or slides file.
 *        Handouts are public. Slides are public only inside the event's
 *        window (first day → 7 days after the last); staff always.
 * DELETE /api/events/<id>/files/<fileId> — remove it (staff only). */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { r2Get, r2Delete } from "@/lib/r2";
import { slidesWindow, type EventFile } from "@/lib/event-files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function load(id: string, fileId: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const event = await db.collection("task_events").findOne(
    { _id: new ObjectId(id), origin: "manual" },
    { projection: { files: 1, date: 1, endDate: 1 } }
  );
  if (!event) return null;
  const file = (Array.isArray(event.files) ? (event.files as EventFile[]) : []).find((f) => f.id === fileId);
  return file ? { db, event, file } : null;
}

export async function GET(_req: Request, { params }: { params: { id: string; fileId: string } }) {
  const found = await load(params.id, params.fileId);
  if (!found) return new NextResponse("Not found", { status: 404 });
  const { event, file } = found;

  if (file.kind === "slides") {
    const staff = verifySession(cookies().get(COOKIE_NAME)?.value);
    const w = slidesWindow(String(event.date), event.endDate ? String(event.endDate) : undefined);
    if (!staff && !w.open) {
      return new NextResponse(
        today_before(w.opensOn) ? `Slides open on ${w.opensOn}.` : "These slides are no longer available.",
        { status: 403, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  const upstream = await r2Get(file.key);
  if (!upstream.ok || !upstream.body) return new NextResponse("File unavailable", { status: 502 });
  return new Response(upstream.body, {
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": `inline; filename="${file.name.replace(/["\r\n]/g, "_")}"`,
      "X-Content-Type-Options": "nosniff",
      // Slides can lock again, so they are never cached; handouts are stable.
      "Cache-Control": file.kind === "slides" ? "private, no-store" : "public, max-age=3600",
    },
  });
}

function today_before(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Phnom_Penh" }).format(new Date()) < iso;
}

export async function DELETE(_req: Request, { params }: { params: { id: string; fileId: string } }) {
  if (!verifySession(cookies().get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const found = await load(params.id, params.fileId);
  if (!found) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  await found.db.collection("task_events").updateOne(
    { _id: new ObjectId(params.id) },
    { $pull: { files: { id: params.fileId } } } as never
  );
  await r2Delete(found.file.key).catch(() => {});
  return NextResponse.json({ ok: true });
}
