"use client";

/**
 * "The Yai Ai Brief" — full player card.
 *
 * - Custom play/stop button driving a hidden <audio> element
 * - Animated equalizer bars while playing (CSS keyframes in globals.css)
 * - Seek bar + elapsed/total time
 * - Episode picker: today + previous days (chips), dated audio URLs
 * - "Generate today's episode" when today's isn't cut yet; polls while
 *   the newsroom is recording
 * - Renders nothing on deployments without GEMINI_API_KEY / MONGO_URL
 */

import { useCallback, useEffect, useRef, useState } from "react";

type Meta = {
  date: string;
  status: "ready" | "generating" | "failed";
  durationSec?: number;
  stories?: string[];
};

type Phase = "checking" | "unavailable" | "idle" | "generating" | "ready" | "failed";

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
  const [selected, setSelected] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/ai-feed/podcast");
      if (res.status === 503) { setPhase("unavailable"); return; }
      const data = await res.json();
      if (!data.ok) { setPhase("unavailable"); return; }
      setToday(data.today);
      setEpisodes(data.episodes ?? []);
      setSelected((cur) => cur ?? data.episodes?.[0]?.date ?? null);

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

  // Poll while the newsroom records.
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

  const selectedMeta = episodes.find((e) => e.date === selected) ?? null;
  const todayReady = episodes.some((e) => e.date === today);
  const pct = duration ? (elapsed / duration) * 100 : 0;

  return (
    <div className="mb-10 rounded-2xl border border-yai-border bg-yai-navy text-white overflow-hidden">
      <div className="p-5 md:p-6">
        {/* Header row */}
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] font-bold">
          <span className="text-yai-amber">The Yai Ai Brief</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-white/60">Daily Ai news · 2 hosts · ~3 min</span>
        </div>

        {/* Player row */}
        {phase === "ready" && selected && (
          <div className="mt-4 flex items-center gap-4">
            {/* Play / stop */}
            <button
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="w-14 h-14 shrink-0 rounded-full bg-yai-orange hover:bg-yai-orange/90 transition flex items-center justify-center shadow-orange-glow"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-0.5" aria-hidden>
                  <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z" />
                </svg>
              )}
            </button>

            {/* Equalizer — animates while playing */}
            <div className="flex items-end gap-[3px] h-8 shrink-0" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-[4px] rounded-full bg-yai-amber"
                  style={{
                    height: playing ? undefined : "6px",
                    animation: playing
                      ? `yai-eq 0.9s ease-in-out ${i * 0.15}s infinite alternate`
                      : "none",
                  }}
                />
              ))}
            </div>

            {/* Seek + time */}
            <div className="flex-1 min-w-0">
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={pct}
                onChange={seek}
                aria-label="Seek"
                className="w-full accent-yai-orange h-1.5 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[11px] text-white/55 tabular-nums">
                <span>{fmt(elapsed)}</span>
                <span>{fmt(duration || selectedMeta?.durationSec || 0)}</span>
              </div>
            </div>
          </div>
        )}

        {phase === "idle" && (
          <p className="mt-3 text-sm text-white/70">
            No episode yet — two Yai hosts discussing today&rsquo;s top Ai stories, about 3 minutes.
          </p>
        )}

        {phase === "generating" && (
          <div className="mt-3">
            <p className="text-sm text-white/70">
              🎙️ The newsroom is recording — writing the script and voicing both hosts. Usually under 2 minutes…
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-1/3 rounded-full bg-yai-orange animate-pulse" />
            </div>
          </div>
        )}

        {phase === "failed" && (
          <p className="mt-3 text-sm text-red-300">Episode generation failed. Try again in a moment.</p>
        )}

        {/* Footer: episode picker + generate */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {episodes.map((e) => (
            <button
              key={e.date}
              onClick={() => selectEpisode(e.date)}
              className={`text-[12px] px-3 py-1.5 rounded-full border transition ${
                e.date === selected
                  ? "border-yai-orange bg-yai-orange/20 text-yai-amber font-semibold"
                  : "border-white/15 text-white/60 hover:text-white hover:border-white/40"
              }`}
            >
              {niceDate(e.date, today)}
              {e.durationSec ? ` · ${fmt(e.durationSec)}` : ""}
            </button>
          ))}

          {!todayReady && phase !== "generating" && (
            <button
              onClick={generate}
              className="text-[12px] px-3 py-1.5 rounded-full bg-yai-orange hover:bg-yai-orange/90 transition font-semibold"
            >
              ▶ Generate today&rsquo;s episode
            </button>
          )}
        </div>
      </div>

      {/* Hidden audio element drives everything above */}
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
