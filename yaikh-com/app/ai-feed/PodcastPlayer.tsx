"use client";

/**
 * "The Yai Ai Brief" — compact FLOATING player.
 *
 * A small draggable widget (not part of the page flow): docked bottom-right
 * by default, grab anywhere on the header to move it, position remembered
 * in localStorage. Play/pause, live equalizer, seek, episode chips.
 * Renders nothing on deployments without GEMINI_API_KEY / MONGO_URL.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type Meta = {
  date: string;
  status: "ready" | "generating" | "failed";
  durationSec?: number;
  stories?: string[];
};

type Phase = "checking" | "unavailable" | "idle" | "generating" | "ready" | "failed";

const POS_KEY = "yai-brief-pos";
const WIDGET_W = 288;

function EpisodeCalendar({
  month,
  setMonth,
  dates,
  selected,
  today,
  onPick,
}: {
  month: string; // "YYYY-MM"
  setMonth: (m: string) => void;
  dates: string[];
  selected: string | null;
  today: string;
  onPick: (date: string) => void;
}) {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const daysInMonth = new Date(y, m, 0).getDate();
  const startPad = first.getDay(); // 0 = Sunday
  const has = new Set(dates);

  const shift = (delta: number) => {
    const d = new Date(y, m - 1 + delta, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const monthLabel = first.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div className="mt-2 rounded-xl bg-white/5 border border-white/10 p-2">
      <div className="flex items-center justify-between px-1 mb-1.5">
        <button onClick={() => shift(-1)} aria-label="Previous month" className="text-white/50 hover:text-white px-1.5">‹</button>
        <span className="text-[11px] font-semibold text-white/80">{monthLabel}</span>
        <button onClick={() => shift(1)} aria-label="Next month" className="text-white/50 hover:text-white px-1.5">›</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="text-[9px] text-white/35 py-0.5">{d}</span>
        ))}
        {Array.from({ length: startPad }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = `${month}-${String(day).padStart(2, "0")}`;
          const available = has.has(iso);
          const isSelected = iso === selected;
          const isToday = iso === today;
          return (
            <button
              key={iso}
              disabled={!available}
              onClick={() => onPick(iso)}
              className={`text-[10px] rounded-md py-1 transition ${
                isSelected
                  ? "bg-yai-orange text-white font-bold"
                  : available
                  ? "bg-yai-orange/15 text-yai-amber font-semibold hover:bg-yai-orange/30 cursor-pointer"
                  : "text-white/25 cursor-default"
              } ${isToday && !isSelected ? "ring-1 ring-yai-amber/50" : ""}`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 px-1 text-[9px] text-white/35">
        Highlighted days have an episode · {dates.length} in the archive
      </p>
    </div>
  );
}

function fmt(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function niceDate(iso: string, today: string): string {
  if (iso === today) return "Today";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function PodcastPlayer() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [today, setToday] = useState<string>("");
  const [episodes, setEpisodes] = useState<Meta[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [calMonth, setCalMonth] = useState<string | null>(null); // "YYYY-MM"

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---- floating position / drag ----
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null); // null = default dock
  const posRef = useRef<{ x: number; y: number } | null>(null); // latest pos, immune to closure staleness
  const dragRef = useRef<{ dx: number; dy: number; moved: boolean } | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(POS_KEY);
      if (saved) setPos(JSON.parse(saved));
    } catch {}
  }, []);

  const clamp = (x: number, y: number) => {
    const w = boxRef.current?.offsetWidth ?? WIDGET_W;
    const h = boxRef.current?.offsetHeight ?? 120;
    return {
      x: Math.min(Math.max(4, x), window.innerWidth - w - 4),
      y: Math.min(Math.max(4, y), window.innerHeight - h - 4),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    dragRef.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top, moved: false };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    d.moved = true;
    const next = clamp(e.clientX - d.dx, e.clientY - d.dy);
    posRef.current = next;
    setPos(next);
  };

  const onPointerUp = () => {
    if (dragRef.current?.moved && posRef.current) {
      try { localStorage.setItem(POS_KEY, JSON.stringify(posRef.current)); } catch {}
    }
    dragRef.current = null;
  };

  // ---- data ----
  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/ai-feed/podcast");
      if (res.status === 503) { setPhase("unavailable"); return; }
      const data = await res.json();
      if (!data.ok) { setPhase("unavailable"); return; }
      setToday(data.today);
      setEpisodes(data.episodes ?? []);
      setDates(data.dates ?? []);
      setSelected((cur) => cur ?? data.episodes?.[0]?.date ?? null);
      setCalMonth((cur) => cur ?? (data.today as string).slice(0, 7));

      const ep: Meta | null = data.episode;
      if (ep?.status === "generating") setPhase("generating");
      else if (data.episodes?.length > 0) setPhase("ready");
      else if (ep?.status === "failed") setPhase("failed");
      else setPhase("idle");
    } catch {
      setPhase("unavailable");
    }
  }, []);

  useEffect(() => { check(); }, [check]);

  useEffect(() => {
    if (phase === "generating" && !pollRef.current) {
      pollRef.current = setInterval(check, 5000);
    }
    if (phase !== "generating" && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };
  }, [phase, check]);

  const generate = async () => {
    setPhase("generating");
    try {
      const res = await fetch("/api/ai-feed/podcast", { method: "POST" });
      const data = await res.json();
      if (data.episode?.status === "ready") {
        await check();
        setSelected(data.episode.date);
      } else if (data.episode?.status === "generating") {
        setPhase("generating");
      } else {
        setPhase("failed");
      }
    } catch {
      setPhase("failed");
    }
  };

  const selectEpisode = (date: string) => {
    if (date === selected) return;
    const a = audioRef.current;
    if (a) { a.pause(); a.currentTime = 0; }
    setPlaying(false);
    setElapsed(0);
    setDuration(0);
    setSelected(date);
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    a.currentTime = (Number(e.target.value) / 100) * duration;
  };

  if (phase === "checking" || phase === "unavailable") return null;

  const pct = duration ? (elapsed / duration) * 100 : 0;

  const style: React.CSSProperties = pos
    ? { position: "fixed", left: pos.x, top: pos.y, width: WIDGET_W, maxWidth: "calc(100vw - 8px)", zIndex: 300 }
    : { position: "fixed", right: 16, bottom: 16, width: WIDGET_W, maxWidth: "calc(100vw - 24px)", zIndex: 300 };

  return (
    <div
      ref={boxRef}
      style={style}
      className="rounded-2xl bg-yai-navy/95 backdrop-blur text-white shadow-2xl border border-white/10 select-none"
    >
      {/* Drag handle header */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="flex items-center gap-2 px-3 pt-2.5 pb-1.5 cursor-grab active:cursor-grabbing touch-none"
      >
        {/* grip dots */}
        <svg viewBox="0 0 10 16" className="w-2 h-3.5 text-white/30 shrink-0" fill="currentColor" aria-hidden>
          <circle cx="2.5" cy="3" r="1.3" /><circle cx="7.5" cy="3" r="1.3" />
          <circle cx="2.5" cy="8" r="1.3" /><circle cx="7.5" cy="8" r="1.3" />
          <circle cx="2.5" cy="13" r="1.3" /><circle cx="7.5" cy="13" r="1.3" />
        </svg>
        <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-yai-amber">
          Yai Ai Brief
        </span>
        <span className="flex-1" />
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand" : "Collapse"}
          className="text-white/50 hover:text-white transition text-xs leading-none px-1"
        >
          {collapsed ? "▴" : "▾"}
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 pb-3">
          {phase === "ready" && selected && (
            <>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={toggle}
                  aria-label={playing ? "Pause" : "Play"}
                  className="w-9 h-9 shrink-0 rounded-full bg-yai-orange hover:bg-yai-orange/90 transition flex items-center justify-center"
                >
                  {playing ? (
                    <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4" aria-hidden>
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5" aria-hidden>
                      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z" />
                    </svg>
                  )}
                </button>

                {/* Equalizer */}
                <div className="flex items-end gap-[2px] h-5 shrink-0" aria-hidden>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="w-[3px] rounded-full bg-yai-amber"
                      style={{
                        height: playing ? undefined : "4px",
                        animation: playing
                          ? `yai-eq-sm 0.9s ease-in-out ${i * 0.15}s infinite alternate`
                          : "none",
                      }}
                    />
                  ))}
                </div>

                <div className="flex-1 min-w-0">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={pct}
                    onChange={seek}
                    aria-label="Seek"
                    className="w-full accent-yai-orange h-1 cursor-pointer"
                  />
                </div>
                <span className="text-[10px] text-white/55 tabular-nums shrink-0">
                  {fmt(elapsed)}/{fmt(duration || 0)}
                </span>
              </div>

              {/* Episode chips + calendar toggle */}
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-1 min-w-0">
                  {episodes.slice(0, 5).map((e) => (
                    <button
                      key={e.date}
                      onClick={() => selectEpisode(e.date)}
                      className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap transition ${
                        e.date === selected
                          ? "border-yai-orange bg-yai-orange/20 text-yai-amber font-semibold"
                          : "border-white/15 text-white/55 hover:text-white hover:border-white/40"
                      }`}
                    >
                      {niceDate(e.date, today)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCalOpen((v) => !v)}
                  aria-label="Browse episodes by date"
                  className={`shrink-0 text-[12px] px-1.5 py-0.5 rounded transition ${
                    calOpen ? "bg-yai-orange/20 text-yai-amber" : "text-white/55 hover:text-white"
                  }`}
                >
                  📅
                </button>
              </div>

              {/* Calendar look-up */}
              {calOpen && calMonth && (
                <EpisodeCalendar
                  month={calMonth}
                  setMonth={setCalMonth}
                  dates={dates}
                  selected={selected}
                  today={today}
                  onPick={(d) => { selectEpisode(d); setCalOpen(false); }}
                />
              )}
            </>
          )}

          {phase === "idle" && (
            <button
              onClick={generate}
              className="w-full text-[12px] py-2 rounded-full bg-yai-orange hover:bg-yai-orange/90 transition font-semibold"
            >
              ▶ Generate today&rsquo;s episode
            </button>
          )}

          {phase === "generating" && (
            <div>
              <p className="text-[11px] text-white/65">🎙️ Recording today&rsquo;s episode…</p>
              <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-yai-orange animate-pulse" />
              </div>
            </div>
          )}

          {phase === "failed" && (
            <button
              onClick={generate}
              className="w-full text-[12px] py-2 rounded-full border border-red-300/40 text-red-200 hover:bg-red-400/10 transition"
            >
              Generation failed — retry
            </button>
          )}
        </div>
      )}

      {selected && (
        <audio
          ref={audioRef}
          src={`/api/ai-feed/podcast/audio?date=${selected}`}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setElapsed(0); }}
          onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  );
}
