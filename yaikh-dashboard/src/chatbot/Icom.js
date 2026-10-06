// Icom — the department's internal team chat, WhatsApp/Telegram style.
// Layout (Gamini 2026-10-06): a LEFT topic list — narrow left column with the
// topics vertically, FULL titles (wrap to 2 lines), status dot, unread badge
// and last time, grouped under QMS stage headers for QA or Open / In progress
// / Closed for other departments, "All chat" at the top. The right side shows
// the selected topic's thread or the whole group chat. When the panel is too
// narrow a "☰ Topics" button slides the list in from the left. Never raw ISO.
// Data: POST /api/m1/sim/view {"module":"icom","view":"topics"|"chat"|"post"}.
// Rolled out ONE department at a time as Gamini dictates its context.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, RefreshCw, Send, Paperclip, Users, Menu, X } from "lucide-react";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const icom = (body) => fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "icom", ...body }) }).then((r) => r.json());

/* Departments whose conversation context Gamini has dictated. */
const ICOM_READY = new Set(["4dp", "fc", "qa", "hr", "ypi", "mrp", "ce"]);
/* PA slug → icom dept (Production PA talks in the FC warehouse chat). */
export const ICOM_DEPT = { production: "fc" };
/* QMS stages for the QA department chat (Gamini's YQMS columns). */
const QA_STAGES = [
  ["pre_production", "Pre Production"], ["cut", "Cut"], ["decoration", "Decoration"],
  ["sewing", "Sewing"], ["finishing_packing", "Finishing & Packing"],
  ["final_inspection", "Final Inspection"], ["reporting", "Reporting & Compliance"],
];
const STATUS_GROUPS = [["open", "Open"], ["in progress", "In progress"], ["closed", "Closed"]];

export const useIcomUnread = (dept) => {
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    if (!dept || !ICOM_READY.has(dept)) return;
    let on = true;
    const load = () => icom({ view: "topics", dept }).then((j) => { if (on && j && j.ok) setUnread((j.topics || []).reduce((s, t) => s + (t.unread || 0), 0)); }).catch(() => {});
    load();
    const t = setInterval(load, 90000);
    return () => { on = false; clearInterval(t); };
  }, [dept]);
  return unread;
};

const LEVEL_BG = { manager: "bg-indigo-600", executive: "bg-emerald-600", officer: "bg-sky-600", clerk: "bg-amber-500" };
const TOPIC_DOT = { open: "bg-amber-400", "in progress": "bg-sky-400", closed: "bg-gray-300" };

const Avatar = ({ initials, level, small }) => (
  <span className={`${small ? "w-5 h-5 text-[8px]" : "w-7 h-7 text-[10px]"} rounded-full flex items-center justify-center text-white font-black flex-shrink-0 ${LEVEL_BG[level] || "bg-gray-500"}`}>{initials}</span>
);

/* "09:25" today, "Yesterday", else "4 Oct" — never raw ISO. */
const shortWhen = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const now = new Date();
  const day = (x) => `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`;
  if (day(d) === day(now)) return d.toTimeString().slice(0, 5);
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (day(d) === day(y)) return "Yesterday";
  return `${d.getDate()} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]}`;
};

const clamp2 = { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };

