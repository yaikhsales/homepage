"use client";

/**
 * Sales process flow — populates the body of GTM Enabler bar 03
 * (Clear sales & promotion steps).
 *
 * Primary funnel: printed invitation → weekly online demo → on-site in-person →
 * package commitment ($120 / $750 / $1,000+).
 *
 * Parallel channels: government top-down, app user funnel, word-of-mouth from
 * old staff network, non-garment expansion via admin modules.
 */

type Step = {
  num: string;
  title: string;
  detail: string;
  meta: string;
  color: string;
};

const STEPS: Step[] = [
  {
    num: "01",
    title: "Printed invitation",
    detail: "Physically delivered to companies + ministries. Old-school in a relationship-first market — signals seriousness.",
    meta: "Top-of-funnel · zero-cost trust signal",
    color: "#1E4DAA",
  },
  {
    num: "02",
    title: "Weekly online demo · 15–20 min",
    detail: "Recurring slot — owner / decision-maker joins from their office. Walks through platform functions live, no slides.",
    meta: "Same cadence every week · removes scheduling friction",
    color: "#F37021",
  },
  {
    num: "03",
    title: "On-site in-person presentation",
    detail: "Sales team visits the factory. Demo on real data + walkthrough on the actual floor. This is where mindset shifts.",
    meta: "2nd touch · physical presence beats Zoom",
    color: "#0A3327",
  },
  {
    num: "04",
    title: "Package commitment",
    detail: "Starts at the entry tier and scales up as conviction grows. Higher tiers are the company's choice, not ours to push.",
    meta: "$120 / $750 / $1,000+ ladder",
    color: "#D4A017",
  },
];

const PACKAGES = [
  { price: "$120 / yr",  tier: "Cloud Starter",   for: "Admin-only · entry-level commitment" },
  { price: "$750 / yr",  tier: "Cloud Growth",    for: "Mid-size factory · admin + early ops" },
  { price: "$1,000+/yr", tier: "Cloud Enterprise", for: "Full stack — company picks how far they go" },
];

type Channel = {
  tag: string;
  title: string;
  desc: string;
  metric?: string;
  color: string;
};

const CHANNELS: Channel[] = [
  {
    tag: "GOV TOP-DOWN",
    title: "Ministry → factories (pull-through)",
    desc: "Approach ministries directly (Environment first, then Labour, Industry, Telecom). Get them to use Yai functions — often free at the ministry level. Ministry then pushes adoption down to factories under their oversight.",
    metric: "Free at ministry → paid at factory",
    color: "#1E4DAA",
  },
  {
    tag: "APP",
    title: "Worker-app user growth",
    desc: "Currently ~2,500 worker-app users. Target = 100,000. Once that base lands, unlock marketplace + e-commerce + P2P functions — revenue per app user grows automatically.",
    metric: "2,500 → 100,000 users",
    color: "#0A3327",
  },
  {
    tag: "WORD OF MOUTH",
    title: "Old staff bringing friends",
    desc: "Existing team members reaching out to their factory-network friends. Highest-trust channel in Cambodia. Zero CAC.",
    metric: "Zero CAC · highest trust",
    color: "#10B981",
  },
  {
    tag: "NON-GARMENT",
    title: "Cross-industry — admin modules only",
    desc: "Hospitality, food, logistics, services companies use just the admin layer: Accounting, HR, Payroll, Purchase, Shop, App. Same platform, different vertical.",
    metric: "Admin SKU · industry-agnostic",
    color: "#6D4FB6",
  },
  {
    tag: "EVENTS · MEDIA",
    title: "Expos, public speaking, social — slow ramp",
    desc: "Intentionally measured. Not every module is production-tested yet. Volume scales as more of the platform is hardened and ready to demo at scale.",
    metric: "Deliberate slow phase",
    color: "#F37021",
  },
];

export function SalesProcessFlow() {
  return (
    <div className="space-y-5">
      {/* Primary funnel — 4 steps */}
      <div>
        <h5 className="font-extrabold text-yai-navy text-sm mb-2">Primary funnel — 4 steps</h5>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {STEPS.map((s, i) => (
            <li key={s.num} className="relative">
              <div
                className="h-full rounded-lg border border-yai-border bg-white p-3"
                style={{ borderLeftWidth: 4, borderLeftColor: s.color }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white font-extrabold text-[10px]"
                    style={{ background: s.color }}
                  >
                    {s.num}
                  </span>
                  <div className="text-[12px] font-extrabold text-yai-navy leading-tight">
                    {s.title}
                  </div>
                </div>
                <div className="text-[11px] text-gray-700 leading-snug mb-1.5">{s.detail}</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: s.color }}>
                  {s.meta}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-1.5 -translate-y-1/2 text-gray-400 text-lg font-bold">
                  →
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Package ladder */}
      <div>
        <h5 className="font-extrabold text-yai-navy text-sm mb-2">Package ladder · entry then scale</h5>
        <ul className="grid sm:grid-cols-3 gap-2">
          {PACKAGES.map((p, i) => (
            <li
              key={p.tier}
              className="rounded-lg border border-yai-border bg-white p-3 text-center"
              style={{ borderTopWidth: 3, borderTopColor: i === 0 ? "#10B981" : i === 1 ? "#F37021" : "#D4A017" }}
            >
              <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                Tier {i + 1}
              </div>
              <div className="text-base font-extrabold text-yai-navy">{p.tier}</div>
              <div className="text-lg font-extrabold tabular-nums" style={{ color: i === 0 ? "#10B981" : i === 1 ? "#F37021" : "#D4A017" }}>
                {p.price}
              </div>
              <div className="text-[11px] text-gray-600 leading-snug mt-1">{p.for}</div>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-gray-500 italic mt-1.5 leading-snug">
          Start every prospect at the minimum tier. Upgrading is the customer&rsquo;s choice as
          conviction grows — we don&rsquo;t push higher tiers; we let the platform earn them.
        </p>
      </div>

      {/* Parallel channels */}
      <div>
        <h5 className="font-extrabold text-yai-navy text-sm mb-2">Parallel channels alongside the main funnel</h5>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {CHANNELS.map((c) => (
            <li
              key={c.tag}
              className="rounded-lg border border-yai-border bg-white p-3"
              style={{ borderLeftWidth: 3, borderLeftColor: c.color }}
            >
              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                <span
                  className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded text-white"
                  style={{ background: c.color }}
                >
                  {c.tag}
                </span>
                {c.metric && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold tabular-nums" style={{ color: c.color }}>
                    {c.metric}
                  </span>
                )}
              </div>
              <div className="text-[12px] font-bold text-yai-navy leading-tight mb-1">{c.title}</div>
              <div className="text-[11px] text-gray-600 leading-snug">{c.desc}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Current-phase footer */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900 leading-snug">
        <strong>Current phase note:</strong> several modules are still in production-test. Public
        ramp (events, expos, public speaking, social media) is intentionally slow until those
        modules are hardened. Discipline now → credibility later. One step at a time.
      </div>
    </div>
  );
}
