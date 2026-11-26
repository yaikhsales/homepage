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
import { RegisterForm } from "@/components/event/RegisterForm";
import { formatDateRange, formatTimeRange, cateringItems } from "@/lib/event-format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EventPage({ params }: { params: { id: string } }) {
  if (!ObjectId.isValid(params.id)) notFound();

  const db = await getDb();
  const event = await db.collection("task_events").findOne({ _id: new ObjectId(params.id) });
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
          <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            {event.titleEn || event.title}
          </h1>

          <div className="mt-4 space-y-1 text-white/80">
            <p>{formatDateRange(when)}</p>
            {formatTimeRange(when) && <p>{formatTimeRange(when)}</p>}
            {event.venue && <p>{String(event.venue)}</p>}
            {provided.length > 0 && (
              <p className="pt-2">
                {provided.map((c) => (
                  <span key={c.value} className="mr-4 inline-flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-lg leading-none">{c.icon}</span>
                    {c.label}
                  </span>
                ))}
              </p>
            )}
            {mapUrl && (
              <p>
                <a href={mapUrl} target="_blank" rel="noopener noreferrer"
                  className="font-semibold text-white underline hover:text-yai-orange">
                  View on map ↗
                </a>
              </p>
            )}
          </div>
        </div>

        <RegisterForm eventId={params.id} dates={dates} />
      </div>
    </main>
  );
}
