"use client";

import { AnimatePresence, LayoutGroup, motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LangProvider, useLang, type Lang } from "./i18n";

/* yaikh.com home — modern, partner-review optimised single-page scroll.
 * Sections: Nav · Hero · Audience router · 3-layer story · Customers ·
 * Partner stack · Pricing tease · Impact (JICA) · CTA · Footer.
 *
 * Designed so an Anthropic / Google Cloud / JICA reviewer can find their
 * relevance signals within 10 seconds. AI agents crawling the page read
 * the JSON-LD in layout.tsx + the semantic HTML here. */

export default function Home() {
  return (
    <LangProvider>
      <main className="overflow-x-hidden">
        <Nav />
        <Hero />
        <LayerStory />
        <CustomersStrip />
        <PartnerStack />
        <PricingTease />
        <Impact />
        <CTA />
        <Footer />
      </main>
    </LangProvider>
  );
}

/* ─────────────── NAV ─────────────── */
function Nav() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [partnersOpen, setPartnersOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/85 backdrop-blur-md border-b border-black/5" : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1600px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        {/* LEFT — logo + slogan + main nav links */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          <a href="#top" aria-label="Yai · home" className="flex items-center gap-3.5 shrink-0">
            <Image
              src="/images/yai-logo.jpg"
              alt="Yai"
              width={1280}
              height={1280}
              priority
              unoptimized
              className="w-14 h-14 rounded-full drop-shadow-lg shrink-0"
            />
            <span className={`hidden sm:block leading-tight transition-colors ${scrolled ? "text-yai-navy" : "text-white"}`}>
              <span className="block font-serif font-semibold text-[15px] tracking-tight">
                {t("slogan1")}
              </span>
              <span className="block text-[12px] font-semibold tracking-tight max-w-[24ch] mt-0.5">
                {t("slogan2")}
              </span>
            </span>
          </a>
          <div
            className={`hidden lg:flex items-center gap-6 text-[13px] font-semibold transition-colors ${
              scrolled ? "text-yai-navy/80" : "text-white/90"
            }`}
          >
            <a href="#product"   className="hover:text-yai-orange transition">{t("nav.product")}</a>
            <a href="#customers" className="hover:text-yai-orange transition">{t("nav.customers")}</a>
            {/* Partners — click opens a small submenu with Portal */}
            <div className="relative" onMouseLeave={() => setPartnersOpen(false)}>
              <button
                type="button"
                onClick={() => setPartnersOpen((v) => !v)}
                className="hover:text-yai-orange transition inline-flex items-center gap-1"
                aria-expanded={partnersOpen}
                aria-haspopup="menu"
              >
                {t("nav.partners")}
                <svg viewBox="0 0 12 12" className={`w-2.5 h-2.5 transition-transform ${partnersOpen ? "rotate-180" : ""}`} fill="currentColor">
                  <path d="M2 4l4 4 4-4z" />
                </svg>
              </button>
              {partnersOpen && (
                <div role="menu" className="absolute left-0 top-full pt-3 min-w-[120px]">
                  {/* Transparent submenu — inherits the nav's text colour,
                      only the word Portal shows. */}
                  <a
                    href="https://yai-plan-production.up.railway.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    onClick={() => setPartnersOpen(false)}
                    className="block text-[13px] font-semibold hover:text-yai-orange transition whitespace-nowrap"
                  >
                    {t("nav.portal")} <span aria-hidden className="opacity-50">↗</span>
                  </a>
                </div>
              )}
            </div>
            <a href="#pricing"   className="hover:text-yai-orange transition">{t("nav.pricing")}</a>
            <a href="#impact"    className="hover:text-yai-orange transition">{t("nav.flashcards")}</a>
            <a href="#impact"    className="hover:text-yai-orange transition">{t("nav.experience")}</a>
            <a href="#contact"   className="hover:text-yai-orange transition">{t("nav.chat")}</a>
          </div>
        </div>

        {/* RIGHT — language flags + Login button */}
        <div className="flex items-center gap-3 shrink-0">
          <LangFlags scrolled={scrolled} />
          <a
            href="https://yai-plan-production.up.railway.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center px-5 py-2 rounded-full bg-yai-orange text-white hover:bg-yai-orange/90 transition shadow-lg leading-[1.1]"
          >
            <span className="block text-[14px] font-bold">{t("nav.login")}</span>
            <span className="block text-[9px] uppercase tracking-[0.18em] font-semibold opacity-90 mt-0.5">
              {t("nav.loginSub")}
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
}

/* ─────────────── LANGUAGE FLAGS ───────────────
 * Six round 3D flag buttons — Khmer, English, Chinese, Japanese, Bengali, Hindi.
 * 32px round, glossy domed look, lift on hover. Smaller than the Login pill
 * (~56px) so Login stays the primary CTA weight. */
function LangFlags({ scrolled }: { scrolled: boolean }) {
  const { lang, setLang } = useLang();
  const langs: Array<{ code: Lang; label: string; svg: React.ReactNode }> = [
    { code: "km", label: "ខ្មែរ · Khmer",       svg: <FlagKH /> },
    { code: "en", label: "English",              svg: <FlagGB /> },
    { code: "zh", label: "中文 · Chinese",       svg: <FlagCN /> },
    { code: "ja", label: "日本語 · Japanese",    svg: <FlagJP /> },
    { code: "ko", label: "한국어 · Korean",       svg: <FlagKR /> },
    { code: "bn", label: "বাংলা · Bengali",     svg: <FlagBD /> },
    { code: "hi", label: "हिन्दी · Hindi",       svg: <FlagIN /> },
  ];
  return (
    <div className="hidden md:flex items-center gap-1.5">
      {langs.map((l) => (
        <button
          key={l.code}
          type="button"
          title={l.label}
          aria-label={`Switch to ${l.label}`}
          aria-pressed={lang === l.code}
          onClick={() => setLang(l.code)}
          className={`group relative w-8 h-8 rounded-full overflow-hidden transition-all hover:-translate-y-0.5 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yai-amber ${
            lang === l.code ? "ring-2 ring-yai-amber scale-110" : ""
          }`}
          style={{
            // 3D domed button: drop shadow + amber ring outline
            boxShadow: scrolled
              ? "0 2px 5px rgba(10,31,71,0.35), 0 0 0 1px rgba(10,31,71,0.15)"
              : "0 3px 8px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.55)",
          }}
        >
          {/* Flag artwork */}
          <span className="absolute inset-0 block rounded-full overflow-hidden">
            {l.svg}
          </span>
          {/* Glossy top highlight (the "dome" effect) */}
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 18%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 35%, transparent 60%)",
            }}
          />
          {/* Inset rim shadow — gives the button its rim/edge */}
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.35)",
            }}
          />
          {/* Hover ring */}
          <span className="absolute inset-0 rounded-full pointer-events-none ring-0 group-hover:ring-2 ring-yai-amber transition-all" />
        </button>
      ))}
    </div>
  );
}

/* ─── tiny round-clipped flag SVGs (no external assets needed) ─── */
function FlagKH() {
  return (
    /* Real Cambodia flag PNG — the proper Angkor Wat silhouette + correct
       blue / red proportions, far cleaner than the hand-drawn SVG. */
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/images/flag-kh.png"
      alt=""
      className="w-full h-full object-cover"
      draggable={false}
    />
  );
}
function FlagGB() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <defs><clipPath id="gb"><circle cx="30" cy="30" r="30" /></clipPath></defs>
      <g clipPath="url(#gb)">
        <rect width="60" height="60" fill="#012169" />
        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#fff" strokeWidth="10" />
        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 V60 M0,30 H60" stroke="#fff" strokeWidth="14" />
        <path d="M30,0 V60 M0,30 H60" stroke="#C8102E" strokeWidth="8" />
      </g>
    </svg>
  );
}
function FlagCN() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <defs><clipPath id="cn"><circle cx="30" cy="30" r="30" /></clipPath></defs>
      <g clipPath="url(#cn)">
        <rect width="60" height="60" fill="#DE2910" />
        <Star cx={15} cy={15} r={6} />
        <Star cx={26} cy={8} r={2.2} />
        <Star cx={31} cy={14} r={2.2} />
        <Star cx={31} cy={22} r={2.2} />
        <Star cx={26} cy={28} r={2.2} />
      </g>
    </svg>
  );
}
function FlagJP() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <defs><clipPath id="jp"><circle cx="30" cy="30" r="30" /></clipPath></defs>
      <g clipPath="url(#jp)">
        <rect width="60" height="60" fill="#fff" />
        <circle cx="30" cy="30" r="12" fill="#BC002D" />
      </g>
    </svg>
  );
}
function FlagKR() {
  /* South Korea — Taegukgi. White field, red-and-blue taegeuk (yin-yang)
     circle in the centre, four black trigrams at the corners. */
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <defs>
        <clipPath id="kr"><circle cx="30" cy="30" r="30" /></clipPath>
      </defs>
      <g clipPath="url(#kr)">
        <rect width="60" height="60" fill="#fff" />
        {/* Taegeuk — red top half, blue bottom half */}
        <circle cx="30" cy="30" r="11" fill="#C60C30" />
        <path
          d="M 30 19 a 11 11 0 0 1 0 22 a 5.5 5.5 0 0 1 0 -11 a 5.5 5.5 0 0 0 0 -11"
          fill="#003478"
        />
        {/* 4 trigrams — corners, slightly inset */}
        <g fill="#000">
          {/* top-left: Geon (☰) — three solid bars */}
          <rect x="7"  y="13"  width="9" height="1.4" />
          <rect x="7"  y="15.6" width="9" height="1.4" />
          <rect x="7"  y="18.2" width="9" height="1.4" />
          {/* top-right: Gam (☵) — solid · broken · broken (centred breaks) */}
          <rect x="44" y="13"   width="9" height="1.4" />
          <rect x="44" y="15.6" width="3.6" height="1.4" />
          <rect x="49.4" y="15.6" width="3.6" height="1.4" />
          <rect x="44" y="18.2" width="3.6" height="1.4" />
          <rect x="49.4" y="18.2" width="3.6" height="1.4" />
          {/* bottom-left: Ri (☲) — broken · solid · broken */}
          <rect x="7"  y="41"   width="3.6" height="1.4" />
          <rect x="12.4" y="41" width="3.6" height="1.4" />
          <rect x="7"  y="43.6" width="9" height="1.4" />
          <rect x="7"  y="46.2" width="3.6" height="1.4" />
          <rect x="12.4" y="46.2" width="3.6" height="1.4" />
          {/* bottom-right: Gon (☷) — three broken bars */}
          <rect x="44" y="41"   width="3.6" height="1.4" />
          <rect x="49.4" y="41"   width="3.6" height="1.4" />
          <rect x="44" y="43.6" width="3.6" height="1.4" />
          <rect x="49.4" y="43.6" width="3.6" height="1.4" />
          <rect x="44" y="46.2" width="3.6" height="1.4" />
          <rect x="49.4" y="46.2" width="3.6" height="1.4" />
        </g>
      </g>
    </svg>
  );
}

function FlagBD() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <defs><clipPath id="bd"><circle cx="30" cy="30" r="30" /></clipPath></defs>
      <g clipPath="url(#bd)">
        <rect width="60" height="60" fill="#006A4E" />
        <circle cx="27" cy="30" r="12" fill="#F42A41" />
      </g>
    </svg>
  );
}
function FlagIN() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <defs><clipPath id="in"><circle cx="30" cy="30" r="30" /></clipPath></defs>
      <g clipPath="url(#in)">
        <rect width="60" height="20" fill="#FF9933" />
        <rect y="20" width="60" height="20" fill="#fff" />
        <rect y="40" width="60" height="20" fill="#138808" />
        <circle cx="30" cy="30" r="6" fill="none" stroke="#000080" strokeWidth="1" />
        <circle cx="30" cy="30" r="1.5" fill="#000080" />
      </g>
    </svg>
  );
}
function Star({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r / 2.5;
    return `${cx + rr * Math.cos(angle)},${cy + rr * Math.sin(angle)}`;
  }).join(" ");
  return <polygon points={points} fill="#FFDE00" />;
}

