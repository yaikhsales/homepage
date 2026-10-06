// Big Brain's direct chats with the 14 department PAs — lives in the dark
// Chat History drawer of the Big Brain chat (Gamini 2026-10-06). Left list =
// the PAs in module order with icon, unread badge and last message; click a
// PA → a direct thread where Big Brain types to that department's PA.
// Data (Icom, dept "bigbrain"): topics → dm topics {kind:"dm", pa, id
// "bigbrain-dm-<pa>"}; thread → rows {at, from_code, text, kind}; post →
// {topic_id, text, from_code:"Big Brain"}. Plain data routes, no Claude.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, RefreshCw, Send } from "lucide-react";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const icom = (body) => fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "icom", dept: "bigbrain", ...body }) }).then((r) => r.json());

// Module order (Gamini): 4DP, YPI, MRP, FC, CE, Production, QA, YTM, HR, Admin, CSR, Shipping, Accounting, Social.
const PAS = [
  ["4dp", "4DP PA", "Planning", "from-amber-500 to-yellow-500"],
  ["ypi", "YPI PA", "Product development", "from-lime-500 to-green-500"],
  ["mrp", "MRP PA", "Materials", "from-red-500 to-orange-500"],
  ["fc", "FC PA", "Fabric control", "from-violet-500 to-indigo-500"],
  ["ce", "CE PA", "Industrial engineering", "from-pink-500 to-rose-500"],
  ["production", "Production PA", "Production", "from-orange-500 to-amber-500"],
  ["qa", "QA PA", "Quality", "from-violet-500 to-purple-500"],
  ["ytm", "YTM PA", "Maintenance", "from-teal-500 to-cyan-500"],
  ["hr", "HR PA", "HR", "from-indigo-500 to-blue-500"],
  ["admin", "Admin PA", "Admin", "from-blue-500 to-cyan-500"],
  ["csr", "CSR PA", "Compliance", "from-purple-500 to-pink-500"],
  ["shipping", "Shipping PA", "Shipping", "from-cyan-500 to-sky-500"],
  ["accounting", "Accounting PA", "Accounting", "from-green-500 to-emerald-500"],
  ["social", "Social PA", "Social media", "from-sky-500 to-blue-500"],
].map(([slug, code, dept, grad]) => ({ slug, code, dept, grad, topicId: `bigbrain-dm-${slug}` }));

const ME = "Big Brain";

const shortTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const today = new Date();
  return d.toDateString() === today.toDateString()
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { day: "numeric", month: "short" });
};

const PAIcon = ({ pa, size = 36 }) => (
  <span className={`rounded-full bg-gradient-to-br ${pa.grad} text-white font-black flex items-center justify-center flex-shrink-0 shadow`}
    style={{ width: size, height: size, fontSize: size * 0.3 }}>
    {pa.code.replace(/ PA$/, "").slice(0, 4)}
  </span>
);

/* Find the dm topic for a PA, whatever shape the route uses for `pa`. */
const dmFor = (topics, pa) => topics.find((t) =>
  t.id === pa.topicId ||
  (t.kind === "dm" && [pa.slug, pa.code].includes(String(t.pa || "").replace(/-bot$/, "")))
);

