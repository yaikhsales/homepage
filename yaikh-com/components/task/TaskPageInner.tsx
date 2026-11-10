"use client";

/* Client wrapper for /task.
 *
 * Owns:
 *   - logout button (POSTs /api/auth/logout → router.refresh → back to gate)
 *   - 1-min inactivity auto-logout (mouse / key / scroll / touch resets the
 *     timer); countdown shown next to the Log out button
 *
 * Takes the server-resolved viewer + events so the server component stays
 * a thin shell.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TaskCalendar, type TaskEvent } from "./TaskCalendar";
import { TeamTaskList } from "./TeamTaskList";
import { TaskFilterBar, keyOf, type MonthKey } from "./TaskFilterBar";

const IDLE_MS = 60_000; // 1 minute

export function TaskPageInner({ viewer, events: initialEvents, teamOptions }: {
  viewer: string;
  events: TaskEvent[];
  teamOptions: string[];
}) {
  const router = useRouter();
  const [events, setEvents] = useState<TaskEvent[]>(initialEvents);
  const [feedState, setFeedState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [secondsLeft, setSecondsLeft] = useState(IDLE_MS / 1000);
  const loggingOut = useRef(false);

  // Filter / cursor state. cursorMonth is the middle of the 3-month strip.
  // selectedMonth + selectedSource scope what the list below shows.
  const today = useMemo(() => new Date(), []);
  const [cursorMonth, setCursorMonth] = useState<MonthKey>(
    () => keyOf(today.getFullYear(), today.getMonth())
  );
  const [selectedMonth, setSelectedMonth] = useState<MonthKey | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const shiftCursor = useCallback((delta: number) => {
    setCursorMonth((mk) => {
      const [y, m] = mk.split("-").map(Number);
      const total = y * 12 + (m - 1) + delta;
      const ny = Math.floor(total / 12);
      const nm = ((total % 12) + 12) % 12;
      return `${ny}-${String(nm + 1).padStart(2, "0")}`;
    });
    // When the strip shifts, drop any month selection that leaves the view.
    setSelectedMonth(null);
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (selectedMonth && e.date.slice(0, 7) !== selectedMonth) return false;
      if (selectedSource && e.sourceSlug !== selectedSource) return false;
      return true;
    });
  }, [events, selectedMonth, selectedSource]);

  // Pull live events from /api/events once on mount; keeps initialEvents
  // as a safe fallback if the API is down.
  useEffect(() => {
    let cancelled = false;
    setFeedState("loading");
    fetch("/api/events", { credentials: "same-origin" })
      .then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((d) => {
        if (cancelled) return;
        if (d?.ok && Array.isArray(d.events)) {
          setEvents(d.events);
          setFeedState("ok");
        } else {
          setFeedState("err");
        }
      })
      .catch(() => { if (!cancelled) setFeedState("err"); });
    return () => { cancelled = true; };
  }, []);

  const logout = useCallback(async () => {
    if (loggingOut.current) return;
    loggingOut.current = true;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.refresh();
    }
  }, [router]);

  useEffect(() => {
    let expireAt = Date.now() + IDLE_MS;
    const kick = () => { expireAt = Date.now() + IDLE_MS; };

    const activityEvents = ["mousemove", "keydown", "mousedown", "scroll", "touchstart"];
    for (const e of activityEvents) {
      window.addEventListener(e, kick, { passive: true });
    }

    const tick = window.setInterval(() => {
      const remainMs = expireAt - Date.now();
      const remainSec = Math.max(0, Math.ceil(remainMs / 1000));
      setSecondsLeft(remainSec);
      if (remainMs <= 0) {
        window.clearInterval(tick);
        logout();
      }
    }, 500);

    return () => {
      window.clearInterval(tick);
      for (const e of activityEvents) {
        window.removeEventListener(e, kick);
      }
    };
  }, [logout]);

  return (
    <main className="min-h-screen bg-[#f3f0e8] px-4 py-8 sm:px-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-yai-orange">
              Yai · Task
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-yai-navy">
              Events Calendar
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Pulled from the GOV · STARTUP folder (21 channels) + TAFTAC
              MEMBERS topics. Pick what we go to, skip, or defer.
            </p>
            <div className="mt-1 text-[11px] text-gray-500">
              Signed in as <strong>{viewer}</strong>
              {feedState === "loading" && <span> · loading events…</span>}
              {feedState === "ok" && <span> · {events.length} events loaded</span>}
              {feedState === "err" && (
                <span className="text-rose-600"> · events feed unavailable</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <button
              type="button"
              onClick={logout}
              className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-gray-400 bg-white hover:bg-gray-100 text-gray-700"
            >
              Log out
            </button>
            <div
              className={`text-[10px] ${secondsLeft <= 15 ? "text-rose-600 font-semibold" : "text-gray-500"}`}
              title="You will be signed out after 1 minute of inactivity"
            >
              auto-logout in {secondsLeft}s
            </div>
          </div>
        </header>

        <TaskFilterBar
          cursorMonth={cursorMonth}
          onShift={shiftCursor}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          selectedSource={selectedSource}
          onSelectSource={setSelectedSource}
          events={events}
        />

        <TaskCalendar events={filteredEvents} cursorMonth={cursorMonth} />
        <TeamTaskList events={filteredEvents} teamOptions={teamOptions} />
      </div>
    </main>
  );
}