/* ─────────────── HERO ─────────────── */
function Hero() {
  const { t } = useLang();
  return (
    <section
      id="top"
      className="relative mesh-hero text-white overflow-hidden grain min-h-screen flex items-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-yai-navy/40 pointer-events-none" />
      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-10 pt-32 pb-24 grid lg:grid-cols-[1.4fr_1fr] gap-12 items-start">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-7 min-h-[56px]"
          >
            {/* Cambodia flag + label */}
            <span className="inline-flex items-center gap-2.5">
              <Image
                src="/images/flag-cambodia.png"
                alt="Flag of Cambodia"
                width={160}
                height={80}
                unoptimized
                className="w-12 h-6 rounded-[2px] ring-2 ring-white/40 shadow object-cover"
              />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/85">
                {t("hero.madeIn")}
              </span>
            </span>
            {/* Divider */}
            <span className="hidden sm:inline-block w-px h-7 bg-white/25" aria-hidden />
            {/* ASEAN logo + label — sized to match Cambodia flag visual
                weight, wrapped in a white circular badge so the white
                square background reads as intentional brand framing
                rather than a cropping accident. */}
            <span className="inline-flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md ring-2 ring-white/40 overflow-hidden">
                <Image
                  src="/images/asean-logo-with-flags.png"
                  alt="ASEAN — Cambodia and 9 fellow member states"
                  width={400}
                  height={400}
                  unoptimized
                  className="w-12 h-12 object-contain"
                />
              </span>
              <span className="text-[12px] font-extrabold uppercase tracking-[0.22em] text-white/85">
                ASEAN
              </span>
            </span>

            {/* Ai MIP — 3D gold-on-blue brand badge, sits alongside the
                Cambodia + ASEAN flags as a peer brand mark. */}
            <span
              className="inline-block px-4 py-2 rounded-full text-[13px] font-extrabold uppercase tracking-[0.22em] text-yai-amber"
              style={{
                background:
                  "linear-gradient(180deg, #2A5DC4 0%, #1E4DAA 50%, #143C8C 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.35), 0 6px 14px -4px rgba(10,31,71,0.6), 0 0 0 1px rgba(255,213,138,0.35)",
                textShadow: "0 1px 0 rgba(0,0,0,0.35)",
              }}
            >
              Ai MIP
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight text-balance"
          >
            {t("hero.titleA")} <span className="text-yai-amber italic">{t("hero.titleB")}</span>
            <br />
            {t("hero.titleC")}
          </motion.h1>


<motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 text-lg lg:text-xl text-white/85 max-w-2xl leading-relaxed text-pretty"
          >
            <span className="font-semibold text-yai-amber">{t("hero.p1")}</span>
            {t("hero.pRest")}
          </motion.p>

          {/* Texlink Technologies — the company behind Yai. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-8 max-w-2xl rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-sm p-5"
          >
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-yai-amber">
                {t("hero.devBy")}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">
                {t("hero.since")}
              </span>
            </div>
            <div className="font-serif text-xl font-semibold text-white leading-tight">
              Texlink Technologies Co., Ltd.
            </div>
            <p className="mt-3 text-[13.5px] text-white/75 leading-relaxed">
              {t("hero.txDesc")}
            </p>
          </motion.div>


        </div>

        {/* Right — compact dream showcase on top, stat block below */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="hidden lg:block space-y-4"
        >
          <CompactDreamShowcase />
          <div className="grid grid-cols-2 gap-4">
            <StatCard value="10" label={t("stats.agents")} />
            <StatCard value="20" label={t("stats.engineers")} />
            <LiveDurationStat startDate="2024-05-20" />
            <StatCard value="40 yrs" label={t("stats.exp")} />
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center">
        <div className="text-white/40 text-[10px] uppercase tracking-[0.25em] font-bold flex flex-col items-center gap-2">
          <span>{t("hero.scroll")}</span>
          <span className="block w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/15 p-5 backdrop-blur-sm">
      <div className="text-4xl font-extrabold tracking-tight text-yai-amber">{value}</div>
      <div className="text-[11px] uppercase tracking-wider mt-1 text-white/65">{label}</div>
    </div>
  );
}

/** Live "Y years D days" counter from a start date — updates hourly so the
 *  number stays accurate without flickering. Server-renders an empty value
 *  to avoid hydration mismatch, then fills in on the client. */
function LiveDurationStat({ startDate }: { startDate: string }) {
  const { t } = useLang();
  const [value, setValue] = useState("…");
  useEffect(() => {
    const start = new Date(startDate);
    const compute = () => {
      const now = new Date();
      let years = now.getFullYear() - start.getFullYear();
      const anniv = new Date(start);
      anniv.setFullYear(start.getFullYear() + years);
      if (anniv.getTime() > now.getTime()) {
        years -= 1;
        anniv.setFullYear(start.getFullYear() + years);
      }
      const days = Math.floor((now.getTime() - anniv.getTime()) / 86_400_000);
      setValue(`${years}y ${days}d`);
    };
    compute();
    // Recompute every hour — day-by-day accuracy without burning CPU.
    const id = setInterval(compute, 3_600_000);
    return () => clearInterval(id);
  }, [startDate]);

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/15 p-5 backdrop-blur-sm">
      <div className="text-4xl font-extrabold tracking-tight text-yai-amber tabular-nums">
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wider mt-1 text-white/65">
        {t("stats.live")}
      </div>
    </div>
  );
}

/* ─────────────── DREAM SHOWCASE ───────────────
 * TV-style auto-cycling slideshow of the 4 stages — Today → L1 → L2 → L3.
 * Used as the COMPACT variant inside the hero's right column. */
/* Text lives in i18n.tsx under dream.<k>.tag/title/cap — resolve via t(). */
const DREAM_FRAMES = [
  { img: "/images/dream-today.png", k: "today", accent: "#94A3B8" },
  { img: "/images/dream-l1.png",    k: "l1",    accent: "#F37021" },
  { img: "/images/dream-l2.png",    k: "l2",    accent: "#1E4DAA" },
  { img: "/images/dream-l3.png",    k: "l3",    accent: "#0A3327" },
];

/* Accounting evolution — photoreal Vertex-generated frames showing how
 * ONE role transforms across the 4 eras. Appended to the main cinema
 * slideshow (not the hero compact showcase). */
const ACC_FRAMES = [
  { img: "/images/acc-today.png", k: "acc1", accent: "#94A3B8" },
  { img: "/images/acc-l1.png",    k: "acc2", accent: "#F37021" },
  { img: "/images/acc-l2.png",    k: "acc3", accent: "#1E4DAA" },
  { img: "/images/acc-l3.png",    k: "acc4", accent: "#0A3327" },
];

/* The big Impact cinema runs the full 8-frame reel. */
const CINEMA_FRAMES = [...DREAM_FRAMES, ...ACC_FRAMES];

/** Compact showcase that fits inside the hero's right column above the
 *  stat cards. Same 4-frame auto-cycle, smaller chrome — no section title,
 *  shorter captions, just the moving picture. */
