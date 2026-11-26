"use client";

/* Sign-up form on the public event page — what a scanned QR leads to.
 *
 * Name, how to be contacted (and the matching detail), which of the
 * offered dates, and an optional note. No account, no access code: the
 * people filling this in are guests who just scanned a handout.
 */

import { useState } from "react";

const METHODS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "phone", label: "Phone call" },
  { value: "telegram", label: "Telegram" },
] as const;

const FIELD =
  "w-full rounded-lg border border-white/30 bg-white px-3 py-2.5 text-[15px] text-yai-blue-deep " +
  "placeholder-yai-blue-deep/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent " +
  "disabled:opacity-60";
const LABEL = "block text-white/85 text-sm font-medium mb-1.5";

export function RegisterForm({ eventId, dates }: { eventId: string; dates: string[] }) {
  const [name, setName] = useState("");
  const [method, setMethod] = useState<string>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [chosenDate, setChosenDate] = useState(dates[0] || "");
  const [note, setNote] = useState("");
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
        body: JSON.stringify({
          name, contactMethod: method, email, phone, telegram, chosenDate, note, website,
        }),
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
        <p className="mt-2 text-white/75">
          We will be in touch by {METHODS.find((m) => m.value === method)?.label.toLowerCase()}.
        </p>
        <a href="/" className="mt-6 inline-block text-sm font-semibold text-white/80 underline hover:text-white">
          Back to home
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-8"
    >
      <h2 className="mb-5 text-lg font-bold text-white">Register</h2>

      <div className="mb-4">
        <label className={LABEL} htmlFor="rg-name">Your name</label>
        <input id="rg-name" required minLength={2} maxLength={120} value={name}
          disabled={saving} onChange={(e) => setName(e.target.value)}
          className={FIELD} placeholder="Full name" />
      </div>

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
                  weekday: "short", day: "numeric", month: "short", year: "numeric",
                })}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <span className={LABEL}>How should we contact you?</span>
        <div className="flex flex-wrap gap-2">
          {METHODS.map((m) => (
            <button key={m.value} type="button" disabled={saving} onClick={() => setMethod(m.value)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                method === m.value
                  ? "border-white bg-white text-yai-blue-deep"
                  : "border-white/30 bg-white/5 text-white hover:bg-white/15"
              }`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {method === "email" && (
        <div className="mb-4">
          <label className={LABEL} htmlFor="rg-email">Email</label>
          <input id="rg-email" type="email" required maxLength={200} value={email}
            disabled={saving} onChange={(e) => setEmail(e.target.value)}
            className={FIELD} placeholder="you@company.com" />
        </div>
      )}

      {(method === "sms" || method === "phone") && (
        <div className="mb-4">
          <label className={LABEL} htmlFor="rg-phone">Phone number</label>
          <input id="rg-phone" type="tel" required maxLength={40} value={phone}
            disabled={saving} onChange={(e) => setPhone(e.target.value)}
            className={FIELD} placeholder="+855 ..." />
        </div>
      )}

      {method === "telegram" && (
        <div className="mb-4">
          <label className={LABEL} htmlFor="rg-tg">Telegram username</label>
          <input id="rg-tg" required maxLength={80} value={telegram}
            disabled={saving} onChange={(e) => setTelegram(e.target.value)}
            className={FIELD} placeholder="@username" />
        </div>
      )}

      <div className="mb-5">
        <label className={LABEL} htmlFor="rg-note">
          Anything else? <span className="font-normal text-white/50">(optional)</span>
        </label>
        <textarea id="rg-note" maxLength={500} rows={2} value={note}
          disabled={saving} onChange={(e) => setNote(e.target.value)}
          className={FIELD} placeholder="Company, role, questions…" />
      </div>

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
