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
import { randomBytes } from "crypto";
import { getDb } from "@/lib/mongo";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";

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

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please tell us your name." }, { status: 400 });
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "That email does not look right." }, { status: 400 });
  }
  if (!email && !phone && !telegram) {
    return NextResponse.json(
      { ok: false, error: "Leave an email, phone number or Telegram so we can reach you." },
      { status: 400 }
    );
  }

  // Explicit permission: which channels the person agreed to be contacted on.
  const VIA = ["email", "telegram", "phone"] as const;
  const contactVia = Array.isArray(body.contactVia)
    ? Array.from(new Set(body.contactVia.map((v) => clean(v, 20)).filter((v) => (VIA as readonly string[]).includes(v))))
    : [];
  if (contactVia.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Tick at least one way we may contact you." },
      { status: 400 }
    );
  }
  // A ticked channel is only usable if they left the detail for it.
  const lacking = contactVia.find(
    (v) => (v === "email" && !email) || (v === "telegram" && !telegram) || (v === "phone" && !phone)
  );
  if (lacking) {
    const need = lacking === "email" ? "your email" : lacking === "telegram" ? "your Telegram username" : "your phone number";
    return NextResponse.json(
      { ok: false, error: `You ticked ${lacking} — please add ${need}.` },
      { status: 400 }
    );
  }

  const contactMethod = contactVia[0] as ContactMethod;

  try {
    const db = await getDb();
    const event = await db.collection("task_events").findOne({ _id: new ObjectId(params.id) });
    if (!event) {
      return NextResponse.json({ ok: false, error: "Unknown event." }, { status: 404 });
    }

    // The days this event runs. A multi-day event must have at least one
    // ticked; only real days of the event are kept.
    const first = String(event.date);
    const last = event.endDate && String(event.endDate) > first ? String(event.endDate) : first;
    const asked = Array.isArray(body.attendDays) ? body.attendDays : chosenDate ? [chosenDate] : [];
    const attendDays = Array.from(new Set(asked.map((d: unknown) => clean(d, 10))))
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d >= first && d <= last)
      .sort();
    if (last > first && attendDays.length === 0) {
      return NextResponse.json({ ok: false, error: "Tick the day you will attend." }, { status: 400 });
    }
    if (attendDays.length === 0) attendDays.push(first);
    // One registration is one day's seat.
    attendDays.splice(1);
    const date = attendDays[0];

    // One person, one place per event: a second submit with the same contact
    // detail updates the first rather than filling the registry with repeats.
    const identity = email || phone || telegram;
    const regs = db.collection("event_registrations");

    // Check-in code: four letters, unique within this event, kept if the
    // same person registers again so a card already saved stays valid.
    // No I or O, which read as 1 and 0 at the door.
    const existing = await regs.findOne({ eventId: params.id, identity }, { projection: { checkInCode: 1 } });
    let checkInCode = typeof existing?.checkInCode === "string" ? existing.checkInCode : "";
    for (let i = 0; !checkInCode && i < 20; i++) {
      const bytes = randomBytes(4);
      const code = Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
      if (!(await regs.findOne({ eventId: params.id, checkInCode: code }, { projection: { _id: 1 } }))) {
        checkInCode = code;
      }
    }
    if (!checkInCode) throw new Error("Could not make a check-in code. Please try again.");

    await regs.updateOne(
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
          contactVia,
          chosenDate: date,
          attendDays,
          note,
          checkInCode,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date(), status: "new" },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, registered: true, attendDays, checkInCode, name });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