function CompactDreamShowcase() {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % DREAM_FRAMES.length);
    }, 2800);
    return () => clearInterval(id);
  }, [paused]);

  const f = DREAM_FRAMES[idx];

  return (
    <div>
      {/* Caption row — sits ABOVE the animation frame and matches the
          56px min-height of the Made-in-Cambodia / ASEAN flag row on the
          left side of the hero so the two rows align on the same line. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`cap-${idx}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-3 mb-7 min-h-[56px]"
        >
          <span
            className="inline-block text-[12px] font-extrabold uppercase tracking-[0.18em] px-3 py-1.5 rounded-md text-white shrink-0"
            style={{ background: f.accent }}
          >
            {t(`dream.${f.k}.tag`)}
          </span>
          <h4 className="font-serif text-lg lg:text-xl font-semibold leading-tight text-white">
            {t(`dream.${f.k}.title`)}
          </h4>
        </motion.div>
      </AnimatePresence>

      {/* Animation frame — clean, no caption overlay */}
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-black"
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={f.img}
              alt={t(`dream.${f.k}.title`)}
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              priority={idx === 0}
              className="object-cover"
            />
            {/* Layer-1-only: radial orange glow centred on the data hub.
                Fades to transparent at the edges so workers / machines /
                desks stay in their original cool blue. */}
            {f.k === "l1" && (
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                  background:
                    "radial-gradient(ellipse 18% 22% at 50% 56%, rgba(243,112,33,0.95) 0%, rgba(243,112,33,0.55) 50%, rgba(243,112,33,0) 100%)",
                }}
              />
            )}
            {/* Vignette so edges feel finished */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.4)]" />
          </motion.div>
        </AnimatePresence>

        {/* Progress bar at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <motion.div
            key={`bar-${idx}-${paused ? "p" : "r"}`}
            initial={{ width: "0%" }}
            animate={{ width: paused ? "0%" : "100%" }}
            transition={{ duration: paused ? 0 : 2.8, ease: "linear" }}
            className="h-full bg-yai-amber"
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── AUDIENCE ROUTER ─────────────── */
function AudienceRouter() {
  const cards = [
    {
      tag: "I run a factory",
      title: "Start at $120/yr — own the upgrade.",
      body: "Replace paper, Excel and WhatsApp with one platform. Khmer voice, phone-first, Ai agents do the chasing.",
      cta: "For factory owners",
      color: "#1E4DAA",
    },
    {
      tag: "I'm a brand buyer",
      title: "Audit-ready suppliers, automatically.",
      body: "Compliance, EMR, WRAP / BSCI evidence flow through Yai. Pick from a growing list of Yai-using factories.",
      cta: "For brands",
      color: "#F37021",
    },
    {
      tag: "I'm with government / institution",
      title: "National-scale factory digitalisation.",
      body: "Ministry-aligned digital audit, E-Gov SSO integration, worker-voice channels. Built in Cambodia for ASEAN.",
      cta: "For institutional",
      color: "#0A3327",
    },
  ];

  return (
    <Section className="bg-yai-bg">
      <SectionEyebrow>Audience router</SectionEyebrow>
      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-yai-navy text-balance max-w-3xl">
        Three doors into the same platform.
      </h2>
      <div className="grid md:grid-cols-3 gap-5 mt-10">
        {cards.map((c, i) => (
          <Reveal key={c.tag} delay={i * 0.08}>
            <a
              href="#contact"
              className="group relative block rounded-2xl bg-white p-7 border border-black/5 hover:border-transparent hover:shadow-2xl transition overflow-hidden h-full"
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5 transition-opacity opacity-60 group-hover:opacity-100"
                style={{ background: c.color }}
              />
              <div
                className="text-[10px] uppercase tracking-[0.2em] font-bold mb-4"
                style={{ color: c.color }}
              >
                {c.tag}
              </div>
              <h3 className="font-serif text-2xl font-semibold text-yai-navy leading-tight">
                {c.title}
              </h3>
              <p className="mt-4 text-[14px] text-gray-600 leading-relaxed">{c.body}</p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-yai-navy group-hover:text-yai-orange transition">
                {c.cta} <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────── 3-LAYER STORY ─────────────── */
function LayerStory() {
  const { t } = useLang();
  const layers = [
    {
      tag: t("layer.today.tag"),
      name: t("layer.today.name"),
      sub: t("layer.today.sub"),
      desc: t("layer.today.desc"),
      icons: ["Paper reports", "Ledger books", "WhatsApp", "Manual signing", "Chasing approvals"],
      variant: "before",
    },
    {
      tag: t("layer.l1.tag"),
      name: t("layer.l1.name"),
      sub: t("layer.l1.sub"),
      desc: t("layer.l1.desc"),
      icons: ["Smart UIs", "Chat agents", "Mobile apps", "AIoT", "LLMs"],
      variant: "l1",
    },
    {
      tag: t("layer.l2.tag"),
      name: t("layer.l2.name"),
      sub: t("layer.l2.sub"),
      desc: t("layer.l2.desc"),
      icons: ["Agentic skills", "Auto-queue tasks", "Human escalation", "SOP monitoring", "Process policing"],
      variant: "l2",
    },
    {
      tag: t("layer.l3.tag"),
      name: t("layer.l3.name"),
      sub: t("layer.l3.sub"),
      desc: t("layer.l3.desc"),
      icons: ["Human + Ai sync", "Proven results", "Confident capital", "Clone-to-country", "Multi-territory"],
      variant: "l3",
    },
  ];

  const panelClass = (v: string) =>
    v === "before"
      ? "bg-gray-50 border-2 border-dashed border-gray-300 text-gray-600"
      : v === "l1"
      ? "bg-gradient-to-b from-yai-cream to-[#FFD9B5] border-2 border-yai-orange/40 text-yai-navy"
      : v === "l2"
      ? "bg-gradient-to-b from-yai-blue to-[#2A5DC4] border-2 border-yai-blue text-white"
      : "bg-gradient-to-b from-yai-forest to-[#1A5742] border-2 border-[#0E3B2E] text-white";

  return (
    <Section id="product" className="!pt-4 lg:!pt-6">
      <SectionEyebrow>{t("platform.eyebrow")}</SectionEyebrow>
      {/* Title + subtitle in a 2-col row so the supporting copy sits to the
          right at the title's bottom level, leaving the layer cards to come
          up closer underneath. */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-x-10 gap-y-3 items-end">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-yai-navy text-balance">
          {t("platform.title")}
        </h2>
        <p className="text-base text-gray-600 leading-relaxed">
          {t("platform.para")}
        </p>
      </div>

      {/* Evolution rail */}
      <div className="hidden md:flex items-center justify-center gap-3 mt-6 mb-4 text-yai-navy/50">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase">{t("platform.old")}</span>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-yai-blue/40 to-yai-blue" />
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-yai-blue">{t("platform.evo")}</span>
        <div className="flex-1 h-px bg-gradient-to-r from-yai-blue via-yai-forest/60 to-yai-forest" />
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase">{t("platform.full")}</span>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mt-6">
        {layers.map((l, i) => (
          <Reveal key={l.tag} delay={i * 0.08}>
            <div className={`rounded-2xl overflow-hidden h-full flex flex-col ${panelClass(l.variant)}`}>
              <div className="p-5">
                <div className={`inline-block text-[10px] font-extrabold uppercase tracking-[0.18em] px-2 py-1 rounded ${
                  l.variant === "before"
                    ? "bg-gray-300 text-gray-700"
                    : l.variant === "l1"
                    ? "bg-yai-orange text-white"
                    : l.variant === "l2"
                    ? "bg-white text-yai-blue"
                    : "bg-yai-amber text-yai-forest"
                }`}>
                  {l.tag}
                </div>
                <h3 className={`mt-3 font-serif text-2xl font-semibold leading-tight ${l.variant === "before" ? "text-gray-600" : ""}`}>
                  {l.name}
                </h3>
                <p className={`text-[11px] italic mt-1 ${l.variant === "before" ? "text-gray-500" : "opacity-80"}`}>
                  {l.sub}
                </p>
                <p className={`text-[13px] leading-snug mt-3 ${l.variant === "before" ? "text-gray-500" : "opacity-85"}`}>
                  {l.desc}
                </p>
              </div>

              {/* Layer animation — visually telegraphs what this stage IS */}
              <div className="px-5">
                <LayerAnimation variant={l.variant} />
              </div>

              <div className="px-5 pb-5 mt-auto pt-3">
                <ul className={`flex flex-wrap gap-1.5`}>
                  {l.icons.map((icon) => (
                    <li
                      key={icon}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                        l.variant === "before"
                          ? "bg-white/70 text-gray-500 border border-gray-200"
                          : l.variant === "l1"
                          ? "bg-white/60 text-yai-navy border border-yai-orange/30"
                          : "bg-white/15 text-white border border-white/25"
                      }`}
                    >
                      {icon}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─── Per-layer animated visualisations inside the LayerStory cards.
 *  - before  · floating disconnected paper documents (chaos)
 *  - l1      · data streams flowing INTO a central glowing data hub
 *  - l2      · three Ai agents handing tasks between each other
 *  - l3      · a central Yai brain emitting signals to many factories */
function LayerAnimation({ variant }: { variant: string }) {
  if (variant === "before") {
    /* The chaotic office scene — multiple stick figures, printer spitting
       paper, growing pile, scattered fluttering papers, non-stop chat. */
    return (
      <svg viewBox="0 0 200 100" className="w-full h-32">
        {/* ─── Confused worker at the top centre (scratches head) ─── */}
        <g transform="translate(75 22)">
          <g className="anim-head-wobble-1">
            <circle cx="0" cy="0" r="3.5" fill="#1F2937" />
          </g>
          <line x1="0" y1="3" x2="0" y2="16" stroke="#1F2937" strokeWidth="2" />
          <line x1="0" y1="16" x2="-3" y2="26" stroke="#1F2937" strokeWidth="1.5" />
          <line x1="0" y1="16" x2="3"  y2="26" stroke="#1F2937" strokeWidth="1.5" />
          {/* one arm scratching head, one hanging */}
          <line x1="0" y1="6" x2="-3" y2="-2" stroke="#1F2937" strokeWidth="1.5" />
          <line x1="0" y1="6" x2="4"  y2="12" stroke="#1F2937" strokeWidth="1.5" />
          {/* "?" speech mark */}
          <text x="-4" y="-6" fontSize="6" fontWeight="800" fill="#94A3B8">?</text>
        </g>

        {/* ─── Printer + growing paper pile (mid-centre) ─── */}
        <g transform="translate(105 50)">
          {/* printer body */}
          <rect x="-9" y="0" width="18" height="11" fill="#94A3B8" rx="1" />
          <rect x="-9" y="0" width="18" height="3"  fill="#1F2937" rx="1" />
          {/* output slit */}
          <rect x="-7" y="4" width="14" height="1" fill="#0F172A" />
          {/* paper emerging */}
          <g className="anim-paper-print">
            <rect x="-7" y="5" width="14" height="8" fill="#fff" stroke="#94A3B8" strokeWidth="0.6" />
            <line x1="-5" y1="8"  x2="5" y2="8"  stroke="#CBD5E1" strokeWidth="0.5" />
            <line x1="-5" y1="10" x2="5" y2="10" stroke="#CBD5E1" strokeWidth="0.5" />
          </g>
          {/* growing pile to the right of the printer */}
          <g className="anim-pile-bob" transform="translate(15 5)">
            <rect x="-1.5" y="6"  width="14" height="2" fill="#fff" stroke="#94A3B8" strokeWidth="0.4" />
            <rect x="-0.5" y="4"  width="14" height="2" fill="#fff" stroke="#94A3B8" strokeWidth="0.4" />
            <rect x="-2"   y="2"  width="14" height="2" fill="#fff" stroke="#94A3B8" strokeWidth="0.4" />
            <rect x="-1"   y="0"  width="14" height="2" fill="#fff" stroke="#94A3B8" strokeWidth="0.4" />
            <rect x="-2"   y="-2" width="14" height="2" fill="#fff" stroke="#94A3B8" strokeWidth="0.4" />
          </g>
        </g>

        {/* ─── Worker hunched over a desk typing furiously ─── */}
        <g transform="translate(40 50)" className="anim-desk-typing">
          {/* desk */}
          <rect x="-12" y="14" width="22" height="3" fill="#94A3B8" rx="0.5" />
          {/* monitor */}
          <rect x="-1" y="2" width="9" height="7" fill="#1F2937" rx="0.6" />
          <rect x="0"  y="3" width="7" height="5" fill="#7DD3FC" />
          <rect x="-2" y="9" width="11" height="1.5" fill="#0F172A" />
          {/* hunched worker */}
          <g className="anim-head-wobble-2">
            <circle cx="-7" cy="-3" r="3.5" fill="#1F2937" />
          </g>
          <line x1="-7" y1="0" x2="-5" y2="10" stroke="#1F2937" strokeWidth="2" />
          <line x1="-5" y1="10" x2="-1" y2="14" stroke="#1F2937" strokeWidth="1.5" />
        </g>

        {/* ─── Manager seated at desk on the right ─── */}
        <g className="anim-manager-nod">
          <circle cx="170" cy="32" r="4.5" fill="#1F2937" />
          <line x1="170" y1="36" x2="170" y2="50" stroke="#1F2937" strokeWidth="2.5" />
          <line x1="170" y1="40" x2="163" y2="46" stroke="#1F2937" strokeWidth="1.6" />
          <line x1="170" y1="40" x2="177" y2="46" stroke="#1F2937" strokeWidth="1.6" />
          <line x1="177" y1="46" x2="181" y2="44" stroke="#1E4DAA" strokeWidth="1.2" />
        </g>
        <rect x="157" y="54" width="26" height="3" fill="#94A3B8" rx="0.5" />
        <rect x="161" y="46" width="14" height="9" fill="#fff" stroke="#94A3B8" strokeWidth="0.7" rx="0.5" />
        <line x1="164" y1="50" x2="172" y2="50" stroke="#CBD5E1" strokeWidth="0.5" />
        <line x1="164" y1="52" x2="172" y2="52" stroke="#CBD5E1" strokeWidth="0.5" />

        {/* ─── Running worker (paper in hand) — left → right → loop ─── */}
        <g className="anim-worker-runs">
          <circle cx="0" cy="32" r="4" fill="#0F172A" />
          <line x1="0" y1="36" x2="0" y2="50" stroke="#0F172A" strokeWidth="2" />
          <line x1="0" y1="50" x2="-3" y2="62" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="0" y1="50" x2="4"  y2="60" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="0" y1="40" x2="7" y2="44" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="6" y="41" width="6" height="7" fill="#fff" stroke="#0F172A" strokeWidth="0.7" rx="0.4" />
        </g>

        {/* ─── Sewing workers row at the bottom — all confused with ??? ─── */}
        {[
          { x: 12,  d: 0   },
          { x: 32,  d: 0.25 },
          { x: 52,  d: 0.5 },
          { x: 72,  d: 0.75 },
        ].map((s, i) => (
          <g key={`sewer-${i}`} transform={`translate(${s.x} 80)`}>
            {/* "?" pulsing above the head */}
            <text
              x="0" y="-10"
              textAnchor="middle"
              fontSize="9"
              fontWeight="800"
              fill="#94A3B8"
              className={`anim-question-${(i % 4) + 1}`}
            >
              ?
            </text>
            {/* tiny sewer */}
            <circle cx="0" cy="-2" r="2.6" fill="#1F2937" />
            <line x1="0" y1="0.5" x2="0" y2="8" stroke="#1F2937" strokeWidth="1.6" />
            <line x1="0" y1="4"   x2="-3" y2="7" stroke="#1F2937" strokeWidth="1.2" />
            <line x1="0" y1="4"   x2="3"  y2="7" stroke="#1F2937" strokeWidth="1.2" />
            {/* sewing machine — small box in front */}
            <rect x="-3" y="9" width="6" height="3" fill="#94A3B8" />
            <line x1="-2" y1="11" x2="2" y2="11" stroke="#fff" strokeWidth="0.6" />
          </g>
        ))}

        {/* ─── Two arguing people — facing each other with "!@#" between ─── */}
        <g transform="translate(135 22)">
          {/* left arguer — leaning right */}
          <g className="anim-argue-left">
            <circle cx="-7" cy="0" r="3" fill="#1F2937" />
            <line x1="-7" y1="2.5" x2="-7" y2="11" stroke="#1F2937" strokeWidth="1.6" />
            <line x1="-7" y1="6" x2="-3" y2="8" stroke="#1F2937" strokeWidth="1.2" />
            <line x1="-7" y1="11" x2="-9" y2="17" stroke="#1F2937" strokeWidth="1.2" />
            <line x1="-7" y1="11" x2="-5" y2="17" stroke="#1F2937" strokeWidth="1.2" />
          </g>
          {/* right arguer — leaning left */}
          <g className="anim-argue-right">
            <circle cx="7" cy="0" r="3" fill="#1F2937" />
            <line x1="7" y1="2.5" x2="7" y2="11" stroke="#1F2937" strokeWidth="1.6" />
            <line x1="7" y1="6" x2="3" y2="8" stroke="#1F2937" strokeWidth="1.2" />
            <line x1="7" y1="11" x2="9" y2="17" stroke="#1F2937" strokeWidth="1.2" />
            <line x1="7" y1="11" x2="5" y2="17" stroke="#1F2937" strokeWidth="1.2" />
          </g>
          {/* angry symbols between them */}
          <text x="0" y="-2" textAnchor="middle" fontSize="7" fontWeight="800" fill="#DC2626">!@#</text>
        </g>

        {/* ─── Fluttering paper scraps falling at random positions ─── */}
        <rect x="60" y="0" width="5" height="6" fill="#fff" stroke="#CBD5E1" strokeWidth="0.4" className="anim-paper-flutter-1" />
        <rect x="125" y="0" width="5" height="6" fill="#fff" stroke="#CBD5E1" strokeWidth="0.4" className="anim-paper-flutter-2" />
        <rect x="150" y="0" width="5" height="6" fill="#fff" stroke="#CBD5E1" strokeWidth="0.4" className="anim-paper-flutter-3" />

        {/* ─── Cart pusher — worker shoving a wheeled trolley piled high
                with papers across the bottom of the scene ─── */}
        <g transform="translate(130 80)" className="anim-cart-push">
          {/* paper pile on cart */}
          <rect x="-7" y="-7" width="14" height="2" fill="#fff" stroke="#94A3B8" strokeWidth="0.4" />
          <rect x="-8" y="-5" width="14" height="2" fill="#fff" stroke="#94A3B8" strokeWidth="0.4" />
          <rect x="-7" y="-3" width="14" height="2" fill="#fff" stroke="#94A3B8" strokeWidth="0.4" />
          <rect x="-8" y="-1" width="14" height="2" fill="#fff" stroke="#94A3B8" strokeWidth="0.4" />
          {/* cart body */}
          <rect x="-8" y="1"  width="16" height="6" fill="#94A3B8" />
          <rect x="-8" y="1"  width="16" height="1.5" fill="#1F2937" />
          {/* spinning wheels */}
          <g className="anim-cart-wheel" transform="translate(-6 8)">
            <circle cx="0" cy="0" r="1.6" fill="#0F172A" />
            <line x1="-1.6" y1="0" x2="1.6" y2="0" stroke="#94A3B8" strokeWidth="0.4" />
          </g>
          <g className="anim-cart-wheel" transform="translate(6 8)">
            <circle cx="0" cy="0" r="1.6" fill="#0F172A" />
            <line x1="-1.6" y1="0" x2="1.6" y2="0" stroke="#94A3B8" strokeWidth="0.4" />
          </g>
          {/* worker behind the cart, leaning forward to push */}
          <g transform="translate(-14 -3)">
            <circle cx="0" cy="0" r="3" fill="#1F2937" />
            <line x1="0" y1="3" x2="0" y2="13" stroke="#1F2937" strokeWidth="1.6" />
            {/* arms reaching forward to push the cart */}
            <line x1="0" y1="6" x2="6" y2="4" stroke="#1F2937" strokeWidth="1.4" />
            <line x1="0" y1="6" x2="6" y2="9" stroke="#1F2937" strokeWidth="1.4" />
            {/* legs mid-step */}
            <line x1="0" y1="13" x2="-2" y2="22" stroke="#1F2937" strokeWidth="1.4" />
            <line x1="0" y1="13" x2="3" y2="22" stroke="#1F2937" strokeWidth="1.4" />
          </g>
        </g>

        {/* ─── Laptop shaker — frustrated worker shaking a laptop ─── */}
        <g transform="translate(170 78)">
          {/* head — shakes with frustration */}
          <g className="anim-frustrated-head">
            <circle cx="0" cy="0" r="3" fill="#1F2937" />
          </g>
          {/* body + legs */}
          <line x1="0" y1="3" x2="0" y2="14" stroke="#1F2937" strokeWidth="1.6" />
          <line x1="0" y1="14" x2="-2" y2="22" stroke="#1F2937" strokeWidth="1.4" />
          <line x1="0" y1="14" x2="3" y2="22" stroke="#1F2937" strokeWidth="1.4" />
          {/* arms holding laptop */}
          <line x1="0" y1="7" x2="-4" y2="10" stroke="#1F2937" strokeWidth="1.4" />
          <line x1="0" y1="7" x2="4"  y2="10" stroke="#1F2937" strokeWidth="1.4" />
          {/* laptop being shaken */}
          <g className="anim-laptop-shake" transform="translate(0 11)">
            <rect x="-5" y="-2" width="10" height="5" fill="#0F172A" rx="0.5" />
            <rect x="-4" y="-1" width="8"  height="3" fill="#7DD3FC" />
            <rect x="-5" y="3"  width="10" height="1" fill="#0F172A" />
          </g>
          {/* frustration symbol above head */}
          <text x="0" y="-5" textAnchor="middle" fontSize="6" fontWeight="900" fill="#DC2626">!#@</text>
        </g>

        {/* ─── Panicked runner — runs R→L with FIRE on head ─── */}
        <g className="anim-panic-runs">
          <circle cx="0" cy="42" r="4" fill="#0F172A" />
          <line x1="0" y1="46" x2="0" y2="60" stroke="#0F172A" strokeWidth="2" />
          {/* arms flailing up */}
          <line x1="0" y1="50" x2="-6" y2="42" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="0" y1="50" x2="6"  y2="42" stroke="#0F172A" strokeWidth="1.5" />
          {/* legs mid-stride */}
          <line x1="0" y1="60" x2="-4" y2="72" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="0" y1="60" x2="3"  y2="70" stroke="#0F172A" strokeWidth="1.5" />
          {/* FLAME on head — orange teardrops */}
          <g className="anim-flame" transform="translate(0 36)">
            <path d="M 0 0 Q -3 -4 -1 -7 Q 0 -3 1 -7 Q 3 -4 0 0 Z" fill="#F37021" />
            <path d="M 0 0 Q -1.5 -2 -0.5 -4 Q 0 -1.5 0.5 -4 Q 1.5 -2 0 0 Z" fill="#FBBF24" />
          </g>
        </g>

        {/* ─── Chat bubbles popping non-stop at top ─── */}
        <g className="anim-chat-1"><ChatBubble cx={15}  cy={10} /></g>
        <g className="anim-chat-2"><ChatBubble cx={45}  cy={6} /></g>
        <g className="anim-chat-3"><ChatBubble cx={95}  cy={8} /></g>
        <g className="anim-chat-4"><ChatBubble cx={135} cy={10} /></g>
        <g className="anim-chat-5"><ChatBubble cx={165} cy={6} /></g>
        <g className="anim-chat-6"><ChatBubble cx={185} cy={12} /></g>
      </svg>
    );
  }

  if (variant === "l1") {
    return (
      <svg viewBox="0 0 220 130" className="w-full h-40">
        {/* 4 corner data points feeding INTO the central hub. */}
        {[
          { d: "M 34 34 L 110 65", key: "tl" },
          { d: "M 186 34 L 110 65", key: "tr" },
          { d: "M 34 96 L 110 65", key: "bl" },
          { d: "M 186 96 L 110 65", key: "br" },
        ].map((p) => (
          <path
            key={p.key}
            d={p.d}
            stroke="#F37021"
            strokeWidth="1.6"
            fill="none"
            strokeDasharray="3.5 4.5"
            className="anim-flow"
          />
        ))}
        {/* corner data nodes — icons at safe scale, pulled inward so they
            don't get clipped, labels positioned BELOW each top icon and
            ABOVE each bottom icon so they sit fully inside the viewBox. */}
        <g transform="translate(34 34) scale(1.6)">
          <IconSensor />
        </g>
        <text x="34" y="14" textAnchor="middle" fontSize="9" fontWeight="800" fill="#9A3412">
          AIoT sensors
        </text>
        <g transform="translate(186 34) scale(1.6)">
          <IconScreen />
        </g>
        <text x="186" y="14" textAnchor="middle" fontSize="9" fontWeight="800" fill="#9A3412">
          Smart UIs
        </text>
        <g transform="translate(34 96) scale(1.6)">
          <IconTablet />
        </g>
        <text x="34" y="120" textAnchor="middle" fontSize="9" fontWeight="800" fill="#9A3412">
          Pads
        </text>
        <g transform="translate(186 96) scale(1.6)">
          <IconChip />
        </g>
        <text x="186" y="120" textAnchor="middle" fontSize="9" fontWeight="800" fill="#9A3412">
          LLMs
        </text>
        {/* central database — re-centred at (110, 65) for the wider viewBox */}
        <circle cx="110" cy="65" r="26" fill="#F37021" opacity="0.1" className="anim-pulse-bright" />
        <g className="anim-pulse-bright" style={{ transformOrigin: "110px 65px" }}>
          <ellipse cx="110" cy="53" rx="20" ry="5.5" fill="#F37021" />
          <rect x="90" y="53" width="40" height="20" fill="#F37021" />
          <ellipse cx="110" cy="73" rx="20" ry="5.5" fill="#F37021" />
          {/* stripe details on the database */}
          <ellipse cx="110" cy="59" rx="20" ry="5.5" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
          <ellipse cx="110" cy="66" rx="20" ry="5.5" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
        </g>
      </svg>
    );
  }

  if (variant === "l2") {
    /* 5-agent constellation — real photo portraits in circles, like the
       reference. Connected by dashed lines, each speaks in sequence: their
       portrait gets a bright amber ring + a labelled speech bubble pops in. */
    const AGENTS = [
      { x: 15, y: 30, img: "/images/agent-9.png",  name: "Production", msg: "Request",     alert: false, anim: 1 },
      { x: 50, y: 22, img: "/images/agent-22.png", name: "QC",         msg: "Defects ↑",   alert: true,  anim: 2 },
      { x: 85, y: 30, img: "/images/agent-10.png", name: "Dashboard",  msg: "→ GM",        alert: false, anim: 3 },
      { x: 22, y: 72, img: "/images/agent-11.png", name: "YTM",        msg: "Machine ✕",   alert: true,  anim: 4 },
      { x: 78, y: 72, img: "/images/agent-30.png", name: "MRP",        msg: "Fabric ↺",    alert: true,  anim: 5 },
    ];
    const EDGES: Array<[number, number]> = [
      [0, 1], [1, 2], [0, 3], [3, 4], [4, 2], [1, 3], [1, 4], [0, 2],
    ];
    return (
      <div className="relative w-full h-36 overflow-visible">
        {/* Constellation lines as inline SVG behind the avatars */}
        <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          {EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={AGENTS[a].x} y1={AGENTS[a].y}
              x2={AGENTS[b].x} y2={AGENTS[b].y}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="0.4"
              strokeDasharray="1.2 1.6"
            />
          ))}
        </svg>

        {/* Photo-portrait avatars + labels + per-agent speech bubble */}
        {AGENTS.map((a, i) => (
          <PortraitAgent key={i} agent={a} />
        ))}
      </div>
    );
  }

  // l3 — Full Ai: home (People + AI + Capital) → 5-country expansion tour
  const COUNTRIES = [
    { x: 50,  name: "Bangladesh" },
    { x: 82,  name: "Indonesia" },
    { x: 114, name: "India" },
    { x: 146, name: "Uzbekistan" },
    { x: 178, name: "Mexico" },
  ];
  return (
    <svg viewBox="0 0 200 110" className="w-full h-40">
      {/* Wave-path flight from home → through all 5 country stops */}
      <path
        d="M 35 60 Q 47 36 60 60 Q 75 84 90 60 Q 105 36 120 60 Q 135 84 150 60 Q 165 36 180 60"
        stroke="#FACC15"
        strokeWidth="0.9"
        strokeDasharray="2.5 3"
        fill="none"
        opacity="0.5"
      />

      {/* ─── HOME ZONE — 3 icons stacked vertically, much bigger ─── */}
      <g className="anim-ready-pulse">
        {/* People */}
        <g transform="translate(22 22)">
          <circle cx="0" cy="0" r="11" fill="#FACC15" />
          <circle cx="-2.8" cy="-2.4" r="2.4" fill="#0A3327" />
          <circle cx="2.8"  cy="-2.4" r="2.4" fill="#0A3327" />
          <path d="M -5 1.8 Q 0 5.2 5 1.8" stroke="#0A3327" strokeWidth="2" fill="none" />
        </g>
        {/* AI */}
        <g transform="translate(22 49)">
          <circle cx="0" cy="0" r="11" fill="#FACC15" />
          <text x="0" y="4.2" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0A3327">Ai</text>
        </g>
        {/* Capital */}
        <g transform="translate(22 76)">
          <circle cx="0" cy="0" r="11" fill="#FACC15" />
          <text x="0" y="4.5" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0A3327">$</text>
        </g>
        {/* READY badge — chunkier */}
        <g transform="translate(22 99)">
          <rect x="-18" y="-5.5" width="36" height="11" rx="5.5" fill="#10B981" />
          <text x="0" y="2.4" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#fff" letterSpacing="0.6">
            READY
          </text>
        </g>
      </g>

      {/* ─── 5 COUNTRY FACTORIES — bigger, with bigger labels ─── */}
      {COUNTRIES.map((c, i) => {
        const labelBelow = i % 2 === 0;
        // Re-space countries to fit the new viewBox width with bigger factories
        const cx = 60 + i * 30;
        return (
          <g key={c.name} transform={`translate(${cx} 60)`}>
            <g className={`anim-factory-${i + 1}`}>
              <g transform="scale(1.45)">
                <Factory />
              </g>
              <text
                x="0"
                y={labelBelow ? 26 : -17}
                textAnchor="middle"
                fontSize="7.5"
                fontWeight="800"
                fill="#FACC15"
              >
                {c.name}
              </text>
            </g>
          </g>
        );
      })}

      {/* ─── TRAVELLING TEAM — bigger cluster of 3 ─── */}
      <g transform="translate(30 60)">
        <g className="anim-team-journey">
          {/* Motion plume */}
          <circle cx="-15" cy="0" r="2.2" fill="#FACC15" opacity="0.35" />
          <circle cx="-20" cy="0" r="1.4" fill="#FACC15" opacity="0.2" />
          {/* People */}
          <g transform="translate(-9 0)">
            <circle cx="0" cy="0" r="4.5" fill="#FACC15" stroke="#fff" strokeWidth="0.7" />
            <circle cx="-1.2" cy="-1" r="0.95" fill="#0A3327" />
            <circle cx="1.2"  cy="-1" r="0.95" fill="#0A3327" />
            <path d="M -2 0.5 Q 0 2 2 0.5" stroke="#0A3327" strokeWidth="0.9" fill="none" />
          </g>
          {/* AI */}
          <g transform="translate(0 0)">
            <circle cx="0" cy="0" r="4.5" fill="#FACC15" stroke="#fff" strokeWidth="0.7" />
            <text x="0" y="1.7" textAnchor="middle" fontSize="5" fontWeight="800" fill="#0A3327">Ai</text>
          </g>
          {/* Capital */}
          <g transform="translate(9 0)">
            <circle cx="0" cy="0" r="4.5" fill="#FACC15" stroke="#fff" strokeWidth="0.7" />
            <text x="0" y="1.9" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#0A3327">$</text>
          </g>
        </g>
      </g>
    </svg>
  );
}

/** Small factory silhouette — chimney + two pitched roofs */
function Factory() {
  return (
    <g>
      <path d="M -10 6 L -10 -3 L -6 -6 L -6 -3 L -2 -6 L -2 -3 L 2 -6 L 2 -3 L 6 -6 L 6 6 Z"
            fill="#fff" stroke="#FACC15" strokeWidth="0.8" />
      <rect x="-1" y="2" width="2.5" height="4" fill="#0A3327" />
      <rect x="-8" y="-1" width="1.5" height="1.5" fill="#FACC15" />
      <rect x="-4" y="-1" width="1.5" height="1.5" fill="#FACC15" />
      <rect x="3"  y="-1" width="1.5" height="1.5" fill="#FACC15" />
    </g>
  );
}

/** Illustrated office worker — not a stick figure. Skin-toned head with
 *  hair, blue shirt body, dark trousers, distinct phone (with screen)
 *  in left hand, paper sheet in right hand. */
function Worker() {
  return (
    <g transform="translate(0 22)">
      {/* head + hair */}
      <ellipse cx="0" cy="-8" rx="5.5" ry="6" fill="#E5B093" />
      <path d="M -5.5 -10 Q 0 -17 5.5 -10 L 5.5 -7 L -5.5 -7 Z" fill="#1F2937" />
      {/* neck */}
      <rect x="-1.5" y="-3" width="3" height="3" fill="#E5B093" />
      {/* shirt / torso */}
      <path d="M -8 0 Q -9 -1 -7 -1 L 7 -1 Q 9 -1 8 0 L 9 20 L -9 20 Z" fill="#1E4DAA" />
      {/* belt + trousers */}
      <rect x="-9" y="20" width="18" height="2" fill="#0F172A" />
      <rect x="-9" y="22" width="18" height="14" fill="#1F2937" />
      {/* legs in stride (running pose) */}
      <path d="M -4 36 L -7 50 L -4 50 L -2 38 Z" fill="#1F2937" />
      <path d="M  4 36 L  8 47 L  5 50 L  2 38 Z" fill="#1F2937" />
      {/* shoes */}
      <ellipse cx="-5" cy="50" rx="2.5" ry="1" fill="#0F172A" />
      <ellipse cx="6"  cy="49" rx="2.5" ry="1" fill="#0F172A" />

      {/* LEFT arm — holding phone forward */}
      <path d="M -8 2 L -13 12 L -10 13 L -6 4 Z" fill="#1E4DAA" />
      <rect x="-15" y="11" width="5" height="9" rx="0.8" fill="#0F172A" />
      <rect x="-14" y="12.5" width="3" height="6" fill="#7DD3FC" />

      {/* RIGHT arm — holding paper extended */}
      <path d="M 8 2 L 14 10 L 11 12 L 6 4 Z" fill="#1E4DAA" />
      <rect x="13" y="8" width="9" height="11" fill="#fff" stroke="#94A3B8" strokeWidth="0.5" rx="0.5" />
      <line x1="15" y1="11" x2="20" y2="11" stroke="#CBD5E1" strokeWidth="0.6" />
      <line x1="15" y1="13" x2="20" y2="13" stroke="#CBD5E1" strokeWidth="0.6" />
      <line x1="15" y1="15" x2="19" y2="15" stroke="#CBD5E1" strokeWidth="0.6" />
    </g>
  );
}

/** HTML/CSS chat-bubble — used when we need to overlay bubbles on a raster
 *  image (the Today factory scene). White rounded pill with 3 dots inside. */
function ChatBubbleHTML() {
  return (
    <span className="inline-flex items-center justify-center gap-0.5 bg-white border border-gray-300 rounded-full px-1.5 py-0.5 shadow-sm">
      <span className="w-1 h-1 rounded-full bg-gray-500" />
      <span className="w-1 h-1 rounded-full bg-gray-500" />
      <span className="w-1 h-1 rounded-full bg-gray-500" />
    </span>
  );
}

/* ─── Tiny line-icons for Layer 1 corners ─── */
function IconSensor() {
  return (
    <g stroke="#F37021" strokeWidth="1.1" fill="none" strokeLinecap="round">
      <circle cx="0" cy="2" r="1.5" fill="#F37021" />
      <path d="M -3 -1 Q 0 -3 3 -1" />
      <path d="M -5 -3 Q 0 -7 5 -3" />
    </g>
  );
}
function IconScreen() {
  return (
    <g stroke="#F37021" strokeWidth="1" strokeLinecap="round">
      <rect x="-6" y="-4" width="12" height="8" rx="0.8" fill="#F37021" />
      <rect x="-4.5" y="-2.8" width="9" height="5.2" fill="#FFF1E0" />
      <line x1="-2" y1="5" x2="2" y2="5" />
    </g>
  );
}
function IconTablet() {
  return (
    <g stroke="#F37021" strokeWidth="1" strokeLinecap="round">
      <rect x="-3.5" y="-6" width="7" height="11" rx="1" fill="#F37021" />
      <rect x="-2.5" y="-5" width="5" height="7.5" fill="#FFF1E0" />
      <circle cx="0" cy="3.5" r="0.6" fill="#FFF1E0" />
    </g>
  );
}
function IconChip() {
  return (
    <g stroke="#F37021" strokeWidth="0.7" fill="none">
      <rect x="-4" y="-4" width="8" height="8" rx="0.5" fill="#F37021" />
      <rect x="-2.5" y="-2.5" width="5" height="5" fill="#FFF1E0" />
      {[-2, 0, 2].map((d) => (
        <g key={d}>
          <line x1="-5" y1={d} x2="-4" y2={d} />
          <line x1="4" y1={d} x2="5" y2={d} />
          <line x1={d} y1="-5" x2={d} y2="-4" />
          <line x1={d} y1="4" x2={d} y2="5" />
        </g>
      ))}
    </g>
  );
}

/** Photo-portrait agent for the Layer 2 constellation.
 *  Real face in a circular ring + name label + speech bubble that pops in
 *  during the agent's slot in the 5-second cycle. */
function PortraitAgent({
  agent,
}: {
  agent: {
    x: number; y: number;
    img: string; name: string; msg: string;
    alert: boolean; anim: number;
  };
}) {
  const ringColor = agent.alert ? "#F37021" : "#FACC15";
  return (
    <div
      className="absolute"
      style={{
        left: `${agent.x}%`,
        top:  `${(agent.y / 80) * 100}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Photo in circular frame with glow ring on the agent's slot */}
      <div className="relative">
        <span
          className={`anim-glow-${agent.anim} absolute inset-0 -m-1 rounded-full`}
          style={{ background: ringColor, opacity: 0.35 }}
        />
        <div
          className="relative w-10 h-10 rounded-full overflow-hidden shadow-md"
          style={{ boxShadow: `0 0 0 2px ${ringColor}, 0 2px 6px rgba(0,0,0,0.25)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={agent.img}
            alt={agent.name}
            // Head-and-shoulders portraits crop badly with center-center.
            // Pull the face up into the visible circle.
            style={{ objectPosition: "50% 18%" }}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      </div>
      {/* Name label under the portrait */}
      <div className="mt-1 text-center text-[8px] font-bold uppercase tracking-wider text-white/90 whitespace-nowrap">
        {agent.name}
      </div>
      {/* Speech bubble — ALWAYS above each agent's head. Cleanest layout:
          top-row bubbles sit between the card top and the top-row portraits;
          bottom-row bubbles sit between the two rows. Never overlap. */}
      <div
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{ bottom: "calc(100% + 6px)" }}
      >
        <div className={`anim-agent-${agent.anim}`}>
          <span
            className="inline-block px-2.5 py-1 rounded-md text-[11px] font-extrabold shadow-md"
            style={{
              background: agent.alert ? "#DC2626" : "#FBBF24",
              color: "#fff",
            }}
          >
            {agent.msg}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Tiny humanoid agent — head + torso, fits inside a 10-unit halo.
 *  Alert variant tints body orange to flag a problem-reporting agent. */
function Humanoid({ alert }: { alert: boolean }) {
  const body = alert ? "#F37021" : "#FACC15";
  return (
    <g>
      <circle cx="0" cy="-3" r="2.6" fill={body} stroke="#fff" strokeWidth="0.4" />
      <path
        d="M -3.5 0 Q -4 -0.5 -2.5 -0.5 L 2.5 -0.5 Q 4 -0.5 3.5 0 L 4 6 L -4 6 Z"
        fill={body}
        stroke="#fff"
        strokeWidth="0.4"
      />
    </g>
  );
}

/** Speech bubble for an agent — chooses position above or below based on the
 *  agent's location so it never overflows the SVG. Alert (red/orange) for
 *  problem messages, amber for routine messages. */
function AgentBubble({
  x,
  y,
  text,
  alert,
}: {
  x: number;
  y: number;
  text: string;
  alert: boolean;
}) {
  // Bubble sits ABOVE the agent if the agent is in the bottom half, otherwise BELOW.
  const above = y > 40;
  const offset = above ? -18 : 18;
  const tailDir = above ? 1 : -1;
  const fill   = alert ? "#FECACA" : "#FEF3C7";
  const stroke = alert ? "#DC2626" : "#D97706";
  const textCol= alert ? "#7F1D1D" : "#78350F";

  // Estimate width based on text length so we don't clip
  const padX = 5;
  const charW = 3.5;
  const w = Math.max(36, text.length * charW + padX * 2);
  const h = 11;
  // Clamp x so the bubble stays inside the SVG (200 wide)
  const cx = Math.min(Math.max(x, w / 2 + 2), 200 - w / 2 - 2);

  return (
    <g>
      <rect
        x={cx - w / 2}
        y={y + offset - h / 2}
        width={w}
        height={h}
        rx="2.5"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.7"
      />
      <polygon
        points={`${x - 2},${y + offset + (h / 2) * tailDir} ${x + 2},${y + offset + (h / 2) * tailDir} ${x},${y + offset + (h / 2 + 3) * tailDir}`}
        fill={fill}
        stroke={stroke}
        strokeWidth="0.7"
      />
      <text
        x={cx}
        y={y + offset + 2}
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        fill={textCol}
      >
        {text}
      </text>
    </g>
  );
}

function ChatBubble({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <ellipse cx="0" cy="0" rx="7" ry="5" fill="#fff" stroke="#94A3B8" strokeWidth="0.8" />
      <path d="M -2.5 4 L -1 6.5 L 1 4 Z" fill="#fff" stroke="#94A3B8" strokeWidth="0.8" />
      <circle cx="-2.6" cy="0" r="0.7" fill="#94A3B8" />
      <circle cx="0"    cy="0" r="0.7" fill="#94A3B8" />
      <circle cx="2.6"  cy="0" r="0.7" fill="#94A3B8" />
    </g>
  );
}

function PaperDoc({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <g>
      <rect x="-10" y="-14" width="22" height="28" rx="1" fill={fill} stroke={stroke} strokeWidth="1" />
      <line x1="-7" y1="-8"  x2="9"  y2="-8"  stroke={stroke} strokeWidth="0.8" />
      <line x1="-7" y1="-4"  x2="9"  y2="-4"  stroke={stroke} strokeWidth="0.8" />
      <line x1="-7" y1="0"   x2="9"  y2="0"   stroke={stroke} strokeWidth="0.8" />
      <line x1="-7" y1="4"   x2="5"  y2="4"   stroke={stroke} strokeWidth="0.8" />
    </g>
  );
}

/* ─────────────── ADOPTION LADDER ─────────────── */
function CustomersStrip() {
  /* Ascending staircase showing the 6 adoption steps — no prices, just
     the journey from 5-person admin to multi-factory Ai brain. */
  const { t } = useLang();
  const STEPS: Array<{
    step: string;
    name: string;
    clients: number | null;   // null = not available yet (e.g. Ai Server)
    capacity: string;          // CORE TEAM · DEPT · FACTORY · Hardware …
    h: number;
    grad: string;
    accent: string;
    icon: React.ReactNode;
  }> = [
    {
      step: "Step 1",
      name: "Cloud · Starter",
      clients: 3,
      capacity: t("cap.core"),
      h: 170,
      grad: "from-sky-100 to-white",
      accent: "text-yai-blue",
      icon: <AvatarCluster count={5} size={18} cols={5} />,
    },
    {
      step: "Step 2",
      name: "Cloud · Growth",
      clients: 2,
      capacity: t("cap.dept"),
      h: 200,
      grad: "from-sky-200 to-sky-50",
      accent: "text-yai-blue",
      icon: <AvatarCluster count={20} size={11} cols={5} />,
    },
    {
      step: "Step 3",
      name: "Cloud · Enterprise",
      clients: 2,
      capacity: t("cap.factory"),
      h: 230,
      grad: "from-blue-200 to-blue-50",
      accent: "text-yai-blue",
      icon: <AvatarCluster count={36} size={8} cols={6} />,
    },
    {
      step: "Step 4",
      name: "Ai Server",
      clients: 2,
      capacity: t("cap.hardware"),
      h: 260,
      grad: "from-indigo-200 to-indigo-50",
      accent: "text-indigo-700",
      icon: <ServerStack />,
    },
    {
      step: "Step 4",
      name: "Administrative",
      clients: 2,
      capacity: t("cap.tools"),
      h: 260,
      grad: "from-indigo-300 to-indigo-100",
      accent: "text-indigo-700",
      icon: <BriefcaseIcon />,
    },
    {
      step: "Step 4",
      name: "Operation",
      clients: 1,
      capacity: t("cap.tools"),
      h: 260,
      grad: "from-indigo-400 to-indigo-200",
      accent: "text-indigo-800",
      icon: <FactoryIcon />,
    },
    {
      step: "Step 5",
      name: "Agentic",
      clients: 1,
      capacity: t("cap.6mo"),
      h: 300,
      grad: "from-violet-300 to-violet-100",
      accent: "text-violet-700",
      icon: <AgenticPortraitCluster />,
    },
    {
      step: "Step 6",
      name: "Big Ai Brain",
      clients: 1,
      capacity: t("cap.boss"),
      h: 340,
      grad: "from-orange-300 to-orange-100",
      accent: "text-yai-orange",
      icon: <BossBrainIcon />,
    },
  ];

  return (
    <Section id="customers" className="bg-yai-bg !pt-4 lg:!pt-6">
      <SectionEyebrow>{t("journey.eyebrow")}</SectionEyebrow>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-x-10 gap-y-3 items-end">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-yai-navy text-balance">
            {t("journey.title")}
          </h2>
          <div className="mt-3 text-[11px] uppercase tracking-[0.22em] font-extrabold text-yai-orange">
            {t("journey.stamp")}
          </div>
        </div>
        <p className="text-base text-gray-600 leading-relaxed">
          {t("journey.para")}
        </p>
      </div>

      {/* Wrapper structure kept IDENTICAL to the PricingStaircase wrapper
          (-mx-1 px-1 + min-w-max) so the two ladders' pillars line up
          100% column-for-column. */}
      <div className="overflow-x-auto pb-4 mt-10 -mx-1 px-1">
        <div className="min-w-max">
          <div className="flex items-end gap-4">
            {STEPS.map((s) => (
              <FlatStepColumn key={`${s.step}-${s.name}`} s={s} />
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 italic mt-4 max-w-3xl">
        {t("journey.note")}
      </p>
    </Section>
  );
}

/** A tier group on the adoption ladder — its step columns share a big
 *  tier number rendered in each column's bottom slot. Label sits centred
 *  underneath the group as a small caption. */
function TierGroup({
  steps,
  phase,
  label,
  color,
  bg,
}: {
  steps: Array<{
    step: string; name: string; sub: string; h: number;
    grad: string; accent: string; icon: React.ReactNode;
  }>;
  phase: string;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-end gap-2">
        {steps.map((s) => (
          <StepColumn
            key={`${s.step}-${s.name}`}
            s={s}
            tier={phase}
            tierColor={color}
            tierBg={bg}
          />
        ))}
      </div>
      {/* Small tier caption beneath the row of columns */}
      <div className={`text-[10px] uppercase tracking-[0.22em] font-extrabold mt-3 ${color}`}>
        Tier {phase} · {label}
      </div>
    </div>
  );
}

/** Flat step column — no tier badge, no bottom slot. Renders the
 *  client count as a BIG hero number with "clients" + capacity caption
 *  below, so the customer count reads at a glance. */
function FlatStepColumn({
  s,
}: {
  s: {
    step: string; name: string;
    clients: number | null; capacity: string;
    h: number;
    grad: string; accent: string; icon: React.ReactNode;
  };
}) {
  return (
    <div className="flex flex-col shrink-0 w-[124px]" style={{ height: s.h }}>
      {/* Gradient tower body */}
      <div className={`flex-1 rounded-t-2xl border border-b-0 border-yai-border bg-gradient-to-b ${s.grad} flex flex-col items-center px-3.5 pt-4 pb-3 text-center`}>
        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
          {s.step}
        </div>
        <div className={`text-[12px] font-bold leading-tight mt-1.5 ${s.accent}`}>
          {s.name}
        </div>
        {/* Icon / avatar cluster fills the middle */}
        <div className="flex-1 flex items-center justify-center w-full mt-3">
          {s.icon}
        </div>
      </div>
      {/* White tab — BIG number only (no "clients" word) + capacity caption.
          Mirrors the price slot on the PricingStaircase towers. */}
      <div className="rounded-b-xl border border-yai-border bg-white text-center py-2.5 px-1.5">
        <div className={`text-3xl font-extrabold leading-none ${s.accent}`}>
          {s.clients !== null ? s.clients : "—"}
        </div>
        <div className={`text-[9px] uppercase tracking-[0.18em] font-extrabold mt-1 ${s.accent} opacity-80`}>
          {s.capacity}
        </div>
      </div>
    </div>
  );
}

/** Legacy step column with tier-circle badge — retained for reference
 *  in case we want the tier-grouped view back. Not used in the current
 *  flat layout. */
function StepColumn({
  s,
  tier,
  tierColor,
  tierBg,
}: {
  s: {
    step: string; name: string; sub: string; h: number;
    grad: string; accent: string; icon: React.ReactNode;
  };
  tier: string;
  tierColor: string;
  tierBg: string;
}) {
  return (
    <div className="flex flex-col shrink-0 w-[112px]" style={{ height: s.h }}>
      <div className={`flex-1 rounded-t-2xl border border-b-0 border-yai-border bg-gradient-to-b ${s.grad} flex flex-col items-center p-3 text-center`}>
        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
          {s.step}
        </div>
        <div className={`text-[12px] font-bold leading-tight mt-1.5 ${s.accent}`}>
          {s.name}
        </div>
        <div className="text-[10px] text-gray-500 mt-1 leading-tight px-1">
          {s.sub}
        </div>
        <div className="flex-1 flex items-center justify-center w-full">
          {s.icon}
        </div>
      </div>
      {/* Bottom slot — circular brand badge with the BIG tier number */}
      <div className="rounded-b-xl border border-yai-border bg-white py-3 flex items-center justify-center">
        <div
          className="rounded-full w-12 h-12 flex items-center justify-center shadow-md ring-2 ring-white"
          style={{ background: tierBg }}
        >
          <span className="text-2xl font-extrabold leading-none text-white">{tier}</span>
        </div>
      </div>
    </div>
  );
}

/** Commercialisation journey — horizontal timeline of milestones from
 *  July 2026 onward. Each beat shows a date pill + a one-line outcome. */
function CommercialisationJourney() {
  const MILESTONES: Array<{
    date: string;
    title: string;
    desc: string;
    status: "done" | "live" | "next" | "planned";
  }> = [
    { date: "Jul 2026", title: "Commercialisation starts",   desc: "Gates open · Cloud Starter $120/yr live", status: "live" },
    { date: "Q4 2026",  title: "First 30 paying factories",  desc: "Cloud Starter revenue line live",         status: "next" },
    { date: "Q1 2027",  title: "Starter → Growth upgrades",  desc: "First 5 tier-jumps, 14-day Growth trial", status: "planned" },
    { date: "Q2 2027",  title: "Vertical pilots",            desc: "Hospitality + food + non-garment",        status: "planned" },
    { date: "Q3 2027",  title: "Cross-vertical case study",  desc: "Platform-versatility proof published",    status: "planned" },
    { date: "Q4 2027",  title: "Multi-country expansion",    desc: "First non-Cambodia factory live",         status: "planned" },
    { date: "2028",     title: "Ai Server hardware sales",   desc: "Step 4 hardware revenue line",            status: "planned" },
  ];

  const dotColor = (s: string) =>
    s === "live"     ? "#10B981"
    : s === "next"   ? "#F37021"
    : s === "done"   ? "#1E4DAA"
    :                  "#94A3B8";

  return (
    <div className="mt-14">
      <div className="flex items-baseline gap-4 mb-1">
        <div className="text-[10px] uppercase tracking-[0.22em] font-extrabold text-yai-orange">
          Commercialisation journey
        </div>
        <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">
          · Started July 2026
        </div>
      </div>
      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-yai-navy">
        From gate-open to multi-country revenue.
      </h3>

      {/* Horizontal timeline */}
      <div className="relative mt-7 overflow-x-auto pb-4">
        <div className="relative flex gap-5 min-w-max md:min-w-0 md:gap-0 md:justify-between">
          {/* Continuous baseline (desktop only — md+) */}
          <div className="hidden md:block absolute left-0 right-0 top-[18px] h-px bg-gradient-to-r from-yai-orange via-yai-blue/40 to-gray-300 pointer-events-none" />

          {MILESTONES.map((m) => (
            <div key={m.date} className="flex flex-col items-center text-center w-[150px] shrink-0 relative">
              {/* Dot on the timeline */}
              <div className="relative z-10">
                <span
                  className="block w-9 h-9 rounded-full ring-4 ring-yai-bg shadow"
                  style={{ background: dotColor(m.status) }}
                />
              </div>
              {/* Date pill */}
              <div className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-yai-navy">
                {m.date}
              </div>
              {/* Title */}
              <div className="mt-2 font-serif font-semibold text-yai-navy text-[13px] leading-tight">
                {m.title}
              </div>
              {/* Description */}
              <div className="mt-1.5 text-[11.5px] text-gray-600 leading-snug px-1">
                {m.desc}
              </div>
              {/* Status label */}
              <div
                className="mt-2 text-[9px] uppercase tracking-[0.18em] font-extrabold"
                style={{ color: dotColor(m.status) }}
              >
                {m.status === "live"    ? "Live"
                : m.status === "next"   ? "Next"
                : m.status === "done"   ? "Done"
                :                          "Planned"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── tiny visuals for each step on the ladder ─── */

/** Avatar cluster — real photo portraits in a grid, cycled from the
 *  5 source images so larger clusters fill in with varied faces. Used
 *  in Steps 1-3 to show team/department/factory scale visually. */
function AvatarCluster({
  count,
  size,
  cols,
}: {
  count: number;
  size: number;
  cols: number;
}) {
  const IMAGES = [
    "/images/agent-9.png",
    "/images/agent-10.png",
    "/images/agent-11.png",
    "/images/agent-22.png",
    "/images/agent-30.png",
  ];
  return (
    <div
      className="grid gap-[1.5px]"
      style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)` }}
    >
      {Array.from({ length: count }, (_, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={IMAGES[i % IMAGES.length]}
          alt=""
          className="rounded-full object-cover border border-white/60"
          style={{ width: size, height: size, objectPosition: "50% 18%" }}
          draggable={false}
        />
      ))}
    </div>
  );
}

/** Agentic step — 4 portrait avatars + a "MANY OTHERS" caption,
 *  echoing the yai-plan layout where the agentic step features a
 *  visible team plus many invisible companions. */
function AgenticPortraitCluster() {
  const IMAGES = [
    "/images/agent-9.png",
    "/images/agent-22.png",
    "/images/agent-11.png",
    "/images/agent-30.png",
  ];
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex -space-x-1.5">
        {IMAGES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            className="rounded-full object-cover w-7 h-7 border-2 border-white shadow-sm"
            style={{ objectPosition: "50% 18%" }}
            draggable={false}
          />
        ))}
      </div>
      <div className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-violet-700">
        + many others
      </div>
    </div>
  );
}

/** Boss + Big Ai Brain — single large boss avatar with a chat bubble
 *  icon next to it, sitting above 5 mini factory icons. */
function BossBrainIcon() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/agent-10.png"
          alt="Boss"
          className="rounded-full object-cover w-10 h-10 border-2 border-white shadow-md"
          style={{ objectPosition: "50% 18%" }}
          draggable={false}
        />
        {/* chat bubble badge attached to the avatar */}
        <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-white shadow flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-yai-orange" fill="currentColor">
            <path d="M4 4h16v12H7l-3 3V4z" />
          </svg>
        </span>
      </div>
      {/* 5 mini factory icons */}
      <div className="flex items-center gap-0.5 text-yai-orange">
        {[1, 2, 3, 4, 5].map((n) => (
          <svg key={n} viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="currentColor">
            <path d="M3 21h18V11l-6 4V11l-6 4V7L3 11v10z" />
          </svg>
        ))}
      </div>
      <div className="text-[8px] font-extrabold uppercase tracking-wide text-yai-orange leading-tight text-center">
        5 factories<br />1 chat
      </div>
    </div>
  );
}

function DotCluster({ count, cols, color }: { count: number; cols: number; color: string }) {
  return (
    <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color, opacity: 0.7 + (i / count) * 0.3 }}
        />
      ))}
    </div>
  );
}
function ServerStack() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10" stroke="currentColor" fill="none" strokeWidth="1.6">
      <rect x="4" y="3" width="16" height="5" rx="1" />
      <circle cx="7" cy="5.5" r="0.8" fill="currentColor" />
      <line x1="10" y1="5.5" x2="17" y2="5.5" strokeLinecap="round" />
      <rect x="4" y="10" width="16" height="5" rx="1" />
      <circle cx="7" cy="12.5" r="0.8" fill="currentColor" />
      <line x1="10" y1="12.5" x2="17" y2="12.5" strokeLinecap="round" />
      <rect x="4" y="17" width="16" height="3" rx="1" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10" stroke="currentColor" fill="none" strokeWidth="1.6">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
      <line x1="3" y1="13" x2="21" y2="13" strokeLinecap="round" />
    </svg>
  );
}
function FactoryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10" stroke="currentColor" fill="none" strokeWidth="1.6">
      <path d="M3 21h18V11l-6 4V11l-6 4V7L3 11v10z" strokeLinejoin="round" />
      <line x1="8" y1="17" x2="8" y2="19" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12" y2="19" strokeLinecap="round" />
      <line x1="16" y1="17" x2="16" y2="19" strokeLinecap="round" />
    </svg>
  );
}
function CombinedToolsIcon() {
  // Briefcase (admin) + factory (operations) side-by-side, telegraphing
  // that this column carries BOTH tool stacks.
  return (
    <div className="flex items-center gap-1 text-indigo-700">
      <svg viewBox="0 0 24 24" className="w-7 h-7" stroke="currentColor" fill="none" strokeWidth="1.7">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
        <line x1="3" y1="13" x2="21" y2="13" strokeLinecap="round" />
      </svg>
      <span className="text-indigo-400 font-bold text-xs">+</span>
      <svg viewBox="0 0 24 24" className="w-7 h-7" stroke="currentColor" fill="none" strokeWidth="1.7">
        <path d="M3 21h18V11l-6 4V11l-6 4V7L3 11v10z" strokeLinejoin="round" />
        <line x1="8" y1="17" x2="8" y2="19" strokeLinecap="round" />
        <line x1="12" y1="17" x2="12" y2="19" strokeLinecap="round" />
        <line x1="16" y1="17" x2="16" y2="19" strokeLinecap="round" />
      </svg>
    </div>
  );
}
function AgenticCluster() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="grid grid-cols-4 gap-[2px]">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-violet-600" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[1px] mt-0.5 opacity-70">
        {Array.from({ length: 21 }, (_, i) => (
          <span key={i} className="w-1 h-1 rounded-full bg-violet-500" />
        ))}
      </div>
      <div className="text-[8px] font-bold uppercase tracking-wide text-violet-700 mt-1">
        + many others
      </div>
    </div>
  );
}
function BigBrainIcon() {
  return (
    <div className="flex flex-col items-center gap-1.5 text-yai-orange">
      <svg viewBox="0 0 24 24" className="w-9 h-9" stroke="currentColor" fill="none" strokeWidth="1.6">
        <path d="M9 4a2.6 2.6 0 00-2.6 2.6c-1.4 0-2.4 1-2.4 2.4 0 1 .6 1.9 1.5 2.3-.3.5-.5 1-.5 1.6a2.5 2.5 0 002.5 2.5v.6A2.6 2.6 0 009 19V4z" />
        <path d="M15 4a2.6 2.6 0 012.6 2.6c1.4 0 2.4 1 2.4 2.4 0 1-.6 1.9-1.5 2.3.3.5.5 1 .5 1.6a2.5 2.5 0 01-2.5 2.5v.6A2.6 2.6 0 0115 19V4z" />
        <line x1="12" y1="4" x2="12" y2="21" strokeLinecap="round" />
      </svg>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <svg key={n} viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="currentColor">
            <path d="M3 21h18V11l-6 4V11l-6 4V7L3 11v10z" />
          </svg>
        ))}
      </div>
      <div className="text-[8px] font-bold uppercase tracking-wide leading-tight text-center">
        5 factories<br />1 chat
      </div>
    </div>
  );
}

