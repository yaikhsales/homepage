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

/* The public Yai channel — same handle the footer links to. A https://t.me
   link hands straight to the installed Telegram app on phone and desktop,
   and falls back to the web client when there is none. */
const TELEGRAM_URL = "https://t.me/yaikh1";

function TelegramGlyph() {
  return (
    <svg viewBox="0 0 496 512" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm114 169-41 193c-3 14-12 17-24 11l-62-46-30 29c-3 3-6 6-13 6l5-63 115-104c5-4-1-7-8-3l-142 90-61-20c-13-4-14-13 3-20l239-92c11-4 21 3 17 19z" />
    </svg>
  );
}

export default function ChatBubble() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  /* "nav" hangs the panel under the Chat with us link in the header;
     "float" keeps it above the round button bottom-right. */
  const [anchor, setAnchor] = useState<"float" | "nav">("float");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", message: "", website: "" });
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) firstFieldRef.current?.focus();
  }, [open]);

  /* The header and the mobile menu open this same panel. */
  useEffect(() => {
    const onOpen = (event: Event) => {
      const where = (event as CustomEvent<{ anchor?: "float" | "nav" }>).detail?.anchor;
      setAnchor(where === "nav" ? "nav" : "float");
      setState("idle");
      setOpen(true);
    };
    window.addEventListener("yai-chat:open", onOpen);
    return () => window.removeEventListener("yai-chat:open", onOpen);
  }, []);

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
      setForm({ name: "", message: "", website: "" });
    } catch (caught) {
      setState("error");
      setError(caught instanceof Error ? caught.message : t("chat.failed"));
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setAnchor("float"); setOpen((v) => !v); setState("idle"); }}
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
          className={`fixed z-[60] w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl ${anchor === "nav" ? "top-20 right-5" : "bottom-24 right-5"}`}
        >
          <div className="relative bg-yai-navy px-5 py-4 pr-12 text-white">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-serif text-lg font-semibold leading-tight">{t("chat.title")}</span>
              {/* Says up front where the message lands. */}
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2AABEE]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7fd3f7]">
                <TelegramGlyph /> {t("chat.integrated")}
              </span>
            </div>
            <p className="mt-1 text-[12px] leading-snug text-white/70">{t("chat.sub")}</p>
            {/* Its own close button. The round button bottom-right also closes
                the panel, but from the header that is too far away to find. */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("chat.close")}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              <X size={18} />
            </button>
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

              {/* Straight into the Telegram app for anyone who would rather
                  talk there than fill a form. */}
              <div className="mt-1 flex items-center gap-2" aria-hidden="true">
                <span className="h-px flex-1 bg-yai-border" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">{t("chat.or")}</span>
                <span className="h-px flex-1 bg-yai-border" />
              </div>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#2AABEE] px-5 py-2 text-sm font-bold text-[#2AABEE] transition hover:bg-[#2AABEE] hover:text-white"
              >
                <TelegramGlyph /> {t("chat.telegram")}
              </a>
            </form>
          )}
        </div>
      )}
    </>
  );
}
