"use client";

import Link from "next/link";

/* Starter posts — real content lands in a follow-up pass.
 * Structure kept generic (date · tag · title · lede) so any future
 * source (Substack, RSS, internal CMS) can hydrate this shape. */
type FeedPost = {
  date: string;
  tag: string;
  title: string;
  lede: string;
  href?: string;
};

const POSTS: FeedPost[] = [
  {
    date: "Coming soon",
    tag: "Introducing",
    title: "The Yai Ai feed — what to expect",
    lede:
      "Field notes from Cambodia's first Ai-Native manufacturing platform. Product updates, agent behaviour, lessons from the factory floor, and the model choices behind them.",
  },
];

export default function AiFeedPage() {
  return (
    <main className="min-h-screen bg-yai-bg text-yai-navy">
      {/* Header bar — mirrors /subscribe */}
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
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-yai-orange font-bold">
          Ai feed
        </p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight">
          Field notes from the <em className="text-yai-amber not-italic font-serif italic">Ai-Native</em> factory.
        </h1>
        <p className="mt-5 text-yai-navy/70 text-base md:text-lg max-w-2xl leading-relaxed">
          Product updates, agent behaviour, model choices and lessons from
          Cambodia's first Ai-Native Manufacturing Intelligence Platform.
        </p>
      </section>

      {/* Feed list */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <ul className="divide-y divide-yai-border">
          {POSTS.map((p, i) => (
            <li key={i} className="py-8">
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-yai-navy/50 font-bold">
                <span>{p.date}</span>
                <span className="w-1 h-1 rounded-full bg-yai-navy/30" />
                <span className="text-yai-orange">{p.tag}</span>
              </div>
              <h2 className="mt-3 font-serif text-2xl md:text-3xl leading-snug">
                {p.href ? (
                  <Link href={p.href} className="hover:text-yai-orange transition">
                    {p.title}
                  </Link>
                ) : (
                  p.title
                )}
              </h2>
              <p className="mt-3 text-yai-navy/70 leading-relaxed">{p.lede}</p>
            </li>
          ))}
        </ul>

        {/* Placeholder call-out for the empty state */}
        <div className="mt-6 rounded-2xl border border-dashed border-yai-border p-8 text-center text-yai-navy/55">
          <p className="text-sm">
            More posts are on the way. Want the feed in your inbox?{" "}
            <a href="mailto:gamini@yaikh.com" className="text-yai-orange hover:underline">
              gamini@yaikh.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