/** Apex icon for the merged Agentic → Big Ai Brain column. Shows the
 *  agent cluster flowing UP into the brain — telegraphs the progression
 *  from "many agents" to "one boss-level intelligence" in a single
 *  visual. */
function ApexBrainIcon() {
  return (
    <div className="flex flex-col items-center gap-1.5 text-yai-orange">
      {/* Big Ai Brain on top */}
      <svg viewBox="0 0 24 24" className="w-9 h-9" stroke="currentColor" fill="none" strokeWidth="1.6">
        <path d="M9 4a2.6 2.6 0 00-2.6 2.6c-1.4 0-2.4 1-2.4 2.4 0 1 .6 1.9 1.5 2.3-.3.5-.5 1-.5 1.6a2.5 2.5 0 002.5 2.5v.6A2.6 2.6 0 009 19V4z" />
        <path d="M15 4a2.6 2.6 0 012.6 2.6c1.4 0 2.4 1 2.4 2.4 0 1-.6 1.9-1.5 2.3.3.5.5 1 .5 1.6a2.5 2.5 0 01-2.5 2.5v.6A2.6 2.6 0 0115 19V4z" />
        <line x1="12" y1="4" x2="12" y2="21" strokeLinecap="round" />
      </svg>
      {/* Agentic dots flowing UP toward the brain — Step 5 feeding Step 6 */}
      <div className="grid grid-cols-5 gap-[2px] -mt-0.5">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-yai-orange" />
        ))}
      </div>
      {/* 5 mini factories */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <svg key={n} viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="currentColor">
            <path d="M3 21h18V11l-6 4V11l-6 4V7L3 11v10z" />
          </svg>
        ))}
      </div>
      <div className="text-[8px] font-bold uppercase tracking-wide leading-tight text-center">
        10 agents · 5 factories<br />1 chat
      </div>
    </div>
  );
}

