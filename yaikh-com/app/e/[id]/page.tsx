/* /e/<id> — the public event page a QR code leads to.
 *
 * Deliberately outside the /task gate: the people arriving here scanned a
 * printed handout and have no access code. It shows only what an invitation
 * would show, and the sign-up form posts to the one public route in this
 * feature.
 */
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongo";
import { backfillEventNumbers } from "@/lib/event-number";
import { EventView } from "@/components/event/EventView";
import { formatTimeRange, cateringItems } from "@/lib/event-format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EventPage({ params }: { params: { id: string } }) {
  // Reached either as /e/<id> or, through the /event001 rewrite, as
  // /e/001 — digits mean a running number.
  const byNumber = /^\d{1,6}$/.test(params.id);
  if (!byNumber && !ObjectId.isValid(params.id)) notFound();

  const db = await getDb();
  const find = () =>
    db.collection("task_events")
      .findOne(byNumber ? { eventNo: Number(params.id), origin: "manual" } : { _id: new ObjectId(params.id) });
  let event = await find();
  // An event saved before running numbers existed has none until the first
  // backfill — number them now rather than 404 a printed link.
  if (!event && byNumber) {
    await backfillEventNumbers(db);
    event = await find();
  }
  if (!event) notFound();

  const dates: string[] =
    Array.isArray(event.dates) && event.dates.length ? event.dates : [event.date];

  const when = {
    date: String(event.date),
    endDate: event.endDate ? String(event.endDate) : undefined,
    startTime: event.startTime ? String(event.startTime) : undefined,
    endTime: event.endTime ? String(event.endTime) : undefined,
    time: event.time ? String(event.time) : undefined,
  };
  const provided = cateringItems(event.catering);
  const mapUrl =
    typeof event.mapUrl === "string" && /^https:\/\//i.test(event.mapUrl) ? event.mapUrl : "";

  return (
    <main className="relative min-h-screen overflow-hidden mesh-hero grain text-white px-4 py-5 sm:px-6 sm:py-16">
      <div className="relative mx-auto grid max-w-5xl gap-5 lg:grid-cols-2 lg:gap-12">
        <EventView
          ev={{
            id: String(event._id),
            title: String(event.titleEn || event.title),
            titleKm: typeof event.titleKm === "string" ? event.titleKm : "",
            date: when.date,
            endDate: when.endDate,
            time: formatTimeRange(when),
            venue: event.venue ? String(event.venue) : "",
            mapUrl,
            catering: provided.map((c) => c.value),
            dates,
          }}
        />
      </div>
    </main>
  );
}
