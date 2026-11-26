/* /events — the public list of events we are running.
 *
 * This is what the Events link in the site header points at. It is NOT the
 * /task board: that one is internal, gated, and full of the Telegram scout's
 * feed. A visitor should see only the events we host and a way into the
 * sign-up form.
 *
 * Shows our own events (origin "manual") dated today or later.
 */
import Link from "next/link";
import { getDb } from "@/lib/mongo";
import { formatDateRange, formatTimeRange, cateringItems } from "@/lib/event-format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events · Yai",
  description: "Workshops, trainings and meetings hosted by Yai.",
};

export default async function EventsPage() {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  let events: Array<Record<string, unknown>> = [];
  try {
    const db = await getDb();
    events = await db
      .collection("task_events")
      .find({ origin: "manual", $or: [{ date: { $gte: iso } }, { endDate: { $gte: iso } }] })
      .sort({ date: 1 })
      .limit(100)
      .toArray();
  } catch {
    events = [];
  }

  return (
    <main className="min-h-screen bg-yai-blue-deep px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/yai-logo.jpg" alt="Yai" className="mb-8 h-14 w-auto rounded-lg shadow-xl" />

        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Events</h1>
        <p className="mt-3 text-white/70">
          Workshops, trainings and meetings we are running. Pick one to register.
        </p>

        {events.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-white/15 bg-white/5 p-8 text-white/70">
            Nothing scheduled right now. Check back soon.
          </p>
        ) : (
          <ul className="mt-10 space-y-4">
            {events.map((e) => {
              const id = String(e._id);
              const when = {
                date: String(e.date),
                endDate: e.endDate ? String(e.endDate) : undefined,
                startTime: e.startTime ? String(e.startTime) : undefined,
                endTime: e.endTime ? String(e.endTime) : undefined,
                time: e.time ? String(e.time) : undefined,
              };
              return (
                <li key={id}>
                  <Link href={`/e/${id}`}
                    className="block rounded-2xl border border-white/15 bg-white/10 p-6 transition hover:border-white/40 hover:bg-white/15">
                    {e.kind ? (
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-yai-orange">
                        {String(e.kind)}
                      </p>
                    ) : null}
                    <h2 className="text-xl font-bold text-white">{String(e.titleEn || e.title)}</h2>
                    <p className="mt-2 text-white/75">{formatDateRange(when)}</p>
                    {formatTimeRange(when) ? <p className="text-white/60">{formatTimeRange(when)}</p> : null}
                    {e.venue ? <p className="text-white/60">{String(e.venue)}</p> : null}
                    {cateringItems(e.catering).length > 0 ? (
                      <p className="mt-1 text-white/60">
                        {cateringItems(e.catering).map((c) => `${c.icon} ${c.label}`).join("   ")}
                      </p>
                    ) : null}
                    <span className="mt-4 inline-block text-sm font-bold text-white underline">
                      Register →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <Link href="/" className="mt-12 inline-block text-sm font-semibold text-white/60 underline hover:text-white">
          Back to home
        </Link>
      </div>
    </main>
  );
}