/* ─────────────── PARTNER STACK ─────────────── */
function PartnerStack() {
  const { t } = useLang();
  const partners = [
    {
      name: "Anthropic · Claude Partner Network",
      tag: "Powered by Claude",
      logo: "/images/logo-claude.svg",
      logoAlt: "Anthropic",
      desc: t("partners.claude.desc"),
      bullet: ["Production use of Claude Sonnet 4.5", "Anthropic Academy certified team", "Responsible-AI policy live"],
      color: "#D97757",
      cta: "Read the technical brief",
    },
    {
      name: "Google Ai Services",
      tag: "Built on GCP",
      logo: "/images/logo-googlecloud.svg",
      logoAlt: "Google Cloud",
      desc: t("partners.google.desc"),
      bullet: ["Vertex AI · Gemini · Cloud Run", "Multi-region ASEAN deployment", "$300 credit pilots → enterprise tier"],
      color: "#4285F4",
      cta: "See the GCP architecture",
    },
    {
      name: "JICA · Cambodia digitalisation",
      tag: "Impact-aligned",
      logo: "/images/logo-jica.svg",
      logoAlt: "JICA",
      desc: t("partners.jica.desc"),
      bullet: ["Ministry of Environment ✓", "Cambodia-born team", "Solar-powered Layer 3 compute"],
      color: "#0A3327",
      cta: "Read the impact dossier",
    },
  ];

  return (
    <Section id="partners" className="!pt-4 lg:!pt-6">
      <SectionEyebrow>{t("partners.eyebrow")}</SectionEyebrow>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-x-10 gap-y-3 items-end">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-yai-navy text-balance">
          {t("partners.title")}
        </h2>
        <p className="text-base text-gray-600 leading-relaxed">
          {t("partners.para")}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-5 mt-10">
        {partners.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1}>
            <div className="rounded-2xl bg-white p-7 border border-black/5 hover:shadow-2xl transition h-full flex flex-col">
              {/* Partner logo */}
              <div className="h-10 flex items-center mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.logo}
                  alt={p.logoAlt}
                  className="h-9 w-auto object-contain"
                  draggable={false}
                />
              </div>
              <div
                className="self-start text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full text-white"
                style={{ background: p.color }}
              >
                {p.tag}
              </div>
              <h3 className="font-serif text-xl font-semibold text-yai-navy mt-4 leading-tight">
                {p.name}
              </h3>
              <p className="text-[13.5px] text-gray-600 mt-3 leading-relaxed">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────── PRICING (full yai-plan PricingStaircase) ─────────────── */
function PricingTease() {
  const { t } = useLang();
  return (
    <Section id="pricing" className="bg-gradient-to-b from-white to-yai-bg !pt-2 lg:!pt-3">
      <SectionEyebrow>{t("pricing.eyebrow")}</SectionEyebrow>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-x-10 gap-y-3 items-end">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-yai-navy text-balance">
          {t("pricing.title")}
        </h2>
        <p className="text-base text-gray-600 leading-relaxed">
          {t("pricing.para")}
        </p>
      </div>

      <div className="mt-5">
        <PricingStaircase />
      </div>
    </Section>
  );
}

/* ── Inline SVG icons used by the staircase ── */
const SC_IconServer = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-9 h-9">
    <rect x="4" y="3" width="16" height="5" rx="1" />
    <circle cx="7" cy="5.5" r="0.8" fill="currentColor" />
    <line x1="10" y1="5.5" x2="17" y2="5.5" strokeLinecap="round" />
    <rect x="4" y="10" width="16" height="5" rx="1" />
    <circle cx="7" cy="12.5" r="0.8" fill="currentColor" />
    <line x1="10" y1="12.5" x2="17" y2="12.5" strokeLinecap="round" />
    <rect x="4" y="17" width="16" height="3" rx="1" />
  </svg>
);
const SC_IconBriefcase = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-9 h-9">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
    <line x1="3" y1="13" x2="21" y2="13" strokeLinecap="round" />
    <line x1="11" y1="13" x2="13" y2="13" stroke="white" strokeWidth="2" />
  </svg>
);
const SC_IconFactory = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-9 h-9">
    <path d="M3 21h18V11l-6 4V11l-6 4V7L3 11v10z" strokeLinejoin="round" />
    <line x1="8" y1="17" x2="8" y2="19" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12" y2="19" strokeLinecap="round" />
    <line x1="16" y1="17" x2="16" y2="19" strokeLinecap="round" />
  </svg>
);

