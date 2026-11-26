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
import { RegisterForm } from "@/components/event/RegisterForm";
import { formatDateRange, formatTimeRange, cateringItems } from "@/lib/event-format";

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
    <main className="min-h-screen bg-yai-blue-deep px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/yai-logo.jpg" alt="Yai" className="mb-5 h-9 w-9 rounded-md object-cover shadow-lg" />

          <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            {event.titleEn || event.title}
          </h1>

          <ul className="mt-5 space-y-2.5 text-[15px] text-white/85">
            <li className="flex gap-3">
              <span aria-hidden="true" className="w-6 shrink-0 text-center">📅</span>
              <span>{formatDateRange(when)}</span>
            </li>
            {formatTimeRange(when) && (
              <li className="flex gap-3">
                <span aria-hidden="true" className="w-6 shrink-0 text-center">🕘</span>
                <span>{formatTimeRange(when)}</span>
              </li>
            )}
            {event.venue && (
              <li className="flex gap-3">
                <span aria-hidden="true" className="w-6 shrink-0 text-center">📍</span>
                <span>
                  {String(event.venue)}
                  {mapUrl && (
                    <a href={mapUrl} target="_blank" rel="noopener noreferrer"
                      className="ml-3 font-semibold text-white underline hover:text-yai-orange">
                      View on map ↗
                    </a>
                  )}
                </span>
              </li>
            )}
            {provided.map((c) => (
              <li key={c.value} className="flex gap-3">
                <span aria-hidden="true" className="w-6 shrink-0 text-center">{c.icon}</span>
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <RegisterForm eventId={String(event._id)} dates={dates} />
      </div>
    </main>
  );
}
