"use client";

import { useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";

// Inline SVG icons ---------------------------------------------------------
const IconUser = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 19c0-3.5 3.1-6 7-6s7 2.5 7 6v1H5z" />
  </svg>
);
const IconTeam = (
  <svg viewBox="0 0 36 24" fill="currentColor" className="w-12 h-9">
    <circle cx="18" cy="7" r="3" /><path d="M12 20c0-3 2.7-5 6-5s6 2 6 5v1H12z" />
    <circle cx="7" cy="10" r="2.4" /><path d="M2 20c0-2.3 2.2-4 5-4 .6 0 1.3.1 1.8.3-1.2.8-2 2.1-2.2 3.7L2 20z" />
    <circle cx="29" cy="10" r="2.4" /><path d="M34 20l-4.6-.1c-.2-1.6-1-2.9-2.2-3.6.5-.2 1.2-.3 1.8-.3 2.8 0 5 1.7 5 4z" />
  </svg>
);
const IconCrowd = (
  <svg viewBox="0 0 48 24" fill="currentColor" className="w-14 h-9">
    <circle cx="24" cy="6" r="3" /><path d="M18 19c0-3 3-5 6-5s6 2 6 5v1H18z" />
    <circle cx="13" cy="9" r="2.5" /><path d="M7 19c0-2.4 2.4-4 5-4-1.2.9-2 2.3-2 4z" />
    <circle cx="35" cy="9" r="2.5" /><path d="M41 19c0-2.4-2.4-4-5-4 1.2.9 2 2.3 2 4z" />
    <circle cx="5" cy="13" r="2" /><circle cx="43" cy="13" r="2" />
  </svg>
);
const IconServer = (
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
const IconBriefcase = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-9 h-9">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
    <line x1="3" y1="13" x2="21" y2="13" strokeLinecap="round" />
    <line x1="11" y1="13" x2="13" y2="13" stroke="white" strokeWidth="2" />
  </svg>
);
const IconFactory = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-9 h-9">
    <path d="M3 21h18V11l-6 4V11l-6 4V7L3 11v10z" strokeLinejoin="round" />
    <line x1="8" y1="17" x2="8" y2="19" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12" y2="19" strokeLinecap="round" />
    <line x1="16" y1="17" x2="16" y2="19" strokeLinecap="round" />
  </svg>
);
// Agent-avatar clusters — three scales: core team → department → factory
const ClusterTeam = (
  <div className="flex flex-col items-center gap-1.5">
    <div className="flex items-center -space-x-1.5">
      {[1, 2, 3, 4, 6].map((n) => (
        <img key={n} src={`/images/generated/agent-${n}.png?v=3`} alt="" className="w-7 h-7 rounded-full ring-2 ring-white shadow-sm object-cover" />
      ))}
    </div>
    <div className="flex items-end gap-0.5 text-yai-blue h-2.5">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-2 h-2 opacity-55">
        <path d="M21 11c0 3.9-4 7-9 7-1 0-2-.1-3-.4l-4 2.4 1-3.6C3 14.6 2.4 12.9 2.4 11c0-3.9 4-7 9-7s9.6 3.1 9.6 7z"/>
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
        <path d="M21 11c0 3.9-4 7-9 7-1 0-2-.1-3-.4l-4 2.4 1-3.6C3 14.6 2.4 12.9 2.4 11c0-3.9 4-7 9-7s9.6 3.1 9.6 7z"/>
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-2 h-2 opacity-55">
        <path d="M21 11c0 3.9-4 7-9 7-1 0-2-.1-3-.4l-4 2.4 1-3.6C3 14.6 2.4 12.9 2.4 11c0-3.9 4-7 9-7s9.6 3.1 9.6 7z"/>
      </svg>
    </div>
    <div className="text-[9px] font-bold text-yai-blue uppercase tracking-wider">5 · core team</div>
  </div>
);

