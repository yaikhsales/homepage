"use client";

/**
 * "The Yai Ai Brief" — floating player, classic-Winamp styling.
 *
 * Layout (no EQ window, no clutter):
 *   ┌─ title bar ──────────────┐  drag handle + collapse
 *   │ LCD: ▶ 0:24  ▂▄▆ title   │  green-on-black display
 *   │ seek slider              │
 *   │ ⏮ ▶/⏸ ⏭          📅     │  transport
 *   ├─ PLAYLIST ───────────────┤
 *   │ 1. Yai Ai Brief — Today  │  green mono rows, current = highlighted
 *   └──────────────────────────┘
 *
 * Logic unchanged: fixed+draggable, position in localStorage, episode
 * calendar behind 📅, hides when the deployment lacks key/Mongo.
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
const WIDGET_W = 292;

// Winamp-ish chrome
const CHROME = "#23232e";
const BEVEL_LIGHT = "#4a4a5e";
const BEVEL_DARK = "#101018";
const LCD_GREEN = "#00e800";

function fmt(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function niceDate(iso: string, today: string): string {
  if (iso === today) return "Today";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: undefined });
}

const bevelOut: React.CSSProperties = {
  borderTop: `1px solid ${BEVEL_LIGHT}`,
  borderLeft: `1px solid ${BEVEL_LIGHT}`,
  borderBottom: `1px solid ${BEVEL_DARK}`,
  borderRight: `1px solid ${BEVEL_DARK}`,
  background: CHROME,
};

const bevelIn: React.CSSProperties = {
  borderTop: `1px solid ${BEVEL_DARK}`,
  borderLeft: `1px solid ${BEVEL_DARK}`,
  borderBottom: `1px solid ${BEVEL_LIGHT}`,
  borderRight: `1px solid ${BEVEL_LIGHT}`,
};

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
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const posRef = useRef<{ x: number; y: number } | null>(null);
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
    const h = boxRef.current?.offsetHeight ?? 160;
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

  const stepEpisode = (delta: number) => {
    if (!selected || episodes.length === 0) return;
    const i = episodes.findIndex((e) => e.date === selected);
    const next = episodes[i + delta];
    if (next) selectEpisode(next.date);
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

  const selectedMeta = episodes.find((e) => e.date === selected) ?? null;
  const selectedIdx = episodes.findIndex((e) => e.date === selected);
  const pct = duration ? (elapsed / duration) * 100 : 0;

  const style: React.CSSProperties = pos
    ? { position: "fixed", left: pos.x, top: pos.y, width: WIDGET_W, maxWidth: "calc(100vw - 8px)", zIndex: 300 }
    : { position: "fixed", right: 16, bottom: 16, width: WIDGET_W, maxWidth: "calc(100vw - 24px)", zIndex: 300 };

  return (
    <div ref={boxRef} style={{ ...style, ...bevelOut, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }} className="select-none rounded-[3px]">
      {/* ---- Title bar (drag handle) ---- */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="flex items-center gap-1.5 h-[18px] px-1.5 cursor-grab active:cursor-grabbing touch-none"
        style={{ background: "linear-gradient(#34344a, #23232e)" }}
      >
        <Ridges />
        <span className="text-[9px] font-bold tracking-[0.25em] text-[#c9c9d8] uppercase whitespace-nowrap">
          Yai Ai Brief
        </span>
        <Ridges />
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand" : "Collapse"}
          className="shrink-0 w-[13px] h-[13px] leading-none text-[8px] text-[#c9c9d8] flex items-center justify-center"
          style={bevelOut}
        >
          {collapsed ? "▴" : "▾"}
        </button>
      </div>

      {!collapsed && (
        <div className="p-1.5 space-y-1.5">
          {/* ---- LCD display ---- */}
          <div className="px-2 py-1.5 rounded-[2px] bg-black font-mono" style={bevelIn}>
            {phase === "ready" && selectedMeta ? (
              <>
                <div className="flex items-center gap-2">
                  <span style={{ color: LCD_GREEN }} className="text-[10px]">{playing ? "▶" : "❚❚"}</span>
                  <span style={{ color: LCD_GREEN, textShadow: `0 0 6px ${LCD_GREEN}66` }} className="text-xl tabular-nums leading-none">
                    {fmt(elapsed)}
                  </span>
                  {/* mini spectrum */}
                  <span className="flex items-end gap-[2px] h-4 ml-1" aria-hidden>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="w-[3px]"
                        style={{
                          background: LCD_GREEN,
                          height: playing ? undefined : "3px",
                          animation: playing ? `yai-eq-sm 0.8s ease-in-out ${i * 0.13}s infinite alternate` : "none",
                        }}
                      />
                    ))}
                  </span>
                  <span style={{ color: LCD_GREEN }} className="ml-auto text-[10px] tabular-nums">
                    {fmt(duration || selectedMeta.durationSec || 0)}
                  </span>
                </div>
                <div style={{ color: LCD_GREEN }} className="mt-1 text-[10px] truncate">
                  {selectedIdx + 1}. The Yai Ai Brief — {niceDate(selectedMeta.date, today)} ({fmt(selectedMeta.durationSec || 0)})
                </div>
              </>
            ) : phase === "generating" ? (
              <div style={{ color: LCD_GREEN }} className="text-[10px] py-1 animate-pulse">
                ● REC — recording today&rsquo;s episode…
              </div>
            ) : phase === "failed" ? (
              <div className="text-[10px] py-1 text-red-400">✕ generation failed — press ▶ to retry</div>
            ) : (
              <div style={{ color: LCD_GREEN }} className="text-[10px] py-1">
                no episode yet — press ▶ to record today&rsquo;s
              </div>
            )}
          </div>

          {/* ---- Seek ---- */}
          {phase === "ready" && (
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={pct}
              onChange={seek}
              aria-label="Seek"
              className="w-full h-[8px] cursor-pointer accent-[#d4a017]"
            />
          )}

          {/* ---- Transport ---- */}
          <div className="flex items-center gap-1">
            <TransportBtn label="Previous episode" onClick={() => stepEpisode(1)} disabled={phase !== "ready"}>⏮</TransportBtn>
            <TransportBtn
              label={playing ? "Pause" : "Play"}
              onClick={phase === "ready" ? toggle : generate}
              wide
            >
              {phase === "generating" ? "…" : playing ? "❚❚" : "▶"}
            </TransportBtn>
            <TransportBtn label="Next episode" onClick={() => stepEpisode(-1)} disabled={phase !== "ready"}>⏭</TransportBtn>
            <span className="flex-1" />
            <TransportBtn label="Browse episodes by date" onClick={() => setCalOpen((v) => !v)} active={calOpen}>📅</TransportBtn>
          </div>

          {/* ---- Playlist ---- */}
          {episodes.length > 0 && (
            <div className="rounded-[2px] bg-black font-mono" style={bevelIn}>
              <div className="px-2 pt-1 pb-0.5 text-[8px] tracking-[0.2em] uppercase" style={{ color: "#7a7a8e" }}>
                Playlist
              </div>
              <ul className="max-h-32 overflow-y-auto px-1 pb-1">
                {episodes.map((e, i) => {
                  const active = e.date === selected;
                  return (
                    <li key={e.date}>
                      <button
                        onClick={() => selectEpisode(e.date)}
                        className={`w-full flex items-baseline gap-1.5 px-1 py-[2px] text-left text-[11px] leading-tight ${
                          active ? "bg-[#16418c]" : "hover:bg-white/5"
                        }`}
                        style={{ color: active ? "#ffffff" : LCD_GREEN }}
                      >
                        <span className="tabular-nums">{i + 1}.</span>
                        <span className="truncate flex-1">
                          The Yai Ai Brief — {niceDate(e.date, today)}
                        </span>
                        <span className="tabular-nums text-[10px]">{fmt(e.durationSec || 0)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="px-2 pb-1 text-[8px]" style={{ color: "#7a7a8e" }}>
                {dates.length} episode{dates.length === 1 ? "" : "s"} in archive
              </div>
            </div>
          )}

          {/* ---- Calendar ---- */}
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

function Ridges() {
  return (
    <span className="flex-1 flex flex-col gap-[2px]" aria-hidden>
      <span className="h-[1px]" style={{ background: "#4a4a5e", boxShadow: "0 1px 0 #101018" }} />
      <span className="h-[1px]" style={{ background: "#4a4a5e", boxShadow: "0 1px 0 #101018" }} />
    </span>
  );
}

function TransportBtn({
  children,
  label,
  onClick,
  disabled,
  wide,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  wide?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`h-[22px] ${wide ? "w-10" : "w-7"} flex items-center justify-center text-[11px] leading-none transition ${
        disabled ? "opacity-40" : "hover:brightness-125 active:translate-y-[1px]"
      }`}
      style={{
        ...bevelOut,
        color: active ? "#ffd75e" : "#c9c9d8",
        borderRadius: 2,
      }}
    >
      {children}
    </button>
  );
}

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
    <div className="rounded-[2px] bg-black font-mono p-1.5" style={bevelIn}>
      <div className="flex items-center justify-between px-1 mb-1">
        <button onClick={() => shift(-1)} aria-label="Previous month" className="px-1.5 text-[#c9c9d8] hover:text-white">‹</button>
        <span className="text-[10px] font-semibold" style={{ color: LCD_GREEN }}>{monthLabel}</span>
        <button onClick={() => shift(1)} aria-label="Next month" className="px-1.5 text-[#c9c9d8] hover:text-white">›</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="text-[8px] py-0.5" style={{ color: "#7a7a8e" }}>{d}</span>
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
              className={`text-[10px] rounded-[2px] py-0.5 transition ${
                isSelected
                  ? "bg-[#16418c] text-white font-bold"
                  : available
                  ? "font-semibold hover:bg-white/10 cursor-pointer"
                  : "cursor-default"
              } ${isToday && !isSelected ? "ring-1 ring-[#ffd75e]/60" : ""}`}
              style={{ color: isSelected ? "#fff" : available ? LCD_GREEN : "#3a3a48" }}
            >
              {day}
            </button>
          );
        })}
      </div>
      <p className="mt-1 px-1 text-[8px]" style={{ color: "#7a7a8e" }}>
        green days have an episode · {dates.length} in archive
      </p>
    </div>
  );
}
