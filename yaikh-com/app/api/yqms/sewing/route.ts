import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const collectionName = "yqms_sewing_checks";
const noStore = { "Cache-Control": "private, no-store" };
const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers: noStore });
const str = (value: unknown, max = 120) => typeof value === "string" ? value.trim().slice(0, max) : "";

function identity() {
  return verifySession(cookies().get(COOKIE_NAME)?.value);
}

function sameOrigin() {
  const origin = headers().get("origin");
  const host = headers().get("x-forwarded-host") || headers().get("host");
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}

function serialize(doc: Record<string, any>) {
  return { ...doc, _id: String(doc._id) };
}

export async function GET(request: Request) {
  if (!identity()) return bad("Sign in to Yai to view quality records.", 401);
  const mode = new URL(request.url).searchParams.get("mode");
  if (mode !== "first-output" && mode !== "endline") return bad("Invalid workflow.");
  try {
    const db = await getDb();
    const records = await db.collection(collectionName).find({ mode }).sort({ createdAt: -1 }).limit(500).toArray();
    return NextResponse.json({ ok: true, records: records.map(serialize) }, { headers: noStore });
  } catch (error) {
    console.error("YQMS sewing read failed", error);
    return bad("Quality records are unavailable. Check the database connection.", 503);
  }
}

export async function POST(request: Request) {
  const session = identity();
  if (!session) return bad("Sign in to Yai before saving an inspection.", 401);
  if (!sameOrigin()) return bad("Invalid request origin.", 403);
  let body: Record<string, any>;
  try { body = await request.json(); } catch { return bad("Invalid inspection data."); }
  const mode = str(body.mode);
  if (mode !== "first-output" && mode !== "endline") return bad("Invalid workflow.");
  const mo = str(body.mo), line = str(body.line), style = str(body.style);
  const inspector = str(body.inspector), employeeId = str(body.employeeId);
  if (!mo || !line || !style || !inspector || !employeeId) return bad("MO, line, style, inspector name and YHR employee ID are required.");
  const defects = Array.isArray(body.defects) ? body.defects.slice(0, 20).map((item: unknown) => str(item, 80)).filter(Boolean) : [];
  if (mode === "first-output") {
    const sample = Number(body.sample), failed = Number(body.failed);
    if (!Number.isInteger(sample) || sample < 1 || sample > 100 || !Number.isInteger(failed) || failed < 0 || failed > sample) return bad("Enter a valid startup sample and failed quantity.");
    if (!str(body.sampleRef) || !str(body.machineIds) || !str(body.operatorIds) || !str(body.machineCheck) || !str(body.skillCheck) || !str(body.measurementCheck)) return bad("Approved sample, machine IDs, operator IDs, machine, skill and measurement checks are required.");
    if (failed && !defects.length) return bad("Record defects for failed startup pieces.");
  } else {
    if (!str(body.pieceId)) return bad("Scan or enter a unique garment/bundle piece ID.");
    if (!["pass", "repair", "reject"].includes(str(body.result))) return bad("Select pass, repair or reject.");
    if (str(body.result) !== "pass" && !defects.length) return bad("Record at least one defect for a failed garment.");
    if (str(body.result) !== "pass" && (!["minor", "major", "critical"].includes(str(body.severity)) || !str(body.defectLocation))) return bad("Record defect severity and location for a failed garment.");
  }
  const now = new Date();
  const record = {
    mode, mo, line, style, color: str(body.color), size: str(body.size), shift: str(body.shift),
    inspector, employeeId, session, createdAt: now, updatedAt: now,
    defects, notes: str(body.notes, 2000), operation: str(body.operation), machine: str(body.machine),
    ...(mode === "first-output" ? {
      sample: Number(body.sample), failed: Number(body.failed), sampleRef: str(body.sampleRef),
      machineIds: str(body.machineIds, 500), operatorIds: str(body.operatorIds, 500),
      machineCheck: str(body.machineCheck), skillCheck: str(body.skillCheck), measurementCheck: str(body.measurementCheck), measurementNotes: str(body.measurementNotes, 1000),
      decision: Number(body.failed) || str(body.machineCheck) !== "pass" || str(body.skillCheck) !== "pass" || str(body.measurementCheck) !== "pass" ? "hold" : "pending-qa",
      approvalBy: "", approvalEmployeeId: "", approvedAt: null,
    } : {
      pieceId: str(body.pieceId), result: str(body.result), severity: str(body.severity), defectLocation: str(body.defectLocation),
      repairStatus: str(body.result) === "pass" ? "none" : "open",
      recheckResult: "", recheckedBy: "", recheckedAt: null,
      alertAcknowledgedBy: "", alertAcknowledgedAt: null,
    }),
  };
  try {
    const db = await getDb();
    const coll = db.collection(collectionName);
    if (mode === "endline") {
      const startup = await coll.findOne({ mode: "first-output", mo, line, style }, { sort: { createdAt: -1 } });
      if (!startup || startup.decision !== "approved") return bad("This MO, line and style need an approved first-output sewing check before end-line records can be saved.", 409);
      await coll.createIndex({ mode: 1, mo: 1, line: 1, pieceId: 1 }, { unique: true, partialFilterExpression: { mode: "endline" } });
    }
    const saved = await coll.insertOne(record);
    return NextResponse.json({ ok: true, record: serialize({ ...record, _id: saved.insertedId }) }, { status: 201, headers: noStore });
  } catch (error: any) {
    if (error?.code === 11000) return bad("That garment ID is already recorded for this MO and line. Open it for reinspection instead.", 409);
    console.error("YQMS sewing save failed", error);
    return bad("Could not save the inspection. Try again.", 503);
  }
}