const ClusterMidTeam = (
  <div className="flex flex-col items-center gap-1.5">
    <div className="grid grid-cols-7 gap-[2px]">
      {[1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 18, 20, 22].map((n) => (
        <img key={n} src={`/images/generated/agent-${n}.png?v=3`} alt="" className="w-[14px] h-[14px] rounded-full ring-[1.5px] ring-white shadow-sm object-cover" />
      ))}
    </div>
    <div className="text-[9px] font-bold text-yai-blue uppercase tracking-wider">5 → 300 · dept</div>
  </div>
);

const ClusterBigTeam = (
  <div className="flex flex-col items-center gap-1.5">
    <div className="grid grid-cols-7 gap-[1px]">
      {[1,2,3,4,5,6,7, 8,9,10,11,12,13,14, 15,17,18,19,20,21,22, 24,25,26,29,30,33,38].map((n, i) => (
        <img key={i} src={`/images/generated/agent-${n}.png?v=3`} alt="" className="w-[10px] h-[10px] rounded-full ring-[0.5px] ring-white object-cover" />
      ))}
    </div>
    <div className="text-[9px] font-bold text-yai-blue uppercase tracking-wider">300 → 1,000 · factory</div>
  </div>
);

const ClusterAgentic = (
  <div className="flex flex-col items-center gap-1">
    <div className="flex items-center -space-x-1.5">
      {[1, 4, 9, 22].map((n) => (
        <img key={n} src={`/images/generated/agent-${n}.png?v=3`} alt="" className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm object-cover" />
      ))}
    </div>
    <div className="text-[8px] font-bold text-yai-blue uppercase tracking-wider">+ many others</div>
  </div>
);
const ClusterBrain = (
  <div className="flex flex-col items-center gap-1.5 text-yai-orange">
    {/* The Big Ai Brain itself */}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-9 h-9">
      <path d="M9 4a2.6 2.6 0 00-2.6 2.6c-1.4 0-2.4 1-2.4 2.4 0 1 .6 1.9 1.5 2.3-.3.5-.5 1-.5 1.6a2.5 2.5 0 002.5 2.5v.6A2.6 2.6 0 009 19V4z" />
      <path d="M15 4a2.6 2.6 0 012.6 2.6c1.4 0 2.4 1 2.4 2.4 0 1-.6 1.9-1.5 2.3.3.5.5 1 .5 1.6a2.5 2.5 0 01-2.5 2.5v.6A2.6 2.6 0 0115 19V4z" />
      <line x1="12" y1="4" x2="12" y2="21" strokeLinecap="round" />
    </svg>
    {/* Boss talking to it */}
    <div className="relative">
      <img src="/images/generated/agent-boss.png?v=1" alt="" className="w-9 h-9 rounded-full ring-2 ring-white shadow object-cover" />
      <div className="absolute -top-1 -right-2 bg-white border border-yai-orange rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="#F37021" strokeWidth="2.5" className="w-2.5 h-2.5">
          <path d="M21 11c0 3.9-4 7-9 7-1 0-2-.1-3-.4l-4 2.4 1-3.6C3 14.6 2.4 12.9 2.4 11c0-3.9 4-7 9-7s9.6 3.1 9.6 7z" />
        </svg>
      </div>
    </div>
    {/* 5 factories */}
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
          <path d="M3 21h18V11l-6 4V11l-6 4V7L3 11v10z" />
        </svg>
      ))}
    </div>
    <div className="text-[8px] font-bold uppercase tracking-wider leading-tight text-center">5 factories<br/>1 chat</div>
  </div>
);

// Static (non-toggle) step type --------------------------------------------
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

const BEFORE: StaticStep[] = [
  { step: "Step 1", stage: "Cloud · Starter",    sub: "5 key members",     price: "$120",   per: "/ year", h: 200, bg: "from-sky-100 to-white",    accent: "text-yai-blue", icon: ClusterTeam },
  { step: "Step 2", stage: "Cloud · Growth",     sub: "5 – 300 users",     price: "$750",   per: "/ year", h: 230, bg: "from-sky-200 to-sky-50",   accent: "text-yai-blue", icon: ClusterMidTeam },
  { step: "Step 3", stage: "Cloud · Enterprise", sub: "300 – 1,000 users", price: "$1,200", per: "/ year", h: 265, bg: "from-blue-200 to-blue-50", accent: "text-yai-blue", icon: ClusterBigTeam },
];

