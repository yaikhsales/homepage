import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const collectionName = "yqms_sewing_station_checks";
const validModes = ["inline", "roaming", "checkout", "qa20"];
const noStore = { "Cache-Control": "private, no-store" };
const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers: noStore });
const str = (value: unknown, max = 120) => typeof value === "string" ? value.trim().slice(0, max) : "";
const serialize = (row: Record<string, any>) => ({ ...row, _id: String(row._id) });

function viewer() { return verifySession(cookies().get(COOKIE_NAME)?.value); }
function floorViewer(mode: string) {
  const value = verifySession(cookies().get("yqms_floor_session")?.value);
  if (!value) return null;
  const [scope, allowed, expiry] = value.split(":");
  return scope === "yqms-floor" && allowed === mode && Number(expiry) > Date.now() ? `Floor pad · ${mode}` : null;
}
function sameOrigin() {
  const origin = headers().get("origin");
  const host = headers().get("x-forwarded-host") || headers().get("host");
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}

export async function GET(request: Request) {
  const session = viewer();
  if (!session) return bad("Sign in to Yai to view quality records.", 401);
  const mode = new URL(request.url).searchParams.get("mode");
  if (!validModes.includes(mode || "")) return bad("Invalid sewing workflow.");
  try {
    const db = await getDb();
    const records = await db.collection(collectionName).find({ mode }).sort({ createdAt: -1 }).limit(500).toArray();
    return NextResponse.json({ ok: true, viewer: session, records: records.map(serialize) }, { headers: noStore });
  } catch (error) {
    console.error("YQMS sewing station read failed", error);
    return bad("Quality records are unavailable. Check the database connection.", 503);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin()) return bad("Invalid request origin.", 403);
  let body: Record<string, any>;
  try { body = await request.json(); } catch { return bad("Invalid inspection data."); }
  const mode = str(body.mode);
  if (!validModes.includes(mode)) return bad("Invalid sewing workflow.");
  const session = viewer() || floorViewer(mode);
  if (!session) return bad("Sign in to the floor pad or Yai before saving an inspection.", 401);
  const mo = str(body.mo), line = str(body.line), style = str(body.style);
  const inspector = str(body.inspector), employeeId = str(body.employeeId);
  if (!mo || !line || !style || !inspector || !employeeId) return bad("MO, line, style, inspector and YHR employee ID are required.");
  const now = new Date();
  const common = { mode, mo, line, style, inspector, employeeId, shift: str(body.shift) || "Day", session, createdAt: now, updatedAt: now, history: [{ action: "created", actor: inspector, employeeId, at: now }] };
  try {
    const db = await getDb();
    const coll = db.collection<any>(collectionName);
    let record: Record<string, any>;
    if (mode === "checkout") {
      const pieceIds = Array.isArray(body.pieceIds) ? body.pieceIds.slice(0, 50).map((item: unknown) => str(item, 80)).filter(Boolean) : [];
      if (!pieceIds.length || pieceIds.length !== new Set(pieceIds).size) return bad("Enter unique released garment IDs, up to 50 per handoff.");
      const receiver = str(body.receiver), destination = str(body.destination);
      if (!receiver || !destination) return bad("Receiver and destination are required.");
      const source = await db.collection("yqms_sewing_checks").find({ mode: "endline", mo, line, style, pieceId: { $in: pieceIds } }).toArray();
      const released = new Set(source.filter(row => row.result === "pass" || row.recheckResult === "pass").map(row => row.pieceId));
      const blocked = pieceIds.filter(id => !released.has(id));
      if (blocked.length) return bad(`These garments have no released end-line QC record: ${blocked.slice(0, 8).join(", ")}.`, 409);
      await coll.createIndex({ mode: 1, mo: 1, line: 1, pieceIds: 1 }, { unique: true, partialFilterExpression: { mode: "checkout" } });
      record = { ...common, pieceIds, quantity: pieceIds.length, receiver, destination, bundleId: str(body.bundleId), notes: str(body.notes, 1000), status: "released" };
    } else {
      const sample = Number(body.sample), failed = Number(body.failed);
      if (!Number.isInteger(sample) || sample < 1 || sample > 100 || !Number.isInteger(failed) || failed < 0 || failed > sample) return bad("Enter valid checked and failed quantities.");
      if (mode === "qa20" && sample !== 20) return bad("A 20pcs QA audit must inspect exactly 20 pieces.");
      const defects = Array.isArray(body.defects) ? body.defects.slice(0, 20).map((item: unknown) => str(item, 80)).filter(Boolean) : [];
      if (failed && !defects.length) return bad("Record defects when pieces fail.");
      const severity = str(body.severity);
      if (failed && !["minor", "major", "critical"].includes(severity)) return bad("Select defect severity.");
      record = { ...common, sample, failed, defects, severity, operation: str(body.operation), machine: str(body.machine), operatorId: str(body.operatorId), notes: str(body.notes, 1000), status: failed ? "action-needed" : "pass", correctiveAction: "", reviewedBy: "", reviewedEmployeeId: "" };
    }
    const saved = await coll.insertOne(record);
    return NextResponse.json({ ok: true, record: serialize({ ...record, _id: saved.insertedId }) }, { status: 201, headers: noStore });
  } catch (error: any) {
    if (error?.code === 11000) return bad("One or more garments have already been checked out for this MO and line.", 409);
    console.error("YQMS sewing station save failed", error);
    return bad("Could not save this quality record. Try again.", 503);
  }
}

export async function PATCH(request: Request) {
  const session = viewer();
  if (!session) return bad("Sign in to Yai to modify quality records.", 401);
  if (!sameOrigin()) return bad("Invalid request origin.", 403);
  let body: Record<string, any>;
  try { body = await request.json(); } catch { return bad("Invalid update data."); }
  const id = str(body.id), actor = str(body.actor), employeeId = str(body.employeeId), note = str(body.note, 1000);
  if (!ObjectId.isValid(id) || !actor || !employeeId || !note) return bad("Record ID, reviewer, YHR ID and note are required.");
  const db = await getDb();
  const coll = db.collection<any>(collectionName);
  const existing = await coll.findOne({ _id: new ObjectId(id) });
  if (!existing) return bad("Inspection not found.", 404);
  const now = new Date();
  const status = existing.mode === "checkout" ? "reviewed" : str(body.status);
  if (existing.mode !== "checkout" && !["action-needed", "resolved", "pass"].includes(status)) return bad("Select a valid review status.");
  await coll.updateOne({ _id: existing._id }, { $set: { status, correctiveAction: note, reviewedBy: actor, reviewedEmployeeId: employeeId, updatedAt: now, updatedBySession: session }, $push: { history: { action: status, actor, employeeId, note, at: now } } } as any);
  return NextResponse.json({ ok: true }, { headers: noStore });
}
