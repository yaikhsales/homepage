/* PATCH /api/events/<id> — set the Khmer and/or Chinese title of one of our events.
 * Session-gated, and limited to events we created (origin "manual"): the
 * scout's rows are somebody else's and are not ours to rewrite. */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { getDb } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!verifySession(cookies().get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ ok: false, error: "Unknown event." }, { status: 404 });
  }
  // Only the titles sent are changed, so saving one never blanks the other.
  const set: Record<string, string> = {};
  try {
    const body = await request.json();
    if (typeof body?.titleKm === "string") set.titleKm = body.titleKm.trim().slice(0, 300);
    if (typeof body?.titleZh === "string") set.titleZh = body.titleZh.trim().slice(0, 300);
  } catch { /* fall through */ }
  if (!Object.keys(set).length) {
    return NextResponse.json({ ok: false, error: "Nothing to save." }, { status: 400 });
  }
  if (set.titleKm && !/[ក-៿]/.test(set.titleKm)) {
    return NextResponse.json({ ok: false, error: "That does not look like Khmer." }, { status: 400 });
  }
  if (set.titleZh && !/[\u4e00-\u9fff]/.test(set.titleZh)) {
    return NextResponse.json({ ok: false, error: "That does not look like Chinese." }, { status: 400 });
  }
  const db = await getDb();
  const res = await db
    .collection("task_events")
    .updateOne({ _id: new ObjectId(params.id), origin: "manual" }, { $set: set });
  if (!res.matchedCount) {
    return NextResponse.json({ ok: false, error: "Unknown event." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, ...set });
}
