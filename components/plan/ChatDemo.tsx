"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

type Msg = {
  from: "user" | "agent";
  text: string;
  meta?: string; // optional small line under
  rows?: { label: string; value: string }[]; // optional table-like rows
};

const SCRIPT: Msg[] = [
  { from: "user", text: "Show me last month's payroll summary." },
  {
    from: "agent",
    text: "Payroll period: 01–31 March.",
    meta: "Posted to ABA + Wing • All payslips delivered",
    rows: [
      { label: "Workers paid", value: "2,184" },
      { label: "Total disbursed", value: "$1.42M" },
      { label: "OT hours", value: "18,420" },
      { label: "Exceptions flagged", value: "3 (resolved)" },
    ],
  },
  { from: "user", text: "Any compliance audits coming up?" },
  {
    from: "agent",
    text: "Yes — WRAP recertification on 18 April.",
    meta: "Evidence pack 92% complete. I can finalise it now.",
  },
  { from: "user", text: "Finalise it." },
  {
    from: "agent",
    text: "Done. 247 records consolidated, 3 gaps flagged for manager review.",
    meta: "PDF ready in Compliance → Audits → WRAP-2026-Q2",
  },
];

export function ChatDemo() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });
  const [visible, setVisible] = useState<Msg[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!inView) return;
    setVisible([]);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    let cumulative = 600;
    SCRIPT.forEach((msg, i) => {
      const t = setTimeout(() => {
        setVisible((cur) => [...cur, msg]);
      }, cumulative);
      timersRef.current.push(t);
      cumulative += msg.from === "user" ? 1000 : 1700;
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [inView]);

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-gradient-to-br from-yai-navy via-[#0E2D52] to-[#0A2540] p-1 shadow-2xl"
    >
      <div className="rounded-[14px] bg-[#0A1F38] overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10 bg-black/20">
          <div className="w-8 h-8 rounded-full bg-yai-blue flex items-center justify-center text-white font-bold text-sm">
            Y
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-sm">YAI Agent — Finance</div>
            <div className="text-emerald-400 text-[11px] flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </div>
          </div>
          <div className="text-white/40 text-[11px]">EN · 中文 · ខ្មែរ</div>
        </div>

        {/* Messages */}
        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-3 min-h-[440px] max-h-[480px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {visible.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.from === "user"
                      ? "bg-yai-blue text-white rounded-br-sm"
                      : "bg-white/8 text-white border border-white/10 rounded-bl-sm"
                  }`}
                  style={msg.from === "agent" ? { backgroundColor: "rgba(255,255,255,0.06)" } : undefined}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  {msg.meta && (
                    <p className="text-[11px] mt-1 opacity-70">{msg.meta}</p>
                  )}
                  {msg.rows && (
                    <div className="mt-3 space-y-1 border-t border-white/10 pt-2">
                      {msg.rows.map((r) => (
                        <div key={r.label} className="flex justify-between text-[12px]">
                          <span className="opacity-70">{r.label}</span>
                          <span className="font-semibold tabular-nums">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {/* Typing indicator when the next message will be from agent */}
            {visible.length < SCRIPT.length && SCRIPT[visible.length].from === "agent" && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 bg-white/60 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input bar (decorative) */}
        <div className="px-4 py-3 border-t border-white/10 bg-black/20 flex items-center gap-2">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/40 text-sm">
            Ask anything about the factory…
          </div>
          <div className="w-9 h-9 rounded-lg bg-yai-blue flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
              <path
                d="M5 12l14-8-4 16-3-7-7-1z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
