"use client";

/* Handouts and slides for one of our events, in the Yai events panel.
 *
 * 3 slots of A4 handout (JPG/PNG) — public at all times, the advert.
 * 3 slots of slides (PDF) — public only from the first day of the event
 * until 7 days after its last day. */

import { useRef, useState } from "react";
import type { TaskEvent } from "./TaskCalendar";

type F = NonNullable<TaskEvent["files"]>[number];
const KINDS = [
  { kind: "handout" as const, title: "A4 handouts", hint: "JPG or PNG · public any time", accept: "image/jpeg,image/png" },
  { kind: "slides" as const, title: "Slides", hint: "PDF · open from the event day until 7 days after", accept: "application/pdf" },
];

function size(n: number) {
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
}

export function EventFiles({
  event,
  ready,
  onChange,
}: {
  event: TaskEvent;
  ready: boolean;
  onChange: (files: F[]) => void;
}) {
  const files = event.files || [];
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const upload = async (kind: "handout" | "slides", file: File) => {
    setBusy(kind); setError(null);
    try {
      const body = new FormData();
      body.append("kind", kind);
      body.append("file", file);
      const res = await fetch(`/api/events/${event.id}/files`, { method: "POST", body, credentials: "same-origin" });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.ok) { setError(d?.error || "Upload failed."); return; }
      onChange([...files, d.file]);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (f: F) => {
    if (!window.confirm(`Remove "${f.name}"?`)) return;
    setBusy(f.id); setError(null);
    try {
      const res = await fetch(`/api/events/${event.id}/files/${f.id}`, { method: "DELETE", credentials: "same-origin" });
      if (!res.ok) { setError("Could not remove it."); return; }
      onChange(files.filter((x) => x.id !== f.id));
    } catch {
      setError("Network error.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-200 pt-3">
      {!ready && (
        <p className="mb-2 rounded bg-amber-50 px-2 py-1 text-[11px] text-amber-800">
          File storage is not switched on yet — the R2 keys still need adding on Railway.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {KINDS.map(({ kind, title, hint, accept }) => {
          const list = files.filter((f) => f.kind === kind);
          return (
            <div key={kind}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {title} · {list.length}/3
              </p>
              <p className="mb-2 text-[10px] text-gray-400">{hint}</p>
              <ul className="space-y-1">
                {list.map((f) => (
                  <li key={f.id} className="flex items-center gap-2 text-[12px]">
                    <a href={`/api/events/${event.id}/files/${f.id}`} target="_blank" rel="noopener noreferrer"
                      className="min-w-0 flex-1 truncate font-semibold text-yai-blue underline">{f.name}</a>
                    <span className="shrink-0 text-gray-400">{size(f.size)}</span>
                    <button type="button" onClick={() => remove(f)} disabled={busy !== null}
                      className="shrink-0 px-1 text-gray-400 hover:text-rose-600" aria-label={`Remove ${f.name}`}>×</button>
                  </li>
                ))}
              </ul>
              {list.length < 3 && (
                <>
                  <input ref={(el) => { inputs.current[kind] = el; }} type="file" accept={accept} className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void upload(kind, f); }} />
                  <button type="button" disabled={!ready || busy !== null}
                    onClick={() => inputs.current[kind]?.click()}
                    className="mt-1 rounded border border-dashed border-gray-400 px-2.5 py-1 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                    {busy === kind ? "Uploading…" : "+ Attach"}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
      {error && <p className="mt-2 text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}
