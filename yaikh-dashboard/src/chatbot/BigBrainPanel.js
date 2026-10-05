import React, { useState, useRef, useEffect, useCallback } from "react";
import { generateBossOrChat } from "./gemini-api";

/* Compact green Big Brain panel — drives the dashboard pages (Management
 * Dashboard / System Analysis / SOP) as a pop-up instead of the full-screen
 * YaiDataBot takeover. Matches the PA compact mount geometry exactly
 * (fixed bottom-6 right-6, w-[400px], max-h-[96vh]) so the body.yai-pa-open
 * flag + the 436px reservation keep working. Answers go through the same
 * Claude Big Brain backend (generateBossOrChat), so the "heavy load" holding
 * message and trilingual replies apply here too.
 *
 * Usage (wired by AppLayout):
 *   import BigBrainPanel from "./chatbot/BigBrainPanel";
 *   <BigBrainPanel page="Management Dashboard" onClose={() => setBigBrainOpen(false)} />
 */

const lang = () => {
  try { return (localStorage.getItem("app-language") || "en").toLowerCase().slice(0, 2); }
  catch { return "en"; }
};

// Short, page-aware opener in the 3 header languages.
const GREETING = {
  en: (page) => `I'm Big Brain — I sit across all 14 agents. On ${page}, ask me what needs your attention or how any of it works.`,
  km: (page) => `ខ្ញុំជា Big Brain — ខ្ញុំមើលការណ៍លើ agent ទាំង 14។ នៅទំព័រ ${page} សួរខ្ញុំអំពីអ្វីដែលត្រូវការការយកចិត្តទុកដាក់ ឬរបៀបដែលវាដំណើរការ។`,
  zh: (page) => `我是 Big Brain — 我统管全部 14 个助手。在「${page}」页面，问我哪些需要您关注，或任何功能怎么用。`,
};
const PLACEHOLDER = { en: "Ask Big Brain…", km: "សួរ Big Brain…", zh: "问 Big Brain…" };
const THINKING = { en: "Thinking…", km: "កំពុងគិត…", zh: "思考中…" };

const GREEN_ORB = "radial-gradient(circle at 30% 25%, #a7f3d0 0%, #10b981 55%, #047857 100%)";

export default function BigBrainPanel({ page = "this page", onClose }) {
  const L = lang();
  const [messages, setMessages] = useState(() => [
    { from: "bot", text: (GREETING[L] || GREETING.en)(page) },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Reserve floor space the same way the PA panels do.
  useEffect(() => {
    document.body.classList.add("yai-pa-open");
    return () => document.body.classList.remove("yai-pa-open");
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    const history = messages.map((m) => ({ from: m.from, text: m.text }));
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setIsTyping(true);
    try {
      const context =
        `You are Yai (Big Brain) driving the "${page}" screen of the Yaikh platform. ` +
        `You sit on top of all 14 department agents and route. Answer about this screen and the factory ` +
        `from the reference data; be warm, short, and direct. Never invent numbers or PAs.`;
      const reply = await generateBossOrChat(text, "Big Brain", context, history, "");
      const parts = String(reply || "").split("\n\n").map((s) => s.trim()).filter(Boolean);
      const bubbles = parts.length ? parts : [String(reply || "").trim()];
      setMessages((prev) => [...prev, ...bubbles.map((t) => ({ from: "bot", text: t }))]);
    } catch {
      const oops = { en: "One moment — let me try that again.", km: "មួយភ្លែត — សូមសាកល្បងម្ដងទៀត។", zh: "稍等 — 我再试一次。" };
      setMessages((prev) => [...prev, { from: "bot", text: oops[L] || oops.en }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [input, isTyping, messages, page, L]);

  return (
    <div
      className="fixed bottom-6 right-6 w-[400px] max-h-[96vh] z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30 bg-slate-900"
      style={{ maxWidth: "calc(100vw - 2rem)" }}
      role="dialog"
      aria-label="Big Brain"
    >
      {/* Header — green Big Brain identity */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: "linear-gradient(90deg,#047857,#065f46)" }}>
        <div className="w-9 h-9 rounded-full flex-shrink-0" style={{ background: GREEN_ORB }} />
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold leading-tight">Big Brain</div>
          <div className="text-emerald-100/80 text-xs truncate">{page}</div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-emerald-100/80 hover:text-white text-xl leading-none px-2 py-1 rounded-lg hover:bg-white/10"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2" style={{ minHeight: 180 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-snug whitespace-pre-wrap break-words ${
                m.from === "user"
                  ? "bg-emerald-600 text-white rounded-br-sm"
                  : "bg-slate-800 text-slate-100 rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-400 text-sm px-3 py-2 rounded-2xl rounded-bl-sm">
              {THINKING[L] || THINKING.en}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 p-2 border-t border-white/10 bg-slate-900">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
          }}
          placeholder={PLACEHOLDER[L] || PLACEHOLDER.en}
          className="flex-1 resize-none bg-slate-800 text-white placeholder:text-slate-500 text-sm rounded-xl px-3 py-2 outline-none max-h-28"
        />
        <button
          onClick={send}
          disabled={!input.trim() || isTyping}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white flex items-center justify-center"
          aria-label="Send"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
