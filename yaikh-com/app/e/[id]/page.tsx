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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function longDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default async function EventPage({ params }: { params: { id: string } }) {
  if (!ObjectId.isValid(params.id)) notFound();

  const db = await getDb();
  const event = await db.collection("task_events").findOne({ _id: new ObjectId(params.id) });
  if (!event) notFound();

  const dates: string[] =
    Array.isArray(event.dates) && event.dates.length ? event.dates : [event.date];

  return (
    <main className="min-h-screen bg-yai-blue-deep px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/yai-logo.jpg" alt="Yai" className="mb-8 h-16 w-auto rounded-lg shadow-xl" />

          {event.kind && (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-yai-orange">
              {String(event.kind)}
            </p>
          )}

          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {event.titleEn || event.title}
          </h1>

          {event.source && (
            <p className="mt-3 text-white/70">Hosted by {String(event.source)}</p>
          )}

          <dl className="mt-8 space-y-4 text-white/85">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
                {dates.length > 1 ? "Dates offered" : "Date"}
              </dt>
              <dd className="mt-1 space-y-0.5">
                {dates.map((d) => <div key={d}>{longDate(d)}</div>)}
              </dd>
            </div>

            {event.time && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-white/50">Time</dt>
                <dd className="mt-1">{String(event.time)}</dd>
              </div>
            )}

            {event.venue && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-white/50">Venue</dt>
                <dd className="mt-1">{String(event.venue)}</dd>
              </div>
            )}
          </dl>

          <a href="/" className="mt-10 inline-block text-sm font-semibold text-white/60 underline hover:text-white">
            yaikh.com
          </a>
        </div>

        <RegisterForm eventId={params.id} dates={dates} />
      </div>
    </main>
  );
}
