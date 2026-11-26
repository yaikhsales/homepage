/* PATCH /api/events/<id> — correct the Khmer title of one of our events.
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
  let titleKm = "";
  try {
    const body = await request.json();
    titleKm = typeof body?.titleKm === "string" ? body.titleKm.trim().slice(0, 300) : "";
  } catch { /* fall through */ }
  if (titleKm && !/[ក-៿]/.test(titleKm)) {
    return NextResponse.json({ ok: false, error: "That does not look like Khmer." }, { status: 400 });
  }
  const db = await getDb();
  const res = await db
    .collection("task_events")
    .updateOne({ _id: new ObjectId(params.id), origin: "manual" }, { $set: { titleKm } });
  if (!res.matchedCount) {
    return NextResponse.json({ ok: false, error: "Unknown event." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, titleKm });
}
