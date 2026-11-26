/* POST /api/events/<id>/register — public event sign-up.
 *
 * This is the one route in the events feature with NO session gate: it is
 * what a QR code on a printed handout leads to, and the people scanning it
 * are guests, not staff. Everything it writes is therefore treated as
 * untrusted input and length-capped.
 *
 * Writes Mongo `yaikh.event_registrations`. These rows hold personal data
 * (name, and whichever of email / phone / telegram the person gave), so the
 * registry that reads them back stays behind the session gate.
 */
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTACT_METHODS = ["email", "sms", "phone", "telegram"] as const;
type ContactMethod = (typeof CONTACT_METHODS)[number];

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ ok: false, error: "Unknown event." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // Honeypot: a real person never fills a field they cannot see. Answer as if
  // it worked so a bot learns nothing from the difference.
  if (clean(body.website, 80)) {
    return NextResponse.json({ ok: true, registered: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200).toLowerCase();
  const phone = clean(body.phone, 40);
  const telegram = clean(body.telegram, 80).replace(/^@/, "");
  const chosenDate = clean(body.chosenDate, 10);
  const note = clean(body.note, 500);
  const methodInput = clean(body.contactMethod, 20);
  const contactMethod = (CONTACT_METHODS as readonly string[]).includes(methodInput)
    ? (methodInput as ContactMethod)
    : "email";

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please tell us your name." }, { status: 400 });
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "That email does not look right." }, { status: 400 });
  }

  // Whichever way they asked to be contacted, we need that detail — being
  // able to reach them is the entire point of the form.
  const missing =
    (contactMethod === "email" && !email) ||
    ((contactMethod === "sms" || contactMethod === "phone") && !phone) ||
    (contactMethod === "telegram" && !telegram);
  if (missing) {
    const need =
      contactMethod === "email" ? "an email address"
        : contactMethod === "telegram" ? "a Telegram username"
          : "a phone number";
    return NextResponse.json(
      { ok: false, error: `Please add ${need} so we can reach you that way.` },
      { status: 400 }
    );
  }

  try {
    const db = await getDb();
    const event = await db.collection("task_events").findOne({ _id: new ObjectId(params.id) });
    if (!event) {
      return NextResponse.json({ ok: false, error: "Unknown event." }, { status: 404 });
    }

    const offered: string[] =
      Array.isArray(event.dates) && event.dates.length ? event.dates : [event.date];
    // Only a date this event actually offers; otherwise fall back to its first.
    const date = offered.includes(chosenDate) ? chosenDate : offered[0];

    // One person, one place per event: a second submit with the same contact
    // detail updates the first rather than filling the registry with repeats.
    const identity = email || phone || telegram;
    await db.collection("event_registrations").updateOne(
      { eventId: params.id, identity },
      {
        $set: {
          eventId: params.id,
          eventTitle: event.title,
          identity,
          name,
          email,
          phone,
          telegram,
          contactMethod,
          chosenDate: date,
          note,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date(), status: "new" },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, registered: true, chosenDate: date });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
