// Icom — the department's internal team chat, opened from the PA header's
// ☰ button. Members (code · role · online dot) on top, then topics; a topic
// opens its thread with assign/status lines as small system rows and a
// reply box. "+ New topic" opens a topic as the manager. The personal PA
// chat history stays reachable via "My PA chats".
// Data: POST /api/m1/sim/view module "icom" — views topics / thread / post.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, RefreshCw, Send } from "lucide-react";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const icom = (body) => fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "icom", ...body }) }).then((r) => r.json());

export const useIcomUnread = (dept) => {
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    if (!dept) return;
    let on = true;
    const load = () => icom({ view: "topics", dept }).then((j) => { if (on && j && j.ok) setUnread((j.topics || []).reduce((s, t) => s + (t.unread || 0), 0)); }).catch(() => {});
    load();
    const t = setInterval(load, 90000);
    return () => { on = false; clearInterval(t); };
  }, [dept]);
  return unread;
};

const STATUS_TONE = { open: "bg-amber-100 text-amber-700", "in progress": "bg-sky-100 text-sky-700", closed: "bg-gray-100 text-gray-500" };
const Dot = ({ on }) => <span className={`inline-block w-1.5 h-1.5 rounded-full ${on ? "bg-emerald-500" : "bg-gray-300"}`} />;

const Icom = ({ dept, onMyChats }) => {
  const [data, setData] = useState(null);
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [newTopic, setNewTopic] = useState(false);
  const [title, setTitle] = useState("");

  const manager = useMemo(() => {
    const m = (data && data.members) || [];
    return (m.find((x) => x.level === "manager" || x.role === "manager") || m[0] || {}).code;
  }, [data]);

  const loadTopics = useCallback(() => {
    setLoading(true);
    icom({ view: "topics", dept }).then((j) => { if (j && j.ok) setData(j); }).catch(() => {}).finally(() => setLoading(false));
  }, [dept]);
  useEffect(() => { loadTopics(); }, [loadTopics]);

  const openTopic = (id) => {
    setLoading(true);
    icom({ view: "thread", dept, topic_id: id }).then((j) => { if (j && j.ok) setThread(j); }).catch(() => {}).finally(() => setLoading(false));
  };

  const post = async () => {
    const t = text.trim();
    if (!t || !manager) return;
    setText("");
    try {
      if (newTopic) {
        const tt = title.trim();
        if (!tt) return;
        const j = await icom({ view: "post", dept, title: tt, text: t, from_code: manager });
        setNewTopic(false); setTitle("");
        if (j && j.ok && j.topic) { setThread(j); loadTopics(); }
      } else if (thread && thread.topic) {
        const j = await icom({ view: "post", dept, topic_id: thread.topic.id, text: t, from_code: manager });
        if (j && j.ok) setThread(j);
      }
    } catch (e) { /* refetch covers it */ }
  };

  /* thread view */
  if (thread && thread.topic) {
    const tp = thread.topic;
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
          <button onClick={() => { setThread(null); loadTopics(); }} className="p-1 rounded hover:bg-gray-100"><ArrowLeft size={14} /></button>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold truncate">{tp.title}</div>
            <div className="text-[10px] text-gray-500">{tp.ref || tp.id} · <span className={`px-1 rounded ${STATUS_TONE[tp.status] || ""}`}>{tp.status}</span> · {Array.isArray(tp.assigned_to) ? tp.assigned_to.join(", ") : ""}</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
          {(thread.messages || []).map((m, i) =>
            m.kind && m.kind !== "message" ? (
              <div key={i} className="text-center text-[9px] text-gray-400 italic">{m.at} · {m.from_code} · {m.text}</div>
            ) : (
              <div key={i} className={`max-w-[85%] rounded-xl px-2.5 py-1.5 text-[11px] leading-snug ${m.from_code === manager ? "ml-auto bg-sky-100" : "bg-gray-100"}`}>
                <div className="text-[9px] font-bold text-gray-500">{m.from_code} <span className="font-normal">· {m.role} · {m.at}</span></div>
                <div className="text-gray-800">{m.text}</div>
              </div>
            )
          )}
        </div>
        <div className="p-2 border-t border-gray-200 flex items-center gap-1.5">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && post()} maxLength={500} placeholder={`Reply as ${manager || "…"}`} className="flex-1 text-[11px] border border-gray-300 rounded-full px-3 py-1.5 outline-none focus:border-sky-400" />
          <button onClick={post} className="p-2 rounded-full bg-sky-600 text-white hover:bg-sky-700"><Send size={13} /></button>
        </div>
      </div>
    );
  }

  /* topics view */
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
        <span className="text-xs font-black flex-1">Icom — {String(dept || "").toUpperCase()} team</span>
        <button onClick={loadTopics} className="p-1 rounded hover:bg-gray-100" title="Refresh"><RefreshCw size={12} className={loading ? "animate-spin" : ""} /></button>
        <button onClick={() => { setNewTopic(true); setThread(null); }} className="flex items-center gap-1 text-[10px] font-bold rounded-full bg-sky-600 text-white px-2 py-1 hover:bg-sky-700"><Plus size={11} /> New topic</button>
      </div>
      {data && Array.isArray(data.members) && (
        <div className="px-3 py-1.5 border-b border-gray-100 flex flex-wrap gap-1.5">
          {data.members.map((m) => (
            <span key={m.code} className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-semibold text-gray-600" title={m.role}><Dot on={m.online} /> {m.code} <span className="text-gray-400 font-normal">{m.level || m.role}</span></span>
          ))}
        </div>
      )}
      {newTopic && (
        <div className="px-3 py-2 border-b border-gray-100 space-y-1.5">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Topic title" className="w-full text-[11px] border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-sky-400" />
          <div className="flex items-center gap-1.5">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && post()} maxLength={500} placeholder="First message" className="flex-1 text-[11px] border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-sky-400" />
            <button onClick={post} className="p-2 rounded-full bg-sky-600 text-white hover:bg-sky-700"><Send size={13} /></button>
            <button onClick={() => setNewTopic(false)} className="text-[10px] text-gray-400 hover:text-gray-600">cancel</button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {((data && data.topics) || []).map((tp) => (
          <button key={tp.id} onClick={() => openTopic(tp.id)} className="w-full text-left px-3 py-2 border-b border-gray-100 hover:bg-gray-50">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-800 flex-1 truncate">{tp.title}</span>
              {tp.unread > 0 && <span className="rounded-full bg-rose-600 text-white text-[9px] font-black px-1.5 leading-4">{tp.unread}</span>}
            </div>
            <div className="text-[10px] text-gray-500 truncate">{tp.last_message}</div>
            <div className="text-[9px] text-gray-400"><span className={`px-1 rounded ${STATUS_TONE[tp.status] || ""}`}>{tp.status}</span> · {Array.isArray(tp.assigned_to) ? tp.assigned_to.join(", ") : ""} · {tp.last_at}</div>
          </button>
        ))}
        {data && (data.topics || []).length === 0 && <div className="text-center text-[11px] text-gray-400 pt-8">No topics yet.</div>}
      </div>
      <button onClick={onMyChats} className="m-2 text-[10px] font-bold text-gray-500 hover:text-gray-700 text-center">My PA chats →</button>
    </div>
  );
};

export default Icom;