/* ── Avatar-cluster blocks — 5 sizes from core team through factory ── */
const SC_ClusterTeam = (
  <div className="flex flex-col items-center gap-1.5">
    <div className="flex items-center -space-x-1.5">
      {[1, 2, 3, 4, 6].map((n) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={n} src={`/images/agent-${n}.png`} alt="" className="w-7 h-7 rounded-full ring-2 ring-white shadow-sm object-cover" />
      ))}
    </div>
    <div className="flex items-end gap-0.5 text-yai-blue h-2.5">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-2 h-2 opacity-55">
        <path d="M21 11c0 3.9-4 7-9 7-1 0-2-.1-3-.4l-4 2.4 1-3.6C3 14.6 2.4 12.9 2.4 11c0-3.9 4-7 9-7s9.6 3.1 9.6 7z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
        <path d="M21 11c0 3.9-4 7-9 7-1 0-2-.1-3-.4l-4 2.4 1-3.6C3 14.6 2.4 12.9 2.4 11c0-3.9 4-7 9-7s9.6 3.1 9.6 7z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-2 h-2 opacity-55">
        <path d="M21 11c0 3.9-4 7-9 7-1 0-2-.1-3-.4l-4 2.4 1-3.6C3 14.6 2.4 12.9 2.4 11c0-3.9 4-7 9-7s9.6 3.1 9.6 7z" />
      </svg>
    </div>
    <div className="text-[9px] font-bold text-yai-blue uppercase tracking-wider">5 · core team</div>
  </div>
);