/* One row in the left topic list. */
const TopicRow = ({ tp, active, onPick }) => (
  <button onClick={() => onPick(tp.id)} className={`w-full text-left px-2 py-1.5 border-b border-gray-100 ${active ? "bg-sky-50" : "hover:bg-gray-50"}`}>
    <div className="flex items-start gap-1">
      <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${TOPIC_DOT[tp.status] || "bg-gray-300"}`} />
      <span className={`flex-1 text-[9.5px] leading-[1.25] ${active ? "font-bold text-sky-800" : "font-semibold text-gray-700"}`} style={clamp2}>{tp.title}</span>
    </div>
    <div className="flex items-center justify-between pl-2.5 mt-0.5">
      <span className="text-[8px] text-gray-400">{shortWhen(tp.last_at)}</span>
      {tp.unread > 0 && <span className="rounded-full bg-rose-600 text-white px-1 leading-3 text-[8px] font-black">{tp.unread}</span>}
    </div>
  </button>
);

/* The left topic list: "All chat" on top, then topics grouped under QMS
   stage headers (QA) or Open / In progress / Closed (other departments). */
const TopicList = ({ dept, topics, stages, topicId, stage, onAll, onStage, onTopic }) => {
  const groups = useMemo(() => {
    if (dept === "qa") {
      return QA_STAGES.map(([key, label]) => {
        const st = (stages || []).find((s) => s.stage_key === key || s.stage === label) || {};
        return { key, label, unread: st.unread || 0, items: topics.filter((t) => t.stage === label || t.stage === key) };
      }).filter((g) => g.items.length > 0);
    }
    return STATUS_GROUPS.map(([key, label]) => ({ key, label, unread: 0, items: topics.filter((t) => (t.status || "open") === key) })).filter((g) => g.items.length > 0);
  }, [dept, topics, stages]);

  return (
    <div className="h-full overflow-y-auto bg-white">
      <button onClick={onAll} className={`w-full text-left px-2 py-2 border-b border-gray-200 flex items-center gap-1.5 ${!topicId && !stage ? "bg-sky-50" : "hover:bg-gray-50"}`}>
        <Users size={11} className="text-gray-400 flex-shrink-0" />
        <span className={`text-[10px] ${!topicId && !stage ? "font-black text-sky-800" : "font-bold text-gray-600"}`}>All chat</span>
      </button>
      {groups.map((g) => (
        <div key={g.key}>
          <button onClick={() => onStage && onStage(g.key)} disabled={dept !== "qa"}
            className={`w-full text-left px-2 py-1 flex items-center justify-between sticky top-0 border-b border-gray-100 ${stage === g.key ? "bg-violet-600" : "bg-gray-50"} ${dept === "qa" ? "" : "cursor-default"}`}>
            <span className={`text-[8px] font-black uppercase tracking-wide ${stage === g.key ? "text-white" : "text-gray-400"}`}>{g.label}</span>
            {g.unread > 0 && <span className={`rounded-full px-1 leading-3 text-[8px] font-black ${stage === g.key ? "bg-white text-violet-700" : "bg-rose-600 text-white"}`}>{g.unread}</span>}
          </button>
          {g.items.map((tp) => <TopicRow key={tp.id} tp={tp} active={tp.id === topicId} onPick={onTopic} />)}
        </div>
      ))}
    </div>
  );
};

const Icom = ({ dept, onMyChats }) => {
  const ready = ICOM_READY.has(dept);
  const [d, setD] = useState(null);            // chat view: messages + me
  const [idx, setIdx] = useState(null);         // topics view: topics + stages + members
  const [loading, setLoading] = useState(true);
  const [topicId, setTopicId] = useState(null);
  const [stage, setStage] = useState(null);     // QA: QMS stage filter
  const [text, setText] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [drawer, setDrawer] = useState(false);  // narrow mode: slide-in topic list
  const [listOpen, setListOpen] = useState(true); // inline list slides away when a topic is picked
  const [narrow, setNarrow] = useState(false);
  const rootRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((es) => { for (const e of es) setNarrow(e.contentRect.width < 230); });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ready]);

  const loadTopics = useCallback(() => {
    if (!ready) return;
    icom({ view: "topics", dept }).then((j) => { if (j && j.ok) setIdx(j); }).catch(() => {});
  }, [dept, ready]);

  const load = useCallback(() => {
    if (!ready) { setLoading(false); return; }
    setLoading(true);
    icom({ view: "chat", dept, ...(topicId ? { topic_id: topicId } : {}), ...(stage ? { stage } : {}) })
      .then((j) => { if (j && j.ok) setD(j); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [dept, topicId, stage, ready]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadTopics(); }, [loadTopics]);
  useEffect(() => { if (endRef.current) endRef.current.scrollIntoView({ block: "end" }); }, [d]);

  const me = d && d.me;
  const send = async () => {
    const t = text.trim();
    if (!t || !me) return;
    setText("");
    try {
      await icom({ view: "post", dept, text: t, from_code: me, ...(topicId ? { topic_id: topicId } : {}), ...(stage ? { stage } : {}) });
      // The post response's message shape differs per target (topic thread vs
      // group chat) — always refetch the chat view so bubbles keep avatars,
      // name labels and the "mine" green.
      load();
      loadTopics();
    } catch (e) { load(); }
  };

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-2">
        <Users size={28} className="text-gray-300" />
        <div className="text-sm font-bold text-gray-600">Icom is coming for this department</div>
        <div className="text-[11px] text-gray-400 leading-snug">Each department's team chat is set up with its own real working context. {String(dept || "").toUpperCase()} is next in line.</div>
        <button onClick={onMyChats} className="mt-2 text-[10px] font-bold text-sky-600 hover:text-sky-700">My PA chats →</button>
      </div>
    );
  }

  const msgs = (d && d.messages) || [];
  const topics = (idx && idx.topics) || (d && d.topics) || [];
  const stages = (idx && idx.stages) || (d && d.stages) || [];
  const members = (idx && idx.members) || (d && d.members) || [];
  const totalUnread = topics.reduce((s, t) => s + (t.unread || 0), 0);
  const activeTopic = topicId ? topics.find((t) => t.id === topicId) : null;
  const activeStageLabel = stage ? (QA_STAGES.find(([k]) => k === stage) || [])[1] : null;
  let lastDay = null;

  const pickAll = () => { setTopicId(null); setStage(null); setDrawer(false); setListOpen(true); };
  const pickStage = (k) => { setStage(k === stage ? null : k); setTopicId(null); setDrawer(false); };
  /* Picking a topic slides the list away so the thread gets the full width
     (Gamini 2026-10-06); ☰ in the context bar brings it back. */
  const pickTopic = (id) => { const next = id === topicId ? null : id; setTopicId(next); setStage(null); setDrawer(false); setListOpen(!next); };

  const listEl = (
    <TopicList dept={dept} topics={topics} stages={stages} topicId={topicId} stage={stage}
      onAll={pickAll} onStage={dept === "qa" ? pickStage : null} onTopic={pickTopic} />
  );

  return (
    <div ref={rootRef} className="flex flex-col h-full bg-[#ece5dd]">
      {/* members strip */}
      <div className="bg-white border-b border-gray-200 px-2.5 py-1.5 flex items-center gap-1.5">
        {narrow && (
          <button onClick={() => setDrawer(true)} className="flex items-center gap-1 rounded-md border border-gray-200 px-1.5 py-0.5 text-[9px] font-bold text-gray-600 hover:bg-gray-50 flex-shrink-0" title="Topics">
            <Menu size={11} /> Topics
            {totalUnread > 0 && <span className="rounded-full bg-rose-600 text-white px-1 leading-3 text-[8px] font-black">{totalUnread}</span>}
          </button>
        )}
        <button onClick={() => setShowMembers((v) => !v)} className="flex -space-x-1.5 items-center" title="Team members">
          {members.slice(0, narrow ? 4 : 6).map((m) => (
            <span key={m.code} className="relative inline-flex">
              <Avatar initials={m.initials || m.code.replace(/[^A-Z0-9]/gi, "").slice(0, 2)} level={m.level} small />
              {m.online && <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />}
            </span>
          ))}
        </button>
        <span className="text-[10px] text-gray-500 flex-1 truncate">{members.filter((m) => m.online).length} online · {String(dept).toUpperCase()} team</span>
        <button onClick={() => { load(); loadTopics(); }} className="p-1 rounded hover:bg-gray-100" title="Refresh"><RefreshCw size={12} className={loading ? "animate-spin text-gray-400" : "text-gray-400"} /></button>
        <button onClick={onMyChats} className="text-[9px] font-bold text-gray-400 hover:text-gray-600 whitespace-nowrap">My PA chats</button>
      </div>

      {showMembers && (
        <div className="bg-white border-b border-gray-200 px-3 py-2 grid grid-cols-2 gap-1">
          {members.map((m) => (
            <span key={m.code} className="flex items-center gap-1.5 text-[10px] text-gray-600">
              <Avatar initials={m.initials || m.code.slice(0, 2)} level={m.level} small />
              <span className="truncate">{m.name_label || `${m.role || m.level} · ${m.code}`}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${m.online ? "bg-emerald-500" : "bg-gray-300"}`} />
            </span>
          ))}
        </div>
      )}

      {/* body: left topic list + right thread */}
      <div className="flex-1 flex min-h-0 relative">
        {!narrow && (
          <div className="flex-shrink-0 overflow-hidden" style={{ width: listOpen ? "38%" : 0, minWidth: listOpen ? 100 : 0, maxWidth: 170, transition: "width .25s ease, min-width .25s ease", borderRight: listOpen ? "1px solid #e5e7eb" : "none" }}>{listEl}</div>
        )}

        {narrow && drawer && (
          <>
            <div className="absolute inset-0 bg-black/30 z-10" onClick={() => setDrawer(false)} />
            <div className="absolute inset-y-0 left-0 w-[78%] max-w-[240px] z-20 shadow-2xl flex flex-col bg-white">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-200">
                <span className="text-[10px] font-black text-gray-600">Topics</span>
                <button onClick={() => setDrawer(false)} className="p-1 rounded hover:bg-gray-100"><X size={12} className="text-gray-400" /></button>
              </div>
              <div className="flex-1 min-h-0">{listEl}</div>
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          {/* context bar: which thread is on the right */}
          {(activeTopic || activeStageLabel) && (
            <div className="bg-white/90 border-b border-gray-200 px-2 py-1 flex items-center gap-1.5">
              {!narrow && !listOpen && (
                <button onClick={() => setListOpen(true)} className="p-0.5 rounded hover:bg-gray-100 flex-shrink-0" title="Show topics"><Menu size={11} className="text-gray-500" /></button>
              )}
              <button onClick={pickAll} className="p-0.5 rounded hover:bg-gray-100 flex-shrink-0" title="All chat"><ArrowLeft size={11} className="text-gray-500" /></button>
              {activeTopic && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${TOPIC_DOT[activeTopic.status] || "bg-gray-300"}`} />}
              <span className="text-[9.5px] font-bold text-gray-700 truncate">{activeTopic ? activeTopic.title : activeStageLabel}</span>
              {activeTopic && activeTopic.status && <span className="text-[8px] text-gray-400 flex-shrink-0">{activeTopic.status}</span>}
            </div>
          )}

          {/* chat scroll */}
          <div className="flex-1 overflow-y-auto px-2.5 py-2">
            {msgs.map((m) => {
              const daySep = m.day_label && m.day_label !== lastDay;
              lastDay = m.day_label || lastDay;
              return (
                <React.Fragment key={m.id}>
                  {daySep && (
                    <div className="flex justify-center my-2"><span className="rounded-full bg-white/90 text-gray-500 text-[9px] font-bold px-2.5 py-0.5 shadow-sm">{m.day_label}</span></div>
                  )}
                  {m.kind === "assign" || m.kind === "status" ? (
                    <div className="text-center my-1"><span className="text-[9px] text-gray-500 italic bg-white/70 rounded-full px-2 py-0.5">{m.name_label} · {m.text} · {m.time}</span></div>
                  ) : (
                    <div className={`flex items-end gap-1.5 my-1 ${m.mine ? "flex-row-reverse" : ""}`}>
                      {!m.mine && <Avatar initials={m.initials} level={m.level} />}
                      <div className={`max-w-[82%] rounded-2xl px-2.5 py-1.5 shadow-sm ${m.mine ? "bg-[#d9fdd3]" : "bg-white"}`}>
                        {!m.mine && <div className="text-[9px] font-bold text-sky-700">{m.name_label}</div>}
                        {!topicId && m.topic_title && <div className="text-[8px] text-gray-400 italic">↳ {m.topic_title}{m.ref ? ` · ${m.ref}` : ""}</div>}
                        {m.kind === "file" ? (
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 mt-0.5"><Paperclip size={11} /> {m.text}</div>
                        ) : (
                          <div className="text-[11px] text-gray-800 leading-snug whitespace-pre-wrap">{m.text}</div>
                        )}
                        <div className="text-right text-[8px] text-gray-400 mt-0.5">{m.time}</div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
            {msgs.length === 0 && !loading && <div className="text-center text-[11px] text-gray-400 pt-8">No messages yet.</div>}
            <div ref={endRef} />
          </div>

          {/* composer */}
          <div className="bg-white border-t border-gray-200 p-2 flex items-center gap-1.5">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} maxLength={500}
              placeholder={topicId ? "Reply in this topic…" : "Message the team…"}
              className="flex-1 min-w-0 text-[11px] border border-gray-300 rounded-full px-3 py-2 outline-none focus:border-sky-400 bg-gray-50" />
            <button onClick={send} className="w-9 h-9 rounded-full bg-[#00a884] text-white flex items-center justify-center hover:brightness-110 flex-shrink-0" title="Send"><Send size={15} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Icom;
