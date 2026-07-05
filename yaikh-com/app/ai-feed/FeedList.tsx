"use client";

/**
 * Interactive feed browser: Major Ai Players strip + filter chips
 * (brand / country / topic) + the story cards. Receives the server-fetched
 * items and filters client-side.
 */

import { useMemo, useState } from "react";
import type { FeedItem } from "@/lib/ai-feed";
import { AI_PLAYERS } from "@/data/ai-players";

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

const COUNTRY_FLAGS: Record<string, string> = {
  USA: "🇺🇸", China: "🇨🇳", UK: "🇬🇧", France: "🇫🇷", Japan: "🇯🇵",
  Korea: "🇰🇷", "South Korea": "🇰🇷", India: "🇮🇳", Germany: "🇩🇪",
  Cambodia: "🇰🇭", Singapore: "🇸🇬", Canada: "🇨🇦", Israel: "🇮🇱",
};

export default function FeedList({ items }: { items: FeedItem[] }) {
  const [brand, setBrand] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);

  const facets = useMemo(() => {
    const b = new Map<string, number>();
    const c = new Map<string, number>();
    const t = new Map<string, number>();
    for (const it of items) {
      it.brands?.forEach((x) => b.set(x, (b.get(x) ?? 0) + 1));
      it.countries?.forEach((x) => c.set(x, (c.get(x) ?? 0) + 1));
      it.topics?.forEach((x) => t.set(x, (t.get(x) ?? 0) + 1));
    }
    const sorted = (m: Map<string, number>) =>
      [...m.entries()].sort((a, z) => z[1] - a[1]).map(([k, n]) => ({ k, n }));
    return { brands: sorted(b), countries: sorted(c), topics: sorted(t) };
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          (!brand || it.brands?.includes(brand)) &&
          (!country || it.countries?.includes(country)) &&
          (!topic || it.topics?.includes(topic))
      ),
    [items, brand, country, topic]
  );

  const anyFilter = brand || country || topic;
  const playersInFeed = AI_PLAYERS.filter((p) => facets.brands.some((f) => f.k === p.brand));
  const hasClassification = facets.brands.length + facets.countries.length + facets.topics.length > 0;

  return (
    <>
      {/* ---- Major Ai Players strip ---- */}
      {playersInFeed.length > 0 && (
        <div className="mb-8">
          <div className="text-[10px] uppercase tracking-[0.18em] text-yai-navy/40 font-bold mb-2">
            Major Ai players in today&rsquo;s news — tap to follow one
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {playersInFeed.map((p) => (
              <div
                key={p.brand}
                role="button"
                tabIndex={0}
                onClick={() => setBrand(brand === p.brand ? null : p.brand)}
                onKeyDown={(e) => { if (e.key === "Enter") setBrand(brand === p.brand ? null : p.brand); }}
                className={`shrink-0 w-48 text-left rounded-xl border p-3 transition cursor-pointer ${
                  brand === p.brand
                    ? "border-yai-orange bg-yai-orange/10 shadow-orange-glow"
                    : "border-yai-border bg-white/70 hover:bg-white hover:shadow-card-hover"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{p.flag}</span>
                  <span className="font-semibold text-sm text-yai-navy leading-tight">{p.name}</span>
                </div>
                <div className="mt-1 text-[11px] text-yai-navy/50">
                  {p.country} · {p.hq}
                </div>
                <div className="mt-1 text-[11px] text-yai-navy/70 leading-snug line-clamp-2">{p.blurb}</div>
                {p.links && (
                  <div className="mt-2 flex items-center gap-2.5 text-[10px] font-semibold">
                    {p.links.site && (
                      <PlayerLink href={p.links.site} label={`${p.name} official site`}>🌐 Site</PlayerLink>
                    )}
                    {p.links.pricing && (
                      <PlayerLink href={p.links.pricing} label={`${p.name} pricing`}>💲 Fees</PlayerLink>
                    )}
                    {p.links.x && (
                      <PlayerLink href={p.links.x} label={`${p.name} on X`}>𝕏</PlayerLink>
                    )}
                    {p.links.facebook && (
                      <PlayerLink href={p.links.facebook} label={`${p.name} on Facebook`}>f</PlayerLink>
                    )}
                    {p.links.tiktok && (
                      <PlayerLink href={p.links.tiktok} label={`${p.name} on TikTok`}>♪ TikTok</PlayerLink>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- Filter chips ---- */}
      {hasClassification && (
        <div className="mb-6 space-y-2">
          <FilterRow
            label="Brand"
            options={facets.brands}
            active={brand}
            onPick={(v) => setBrand(brand === v ? null : v)}
          />
          <FilterRow
            label="Country"
            options={facets.countries}
            active={country}
            onPick={(v) => setCountry(country === v ? null : v)}
            decorate={(k) => `${COUNTRY_FLAGS[k] ?? ""} ${k}`.trim()}
          />
          <FilterRow
            label="Topic"
            options={facets.topics}
            active={topic}
            onPick={(v) => setTopic(topic === v ? null : v)}
          />
          {anyFilter && (
            <button
              onClick={() => { setBrand(null); setCountry(null); setTopic(null); }}
              className="text-[11px] text-yai-orange font-semibold hover:underline"
            >
              ✕ Clear filters ({filtered.length} of {items.length} showing)
            </button>
          )}
        </div>
      )}

      {/* ---- Cards ---- */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-yai-border p-10 text-center text-yai-navy/60">
          No stories match this filter right now — the feed refreshes every 15 minutes.
        </div>
      ) : (
        <ul className="space-y-6">
          {filtered.map((it) => (
            <FeedCard key={it.url} item={it} />
          ))}
        </ul>
      )}
    </>
  );
}

function PlayerLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className="text-yai-navy/50 hover:text-yai-orange transition whitespace-nowrap"
    >
      {children}
    </a>
  );
}

function FilterRow({
  label,
  options,
  active,
  onPick,
  decorate,
}: {
  label: string;
  options: { k: string; n: number }[];
  active: string | null;
  onPick: (v: string) => void;
  decorate?: (k: string) => string;
}) {
  if (options.length === 0) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] uppercase tracking-[0.18em] text-yai-navy/40 font-bold w-14 shrink-0">
        {label}
      </span>
      {options.map(({ k, n }) => (
        <button
          key={k}
          onClick={() => onPick(k)}
          className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
            active === k
              ? "border-yai-orange bg-yai-orange/15 text-yai-orange font-semibold"
              : "border-yai-border bg-white/60 text-yai-navy/70 hover:border-yai-orange/50"
          }`}
        >
          {decorate ? decorate(k) : k} <span className="opacity-50">{n}</span>
        </button>
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
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {item.brands?.map((b) => (
                <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-yai-navy/5 text-yai-navy/60 border border-yai-border">
                  {b}
                </span>
              ))}
              {item.countries?.map((c) => (
                <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-yai-navy/5 text-yai-navy/60 border border-yai-border">
                  {COUNTRY_FLAGS[c] ?? ""} {c}
                </span>
              ))}
              {item.topics?.map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-yai-amber/15 text-yai-navy/60 border border-yai-amber/30">
                  {t}
                </span>
              ))}
              <span className="ml-auto text-[11px] text-yai-navy/45">
                Read at {item.source} <span aria-hidden>↗</span>
              </span>
            </div>
          </div>
        </div>
      </a>
    </li>
  );
}
