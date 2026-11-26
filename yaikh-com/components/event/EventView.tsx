"use client";

/* The public event page body: logo + title, the three language flags,
 * the one-line details, and the sign-up form — all in the language the
 * visitor picks. The event's own title stays as it was entered. */

import { useEffect, useState } from "react";
import { RegisterForm } from "./RegisterForm";
import { FlagKH, FlagGB, FlagCN } from "./flags";
import { evT, evDateRange, eventDays, EV_LANGS, type EvLang } from "./strings";

export type EventViewData = {
  id: string;
  title: string;
  titleKm: string;
  titleZh?: string;
  date: string;
  endDate?: string;
  time: string;          // already formatted "09:00 – 12:00"
  venue: string;
  mapUrl: string;
  catering: string[];    // "morning" | "lunch" | "afternoon"
  dates: string[];
  files: { id: string; kind: "handout" | "slides"; name: string; size: number; type: string }[];
  slides: { open: boolean; opensOn: string; closesAfter: string };
};

const FLAGS: Record<EvLang, { label: string; Flag: () => JSX.Element }> = {
  km: { label: "ខ្មែរ", Flag: FlagKH },
  en: { label: "English", Flag: FlagGB },
  zh: { label: "中文", Flag: FlagCN },
};

const ICON: Record<string, string> = { morning: "☕🍰", lunch: "🍽️", afternoon: "🫖" };
const STORE_KEY = "yai-event-lang";

export function EventView({ ev }: { ev: EventViewData }) {
  const [lang, setLang] = useState<EvLang>("en");
  const handouts = ev.files.filter((f) => f.kind === "handout");
  const slideFiles = ev.files.filter((f) => f.kind === "slides");
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Phnom_Penh" }).format(new Date());

  // Remember the choice on this device; private windows may refuse storage.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY) as EvLang | null;
      if (saved && EV_LANGS.includes(saved)) setLang(saved);
    } catch { /* storage unavailable — stay on English */ }
  }, []);
  const choose = (l: EvLang) => {
    setLang(l);
    try { localStorage.setItem(STORE_KEY, l); } catch { /* ignore */ }
  };

  return (
    <>
      <div>
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/yai-logo.jpg" alt="Yai"
            className="mt-0.5 h-8 w-8 shrink-0 rounded-md object-cover shadow-lg sm:h-9 sm:w-9" />
          <div className="min-w-0 flex-1">
            {ev.titleKm && (
              <p lang="km" className="mb-1 text-lg font-bold leading-snug text-white sm:text-2xl">
                {ev.titleKm}
              </p>
            )}
            <h1 className={`font-extrabold leading-tight text-white ${
              ev.titleKm ? "text-base text-white/85 sm:text-xl" : "text-xl sm:text-3xl"
            }`}>
              {lang === "zh" && ev.titleZh ? ev.titleZh : ev.title}
            </h1>
          </div>
          <div className="flex shrink-0 gap-1.5">
            {EV_LANGS.map((l) => {
              const { label, Flag } = FLAGS[l];
              return (
                <button key={l} type="button" onClick={() => choose(l)}
                  title={label} aria-label={label} aria-pressed={lang === l}
                  className={`relative h-7 w-7 overflow-hidden rounded-full shadow-md transition hover:scale-110 ${
                    lang === l ? "ring-2 ring-yai-amber" : "ring-1 ring-white/50 opacity-80"
                  }`}>
                  <span className="absolute inset-0 block overflow-hidden rounded-full"><Flag /></span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-white/85">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span aria-hidden="true">📅</span>{evDateRange(lang, ev.date, ev.endDate)}
          </span>
          {ev.time && (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden="true">🕘</span>{ev.time}
            </span>
          )}
          {ev.venue && (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden="true">📍</span>{ev.venue}
              {ev.mapUrl && (
                <a href={ev.mapUrl} target="_blank" rel="noopener noreferrer"
                  className="ml-1 font-semibold text-white underline hover:text-yai-orange">
                  {evT(lang, "map")}
                </a>
              )}
            </span>
          )}
          {ev.catering.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden="true">{ICON[c]}</span>
              {evT(lang, c as "morning" | "lunch" | "afternoon")}
            </span>
          ))}
        </p>

      </div>

      <RegisterForm ev={ev} days={eventDays(ev.date, ev.endDate)} lang={lang} />

      {/* Handouts and slides come after the sign-up, so the form is the first thing to act on. */}
      {(handouts.length > 0 || slideFiles.length > 0) && (
        <div className="lg:col-span-2">
        {handouts.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {handouts.map((f) => (
              <a key={f.id} href={`/api/events/${ev.id}/files/${f.id}`} target="_blank" rel="noopener noreferrer"
                className="block shrink-0" title={f.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/events/${ev.id}/files/${f.id}`} alt={evT(lang, "handouts")}
                  className="h-40 w-auto rounded-md border border-white/20 bg-white shadow-lg sm:h-52" />
              </a>
            ))}
          </div>
        )}

        {slideFiles.length > 0 && (
          <div className="mt-3 text-[14px] text-white/85">
            {ev.slides.open ? (
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {slideFiles.map((f) => (
                  <a key={f.id} href={`/api/events/${ev.id}/files/${f.id}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-white underline hover:text-yai-orange">
                    <span aria-hidden="true">📄</span>{f.name}
                  </a>
                ))}
              </div>
            ) : (
              <p className="inline-flex items-center gap-1.5 text-white/60">
                <span aria-hidden="true">🔒</span>
                {ev.slides.opensOn > today
                  ? `${evT(lang, "slidesSoon")} ${evDateRange(lang, ev.slides.opensOn)}`
                  : evT(lang, "slidesClosed")}
              </p>
            )}
          </div>
        )}
        </div>
      )}
    </>
  );
}