export async function PATCH(request: Request) {
  const session = identity();
  if (!session) return bad("Sign in to Yai before updating an inspection.", 401);
  if (!sameOrigin()) return bad("Invalid request origin.", 403);
  let body: Record<string, any>;
  try { body = await request.json(); } catch { return bad("Invalid update data."); }
  if (!ObjectId.isValid(str(body.id))) return bad("Invalid record ID.");
  const action = str(body.action), employeeId = str(body.employeeId), actor = str(body.actor);
  if (!employeeId || !actor) return bad("Reviewer name and YHR employee ID are required.");
  const db = await getDb();
  const coll = db.collection(collectionName);
  const existing = await coll.findOne({ _id: new ObjectId(str(body.id)) });
  if (!existing) return bad("Inspection not found.", 404);
  const now = new Date();
  let update: Record<string, any>;
  if (action === "review" && existing.mode === "first-output") {
    const decision = str(body.decision);
    if (!["approved", "hold"].includes(decision)) return bad("Choose approved or hold.");
    if (decision === "approved" && (existing.failed || existing.machineCheck !== "pass" || existing.skillCheck !== "pass" || existing.measurementCheck !== "pass")) return bad("Failed startup checks require correction and a new first-output inspection before approval.");
    update = { decision, approvalBy: actor, approvalEmployeeId: employeeId, approvedAt: now, approvalNote: str(body.note, 500) };
  } else if (action === "recheck" && existing.mode === "endline" && existing.result !== "pass") {
    const result = str(body.result);
    if (!["pass", "repair", "reject"].includes(result)) return bad("Choose a reinspection result.");
    update = { recheckResult: result, repairStatus: result === "pass" ? "closed" : "open", recheckedBy: actor, recheckEmployeeId: employeeId, recheckedAt: now };
  } else if (action === "acknowledge" && existing.mode === "endline" && existing.result !== "pass") {
    update = { alertAcknowledgedBy: actor, alertAcknowledgedEmployeeId: employeeId, alertAcknowledgedAt: now };
  } else return bad("This update is not available for the record.");
  await coll.updateOne({ _id: existing._id }, { $set: { ...update, updatedAt: now, updatedBySession: session } });
  return NextResponse.json({ ok: true }, { headers: noStore });
}
