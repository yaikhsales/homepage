"use client";

/* Sign-up form on the public event page — what a scanned QR leads to.
 *
 * Deliberately plain: name, email, phone, telegram, and the date choice
 * only when the event offers more than one. No account, no access code —
 * the people filling this in scanned a handout.
 */

import { useState } from "react";

const FIELD =
  "w-full min-w-0 rounded-lg border border-white/30 bg-white px-3 py-2.5 text-[15px] text-yai-blue-deep " +
  "placeholder-yai-blue-deep/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent " +
  "disabled:opacity-60";
const LABEL = "block text-white text-sm font-semibold mb-1.5";
// Name [ field ] on one line — the label sits to the left of its box.
const INLINE_LABEL = "w-20 shrink-0 text-white text-sm font-semibold sm:w-24";

export function RegisterForm({ eventId, dates }: { eventId: string; dates: string[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [chosenDate, setChosenDate] = useState(dates[0] || "");
  // Which channels the person agrees to be contacted on. Asked explicitly
  // rather than inferred: leaving a phone number is not the same as saying
  // "you may call me".
  const [contactVia, setContactVia] = useState<string[]>([]);
  const [website, setWebsite] = useState(""); // honeypot
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, telegram, chosenDate, contactVia, website }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Could not register just now. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-md">
        <p className="text-2xl font-bold text-white">You are registered.</p>
        <p className="mt-2 text-white/75">We will be in touch.</p>
        <a href="/" className="mt-6 inline-block text-sm font-semibold text-white/80 underline hover:text-white">
          Back to home
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit}
      className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-8">
      <h2 className="mb-5 text-lg font-bold text-white">Register</h2>

      {dates.length > 1 && (
        <div className="mb-4">
          <span className={LABEL}>Which date suits you?</span>
          <div className="flex flex-wrap gap-2">
            {dates.map((d) => (
              <button key={d} type="button" disabled={saving} onClick={() => setChosenDate(d)}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  chosenDate === d
                    ? "border-white bg-white text-yai-blue-deep"
                    : "border-white/30 bg-white/5 text-white hover:bg-white/15"
                }`}>
                {new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", {
                  weekday: "short", day: "numeric", month: "short",
                })}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-3 flex items-center gap-3">
        <label className={INLINE_LABEL} htmlFor="rg-name">Name</label>
        <input id="rg-name" required minLength={2} maxLength={120} value={name}
          disabled={saving} onChange={(e) => setName(e.target.value)}
          className={FIELD} placeholder="Full name" />
      </div>

      <div className="mb-3 flex items-center gap-3">
        <label className={INLINE_LABEL} htmlFor="rg-email">Email</label>
        <input id="rg-email" type="email" maxLength={200} value={email}
          disabled={saving} onChange={(e) => setEmail(e.target.value)}
          className={FIELD} placeholder="you@company.com" />
      </div>

      <div className="mb-3 flex items-center gap-3">
        <label className={INLINE_LABEL} htmlFor="rg-phone">Phone</label>
        <input id="rg-phone" type="tel" maxLength={40} value={phone}
          disabled={saving} onChange={(e) => setPhone(e.target.value)}
          className={FIELD} placeholder="+855 ..." />
      </div>

      <div className="mb-3 flex items-center gap-3">
        <label className={INLINE_LABEL} htmlFor="rg-tg">Telegram</label>
        <input id="rg-tg" maxLength={80} value={telegram}
          disabled={saving} onChange={(e) => setTelegram(e.target.value)}
          className={FIELD} placeholder="@username" />
      </div>

      <fieldset className="mb-5">
        <legend className={LABEL}>You may contact me by</legend>
        <div className="flex flex-wrap gap-2">
          {([
            ["email", "Email"],
            ["telegram", "Telegram"],
            ["phone", "Phone"],
          ] as const).map(([value, label]) => {
            const on = contactVia.includes(value);
            return (
              <label key={value}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  on ? "border-white bg-white text-yai-blue-deep" : "border-white/30 bg-white/5 text-white hover:bg-white/15"
                }`}>
                <input type="checkbox" className="h-4 w-4 accent-yai-orange" checked={on} disabled={saving}
                  onChange={() => setContactVia((c) => (on ? c.filter((v) => v !== value) : [...c, value]))} />
                {label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="rg-website">Website</label>
        <input id="rg-website" tabIndex={-1} autoComplete="off" value={website}
          onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {error && <p className="mb-4 text-sm font-semibold text-rose-200">{error}</p>}

      <button type="submit" disabled={saving}
        className="w-full rounded-lg bg-white py-3 font-bold text-yai-blue transition hover:bg-white/95 disabled:opacity-50">
        {saving ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
