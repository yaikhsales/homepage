"use client";

/**
 * "The Yai Ai Brief" player card.
 *
 * States:
 *   checking     → silent (no layout shift worth showing)
 *   unavailable  → renders nothing (deployment without key/Mongo)
 *   idle         → "Generate today's episode" button
 *   generating   → progress shimmer; polls GET every 5 s
 *   ready        → <audio> player + episode info
 */

import { useCallback, useEffect, useRef, useState } from "react";

type Meta = {
  date: string;
  status: "ready" | "generating" | "failed";
  durationSec?: number;
  stories?: string[];
};

type Phase = "checking" | "unavailable" | "idle" | "generating" | "ready" | "failed";

export default function PodcastPlayer() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [meta, setMeta] = useState<Meta | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applyMeta = useCallback((exists: boolean, ep: Meta | null) => {
    setMeta(ep);
    if (!exists || !ep) setPhase("idle");
    else if (ep.status === "ready") setPhase("ready");
    else if (ep.status === "generating") setPhase("generating");
    else setPhase("failed");
  }, []);

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/ai-feed/podcast");
      if (res.status === 503) { setPhase("unavailable"); return; }
      const data = await res.json();
      if (!data.ok) { setPhase("unavailable"); return; }
      applyMeta(data.exists, data.episode);
    } catch {
      setPhase("unavailable");
    }
  }, [applyMeta]);

  useEffect(() => { check(); }, [check]);

  // Poll while generating.
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
      applyMeta(true, data.episode ?? null);
    } catch {
      setPhase("failed");
    }
  };

  if (phase === "checking" || phase === "unavailable") return null;

  return (
    <div className="mb-10 rounded-2xl border border-yai-border bg-yai-navy text-white overflow-hidden">
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
        {/* Mic mark */}
        <div className="w-12 h-12 shrink-0 rounded-full bg-yai-orange/90 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6" aria-hidden>
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] font-bold">
            <span className="text-yai-amber">The Yai Ai Brief</span>
            {meta?.date && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="text-white/60">{meta.date}</span>
              </>
            )}
            {meta?.durationSec ? (
              <>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="text-white/60">
                  {Math.floor(meta.durationSec / 60)}:{String(meta.durationSec % 60).padStart(2, "0")}
                </span>
              </>
            ) : null}
          </div>

          {phase === "ready" && (
            <audio controls preload="none" src="/api/ai-feed/podcast/audio" className="mt-3 w-full">
              Your browser does not support audio playback.
            </audio>
          )}

          {phase === "idle" && (
            <p className="mt-2 text-sm text-white/70">
              Today&rsquo;s episode hasn&rsquo;t been generated yet — two Yai hosts discussing
              today&rsquo;s top Ai stories, about 3 minutes.
            </p>
          )}

          {phase === "generating" && (
            <div className="mt-3">
              <p className="text-sm text-white/70">
                Recording today&rsquo;s episode — writing the script and voicing both hosts.
                Usually under 2 minutes…
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-yai-orange animate-pulse" />
              </div>
            </div>
          )}

          {phase === "failed" && (
            <p className="mt-2 text-sm text-red-300">
              Episode generation failed. Try again in a moment.
            </p>
          )}
        </div>

        {(phase === "idle" || phase === "failed") && (
          <button
            onClick={generate}
            className="shrink-0 rounded-full bg-yai-orange hover:bg-yai-orange/90 transition px-5 py-2.5 text-sm font-semibold"
          >
            ▶ Generate today&rsquo;s episode
          </button>
        )}
      </div>
    </div>
  );
}
