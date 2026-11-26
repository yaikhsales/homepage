"use client";

/* Sign-up form on the public event page — what a scanned QR leads to.
 *
 *   Name           [            ]
 *   Confirm — we may contact you by   ☐ Email  ☐ Phone  ☐ Telegram
 *   (a box opens for each one ticked)
 *   [ Submit ]
 *
 * Only the details for ticked channels are sent: we do not keep a phone
 * number someone typed and then said we may not use.
 */

import { useState } from "react";
import { evT, type EvLang } from "./strings";

const FIELD =
  "w-full min-w-0 rounded-lg border border-white/30 bg-white px-3 py-2.5 text-[15px] text-yai-blue-deep " +
  "placeholder-yai-blue-deep/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent " +
  "disabled:opacity-60";
const CHANNELS = [
  { value: "email", type: "email", max: 200, ph: "emailPh" },
  { value: "phone", type: "tel", max: 40, ph: "phonePh" },
  { value: "telegram", type: "text", max: 80, ph: "telegramPh" },
] as const;
type Channel = (typeof CHANNELS)[number]["value"];

export function RegisterForm({ eventId, dates, lang = "en" }: { eventId: string; dates: string[]; lang?: EvLang }) {
  const t = (k: Parameters<typeof evT>[1]) => evT(lang, k);
  const [name, setName] = useState("");
  const [via, setVia] = useState<Channel[]>([]);
  const [detail, setDetail] = useState<Record<Channel, string>>({ email: "", phone: "", telegram: "" });
  const [chosenDate, setChosenDate] = useState(dates[0] || "");
  const [website, setWebsite] = useState(""); // honeypot
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const toggle = (c: Channel) =>
    setVia((v) => (v.includes(c) ? v.filter((x) => x !== c) : [...v, c]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (via.length === 0) {
      setError(t("tickOne"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: via.includes("email") ? detail.email : "",
          phone: via.includes("phone") ? detail.phone : "",
          telegram: via.includes("telegram") ? detail.telegram : "",
          contactVia: via,
          chosenDate,
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        // Server messages are English; in another language show our own wording.
        setError(lang === "en" && data?.error ? data.error : t("failed"));
        return;
      }
      setDone(true);
    } catch {
      setError(t("network"));
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-md">
        <p className="text-2xl font-bold text-white">{t("doneTitle")}</p>
        <p className="mt-2 text-white/75">{t("doneBody")}</p>
        <a href="/" className="mt-6 inline-block text-sm font-semibold text-white/80 underline hover:text-white">
          {t("home")}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-8">
      <h2 className="mb-4 text-lg font-bold text-white">{t("register")}</h2>

      {dates.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {dates.map((d) => (
            <button key={d} type="button" disabled={saving} onClick={() => setChosenDate(d)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                chosenDate === d ? "border-white bg-white text-yai-blue-deep" : "border-white/30 bg-white/5 text-white hover:bg-white/15"
              }`}>
              {d}
            </button>
          ))}
        </div>
      )}

      <div className="mb-4">
        <label className="sr-only" htmlFor="rg-name">{t("name")}</label>
        <input id="rg-name" required minLength={2} maxLength={120} value={name}
          disabled={saving} onChange={(e) => setName(e.target.value)}
          className={FIELD} placeholder={t("name")} />
      </div>

      <fieldset className="mb-4">
        <legend className="mb-2 text-sm font-semibold text-white">{t("consent")}</legend>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((c) => {
            const on = via.includes(c.value);
            return (
              <label key={c.value}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  on ? "border-white bg-white text-yai-blue-deep" : "border-white/30 bg-white/5 text-white hover:bg-white/15"
                }`}>
                <input type="checkbox" className="h-4 w-4 accent-yai-orange" checked={on}
                  disabled={saving} onChange={() => toggle(c.value)} />
                {t(c.value)}
              </label>
            );
          })}
        </div>
      </fieldset>

      {CHANNELS.filter((c) => via.includes(c.value)).map((c) => (
        <div key={c.value} className="mb-3">
          <label className="sr-only" htmlFor={`rg-${c.value}`}>{t(c.value)}</label>
          <input id={`rg-${c.value}`} type={c.type} required maxLength={c.max}
            value={detail[c.value]} disabled={saving} placeholder={t(c.ph)}
            onChange={(e) => setDetail((d) => ({ ...d, [c.value]: e.target.value }))}
            className={FIELD} />
        </div>
      ))}

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="rg-website">Website</label>
        <input id="rg-website" tabIndex={-1} autoComplete="off" value={website}
          onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {error && <p className="mb-4 mt-2 text-sm font-semibold text-rose-200">{error}</p>}

      <button type="submit" disabled={saving}
        className="mt-3 w-full rounded-lg bg-white py-3 font-bold text-yai-blue transition hover:bg-white/95 disabled:opacity-50">
        {saving ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