const SC_ClusterMidTeam = (
  <div className="flex flex-col items-center gap-1.5">
    <div className="grid grid-cols-7 gap-[2px]">
      {[1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 18, 20, 22].map((n) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={n} src={`/images/agent-${n}.png`} alt="" className="w-[14px] h-[14px] rounded-full ring-[1.5px] ring-white shadow-sm object-cover" />
      ))}
    </div>
    <div className="text-[9px] font-bold text-yai-blue uppercase tracking-wider">5 → 300 · dept</div>
  </div>
);

const SC_ClusterBigTeam = (
  <div className="flex flex-col items-center gap-1.5">
    <div className="grid grid-cols-7 gap-[1px]">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 24, 25, 26, 29, 30, 33, 38].map((n, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={`/images/agent-${n}.png`} alt="" className="w-[10px] h-[10px] rounded-full ring-[0.5px] ring-white object-cover" />
      ))}
    </div>
    <div className="text-[9px] font-bold text-yai-blue uppercase tracking-wider">300 → 1,000 · factory</div>
  </div>
);

const SC_ClusterAgentic = (
  <div className="flex flex-col items-center gap-1">
    <div className="flex items-center -space-x-1.5">
      {[1, 4, 9, 22].map((n) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={n} src={`/images/agent-${n}.png`} alt="" className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm object-cover" />
      ))}
    </div>
    <div className="text-[8px] font-bold text-yai-blue uppercase tracking-wider">+ many others</div>
  </div>
);

const SC_ClusterBrain = (
  <div className="flex flex-col items-center gap-1.5 text-yai-orange">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-9 h-9">
      <path d="M9 4a2.6 2.6 0 00-2.6 2.6c-1.4 0-2.4 1-2.4 2.4 0 1 .6 1.9 1.5 2.3-.3.5-.5 1-.5 1.6a2.5 2.5 0 002.5 2.5v.6A2.6 2.6 0 009 19V4z" />
      <path d="M15 4a2.6 2.6 0 012.6 2.6c1.4 0 2.4 1 2.4 2.4 0 1-.6 1.9-1.5 2.3.3.5.5 1 .5 1.6a2.5 2.5 0 01-2.5 2.5v.6A2.6 2.6 0 0115 19V4z" />
      <line x1="12" y1="4" x2="12" y2="21" strokeLinecap="round" />
    </svg>
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/agent-boss.png" alt="" className="w-9 h-9 rounded-full ring-2 ring-white shadow object-cover" />
      <div className="absolute -top-1 -right-2 bg-white border border-yai-orange rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="#F37021" strokeWidth="2.5" className="w-2.5 h-2.5">
          <path d="M21 11c0 3.9-4 7-9 7-1 0-2-.1-3-.4l-4 2.4 1-3.6C3 14.6 2.4 12.9 2.4 11c0-3.9 4-7 9-7s9.6 3.1 9.6 7z" />
        </svg>
      </div>
    </div>
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
          <path d="M3 21h18V11l-6 4V11l-6 4V7L3 11v10z" />
        </svg>
      ))}
    </div>
    <div className="text-[8px] font-bold uppercase tracking-wider leading-tight text-center">5 factories<br />1 chat</div>
  </div>
);

type StaticStep = {
  step: string;
  stage: string;
  sub: string;
  price: string;
  per: string;
  h: number;
  bg: string;
  accent: string;
  icon: React.ReactNode;
};

const SC_BEFORE: StaticStep[] = [
  { step: "Step 1", stage: "Cloud · Starter",    sub: "5 key members",     price: "$120",   per: "/ year", h: 250, bg: "from-sky-100 to-white",    accent: "text-yai-blue", icon: SC_ClusterTeam },
  { step: "Step 2", stage: "Cloud · Growth",     sub: "5 – 300 users",     price: "$750",   per: "/ year", h: 290, bg: "from-sky-200 to-sky-50",   accent: "text-yai-blue", icon: SC_ClusterMidTeam },
  { step: "Step 3", stage: "Cloud · Enterprise", sub: "300 – 1,000 users", price: "$1,200", per: "/ year", h: 325, bg: "from-blue-200 to-blue-50", accent: "text-yai-blue", icon: SC_ClusterBigTeam },
];

const SC_AFTER: StaticStep[] = [
  { step: "Step 5", stage: "Agentic",      sub: "After ~6 months",      price: "+ $5,000", per: "/ year · 10 agents + 35 mini",       h: 410, bg: "from-violet-200 to-violet-50", accent: "text-yai-blue",   icon: SC_ClusterAgentic },
  { step: "Step 6", stage: "Big Ai Brain", sub: "Boss · after ~1 year", price: "+ $5,000", per: "/ year · talks across 5+ factories", h: 460, bg: "from-orange-200 to-orange-50", accent: "text-yai-orange", icon: SC_ClusterBrain },
];

function SC_StepCard({ s }: { s: StaticStep }) {
  return (
    <div className="relative flex flex-col shrink-0 w-[124px]" style={{ height: s.h }}>
      <div className={`flex-1 rounded-t-2xl border border-b-0 border-yai-border bg-gradient-to-b ${s.bg} flex flex-col items-center p-2 text-center`}>
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{s.step}</div>
        <div className="text-[13px] font-bold text-yai-navy leading-tight mt-1.5 px-0.5">{s.stage}</div>
        <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{s.sub}</div>
        <div className={`${s.accent} flex-1 flex items-center justify-center`}>{s.icon}</div>
      </div>
      <div className="rounded-b-xl border border-yai-border bg-white text-center py-2.5 px-1.5">
        <div className={`font-extrabold text-xl leading-none ${s.accent}`}>{s.price}</div>
        <div className="text-[10px] text-gray-500 mt-1 leading-tight">{s.per}</div>
      </div>
    </div>
  );
}

