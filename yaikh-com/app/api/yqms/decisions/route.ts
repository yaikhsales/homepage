import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const collectionName = "yqms_decision_events";
const modes = ["first-output", "endline", "inline", "roaming", "checkout", "qa20"];
const roles = ["Factory Manager", "Quality Manager", "Senior Supervisor", "QA Supervisor"];
const noStore = { "Cache-Control": "private, no-store" };
const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status, headers: noStore });
const str = (value: unknown, max = 180) => typeof value === "string" ? value.trim().slice(0, max) : "";
function viewer() { return verifySession(cookies().get(COOKIE_NAME)?.value); }
function sameOrigin() {
  const origin = headers().get("origin");
  const host = headers().get("x-forwarded-host") || headers().get("host");
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}

export async function GET(request: Request) {
  if (!viewer()) return bad("Sign in to Yai to view the decision register.", 401);
  const mode = new URL(request.url).searchParams.get("mode");
  if (!modes.includes(mode || "")) return bad("Invalid YQMS module.");
  try {
    const db = await getDb();
    const events = await db.collection(collectionName).find({ mode }).sort({ at: -1 }).limit(500).toArray();
    return NextResponse.json({ ok: true, events: events.map(row => ({ ...row, _id: String(row._id) })) }, { headers: noStore });
  } catch (error) {
    console.error("YQMS decision read failed", error);
    return bad("Decision events are unavailable. Check the database connection.", 503);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin()) return bad("Invalid request origin.", 403);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return bad("Invalid decision event."); }
  const mode = str(body.mode), kind = str(body.kind);
  if (!modes.includes(mode)) return bad("Invalid YQMS module.");
  const token = headers().get("x-yqms-event-token");
  const trustedEvent = Boolean(process.env.YQMS_EVENT_TOKEN && token === process.env.YQMS_EVENT_TOKEN);
  const session = viewer();
  if (!session && !trustedEvent) return bad("Sign in to Yai to record a decision.", 401);
  const allowed = trustedEvent ? ["pa-notice", "big-brain-question", "big-brain-reply"] : ["decision", "corrective-action"];
  if (!allowed.includes(kind)) return bad("Invalid event type.");
  const actor = str(body.actor), summary = str(body.summary, 1500), nextAction = str(body.nextAction, 1000);
  if (!actor || !summary) return bad("Actor and event details are required.");
  const role = str(body.role), employeeId = str(body.employeeId);
  if (!trustedEvent && (!roles.includes(role) || !employeeId)) return bad("Select a manager or supervisor role and enter a YHR ID.");
  const dueAt = str(body.dueAt, 32);
  if (dueAt && Number.isNaN(Date.parse(dueAt))) return bad("Invalid next-action date.");
  const event = {
    mode, kind, source: trustedEvent ? "connected-agent" : "human", role: trustedEvent ? str(body.role) : role,
    actor, employeeId: trustedEvent ? "" : employeeId, summary, nextAction, dueAt: dueAt || null,
    mo: str(body.mo), line: str(body.line), recordId: str(body.recordId), conversationId: str(body.conversationId),
    session: session || "connected-agent", at: new Date(),
  };
  try {
    const db = await getDb();
    const result = await db.collection(collectionName).insertOne(event);
    return NextResponse.json({ ok: true, event: { ...event, _id: String(result.insertedId) } }, { status: 201, headers: noStore });
  } catch (error) {
    console.error("YQMS decision write failed", error);
    return bad("Could not save the decision event.", 503);
  }
}
