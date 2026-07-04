import Link from "next/link";
import { fetchAiFeed, SOURCES, type FeedItem } from "@/lib/ai-feed";
import PodcastPlayer from "./PodcastPlayer";

// ISR — page rebuilds at most once every 15 min. First request after the
// window triggers a background refetch; readers always get a fast cached
// hit. No cron infra needed.
export const revalidate = 900;

export const metadata = {
  title: "Ai feed — Yai",
  description: "Live Ai news from the world's top labs and outlets.",
};

function relativeTime(ms: number): string {
  if (!ms) return "";
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(ms).toISOString().slice(0, 10);
}

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
          editorial voice for factory operators. Refreshes every 15 minutes; every
          card links back to the original source.
        </p>
        <SourceStrip />
      </section>

      {/* Feed */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <PodcastPlayer />
        {items.length === 0 ? (
          <EmptyState errors={errors} />
        ) : (
          <ul className="space-y-6">
            {items.map((it) => (
              <FeedCard key={it.url} item={it} />
            ))}
          </ul>
        )}

        {items.length > 0 && errors.length > 0 && (
          <p className="mt-8 text-[11px] text-yai-navy/40 text-center">
            Some sources unreachable: {errors.map((e) => e.split(":")[0]).join(", ")}
          </p>
        )}
      </section>
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

function FeedCard({ item }: { item: FeedItem }) {
  return (
    <li>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-2xl border border-yai-border bg-white/70 hover:bg-white hover:shadow-card-hover transition-all overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 md:shrink-0 bg-yai-navy/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image ?? undefined}
              alt=""
              loading="lazy"
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
          <div className="p-5 md:p-6 flex-1 min-w-0">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] font-bold">
              <span className="text-yai-orange">{item.source}</span>
              <span className="w-1 h-1 rounded-full bg-yai-navy/30" />
              <span className="text-yai-navy/50">{relativeTime(item.publishedAt)}</span>
              {item.rewritten && (
                <>
                  <span className="w-1 h-1 rounded-full bg-yai-navy/30" />
                  <span className="text-yai-amber" title={item.originalTitle}>Yai edit</span>
                </>
              )}
            </div>
            <h2 className="mt-2 font-serif text-xl md:text-2xl leading-snug group-hover:text-yai-orange transition-colors">
              {item.title}
            </h2>
            {item.summary && (
              <p className="mt-2 text-yai-navy/70 text-sm md:text-[15px] leading-relaxed line-clamp-3">
                {item.summary}
              </p>
            )}
            <p className="mt-3 text-[11px] text-yai-navy/45">
              Read at {item.source} <span aria-hidden>↗</span>
            </p>
          </div>
        </div>
      </a>
    </li>
  );
}

function EmptyState({ errors }: { errors: string[] }) {
  return (
    <div className="rounded-2xl border border-dashed border-yai-border p-10 text-center">
      <p className="text-yai-navy/70">
        No headlines available right now. The feed refreshes on the next request.
      </p>
      {errors.length > 0 && (
        <p className="mt-3 text-[11px] text-yai-navy/40">
          {errors.length} source{errors.length === 1 ? "" : "s"} unreachable.
        </p>
      )}
    </div>
  );
}
