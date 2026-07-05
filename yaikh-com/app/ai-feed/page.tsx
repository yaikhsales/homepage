import Link from "next/link";
import { fetchAiFeed, SOURCES } from "@/lib/ai-feed";
import PodcastPlayer from "./PodcastPlayer";
import FeedList from "./FeedList";

// ISR — page rebuilds at most once every 15 min. First request after the
// window triggers a background refetch; readers always get a fast cached
// hit. No cron infra needed.
export const revalidate = 900;

export const metadata = {
  title: "Ai feed — Yai",
  description: "Live Ai news from the world's top labs and outlets.",
};

export default async function AiFeedPage() {
  const { items, errors } = await fetchAiFeed({ perSourceLimit: 5, totalLimit: 20 });

  return (
    <main className="min-h-screen bg-yai-bg text-yai-navy">
      {/* Header bar */}
      <div className="bg-yai-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-semibold hover:text-yai-orange transition">
            Yai
          </Link>
          <Link href="/" className="text-sm text-white/70 hover:text-yai-orange transition">
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-yai-orange font-bold">Ai feed</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight">
          The world&rsquo;s top <em className="text-yai-amber not-italic font-serif italic">Ai</em> news.
        </h1>
        <p className="mt-5 text-yai-navy/70 text-base md:text-lg max-w-2xl leading-relaxed">
          Live headlines from the labs and outlets shaping Ai — rewritten in the Yai
          editorial voice for factory operators. Browse by player, country or topic.
          Refreshes every 15 minutes; every card links back to the original source.
        </p>
        <SourceStrip />
      </section>

      {/* Feed */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <FeedList items={items} />

        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-yai-border p-10 text-center">
            <p className="text-yai-navy/70">
              No headlines available right now. The feed refreshes on the next request.
            </p>
          </div>
        )}

        {items.length > 0 && errors.length > 0 && (
          <p className="mt-8 text-[11px] text-yai-navy/40 text-center">
            Some sources unreachable: {errors.map((e) => e.split(":")[0]).join(", ")}
          </p>
        )}
      </section>

      {/* Floating podcast player */}
      <PodcastPlayer />
    </main>
  );
}

function SourceStrip() {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.18em] text-yai-navy/40 font-bold mr-2">
        Sources
      </span>
      {SOURCES.map((s) => (
        <span
          key={s.name}
          className="text-[11px] px-2.5 py-1 rounded-full border border-yai-border bg-white/60 text-yai-navy/70"
        >
          {s.name}
        </span>
      ))}
    </div>
  );
}