const BigBrainPAChats = ({ fontSize = 14, onThreadChange }) => {
  const [topics, setTopics] = useState([]);
  const [open, setOpen] = useState(null); // PA object
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [waiting, setWaiting] = useState(0); // ms timestamp of the GM's last send, 0 = not waiting
  const endRef = useRef(null);

  const loadTopics = useCallback(() => {
    icom({ view: "topics" }).then((j) => { if (j && j.ok) setTopics(j.topics || []); }).catch(() => {});
  }, []);
  useEffect(() => {
    loadTopics();
    const t = setInterval(loadTopics, 20000);
    return () => clearInterval(t);
  }, [loadTopics]);

  const topicIdOf = (pa) => (dmFor(topics, pa) || {}).id || pa.topicId;

  const loadThread = useCallback((pa) => {
    if (!pa) return;
    setLoading(true);
    icom({ view: "thread", topic_id: topicIdOf(pa) })
      .then((j) => setRows(j && j.ok ? (j.rows || j.messages || []) : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics]);

  useEffect(() => { setWaiting(0); if (open) loadThread(open); if (onThreadChange) onThreadChange(!!open); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Every PA answers to Big Brain (the GM). After the GM sends, poll the
  // thread until the PA's reply lands (M1 writes it), up to 2 minutes;
  // otherwise refresh an open thread every 20 s.
  useEffect(() => {
    if (!open) return undefined;
    const tick = () => icom({ view: "thread", topic_id: topicIdOf(open) }).then((j) => {
      if (!j || !j.ok) return;
      const r = j.rows || j.messages || [];
      const last = r[r.length - 1];
      if (waiting) {
        if (last && last.from_code !== ME) { setRows(r); setWaiting(0); }
        else if (Date.now() - waiting > 120000) setWaiting(0);
      } else setRows(r);
    }).catch(() => {});
    const t = setInterval(tick, waiting ? 4000 : 20000);
    return () => clearInterval(t);
  }, [open, waiting]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (endRef.current) endRef.current.scrollIntoView({ block: "end" }); }, [rows]);

  const send = async () => {
    const t = text.trim();
    if (!t || !open) return;
    setText("");
    setRows((r) => [...r, { at: new Date().toISOString(), from_code: ME, text: t, kind: "message", pending: true }]);
    const settle = (failed) => setRows((r) => r.map((m) => (m.pending ? { ...m, pending: false, failed } : m)));
    try {
      const j = await icom({ view: "post", topic_id: topicIdOf(open), text: t, from_code: ME });
      if (j && j.ok && (j.rows || j.messages || []).length) setRows(j.rows || j.messages);
      else settle(!(j && j.ok));
      if (j && j.ok) setWaiting(Date.now());
      loadTopics();
    } catch (e) { settle(true); }
  };

  if (open) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
          <button onClick={() => { setOpen(null); loadTopics(); }} className="p-1.5 rounded-full hover:bg-white/10" title="All PAs"><ArrowLeft size={16} className="text-white/70" /></button>
          <PAIcon pa={open} size={28} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{open.code}</div>
            <div className="text-[10px] text-white/50 truncate">{open.dept} · answers to you, the GM</div>
          </div>
          <button onClick={() => loadThread(open)} className="p-1.5 rounded-full hover:bg-white/10" title="Refresh"><RefreshCw size={13} className={loading ? "animate-spin text-white/40" : "text-white/50"} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5" style={{ fontSize }}>
          {rows.map((m, i) => {
            const mine = m.from_code === ME;
            if (m.kind === "assign" || m.kind === "status") {
              return <div key={i} className="text-center"><span className="text-[10px] text-white/50 italic">{m.text} · {shortTime(m.at)}</span></div>;
            }
            return (
              <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-1.5 ${mine ? "bg-emerald-600/80 text-white" : "bg-white/10 text-white/90"} ${m.pending ? "opacity-70" : ""}`}>
                  <div className="leading-snug whitespace-pre-wrap" style={{ fontSize: Math.max(12, fontSize - 2) }}>{m.text}</div>
                  <div className="text-right text-[9px] text-white/50 mt-0.5">{m.failed ? "not sent — try again" : shortTime(m.at)}</div>
                </div>
              </div>
            );
          })}
          {waiting > 0 && (
            <div className="flex justify-start"><div className="rounded-2xl px-3 py-1.5 bg-white/5 text-white/50 text-xs italic">{open.code} is replying…</div></div>
          )}
          {rows.length === 0 && !loading && (
            <div className="text-center text-xs text-white/50 pt-8 px-4">No messages with {open.code} yet — type below to start.</div>
          )}
          <div ref={endRef} />
        </div>
        <div className="p-2 border-t border-white/10 flex items-center gap-1.5">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} maxLength={500}
            placeholder={`Message ${open.code}…`}
            className="flex-1 min-w-0 text-sm bg-white/5 border border-white/15 rounded-full px-3 py-2 text-white placeholder-white/40 outline-none focus:border-emerald-400" />
          <button onClick={send} className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:brightness-110 flex-shrink-0" title="Send"><Send size={15} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="px-2 pt-1 pb-2">
        <div className="text-[10px] uppercase tracking-wider text-white/40">Department PAs</div>
        <div className="text-[11px] text-white/50 mt-0.5">Every PA answers to Big Brain, the GM. Tap a PA to ask — the reply comes back here.</div>
      </div>
      {PAS.map((pa) => {
        const t = dmFor(topics, pa) || {};
        const unread = Number(t.unread) || 0;
        const last = String(t.last_message || "").replace(/^Big Brain:\s*/, "You: ");
        return (
          <button key={pa.slug} onClick={() => setOpen(pa)} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition text-left">
            <PAIcon pa={pa} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-white/90 font-semibold truncate flex-1">{pa.code}</span>
                {t.last_at && <span className="text-[10px] text-white/40 flex-shrink-0">{shortTime(t.last_at)}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs truncate flex-1 ${unread ? "text-white/80" : "text-white/45"}`}>{last || pa.dept}</span>
                {unread > 0 && <span className="rounded-full bg-emerald-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center flex-shrink-0">{unread}</span>}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default BigBrainPAChats;
