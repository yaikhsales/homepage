"use client";

/* Floating chat bubble — bottom right of the marketing site.
 *
 * It is not a live chat: it collects a name, a way to reach the person and a
 * message, and posts them to /api/contact-chat, which relays them to the
 * Texlink Telegram group. Saying so on the panel is deliberate — a widget that
 * looks like live chat and answers tomorrow is worse than one that says it
 * sends a message.
 */

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useLang } from "@/app/i18n";

type State = "idle" | "sending" | "sent" | "error";

export default function ChatBubble() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", contact: "", message: "", website: "" });
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) firstFieldRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/contact-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, page: typeof window === "undefined" ? "" : window.location.pathname }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) throw new Error(body?.error || t("chat.failed"));
      setState("sent");
      setForm({ name: "", contact: "", message: "", website: "" });
    } catch (caught) {
      setState("error");
      setError(caught instanceof Error ? caught.message : t("chat.failed"));
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); setState("idle"); }}
        aria-expanded={open}
        aria-controls="yai-chat-panel"
        aria-label={t("chat.open")}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-yai-orange text-white shadow-2xl transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yai-orange"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div
          id="yai-chat-panel"
          ref={panelRef}
          role="dialog"
          aria-label={t("chat.title")}
          className="fixed bottom-24 right-5 z-50 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
        >
          <div className="bg-yai-navy px-5 py-4 text-white">
            <div className="font-serif text-lg font-semibold leading-tight">{t("chat.title")}</div>
            <p className="mt-1 text-[12px] leading-snug text-white/70">{t("chat.sub")}</p>
          </div>

          {state === "sent" ? (
            <div className="px-5 py-8 text-center">
              <p className="font-semibold text-yai-navy">{t("chat.sentTitle")}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{t("chat.sentBody")}</p>
              <button
                type="button"
                onClick={() => setState("idle")}
                className="mt-4 rounded-full border border-yai-border px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-yai-navy"
              >
                {t("chat.again")}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-2.5 px-5 py-4">
              <input
                ref={firstFieldRef}
                value={form.name}
                onChange={set("name")}
                placeholder={t("chat.name")}
                maxLength={80}
                required
                className="rounded-lg border border-yai-border px-3 py-2 text-sm outline-none focus:border-yai-blue"
              />
              <input
                value={form.contact}
                onChange={set("contact")}
                placeholder={t("chat.reach")}
                maxLength={120}
                required
                className="rounded-lg border border-yai-border px-3 py-2 text-sm outline-none focus:border-yai-blue"
              />
              <textarea
                value={form.message}
                onChange={set("message")}
                placeholder={t("chat.message")}
                maxLength={2000}
                rows={4}
                required
                className="resize-none rounded-lg border border-yai-border px-3 py-2 text-sm outline-none focus:border-yai-blue"
              />
              {/* Honeypot — off-screen, never shown to a person. */}
              <input
                value={form.website}
                onChange={set("website")}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />
              {state === "error" && <p className="text-[12px] font-semibold text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={state === "sending"}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-yai-orange px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-yai-orange/90 disabled:opacity-60"
              >
                {state === "sending" ? t("chat.sending") : <>{t("chat.send")} <Send size={15} /></>}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
