"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/* yaikh-demo home — replica of the real Yai Data module launcher:
 * top user bar, three department groups (Administration · Management
 * Dashboard · Operations) with category tabs, and a grid of avatar
 * module cards. "Management Dashboard" opens the live Factory Command
 * demo at /dashboard; every other module shows a coming-in-live-platform
 * note. All synthetic — no backend. */

type Mod = { name: string; img: number | "boss"; href?: string };

const ADMIN_TABS = ["Accountant", "Billing", "HR", "ADMIN", "CSR", "Shipping", "E-GOV"];
const MGMT_TABS  = ["Dashboard", "Noticeable"];
const OPS_TABS   = ["QA", "Production", "4DP", "YPI", "MRP"];

const ADMIN_MODS: Mod[] = [
  { name: "Accountant", img: 1 },       { name: "Purchase Request", img: 2 },
  { name: "YHR", img: 3 },              { name: "Support Ticket", img: 4 },
  { name: "Digital Audit", img: 5 },    { name: "Shipping", img: 6 },
  { name: "E-GOVERNMENT", img: 7 },     { name: "IEWS", img: 8 },
  { name: "Bill Claim", img: 9 },       { name: "Org Chart", img: 10 },
  { name: "Y Shop", img: 11 },          { name: "Energy", img: 12 },
  { name: "Salary Bill", img: 13 },     { name: "Training", img: 14 },
  { name: "Gate Pass", img: 15 },       { name: "Air", img: 17 },
  { name: "Shipping Bill", img: 18 },   { name: "Temporary Worker", img: 19 },
  { name: "Meeting Room", img: 20 },    { name: "Water", img: 21 },
  { name: "Speak Up", img: 22 },        { name: "Car Booking", img: 24 },
  { name: "Waste", img: 25 },           { name: "Fire Alarm", img: 26 },
  { name: "Chemical", img: 29 },
];

const MGMT_MODS: Mod[] = [
  { name: "Management Dashboard", img: "boss", href: "/dashboard" },
  { name: "System Analysis", img: 30 },
  { name: "SOP", img: 31 },
  { name: "Call Out", img: 32 },
];

const OPS_MODS: Mod[] = [
  { name: "YQMS", img: 33 },  { name: "FC", img: 34 },
  { name: "4DP", img: 35 },   { name: "YPI", img: 36 },
  { name: "MRP", img: 37 },   { name: "YWIP", img: 38 },
  { name: "CE", img: 6 },     { name: "YTM", img: 9 },
  { name: "YTM Shop", img: 11 },
];

