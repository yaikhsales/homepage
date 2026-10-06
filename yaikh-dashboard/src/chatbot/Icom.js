// Icom — the department's internal team chat, WhatsApp/Telegram style.
// Opens STRAIGHT into the department group chat: bubbles in time order with
// day separators, round level-coloured initials avatars, "Planning manager ·
// P-01" sender lines, short times, my messages right in blue, assign/status
// as centred system lines, files as chips. Topics are a chip row that
// filters the chat; members live in a small header strip. Never raw ISO.
// Data: POST /api/m1/sim/view {"module":"icom","view":"chat","dept",...}.
// Rolled out ONE department at a time as Gamini dictates its context —
// currently 4DP only; other departments see a calm "coming" note.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, RefreshCw, Send, Paperclip, Users } from "lucide-react";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const icom = (body) => fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "icom", ...body }) }).then((r) => r.json());

/* Departments whose conversation context Gamini has dictated. */
const ICOM_READY = new Set(["4dp"]);

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

const Icom = ({ dept, onMyChats }) => {
  const ready = ICOM_READY.has(dept);
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topicId, setTopicId] = useState(null);
  const [text, setText] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const endRef = useRef(null);

  const load = useCallback(() => {
    if (!ready) { setLoading(false); return; }
    setLoading(true);
    icom({ view: "chat", dept, ...(topicId ? { topic_id: topicId } : {}) })
      .then((j) => { if (j && j.ok) setD(j); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [dept, topicId, ready]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (endRef.current) endRef.current.scrollIntoView({ block: "end" }); }, [d]);

  const me = d && d.me;
  const send = async () => {
    const t = text.trim();
    if (!t || !me) return;
    setText("");
    try {
      const j = await icom({ view: "post", dept, text: t, from_code: me, ...(topicId ? { topic_id: topicId } : {}) });
      if (j && j.ok) setD(j); else load();
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
  const topics = (d && d.topics) || [];
  const members = (d && d.members) || [];
  let lastDay = null;

  return (
    <div className="flex flex-col h-full bg-[#ece5dd]">
      {/* members strip */}
      <div className="bg-white border-b border-gray-200 px-2.5 py-1.5 flex items-center gap-1.5">
        <button onClick={() => setShowMembers((v) => !v)} className="flex -space-x-1.5 items-center" title="Team members">
          {members.slice(0, 6).map((m) => (
            <span key={m.code} className="relative inline-flex">
              <Avatar initials={m.initials || m.code.replace(/[^A-Z0-9]/gi, "").slice(0, 2)} level={m.level} small />
              {m.online && <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />}
            </span>
          ))}
        </button>
        <span className="text-[10px] text-gray-500 flex-1 truncate">{members.filter((m) => m.online).length} online · {String(dept).toUpperCase()} team</span>
        <button onClick={load} className="p-1 rounded hover:bg-gray-100" title="Refresh"><RefreshCw size={12} className={loading ? "animate-spin text-gray-400" : "text-gray-400"} /></button>
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

      {/* topics chip row */}
      {topics.length > 0 && (
        <div className="bg-white/80 border-b border-gray-200 px-2 py-1 flex gap-1 overflow-x-auto">
          {topicId && (
            <button onClick={() => setTopicId(null)} className="flex items-center gap-0.5 flex-shrink-0 rounded-full bg-gray-700 text-white text-[9px] font-bold px-2 py-0.5"><ArrowLeft size={9} /> All chat</button>
          )}
          {topics.map((tp) => (
            <button key={tp.id} onClick={() => setTopicId(tp.id === topicId ? null : tp.id)} className={`flex items-center gap-1 flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold border ${tp.id === topicId ? "bg-sky-600 text-white border-sky-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`} title={tp.title}>
              <span className={`w-1.5 h-1.5 rounded-full ${TOPIC_DOT[tp.status] || "bg-gray-300"}`} />
              <span className="max-w-[110px] truncate">{tp.title}</span>
              {tp.unread > 0 && <span className="rounded-full bg-rose-600 text-white px-1 leading-3 text-[8px] font-black">{tp.unread}</span>}
            </button>
          ))}
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
                  <div className={`max-w-[78%] rounded-2xl px-2.5 py-1.5 shadow-sm ${m.mine ? "bg-[#d9fdd3]" : "bg-white"}`}>
                    {!m.mine && <div className="text-[9px] font-bold text-sky-700">{m.name_label}</div>}
                    {m.topic_title && <div className="text-[8px] text-gray-400 italic">↳ {m.topic_title}{m.ref ? ` · ${m.ref}` : ""}</div>}
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
          className="flex-1 text-[11px] border border-gray-300 rounded-full px-3 py-2 outline-none focus:border-sky-400 bg-gray-50" />
        <button onClick={send} className="w-9 h-9 rounded-full bg-[#00a884] text-white flex items-center justify-center hover:brightness-110 flex-shrink-0" title="Send"><Send size={15} /></button>
      </div>
    </div>
  );
};

export default Icom;
