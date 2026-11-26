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
    <main className="relative min-h-screen overflow-hidden mesh-hero grain text-white px-4 py-5 sm:px-6 sm:py-16">
      <div className="relative mx-auto grid max-w-5xl gap-5 lg:grid-cols-2 lg:gap-12">
        <div>
          {/* Logo and title share one line — no stacked gap on a phone. */}
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/yai-logo.jpg" alt="Yai" className="mt-0.5 h-8 w-8 shrink-0 rounded-md object-cover shadow-lg sm:h-9 sm:w-9" />
            <h1 className="text-xl font-extrabold leading-tight text-white sm:text-3xl">
              {event.titleEn || event.title}
            </h1>
          </div>

          {/* One flowing line: icon + text pairs that only wrap as whole
              items on a narrow phone, never mid-item. */}
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-white/85">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden="true">📅</span>{formatDateRange(when)}
            </span>
            {formatTimeRange(when) && (
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span aria-hidden="true">🕘</span>{formatTimeRange(when)}
              </span>
            )}
            {event.venue && (
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span aria-hidden="true">📍</span>{String(event.venue)}
                {mapUrl && (
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer"
                    className="ml-1 font-semibold text-white underline hover:text-yai-orange">
                    map ↗
                  </a>
                )}
              </span>
            )}
            {provided.map((c) => (
              <span key={c.value} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span aria-hidden="true">{c.icon}</span>{c.label}
              </span>
            ))}
          </p>
        </div>

        <RegisterForm eventId={String(event._id)} dates={dates} />
      </div>
    </main>
  );
}