function SC_ServerPillar({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col shrink-0 w-[124px]" style={{ height: 360 }}>
      <div className={`flex-1 rounded-t-2xl border border-b-0 border-yai-border bg-gradient-to-b ${on ? "from-orange-200 to-orange-50" : "from-indigo-100 to-white"} flex flex-col items-center p-2 text-center transition-colors`}>
        <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Step 4</div>
        <div className="text-[11px] font-bold text-yai-navy leading-tight mt-1 px-0.5">Ai Server</div>
        <div className="text-[9px] text-gray-500 mt-0.5 leading-tight">Hardware · 1,000+ users</div>
        <div className={`${on ? "text-yai-orange" : "text-gray-400"} flex-1 flex items-center justify-center transition-colors`}>{SC_IconServer}</div>
        <button
          onClick={onToggle}
          className={`w-full text-[10px] font-bold uppercase tracking-wider rounded px-1.5 py-1.5 border transition-colors ${
            on
              ? "bg-yai-orange text-white border-yai-orange"
              : "bg-white text-gray-500 border-yai-border hover:text-yai-orange hover:border-yai-orange"
          }`}
        >
          {on ? "✓ Bought" : "Buy $2,500"}
        </button>
      </div>
      <div className="rounded-b-xl border border-yai-border bg-white text-center py-2.5 px-1.5 min-h-[52px]">
        <AnimatePresence mode="wait">
          {on ? (
            <motion.div
              key="on"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-extrabold text-xl leading-none text-yai-orange">$2,500</div>
              <div className="text-[10px] text-gray-500 mt-1 leading-tight">once · hardware + setup</div>
            </motion.div>
          ) : (
            <motion.div
              key="off"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-gray-400 leading-tight pt-1"
            >
              tap to see what&apos;s next
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SC_TwinPillar({
  title,
  sub,
  icon,
  price,
  on,
  onToggle,
  disabled,
}: {
  title: string;
  sub: string;
  icon: React.ReactNode;
  price: string;
  on: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <div className={`relative flex flex-col shrink-0 w-[124px] transition-opacity ${disabled ? "opacity-55" : ""}`} style={{ height: 360 }}>
      <div className={`flex-1 rounded-t-2xl border border-b-0 border-yai-border bg-gradient-to-b ${on && !disabled ? "from-indigo-300 to-indigo-50" : "from-indigo-100 to-white"} flex flex-col items-center p-2 text-center transition-colors`}>
        <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Step 4</div>
        <div className="text-[11px] font-bold text-yai-navy leading-tight mt-1 px-0.5">{title}</div>
        <div className="text-[9px] text-gray-500 mt-0.5 leading-tight">{sub}</div>
        <div className={`${on && !disabled ? "text-yai-blue" : "text-gray-400"} flex-1 flex items-center justify-center transition-colors`}>{icon}</div>
        <button
          onClick={onToggle}
          disabled={disabled}
          title={disabled ? "Buy the Ai server first" : ""}
          className={`w-full text-[10px] font-bold uppercase tracking-wider rounded px-1.5 py-1.5 border transition-colors ${
            disabled
              ? "bg-gray-100 text-gray-400 border-yai-border cursor-not-allowed"
              : on
                ? "bg-yai-blue text-white border-yai-blue"
                : "bg-white text-gray-500 border-yai-border hover:text-yai-blue hover:border-yai-blue"
          }`}
        >
          {disabled ? "🔒 Locked" : on ? "✓ Activated" : "Activate"}
        </button>
      </div>
      <div className="rounded-b-xl border border-yai-border bg-white text-center py-2.5 px-1.5 min-h-[52px]">
        <AnimatePresence mode="wait">
          {on && !disabled ? (
            <motion.div
              key="on"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-extrabold text-xl leading-none text-yai-blue">+ {price}</div>
              <div className="text-[10px] text-gray-500 mt-1 leading-tight">/ year</div>
            </motion.div>
          ) : (
            <motion.div
              key="off"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-gray-400 leading-tight pt-1"
            >
              {disabled ? "buy server first" : "tap to activate"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PricingStaircase() {
  const [server, setServer] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [prod, setProd] = useState(false);
  const yearly = (admin ? 5000 : 0) + (prod ? 10000 : 0);
  const fmt = (n: number) => "$" + n.toLocaleString();

  const toggleServer = () => {
    setServer((v) => {
      const next = !v;
      if (!next) { setAdmin(false); setProd(false); }
      return next;
    });
  };

  return (
    <>
      <div className="overflow-x-auto pb-4 -mx-1 px-1">
        <LayoutGroup>
          <div className="min-w-max">
            <div className="flex items-end gap-4">
              {SC_BEFORE.map((s) => <SC_StepCard key={s.step} s={s} />)}
              <SC_ServerPillar on={server} onToggle={toggleServer} />
              <SC_TwinPillar
                title="Administrative"
                sub="tools"
                icon={SC_IconBriefcase}
                price="$5,000"
                on={admin}
                onToggle={() => setAdmin((v) => !v)}
                disabled={!server}
              />
              <SC_TwinPillar
                title="Operation"
                sub="tools"
                icon={SC_IconFactory}
                price="$10,000"
                on={prod}
                onToggle={() => setProd((v) => !v)}
                disabled={!server}
              />
              {SC_AFTER.map((s) => <SC_StepCard key={s.step} s={s} />)}
            </div>
            {/* Phase labels spanning their pillars (towers 124w + 16px gaps · matches Journey ladder) */}
            <div className="flex gap-4 mt-3">
              <div style={{ width: 6 * 124 + 5 * 16 }} className="shrink-0 rounded-md bg-yai-blue/10 border border-yai-blue/30 py-2 text-center">
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-yai-blue">Chaos → Digitalization</span>
              </div>
              <div style={{ width: 2 * 124 + 1 * 16 }} className="shrink-0 rounded-md bg-yai-orange/10 border border-yai-orange/30 py-2 text-center">
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-yai-orange">Big Ai Brain</span>
              </div>
            </div>

            {/* Step 4 total summary — under the Server + Admin + Operation block */}
            <div className="flex gap-4 mt-3">
              <div style={{ width: 3 * 124 + 2 * 16 }} className="shrink-0" aria-hidden />
              <div style={{ width: 3 * 124 + 2 * 16 }} className="shrink-0 rounded-xl border-2 border-dashed border-yai-blue/40 bg-yai-blue/5 p-3">
                <div className="text-[10px] uppercase tracking-widest font-extrabold text-yai-blue text-center mb-2">Step 4 · Total</div>
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-yai-orange">Server</span>
                  <motion.span
                    key={server ? "bought" : "no"}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.18 }}
                    className={`font-extrabold ${server ? "text-yai-navy" : "text-gray-400"}`}
                  >
                    {server ? "$2,500 paid" : "not yet"}
                  </motion.span>
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-2 pt-2 border-t border-yai-blue/15">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-yai-blue">Yearly · active</span>
                  <motion.span
                    key={yearly}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className={`font-extrabold text-lg leading-none ${yearly ? "text-yai-blue" : "text-gray-400"}`}
                  >
                    {fmt(yearly)}<span className="text-[10px] text-gray-500 font-normal">/yr</span>
                  </motion.span>
                </div>
              </div>
              <div style={{ width: 2 * 124 + 1 * 16 }} className="shrink-0" aria-hidden />
            </div>
          </div>
        </LayoutGroup>
      </div>

      <p className="text-xs text-gray-500 italic mt-3">
        Each step builds on the one before. <span className="text-yai-blue font-semibold">Buy the Ai server first ($2,500)</span>, then tap to activate Administrative ($5K/yr) and/or Operation ($10K/yr).
      </p>
    </>
  );
}

/* ─────────────── IMPACT (JICA-flavoured) ─────────────── */
function Impact() {
  /* Full-width cinematic presentation — the 4 Vertex-generated frames
     (Today → L1 → L2 → L3) auto-cycle in a big TV frame with a
     lower-third caption. No headline, no stat cards: the visuals
     carry the section. */
  const { t } = useLang();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % CINEMA_FRAMES.length);
    }, 3600);
    return () => clearInterval(id);
  }, [paused]);

  const f = CINEMA_FRAMES[idx];

  return (
    <Section id="impact" className="bg-yai-navy text-white relative overflow-hidden !pt-10 lg:!pt-12">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-yai-blue/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-yai-orange/20 blur-3xl pointer-events-none" />
      <div className="relative max-w-5xl mx-auto">
        {/* Big TV frame */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black"
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 1.07 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={f.img}
                alt={t(`dream.${f.k}.title`)}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority={idx === 0}
                className="object-cover"
              />
              {/* Layer-1-only orange data-hub glow */}
              {f.k === "l1" && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay"
                  style={{
                    background:
                      "radial-gradient(ellipse 18% 22% at 50% 56%, rgba(243,112,33,0.95) 0%, rgba(243,112,33,0.55) 50%, rgba(243,112,33,0) 100%)",
                  }}
                />
              )}
              {/* Lower-third caption — tag pill + title + one-liner */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-20 pb-6 px-6 lg:px-9">
                <span
                  className="inline-block text-[11px] font-extrabold uppercase tracking-[0.18em] px-3 py-1.5 rounded-md text-white"
                  style={{ background: f.accent }}
                >
                  {t(`dream.${f.k}.tag`)}
                </span>
                <h3 className="font-serif text-xl lg:text-3xl font-semibold leading-tight mt-2.5">
                  {t(`dream.${f.k}.title`)}
                </h3>
                <p className="text-[13px] lg:text-sm text-white/75 mt-1.5 max-w-2xl leading-relaxed">
                  {t(`dream.${f.k}.cap`)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots — click to jump to a frame */}
        <div className="flex justify-center gap-2.5 mt-6">
          {CINEMA_FRAMES.map((frame, i) => (
            <button
              key={frame.k}
              onClick={() => setIdx(i)}
              aria-label={t(`dream.${frame.k}.tag`)}
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: i === idx ? 34 : 8,
                background: i === idx ? f.accent : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

/** One agent's transformation in a single card — Accounting example.
 *  4 animated mini-scenes side by side: paper era → digital forms →
 *  agents automating → full-Ai analysis. */
function AccountingTransformCard() {
  const { t } = useLang();
  const ERAS: Array<{
    tag: string;
    accent: string;
    caption: string;
    scene: React.ReactNode;
  }> = [
    {
      tag: t("layer.today.tag"),
      accent: "#94A3B8",
      caption: t("acc.cap1"),
      scene: <AccPaperScene />,
    },
    {
      tag: t("layer.l1.tag"),
      accent: "#F37021",
      caption: t("acc.cap2"),
      scene: <AccFormScene />,
    },
    {
      tag: t("layer.l2.tag"),
      accent: "#1E4DAA",
      caption: t("acc.cap3"),
      scene: <AccAgentScene />,
    },
    {
      tag: t("layer.l3.tag"),
      accent: "#0A3327",
      caption: t("acc.cap4"),
      scene: <AccAnalysisScene />,
    },
  ];

  return (
    <div className="mt-14 rounded-3xl bg-white text-yai-navy p-6 lg:p-8 shadow-2xl">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-[10px] uppercase tracking-[0.22em] font-extrabold text-yai-orange">
          {t("acc.eyebrow")}
        </span>
        <h3 className="font-serif text-xl lg:text-2xl font-semibold">
          {t("acc.title")}
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {ERAS.map((e, i) => (
          <div key={e.tag} className="relative">
            {/* arrow between panels (desktop) */}
            {i > 0 && (
              <div className="hidden lg:flex absolute -left-3.5 top-16 z-10 w-7 h-7 rounded-full bg-white border border-yai-border shadow items-center justify-center text-yai-orange text-sm font-black">
                →
              </div>
            )}
            <div className="rounded-2xl border border-yai-border bg-yai-bg/60 overflow-hidden h-full flex flex-col">
              <div
                className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-white px-3 py-1.5"
                style={{ background: e.accent }}
              >
                {e.tag}
              </div>
              <div className="px-2 pt-2">{e.scene}</div>
              <div className="text-[11.5px] text-gray-600 leading-snug px-3 py-3 mt-auto">
                {e.caption}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Era 1 — paper chaos: bobbing paper piles, fluttering sheet, head-wobble
   accountant hammering a calculator. */
function AccPaperScene() {
  return (
    <svg viewBox="0 0 160 110" className="w-full h-auto">
      {/* desk */}
      <rect x="14" y="74" width="132" height="4" rx="2" fill="#CBD5E1" />
      <line x1="30" y1="78" x2="30" y2="100" stroke="#CBD5E1" strokeWidth="3" />
      <line x1="130" y1="78" x2="130" y2="100" stroke="#CBD5E1" strokeWidth="3" />
      {/* accountant */}
      <g className="anim-head-wobble">
        <circle cx="52" cy="40" r="9" fill="#1F2937" />
      </g>
      <line x1="52" y1="49" x2="52" y2="68" stroke="#1F2937" strokeWidth="4" />
      <g className="anim-desk-typing">
        <line x1="52" y1="56" x2="68" y2="66" stroke="#1F2937" strokeWidth="3" />
      </g>
      {/* calculator */}
      <rect x="66" y="64" width="16" height="10" rx="1.5" fill="#475569" />
      <rect x="68" y="66" width="12" height="3" rx="0.5" fill="#94A3B8" />
      {/* ledger book */}
      <rect x="88" y="66" width="22" height="8" rx="1" fill="#fff" stroke="#94A3B8" strokeWidth="1" />
      <line x1="99" y1="66" x2="99" y2="74" stroke="#94A3B8" strokeWidth="0.8" />
      {/* bobbing paper piles */}
      <g className="anim-pile-bob">
        <rect x="116" y="48" width="24" height="4" fill="#fff" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="118" y="52" width="24" height="4" fill="#fff" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="115" y="56" width="24" height="4" fill="#fff" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="117" y="60" width="24" height="4" fill="#fff" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="116" y="64" width="24" height="10" fill="#fff" stroke="#94A3B8" strokeWidth="0.8" />
      </g>
      {/* fluttering loose sheet */}
      <g className="anim-paper-flutter">
        <rect x="20" y="26" width="12" height="15" rx="1" fill="#fff" stroke="#94A3B8" strokeWidth="0.8" />
        <line x1="23" y1="31" x2="29" y2="31" stroke="#CBD5E1" strokeWidth="1" />
        <line x1="23" y1="35" x2="29" y2="35" stroke="#CBD5E1" strokeWidth="1" />
      </g>
    </svg>
  );
}

/* Era 2 — digital forms: fields fill themselves left-to-right while a
   cursor taps SUBMIT; no paper anywhere. */
function AccFormScene() {
  return (
    <svg viewBox="0 0 160 110" className="w-full h-auto">
      {/* monitor */}
      <rect x="30" y="18" width="100" height="64" rx="4" fill="#fff" stroke="#1E4DAA" strokeWidth="1.6" />
      <rect x="68" y="84" width="24" height="4" rx="2" fill="#1E4DAA" />
      {/* form title bar */}
      <rect x="36" y="24" width="42" height="5" rx="2.5" fill="#BFD2F2" />
      {/* fields — staggered self-filling bars */}
      {[36, 48, 60].map((y, i) => (
        <g key={y}>
          <rect x="36" y={y} width="88" height="8" rx="2" fill="#EFF4FB" stroke="#BFD2F2" strokeWidth="0.8" />
          <rect
            x="38" y={y + 2} width="70" height="4" rx="2" fill="#1E4DAA" opacity="0.85"
            className="anim-form-fill"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        </g>
      ))}
      {/* submit button + flash */}
      <rect x="92" y="71" width="32" height="8" rx="4" fill="#F37021" className="anim-submit-flash" />
      <text x="108" y="77" textAnchor="middle" fontSize="5" fontWeight="800" fill="#fff">SUBMIT</text>
      {/* cursor tapping the button */}
      <g className="anim-cursor-tap">
        <path d="M 112 80 l 5 12 l 2.4 -4.6 l 5 1.6 z" fill="#1F2937" />
      </g>
    </svg>
  );
}

/* Era 3 — agents automate: vouchers glide INTO the Ai agent, approval
   ticks pop OUT; the human just watches. */
function AccAgentScene() {
  return (
    <svg viewBox="0 0 160 110" className="w-full h-auto">
      {/* incoming vouchers */}
      {[0, 0.85].map((d, i) => (
        <g key={i} className="anim-doc-in" style={{ animationDelay: `${d}s` }}>
          <rect x="14" y={36 + i * 22} width="14" height="18" rx="1.5" fill="#fff" stroke="#1E4DAA" strokeWidth="1" />
          <line x1="17" y1={42 + i * 22} x2="25" y2={42 + i * 22} stroke="#BFD2F2" strokeWidth="1.2" />
          <line x1="17" y1={46 + i * 22} x2="25" y2={46 + i * 22} stroke="#BFD2F2" strokeWidth="1.2" />
        </g>
      ))}
      {/* the Ai agent — glowing */}
      <g className="anim-agent-glow">
        <circle cx="80" cy="54" r="16" fill="#1E4DAA" />
        <text x="80" y="59" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">Ai</text>
      </g>
      {/* approval ticks popping out */}
      {[0, 0.85].map((d, i) => (
        <g key={i} className="anim-check-pop" style={{ animationDelay: `${d + 0.4}s` }}>
          <circle cx={118 + i * 18} cy={44 + i * 20} r="7" fill="#10B981" />
          <path d={`M ${114.5 + i * 18} ${44 + i * 20} l 2.5 3 l 4.5 -5.5`} stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* human supervising, relaxed */}
      <circle cx="80" cy="92" r="5" fill="#1F2937" />
      <path d="M 72 103 Q 80 96 88 103" stroke="#1F2937" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

/* Era 4 — full Ai: analytics bars grow, accuracy badge pulses. */
function AccAnalysisScene() {
  return (
    <svg viewBox="0 0 160 110" className="w-full h-auto">
      {/* chart frame */}
      <line x1="26" y1="22" x2="26" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="26" y1="84" x2="128" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* growing bars */}
      {[
        { x: 36, h: 24, c: "#1E4DAA", d: 0 },
        { x: 56, h: 34, c: "#1E4DAA", d: 0.25 },
        { x: 76, h: 46, c: "#F37021", d: 0.5 },
        { x: 96, h: 56, c: "#F37021", d: 0.75 },
      ].map((b) => (
        <rect
          key={b.x}
          x={b.x} y={84 - b.h} width="13" height={b.h} rx="2"
          fill={b.c}
          className="anim-bar-grow"
          style={{ animationDelay: `${b.d}s` }}
        />
      ))}
      {/* trend arrow */}
      <path d="M 32 64 L 60 54 L 84 40 L 112 24" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M 112 24 l -7 0 m 7 0 l -1 7" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* accuracy badge */}
      <g className="anim-acc-pulse">
        <rect x="116" y="42" width="34" height="14" rx="7" fill="#0A3327" />
        <text x="133" y="52" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#FACC15">99.9%</text>
      </g>
    </svg>
  );
}

/* ─────────────── CTA ─────────────── */
function CTA() {
  const { t } = useLang();
  return (
    <Section id="contact" className="bg-white">
      <div className="rounded-3xl bg-gradient-to-br from-yai-navy to-yai-blue text-white p-10 lg:p-16 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-yai-orange/40 blur-3xl pointer-events-none" />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
          <div>
            <SectionEyebrow light>{t("cta.eyebrow")}</SectionEyebrow>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-xl leading-relaxed">
              {t("cta.para")}
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <a
              href="mailto:gamini@yaikh.com"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-yai-orange hover:bg-yai-orange/90 text-white font-bold rounded-full shadow-2xl transition"
            >
              gamini@yaikh.com <span aria-hidden>→</span>
            </a>
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/55 font-bold">
              {t("cta.sub")}
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────── FOOTER ─────────────── */
function Footer() {
  return (
    <footer className="bg-yai-navy text-white/60 text-sm">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <Image
            src="/images/yai-logo.jpg"
            alt="Yai"
            width={1280}
            height={1280}
            unoptimized
            className="w-20 h-20 rounded-full drop-shadow-2xl"
          />
          <p className="mt-4 text-[12.5px] leading-relaxed text-white/55">
            Texlink Technologies Co., Ltd.<br />
            Phnom Penh, Cambodia.<br />
            Ai-Native Manufacturing Intelligence Platform.
          </p>
        </div>
        <FooterCol title="Product">
          <FooterLink href="#product">The platform</FooterLink>
          <FooterLink href="#pricing">Pricing</FooterLink>
          <FooterLink href="#customers">Customers</FooterLink>
        </FooterCol>
        <FooterCol title="Partners">
          <FooterLink href="#partners">Anthropic</FooterLink>
          <FooterLink href="#partners">Google Cloud</FooterLink>
          <FooterLink href="#impact">JICA · Impact</FooterLink>
        </FooterCol>
        <FooterCol title="Company">
          <FooterLink href="mailto:gamini@yaikh.com">Contact</FooterLink>
          <FooterLink href="https://yai-plan-production.up.railway.app">Strategic DTV portal</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row gap-2 justify-between text-[11.5px] text-white/45">
          <span>© {new Date().getFullYear()} Texlink Technologies Co., Ltd. · Made in Cambodia</span>
          <span>www.yaikh.com</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] font-bold text-white/85 mb-3">{title}</div>
      <ul className="space-y-2 text-[13px]">{children}</ul>
    </div>
  );
}
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} className="hover:text-yai-amber transition">
        {children}
      </a>
    </li>
  );
}

/* ─────────────── helpers ─────────────── */
function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-20 lg:py-28 ${className}`}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">{children}</div>
    </section>
  );
}

function SectionEyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={`text-[10.5px] uppercase tracking-[0.25em] font-bold mb-5 ${
        light ? "text-yai-amber" : "text-yai-orange"
      }`}
    >
      {children}
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
