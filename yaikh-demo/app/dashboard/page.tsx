"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* yaikh-demo — the "Experience" linked from the yaikh.com nav.
 * A live-feeling factory command dashboard on SYNTHETIC data:
 * KPI cards that tick, production lines with progress, an alerts
 * feed, and a scripted Yai Agent chat. No backend — everything
 * client-side so visitors can click around safely. */

/* ─── synthetic data ─── */

const LINES = [
  { id: "Line 1", style: "Polo SS24 · M-2231",  target: 1200, status: "running" },
  { id: "Line 2", style: "Hoodie FW · H-1104",  target: 800,  status: "running" },
  { id: "Line 3", style: "Tee Basic · T-0092",  target: 1500, status: "alert" },
  { id: "Line 4", style: "Jacket · J-3310",     target: 450,  status: "running" },
  { id: "Line 5", style: "Shorts · S-0771",     target: 950,  status: "changeover" },
  { id: "Line 6", style: "Polo LS · M-2308",    target: 1100, status: "running" },
] as const;

const ALERTS = [
  { t: "2 min ago",  level: "high", text: "Line 3 — defect rate 4.2% (threshold 2.5%). QC agent dispatched re-check on bundle 88." },
  { t: "14 min ago", level: "mid",  text: "Fabric delivery for J-3310 delayed ~3h. MRP agent re-sequenced cutting plan." },
  { t: "31 min ago", level: "low",  text: "Approval auto-cleared: overtime request, Sewing B (within policy)." },
  { t: "1 h ago",    level: "low",  text: "Daily WRAP evidence pack compiled — 47 documents, 0 gaps." },
] as const;

/* Scripted agent Q&A — quick-question chips drive canned replies. */
const SCRIPT: Array<{ q: string; a: string }> = [
  {
    q: "Why is Line 3 flagged?",
    a: "Line 3's defect rate hit 4.2% against a 2.5% threshold — concentrated in shoulder seams on bundle 88. I've already re-routed the bundle to QC re-check and notified the line supervisor. Root cause looks like needle wear; mechanic ETA 10 minutes.",
  },
  {
    q: "Will we hit today's shipment?",
    a: "Yes, with margin. Cut-off is 17:00; current pace puts packing complete at 15:40. The only risk is Line 4's delayed fabric — I've re-sequenced so its output lands in tomorrow's consignment instead.",
  },
  {
    q: "Show attendance summary",
    a: "Attendance today: 94.2% (1,318 of 1,399). Two sewing teams are short — I've suggested a rebalance moving 4 operators from Line 6, which keeps every line above 90% manning. Want me to apply it?",
  },
  {
    q: "Any compliance issues?",
    a: "None open. The daily audit-evidence pack is complete (47 documents, 0 gaps), chemical log verified at 09:12, and the buyer's CAP item from last week was closed with photos. Next external audit window: 18 days.",
  },
];

/* ─── tiny components ─── */

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points), min = Math.min(...points);
  const norm = (v: number) => 26 - ((v - min) / Math.max(max - min, 1)) * 22;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * (96 / (points.length - 1))} ${norm(p)}`).join(" ");
  return (
    <svg viewBox="0 0 96 28" className="w-24 h-7">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StatusChip({ s }: { s: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    running:    { label: "Running",    cls: "bg-emerald-100 text-emerald-700" },
    alert:      { label: "QC alert",   cls: "bg-red-100 text-red-700" },
    changeover: { label: "Changeover", cls: "bg-amber-100 text-amber-700" },
  };
  const m = map[s] ?? map.running;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${m.cls}`}>
      {m.label}
    </span>
  );
}

/* ─── page ─── */

