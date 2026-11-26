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
          <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            {event.titleEn || event.title}
          </h1>

          <div className="mt-4 space-y-1 text-white/80">
            <p>{dates.map(longDate).join("  ·  ")}</p>
            {event.time && <p>{String(event.time)}</p>}
            {event.venue && <p>{String(event.venue)}</p>}
          </div>
        </div>

        <RegisterForm eventId={params.id} dates={dates} />
      </div>
    </main>
  );
}
