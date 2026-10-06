import React, { useState, useRef, useEffect, useCallback } from "react";
import { generateBossResponse, generateBossOrChat, getSkills } from "./gemini-api";

/* Compact green Big Brain panel — drives the dashboard pages (Management
 * Dashboard / System Analysis / SOP) as a pop-up, not a full-screen takeover.
 * Matches the PA compact geometry (fixed bottom-6 right-6, w-[400px],
 * max-h-[96vh]) and sets body.yai-pa-open so the 436px floor reservation works.
 *
 * Big Brain carries the 4 skills across ALL departments (pa="all"):
 *   Alerts (red/amber tasks waiting) · Reminders (meetings/trainings/questions)
 *   · Forecasts (predictions, text or chart) · Ask (free-form answers).
 * Alerts/Reminders/Forecasts render from the M1 /pa/skills data — NO Claude.
 * Only Ask uses the chat backend, and only when the boss types.
 *
 * Usage (wired by AppLayout):
 *   import BigBrainPanel from "./chatbot/BigBrainPanel";
 *   <BigBrainPanel page="Management Dashboard" onClose={() => setOpen(false)}
 *                  onNavigate={(path) => navigate(path)} />
 */

const lang = () => {
  try { return (localStorage.getItem("app-language") || "en").toLowerCase().slice(0, 2); }
  catch { return "en"; }
};

const T = {
  en: { alerts: "Alerts", reminders: "Reminders", forecasts: "Forecasts", ask: "Ask",
        noAlerts: "Nothing waiting — all clear.", noReminders: "No reminders.", noForecasts: "No forecasts yet.",
        thinking: "Thinking…", placeholder: "Ask Big Brain…",
        greeting: (p) => `I'm Big Brain — across all 14 agents. On ${p}, check Alerts, Reminders and Forecasts, or just ask.` },
  km: { alerts: "ជូនដំណឹង", reminders: "រំលឹក", forecasts: "ការព្យាករណ៍", ask: "សួរ",
        noAlerts: "គ្មានអ្វីរង់ចាំ — ស្រួលបួលហើយ។", noReminders: "គ្មានការរំលឹក។", noForecasts: "មិនទាន់មានការព្យាករណ៍។",
        thinking: "កំពុងគិត…", placeholder: "សួរ Big Brain…",
        greeting: (p) => `ខ្ញុំជា Big Brain — លើ agent ទាំង 14។ នៅ ${p} មើលជូនដំណឹង រំលឹក និងការព្យាករណ៍ ឬសួរខ្ញុំ។` },
  zh: { alerts: "警报", reminders: "提醒", forecasts: "预测", ask: "提问",
        noAlerts: "没有待办 — 一切正常。", noReminders: "暂无提醒。", noForecasts: "暂无预测。",
        thinking: "思考中…", placeholder: "问 Big Brain…",
        greeting: (p) => `我是 Big Brain — 统管全部 14 个助手。在「${p}」查看警报、提醒和预测，或直接问我。` },
};

const GREEN_ORB = "radial-gradient(circle at 30% 25%, #a7f3d0 0%, #10b981 55%, #047857 100%)";
const REMINDER_ICON = { meeting: "📅", training: "🎓", question: "❓", deadline: "⏰" };
const TREND = { up: "↑", down: "↓", flat: "→" };

