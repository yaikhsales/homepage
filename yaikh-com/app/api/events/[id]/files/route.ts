/* POST /api/events/<id>/files — attach a handout image or a slides PDF to
 * one of our events. Session-gated; our own events only. */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { randomUUID } from "node:crypto";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { r2Configured, r2Put } from "@/lib/r2";
import { FILE_RULES, sniffType, publicFile, type EventFile, type FileKind } from "@/lib/event-files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  if (!verifySession(cookies().get(COOKIE_NAME)?.value)) return bad("unauthorized", 401);
  if (!ObjectId.isValid(params.id)) return bad("Unknown event.", 404);
  if (!r2Configured()) {
    return bad("File storage is not set up yet.", 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad("Bad upload.");
  }
  const kind = String(form.get("kind") || "") as FileKind;
  const rule = FILE_RULES[kind];
  if (!rule) return bad("Unknown file kind.");
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) return bad("Choose a file.");
  if (file.size > rule.bytes) return bad(`Too big — ${rule.label} can be up to ${rule.bytes / 1024 / 1024} MB.`);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffType(bytes);
  if (!type || !rule.types.includes(type)) return bad(`That is not a ${rule.label} file.`);

  const db = await getDb();
  const _id = new ObjectId(params.id);
  const event = await db.collection("task_events").findOne({ _id, origin: "manual" }, { projection: { files: 1 } });
  if (!event) return bad("Unknown event.", 404);
  const existing: EventFile[] = Array.isArray(event.files) ? event.files : [];
  if (existing.filter((f) => f.kind === kind).length >= rule.max) {
    return bad(`This event already has ${rule.max} ${kind === "handout" ? "handouts" : "slide files"}. Remove one first.`);
  }

  const id = randomUUID();
  const ext = type === "application/pdf" ? "pdf" : type === "image/png" ? "png" : "jpg";
  const key = `events/${params.id}/${kind}/${id}.${ext}`;
  const name = file.name.replace(/[^\p{L}\p{N}._ ()-]/gu, "_").slice(0, 120) || `${kind}.${ext}`;

  try {
    await r2Put(key, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer, type);
  } catch (err) {
    return bad(err instanceof Error ? err.message : "Upload failed.", 502);
  }

  const entry: EventFile = { id, kind, name, size: file.size, type, key, at: new Date().toISOString() };
  // The kind-count guard is repeated in the update so two uploads racing
  // for the last slot cannot both land.
  const res = await db.collection("task_events").updateOne(
    { _id, origin: "manual", $expr: { $lt: [{ $size: { $filter: { input: { $ifNull: ["$files", []] }, cond: { $eq: ["$$this.kind", kind] } } } }, rule.max] } },
    { $push: { files: entry } } as never
  );
  if (!res.modifiedCount) return bad("Another upload took the last slot. Refresh and try again.", 409);

  return NextResponse.json({ ok: true, file: publicFile(entry) });
}