function ModCard({ m, onLocked }: { m: Mod; onLocked: (name: string) => void }) {
  const src = m.img === "boss" ? "/images/agent-boss.png" : `/images/agent-${m.img}.png`;
  const inner = (
    <div
      className={`group w-[104px] rounded-xl bg-white/95 backdrop-blur border border-white/40 shadow-lg
        px-2 pt-2.5 pb-2 text-center transition-all hover:-translate-y-1 hover:shadow-2xl cursor-pointer
        ${m.href ? "ring-2 ring-yai-orange/70" : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={m.name}
        className="w-16 h-16 rounded-lg object-cover mx-auto"
        style={{ objectPosition: "50% 15%" }}
        draggable={false}
      />
      <div className="text-[10.5px] font-semibold text-yai-navy leading-tight mt-1.5 min-h-[26px] flex items-center justify-center">
        {m.name}
      </div>
      {m.href && (
        <div className="text-[8px] uppercase tracking-widest font-extrabold text-yai-orange -mt-0.5">
          open demo
        </div>
      )}
    </div>
  );
  return m.href ? (
    <Link href={m.href}>{inner}</Link>
  ) : (
    <button type="button" onClick={() => onLocked(m.name)} className="text-left">
      {inner}
    </button>
  );
}

function GroupHeader({ title, tabs }: { title: string; tabs: string[] }) {
  return (
    <div className="mb-4">
      <div className="rounded-lg bg-white/10 backdrop-blur border border-white/15 text-center py-1.5 text-[13px] font-bold text-white">
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
        {tabs.map((t) => (
          <span
            key={t}
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/15 text-white/85 border border-white/10"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Launcher() {
  const [toast, setToast] = useState<string | null>(null);

  const locked = (name: string) => {
    setToast(`${name} — available in the live platform. This demo opens Management Dashboard only.`);
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 70% 20%, rgba(30,77,170,0.55) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 20% 80%, rgba(16,185,129,0.18) 0%, transparent 55%), linear-gradient(160deg, #06122e 0%, #0A1F47 45%, #071a3a 100%)",
      }}
    >
      {/* ── Top user bar ── */}
      <header className="bg-black/30 backdrop-blur border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Image
              src="/images/yai-logo.jpg"
              alt="Yai"
              width={1280}
              height={1280}
              unoptimized
              className="w-9 h-9 rounded-md shrink-0"
            />
            <div className="flex items-center gap-2.5 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/agent-9.png"
                alt=""
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                style={{ objectPosition: "50% 15%" }}
              />
              <div className="leading-tight truncate">
                <div className="text-[13px] font-bold truncate">Sin Khon ▾</div>
                <div className="text-[10px] text-white/55">ID: YM7584</div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-white/60 text-[13px]">
            {["📹", "ℹ️", "📄", "$", "📊", "📱", "✉️", "📅", "💬", "🛒", "🧮"].map((ic, i) => (
              <span key={i} className="opacity-80 hover:opacity-100 cursor-pointer">{ic}</span>
            ))}
            <span className="text-red-400 font-extrabold text-[12px] border-b-2 border-red-400">AT</span>
            <span className="text-[12px] font-semibold text-white/85">🌐 English ▾</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-bold bg-black text-white border border-white/25 rounded-md px-2.5 py-1.5">
              GET IT ON <span className="block text-[11px]">Google Play</span>
            </span>
            <span className="text-[10px] font-bold bg-black text-white border border-white/25 rounded-md px-2.5 py-1.5">
              Download on the <span className="block text-[11px]">App Store</span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Launcher body ── */}
      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        {/* Brand centre mark */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/yai-logo.jpg"
            alt="Yai"
            width={1280}
            height={1280}
            unoptimized
            className="w-12 h-12 rounded-full shadow-xl"
          />
          <div className="text-[12px] font-bold text-white/85 mt-1.5">My Ai Agent</div>
          <div className="relative mt-3 w-full max-w-md">
            <input
              placeholder="Search modules…"
              className="w-full rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-[13px] placeholder-white/40 outline-none focus:border-yai-orange/70"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.8fr_1fr_1.2fr] gap-8 items-start">
          {/* Administration */}
          <section>
            <GroupHeader title="Administration" tabs={ADMIN_TABS} />
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {ADMIN_MODS.map((m) => <ModCard key={m.name} m={m} onLocked={locked} />)}
            </div>
          </section>

          {/* Management Dashboard */}
          <section>
            <GroupHeader title="Management Dashboard" tabs={MGMT_TABS} />
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {MGMT_MODS.map((m) => <ModCard key={m.name} m={m} onLocked={locked} />)}
            </div>
          </section>

          {/* Operations */}
          <section>
            <GroupHeader title="Operations" tabs={OPS_TABS} />
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {OPS_MODS.map((m) => <ModCard key={m.name} m={m} onLocked={locked} />)}
            </div>
          </section>
        </div>

        <p className="text-center text-[11px] text-white/40 mt-10">
          Demo replica of the Yai Data launcher · synthetic environment ·{" "}
          <a href="http://localhost:3001" className="underline hover:text-yai-orange">back to yaikh.com</a>
        </p>
      </main>

      {/* Locked-module toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-yai-navy text-[13px] font-semibold px-5 py-3 rounded-full shadow-2xl anim-msg z-50 max-w-[90vw]">
          {toast}
        </div>
      )}
    </div>
  );
}