const AFTER: StaticStep[] = [
  { step: "Step 5", stage: "Agentic",      sub: "After ~6 months", price: "+ $5,000", per: "/ year · 10 agents + 35 mini",   h: 340, bg: "from-violet-200 to-violet-50", accent: "text-yai-blue",   icon: ClusterAgentic },
  { step: "Step 6", stage: "Big Ai Brain", sub: "Boss · after ~1 year", price: "+ $5,000", per: "/ year · talks across 5+ factories",   h: 380, bg: "from-orange-200 to-orange-50", accent: "text-yai-orange", icon: ClusterBrain },
];

function StepCard({ s }: { s: StaticStep }) {
  return (
    <div className="relative flex flex-col shrink-0 w-[92px]" style={{ height: s.h }}>
      <div className={`flex-1 rounded-t-2xl border border-b-0 border-yai-border bg-gradient-to-b ${s.bg} flex flex-col items-center p-2 text-center`}>
        <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500">{s.step}</div>
        <div className="text-[11px] font-bold text-yai-navy leading-tight mt-1 px-0.5">{s.stage}</div>
        <div className="text-[9px] text-gray-500 mt-0.5 leading-tight">{s.sub}</div>
        <div className={`${s.accent} flex-1 flex items-center justify-center`}>{s.icon}</div>
      </div>
      <div className="rounded-b-xl border border-yai-border bg-white text-center py-2 px-1">
        <div className={`font-extrabold text-base leading-none ${s.accent}`}>{s.price}</div>
        <div className="text-[8px] text-gray-500 mt-1 leading-tight">{s.per}</div>
      </div>
    </div>
  );
}

