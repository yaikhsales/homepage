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
import { backfillEventNumbers } from "@/lib/event-number";
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
    await backfillEventNumbers(db);
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
    <main className="relative min-h-screen overflow-hidden mesh-hero grain text-white px-4 py-6 sm:px-6 sm:py-10">
      <div className="relative mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/yai-logo.jpg" alt="Yai" className="h-9 w-auto rounded-md shadow" />
          <h1 className="text-2xl font-extrabold text-white">Events</h1>
        </div>

        {events.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-8 text-white/70">
            Nothing scheduled right now. Check back soon.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
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
                  <Link href={e.slug ? `/${String(e.slug)}` : `/e/${id}`}
                    className="block rounded-xl border border-white/15 bg-white/10 px-4 py-3 transition hover:border-white/40 hover:bg-white/15">
                    {e.titleKm ? (
                      <p lang="km" className="text-[15px] font-bold leading-snug text-white">{String(e.titleKm)}</p>
                    ) : null}
                    <h2 className="text-[15px] font-bold leading-snug text-white/90">
                      {String(e.titleEn || e.title)}
                    </h2>
                    {/* Same one flowing line as the event page. */}
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/80">
                      <span>📅 {formatDateRange(when)}</span>
                      {formatTimeRange(when) ? <span>🕘 {formatTimeRange(when)}</span> : null}
                      {e.venue ? <span>📍 {String(e.venue)}</span> : null}
                      {cateringItems(e.catering).length > 0 ? (
                        <span>{cateringItems(e.catering).map((c) => `${c.icon} ${c.label}`).join("  ")}</span>
                      ) : null}
                      <span className="ml-auto flex flex-col items-center rounded-full bg-yai-orange px-5 py-1.5 text-white shadow-lg">
                        <span className="text-[15px] font-bold leading-tight">Register →</span>
                        <span className="text-[10px] font-semibold leading-tight text-white/90">
                          <span lang="km">ចុះឈ្មោះ</span> · <span lang="zh">报名</span>
                        </span>
                      </span>
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-white/60 underline hover:text-white">
          Back to home
        </Link>
      </div>
    </main>
  );
}
