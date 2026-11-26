/* GET /api/registrations — the Event Registry feed.
 *
 * Session-gated, unlike the sign-up route that writes these rows: they hold
 * guests' names and contact details, so only signed-in staff read them back.
 *
 * Optional ?eventId=<id> narrows to one event.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { getDb } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const viewer = verifySession(cookies().get(COOKIE_NAME)?.value);
  if (!viewer) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const eventId = new URL(request.url).searchParams.get("eventId") || "";

  try {
    const db = await getDb();
    const rows = await db
      .collection("event_registrations")
      .find(eventId ? { eventId } : {})
      .sort({ createdAt: -1 })
      .limit(1000)
      .toArray();

    const registrations = rows.map((r) => ({
      id: String(r._id),
      eventId: r.eventId,
      eventTitle: r.eventTitle || "",
      name: r.name || "",
      email: r.email || "",
      phone: r.phone || "",
      telegram: r.telegram || "",
      contactMethod: r.contactMethod || "email",
      chosenDate: r.chosenDate || "",
      note: r.note || "",
      status: r.status || "new",
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : "",
    }));

    return NextResponse.json({ ok: true, count: registrations.length, registrations });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
