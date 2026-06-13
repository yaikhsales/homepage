"use client";

import Image from "next/image";
import Link from "next/link";
import { LangProvider, useLang } from "../i18n";
import { motion } from "framer-motion";

/* /experience — landing page that introduces the live Yai Data demo
 * before the visitor steps out to the actual dashboard app on port
 * 3002. Lives under yaikh.com so the brand stays continuous. */
export default function ExperienceLandingPage() {
  return (
    <LangProvider>
      <ExperienceLanding />
    </LangProvider>
  );
}

function ExperienceLanding() {
  const { t } = useLang();
  const DEMO_URL = "http://localhost:3002";

  return (
    <main className="min-h-screen text-white mesh-hero grain relative overflow-hidden flex flex-col">
      <header className="relative z-10 px-6 lg:px-10 pt-6 flex items-center justify-between">
        <Link href="/" aria-label="Back to yaikh.com" className="flex items-center gap-3 group">
          <Image
            src="/images/yai-logo.jpg"
            alt="Yai"
            width={1280}
            height={1280}
            priority
            unoptimized
            className="w-12 h-12 rounded-full shadow-lg shrink-0"
          />
          <div className="leading-tight">
            <div className="font-serif font-semibold text-[15px] tracking-tight group-hover:text-yai-amber transition">
              {t("exp.back")}
            </div>
            <div className="text-[11px] text-white/55 font-semibold">yaikh.com / experience</div>
          </div>
        </Link>
      </header>

      <section className="flex-1 relative z-10 flex items-center justify-center px-6 lg:px-10 py-16">
        <div className="max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.22em] text-yai-amber px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              {t("exp.eyebrow")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-balance mt-6"
          >
            {t("exp.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl mx-auto"
          >
            {t("exp.lede")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-7"
          >
            {[t("exp.b1"), t("exp.b2"), t("exp.b3")].map((b) => (
              <span
                key={b}
                className="text-[12px] font-semibold uppercase tracking-wider text-white/85 px-3 py-1.5 rounded-full border border-white/20 bg-white/[0.04]"
              >
                {b}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-12 flex flex-col items-center gap-3"
          >
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-yai-orange hover:bg-yai-orange/90 text-white text-lg font-bold rounded-full shadow-2xl transition transform hover:-translate-y-0.5"
            >
              {t("exp.cta")}
              <span aria-hidden className="text-xl">→</span>
            </a>
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/45 font-bold mt-1">
              {t("exp.sub")}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Decorative glow blobs */}
      <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-yai-orange/35 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-yai-blue/40 blur-3xl pointer-events-none" />
    </main>
  );
}