// Tiny inline chart for a forecast (bar or line), no chart lib.
function MiniChart({ chart }) {
  if (!chart || !Array.isArray(chart.x) || !Array.isArray(chart.y) || !chart.y.length) return null;
  const w = 220, h = 48, pad = 2;
  const max = Math.max(...chart.y, 1);
  const n = chart.y.length;
  if (chart.type === "line") {
    const pts = chart.y.map((v, i) => {
      const x = pad + (i * (w - 2 * pad)) / Math.max(1, n - 1);
      const y = h - pad - (v / max) * (h - 2 * pad);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return (
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="mt-1">
        <polyline points={pts} fill="none" stroke="#34d399" strokeWidth="2" />
      </svg>
    );
  }
  const bw = (w - 2 * pad) / n;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="mt-1">
      {chart.y.map((v, i) => {
        const bh = (v / max) * (h - 2 * pad);
        return <rect key={i} x={pad + i * bw + 1} y={h - pad - bh} width={bw - 2} height={bh} rx="1" fill="#34d399" />;
      })}
    </svg>
  );
}

export default function BigBrainPanel({ page = "this page", pa = "all", onClose, onNavigate }) {
  const L = lang();
  const t = T[L] || T.en;
  const [tab, setTab] = useState("answers");
  const [skills, setSkills] = useState(null);
  const [messages, setMessages] = useState(() => [{ from: "bot", text: t.greeting(page) }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const go = useCallback((path) => {
    if (!path) return;
    if (typeof onNavigate === "function") onNavigate(path);
    else { try { window.location.assign(path); } catch { /* noop */ } }
  }, [onNavigate]);

  // Floor reservation like the PA panels.
  useEffect(() => {
    document.body.classList.add("yai-pa-open");
    return () => document.body.classList.remove("yai-pa-open");
  }, []);

  // Pull the 3 data skills once (pure data, no Claude). Open on Alerts if any.
  useEffect(() => {
    let alive = true;
    getSkills(pa).then((s) => {
      if (!alive) return;
      setSkills(s);
      if (s && s.badge > 0) setTab("alerts");
    });
    return () => { alive = false; };
  }, [pa]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping, tab]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    const history = messages.map((m) => ({ from: m.from, text: m.text }));
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setIsTyping(true);
    try {
      const context =
        `You are Yai (Big Brain) driving the "${page}" screen, across all 14 department agents. ` +
        `Answer about this screen and the factory from the reference data; warm, short, direct. Never invent numbers or PAs.`;
      // Ask routes to /boss/query first — local Qwen routes to the right PA(s)
      // and merges, NO Claude cost. Claude is only the fallback when /boss/query
      // errors or times out (returns null).
      let reply = await generateBossResponse(text, history, "");
      if (reply == null) reply = await generateBossOrChat(text, "Big Brain", context, history, "");
      const parts = String(reply || "").split("\n\n").map((s) => s.trim()).filter(Boolean);
      const bubbles = parts.length ? parts : [String(reply || "").trim()];
      setMessages((prev) => [...prev, ...bubbles.map((x) => ({ from: "bot", text: x }))]);
    } catch {
      const oops = { en: "One moment — let me try that again.", km: "មួយភ្លែត — សូមសាកល្បងម្ដងទៀត។", zh: "稍等 — 我再试一次。" };
      setMessages((prev) => [...prev, { from: "bot", text: oops[L] || oops.en }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [input, isTyping, messages, page, L]);

  const badge = skills?.badge || 0;
  const alerts = skills?.alerts || [];
  const reminders = skills?.reminders || [];
  const forecasts = skills?.forecasts || [];

  const TabBtn = ({ id, label, count }) => (
    <button
      onClick={() => setTab(id)}
      className={`relative flex-1 text-xs font-semibold py-2 rounded-lg transition ${
        tab === id ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-white/5"
      }`}
    >
      {label}
      {count > 0 && (
        <span className="absolute -top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] leading-4 text-center">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div
      className="fixed bottom-6 right-6 w-[400px] max-h-[96vh] z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30 bg-slate-900"
      style={{ maxWidth: "calc(100vw - 2rem)" }}
      role="dialog"
      aria-label="Big Brain"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: "linear-gradient(90deg,#047857,#065f46)" }}>
        <div className="w-9 h-9 rounded-full flex-shrink-0" style={{ background: GREEN_ORB }} />
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold leading-tight">Big Brain</div>
          <div className="text-emerald-100/80 text-xs truncate">{page}</div>
        </div>
        <button onClick={onClose} aria-label="Close" className="text-emerald-100/80 hover:text-white text-xl leading-none px-2 py-1 rounded-lg hover:bg-white/10">×</button>
      </div>

      {/* Skill tabs */}
      <div className="flex gap-1 px-2 pt-2 bg-slate-900">
        <TabBtn id="alerts" label={t.alerts} count={badge} />
        <TabBtn id="reminders" label={t.reminders} count={0} />
        <TabBtn id="forecasts" label={t.forecasts} count={0} />
        <TabBtn id="answers" label={t.ask} count={0} />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2" style={{ minHeight: 200 }}>
        {tab === "alerts" && (
          alerts.length ? alerts.map((a) => (
            <button key={a.id} onClick={() => go(a.link)} className="w-full text-left flex items-start gap-2 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition">
              <span className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${a.severity === "red" ? "bg-rose-500" : "bg-amber-400"}`} />
              <span className="flex-1 text-sm text-slate-100 leading-snug">{a.label}</span>
              {a.dept && <span className="text-[10px] uppercase text-slate-400 mt-0.5">{a.dept}</span>}
            </button>
          )) : <div className="text-slate-400 text-sm text-center py-6">{t.noAlerts}</div>
        )}

        {tab === "reminders" && (
          reminders.length ? reminders.map((r) => (
            <button key={r.id} onClick={() => go(r.link)} className="w-full text-left flex items-start gap-2 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition">
              <span className="mt-0.5">{REMINDER_ICON[r.type] || "•"}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm text-slate-100 leading-snug">{r.title}</span>
                <span className="block text-xs text-slate-400">
                  {r.when}{r.time ? ` · ${r.time}` : ""}{r.from ? ` · from ${r.from}` : ""}
                </span>
              </span>
            </button>
          )) : <div className="text-slate-400 text-sm text-center py-6">{t.noReminders}</div>
        )}

        {tab === "forecasts" && (
          forecasts.length ? forecasts.map((f) => (
            <button key={f.id} onClick={() => go(f.link)} className="w-full text-left p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-slate-100">{f.metric}</span>
                <span className="text-emerald-300 text-sm">{f.value}{f.unit ? ` ${f.unit}` : ""}</span>
                {f.trend && <span className="text-slate-400 text-xs">{TREND[f.trend] || ""}</span>}
              </div>
              {f.text && <div className="text-xs text-slate-300 mt-0.5 leading-snug">{f.text}</div>}
              <MiniChart chart={f.chart} />
            </button>
          )) : <div className="text-slate-400 text-sm text-center py-6">{t.noForecasts}</div>
        )}

        {tab === "answers" && (
          <>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-snug whitespace-pre-wrap break-words ${
                  m.from === "user" ? "bg-emerald-600 text-white rounded-br-sm" : "bg-slate-800 text-slate-100 rounded-bl-sm"
                }`}>{m.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-400 text-sm px-3 py-2 rounded-2xl rounded-bl-sm">{t.thinking}</div>
              </div>
            )}
          </>
        )}
        <div ref={endRef} />
      </div>

      {/* Input (only meaningful on Ask, but always available) */}
      <div className="flex items-end gap-2 p-2 border-t border-white/10 bg-slate-900">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setTab("answers")}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={t.placeholder}
          className="flex-1 resize-none bg-slate-800 text-white placeholder:text-slate-500 text-sm rounded-xl px-3 py-2 outline-none max-h-28"
        />
        <button onClick={send} disabled={!input.trim() || isTyping} aria-label="Send"
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white flex items-center justify-center">↑</button>
      </div>
    </div>
  );
}