export default function Demo() {
  /* Ticking KPIs — gentle random walk so the board feels alive. */
  const [output, setOutput] = useState(4862);
  const [eff, setEff] = useState(78.4);
  const [defects, setDefects] = useState(2.1);
  const [spark, setSpark] = useState<number[]>([62, 65, 64, 70, 72, 69, 74, 78]);

  useEffect(() => {
    const id = setInterval(() => {
      setOutput((v) => v + Math.floor(Math.random() * 9));
      setEff((v) => Math.min(96, Math.max(60, v + (Math.random() - 0.45) * 0.6)));
      setDefects((v) => Math.min(5, Math.max(0.5, v + (Math.random() - 0.52) * 0.12)));
      setSpark((s) => [...s.slice(1), Math.min(96, Math.max(55, s[s.length - 1] + (Math.random() - 0.45) * 5))]);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  /* Line progress — creeps toward target during the demo. */
  const [progress, setProgress] = useState<number[]>([68, 54, 41, 72, 12, 60]);
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) =>
        p.map((v, i) => (LINES[i].status === "changeover" ? v : Math.min(100, v + Math.random() * 1.2)))
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  /* Scripted chat. */
  const [msgs, setMsgs] = useState<Array<{ who: "user" | "agent"; text: string }>>([
    { who: "agent", text: "Good afternoon. Factory is at 78% efficiency, all shipments on track. One QC alert on Line 3 — ask me about it." },
  ]);
  const [typing, setTyping] = useState(false);
  const [asked, setAsked] = useState<Set<number>>(new Set());
  const chatEnd = useRef<HTMLDivElement>(null);

  const ask = (i: number) => {
    if (typing) return;
    const item = SCRIPT[i];
    setMsgs((m) => [...m, { who: "user", text: item.q }]);
    setAsked((s) => new Set(s).add(i));
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { who: "agent", text: item.a }]);
      setTyping(false);
    }, 1100);
  };

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ── */}
      <header className="bg-yai-navy text-white">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <Image
              src="/images/yai-logo.jpg"
              alt="Yai"
              width={1280}
              height={1280}
              unoptimized
              className="w-10 h-10 rounded-full shrink-0"
            />
            <div className="leading-tight truncate">
              <div className="font-serif font-semibold text-[15px]">Factory Command</div>
              <div className="text-[11px] text-white/60 truncate">Yorkmars Cambodia · Sewing Plant A</div>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-yai-amber">
              <span className="w-2 h-2 rounded-full bg-emerald-400 anim-live" />
              Live demo · synthetic data
            </span>
            <a
              href="http://localhost:3001"
              className="hidden sm:inline-block text-[12px] font-bold px-4 py-1.5 rounded-full border border-white/25 hover:border-yai-orange hover:text-yai-orange transition"
            >
              ← yaikh.com
            </a>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 lg:px-10 py-6 grid lg:grid-cols-[1.7fr_1fr] gap-6">
        {/* LEFT — KPIs + lines + alerts */}
        <div className="space-y-6 min-w-0">
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white border border-black/5 p-5">
              <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-400">Output today</div>
              <div className="text-3xl font-extrabold tracking-tight mt-1 tabular-nums">{output.toLocaleString()}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-emerald-600 font-bold">▲ on pace</span>
                <Sparkline points={spark} color="#1E4DAA" />
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-black/5 p-5">
              <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-400">Line efficiency</div>
              <div className="text-3xl font-extrabold tracking-tight mt-1 tabular-nums">{eff.toFixed(1)}%</div>
              <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-yai-blue rounded-full transition-all duration-700" style={{ width: `${eff}%` }} />
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-black/5 p-5">
              <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-400">Defect rate</div>
              <div className={`text-3xl font-extrabold tracking-tight mt-1 tabular-nums ${defects > 2.5 ? "text-red-600" : "text-yai-navy"}`}>
                {defects.toFixed(1)}%
              </div>
              <div className="text-[11px] mt-2 font-bold text-gray-400">threshold 2.5%</div>
            </div>
            <div className="rounded-2xl bg-white border border-black/5 p-5">
              <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-400">Attendance</div>
              <div className="text-3xl font-extrabold tracking-tight mt-1">94.2%</div>
              <div className="text-[11px] mt-2 font-bold text-gray-400">1,318 / 1,399 workers</div>
            </div>
          </div>

          {/* Production lines */}
          <div className="rounded-2xl bg-white border border-black/5 p-5">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold">Production lines</h2>
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">target vs actual · today</span>
            </div>
            <div className="space-y-3.5">
              {LINES.map((l, i) => (
                <div key={l.id} className="grid grid-cols-[64px_1fr_auto] md:grid-cols-[72px_180px_1fr_92px] items-center gap-3">
                  <div className="font-extrabold text-[13px]">{l.id}</div>
                  <div className="hidden md:block text-[12px] text-gray-500 truncate">{l.style}</div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        l.status === "alert" ? "bg-red-500" : l.status === "changeover" ? "bg-amber-400" : "bg-yai-blue"
                      }`}
                      style={{ width: `${progress[i]}%` }}
                    />
                  </div>
                  <div className="justify-self-end"><StatusChip s={l.status} /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts feed */}
          <div className="rounded-2xl bg-white border border-black/5 p-5">
            <h2 className="font-serif text-lg font-semibold mb-4">Agent activity</h2>
            <div className="space-y-3">
              {ALERTS.map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      a.level === "high" ? "bg-red-500" : a.level === "mid" ? "bg-amber-400" : "bg-emerald-500"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-[13px] leading-snug">{a.text}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{a.t}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Yai Agent chat */}
        <div className="rounded-2xl bg-white border border-black/5 flex flex-col min-h-[560px] lg:sticky lg:top-6 self-start w-full">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/agent-9.png" alt="Yai Agent" className="w-9 h-9 rounded-full object-cover" style={{ objectPosition: "50% 18%" }} />
              <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-[14px]">Yai Agent</div>
              <div className="text-[11px] text-gray-400">GM assistant · always on</div>
            </div>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`anim-msg flex ${m.who === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                    m.who === "user"
                      ? "bg-yai-blue text-white rounded-br-md"
                      : "bg-yai-bg border border-black/5 rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="anim-msg flex justify-start">
                <div className="bg-yai-bg border border-black/5 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 anim-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 anim-dot" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 anim-dot" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
            <div ref={chatEnd} />
          </div>

          {/* quick questions */}
          <div className="px-5 py-4 border-t border-black/5">
            <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-400 mb-2.5">
              Try asking
            </div>
            <div className="flex flex-wrap gap-2">
              {SCRIPT.map((s, i) => (
                <button
                  key={s.q}
                  onClick={() => ask(i)}
                  disabled={typing || asked.has(i)}
                  className={`text-[12px] font-semibold px-3.5 py-2 rounded-full border transition ${
                    asked.has(i)
                      ? "border-gray-200 text-gray-300 cursor-default"
                      : "border-yai-blue/30 text-yai-blue hover:bg-yai-blue hover:text-white"
                  }`}
                >
                  {s.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="max-w-[1600px] w-full mx-auto px-6 lg:px-10 pb-6">
        <p className="text-[11px] text-gray-400">
          Demo environment · all numbers are synthetic. The production platform runs on real factory
          data with the full agent fleet. — Texlink Technologies Co., Ltd.
        </p>
      </footer>
    </div>
  );
}