// Server pillar (Step 4 — must be bought first) -----------------------------
function ServerPillar({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col shrink-0 w-[92px]" style={{ height: 295 }}>
      <div className={`flex-1 rounded-t-2xl border border-b-0 border-yai-border bg-gradient-to-b ${on ? "from-orange-200 to-orange-50" : "from-indigo-100 to-white"} flex flex-col items-center p-2 text-center transition-colors`}>
        <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Step 4</div>
        <div className="text-[11px] font-bold text-yai-navy leading-tight mt-1 px-0.5">Ai Server</div>
        <div className="text-[9px] text-gray-500 mt-0.5 leading-tight">Hardware · 1,000+ users</div>
        <div className={`${on ? "text-yai-orange" : "text-gray-400"} flex-1 flex items-center justify-center transition-colors`}>{IconServer}</div>
        <button
          onClick={onToggle}
          className={`w-full text-[9px] font-bold uppercase tracking-wider rounded px-1 py-1 border transition-colors ${
            on
              ? "bg-yai-orange text-white border-yai-orange"
              : "bg-white text-gray-500 border-yai-border hover:text-yai-orange hover:border-yai-orange"
          }`}
        >
          {on ? "✓ Bought" : "Buy $2,500"}
        </button>
      </div>
      <div className="rounded-b-xl border border-yai-border bg-white text-center py-2 px-1 min-h-[44px]">
        <AnimatePresence mode="wait">
          {on ? (
            <motion.div
              key="on"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-extrabold text-base leading-none text-yai-orange">$2,500</div>
              <div className="text-[8px] text-gray-500 mt-1 leading-tight">once · hardware + setup</div>
            </motion.div>
          ) : (
            <motion.div
              key="off"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[9px] text-gray-400 leading-tight pt-1"
            >
              tap to see what&apos;s next
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Twin pillar (Step 4 — Admin / Operation) — gated by server purchase -----
function TwinPillar({
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
    <div className={`relative flex flex-col shrink-0 w-[92px] transition-opacity ${disabled ? "opacity-55" : ""}`} style={{ height: 295 }}>
      <div className={`flex-1 rounded-t-2xl border border-b-0 border-yai-border bg-gradient-to-b ${on && !disabled ? "from-indigo-300 to-indigo-50" : "from-indigo-100 to-white"} flex flex-col items-center p-2 text-center transition-colors`}>
        <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Step 4</div>
        <div className="text-[11px] font-bold text-yai-navy leading-tight mt-1 px-0.5">{title}</div>
        <div className="text-[9px] text-gray-500 mt-0.5 leading-tight">{sub}</div>
        <div className={`${on && !disabled ? "text-yai-blue" : "text-gray-400"} flex-1 flex items-center justify-center transition-colors`}>{icon}</div>
        <button
          onClick={onToggle}
          disabled={disabled}
          title={disabled ? "Buy the Ai server first" : ""}
          className={`w-full text-[9px] font-bold uppercase tracking-wider rounded px-1 py-1 border transition-colors ${
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
      <div className="rounded-b-xl border border-yai-border bg-white text-center py-2 px-1 min-h-[44px]">
        <AnimatePresence mode="wait">
          {on && !disabled ? (
            <motion.div
              key="on"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-extrabold text-base leading-none text-yai-blue">+ {price}</div>
              <div className="text-[8px] text-gray-500 mt-1 leading-tight">/ year</div>
            </motion.div>
          ) : (
            <motion.div
              key="off"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[9px] text-gray-400 leading-tight pt-1"
            >
              {disabled ? "buy server first" : "tap to activate"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Main staircase -----------------------------------------------------------
export function PricingStaircase() {
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
            <div className="flex items-end gap-1">
              {BEFORE.map((s) => <StepCard key={s.step} s={s} />)}
              <ServerPillar on={server} onToggle={toggleServer} />
              <TwinPillar
                title="Administrative"
                sub="tools"
                icon={IconBriefcase}
                price="$5,000"
                on={admin}
                onToggle={() => setAdmin((v) => !v)}
                disabled={!server}
              />
              <TwinPillar
                title="Operation"
                sub="tools"
                icon={IconFactory}
                price="$10,000"
                on={prod}
                onToggle={() => setProd((v) => !v)}
                disabled={!server}
              />
              {AFTER.map((s) => <StepCard key={s.step} s={s} />)}
            </div>
            {/* Phase labels — span across their pillars */}
            <div className="flex gap-1 mt-2">
              <div style={{ width: 6 * 92 + 5 * 4 }} className="shrink-0 rounded-md bg-yai-blue/10 border border-yai-blue/30 py-1.5 text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-yai-blue">Chaos → Digitalization</span>
              </div>
              <div style={{ width: 2 * 92 + 1 * 4 }} className="shrink-0 rounded-md bg-yai-orange/10 border border-yai-orange/30 py-1.5 text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-yai-orange">Big Ai Brain</span>
              </div>
            </div>

            {/* Step 4 summary — narrow, aligned under just the Server + Admin + Operation pillars */}
            <div className="flex gap-1 mt-2">
              <div style={{ width: 3 * 92 + 2 * 4 }} className="shrink-0" aria-hidden />
              <div style={{ width: 3 * 92 + 2 * 4 }} className="shrink-0 rounded-xl border-2 border-dashed border-yai-blue/40 bg-yai-blue/5 p-2.5">
                <div className="text-[9px] uppercase tracking-widest font-extrabold text-yai-blue text-center mb-1.5">Step 4 · Total</div>
                <div className="flex items-baseline justify-between gap-2 text-[11px]">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-yai-orange">Server</span>
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
                <div className="flex items-baseline justify-between gap-2 mt-1.5 pt-1.5 border-t border-yai-blue/15">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-yai-blue">Yearly · active</span>
                  <motion.span
                    key={yearly}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className={`font-extrabold text-base leading-none ${yearly ? "text-yai-blue" : "text-gray-400"}`}
                  >
                    {fmt(yearly)}<span className="text-[10px] text-gray-500 font-normal">/yr</span>
                  </motion.span>
                </div>
              </div>
              <div style={{ width: 2 * 92 + 1 * 4 }} className="shrink-0" aria-hidden />
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
