/* /api/contact-chat
 *
 *   POST { name, message, website?, contact? }
 *
 * The form asks for a name and a message only. Anyone who wants us to have
 * their number taps through to Telegram instead, which carries it; `contact`
 * stays accepted for a page a visitor already had open.
 *        → stores the message and pushes it to the Texlink Telegram chat.
 *
 * Telegram needs two server-side variables on Railway. Neither belongs in the
 * repo, and the route never echoes them back:
 *
 *   TEXLINK_TG_BOT_TOKEN   from @BotFather, looks like 1234567890:AA...
 *   TEXLINK_TG_CHAT_ID     the numeric id of the group the bot was added to
 *
 * If they are missing the message is still stored and the visitor still gets a
 * thank-you — it just is not relayed. `delivered` in the reply says which
 * happened, so a missing variable shows up as a fact rather than as silence.
 */
import { NextResponse } from "next/server";
import type { Collection } from "mongodb";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TELEGRAM_API = "https://api.telegram.org";

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";

/* Telegram parse_mode HTML understands only these three. */
const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function relayToTelegram(text: string) {
  const token = process.env.TEXLINK_TG_BOT_TOKEN;
  const chatId = process.env.TEXLINK_TG_CHAT_ID;
  if (!token || !chatId) return { delivered: false, reason: "not configured" };

  try {
    const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok || !body?.ok) {
      // Telegram puts the real reason in `description` — keep it in the server
      // log, never in the reply to the browser.
      console.error("[contact-chat] telegram refused:", body?.description || response.status);
      return { delivered: false, reason: "telegram error" };
    }
    return { delivered: true, messageId: body.result?.message_id as number | undefined };
  } catch (error) {
    console.error("[contact-chat] telegram unreachable:", error);
    return { delivered: false, reason: "telegram unreachable" };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    /* Honeypot: real people never fill a field they cannot see. */
    if (clean(body?.website, 80)) return NextResponse.json({ ok: true, delivered: true });

    const name = clean(body?.name, 80);
    const contact = clean(body?.contact, 120);
    const message = clean(body?.message, 2000);
    const page = clean(body?.page, 200);

    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "Tell us your name." }, { status: 400 });
    }
    if (message.length < 2) {
      return NextResponse.json({ ok: false, error: "Write your message." }, { status: 400 });
    }

    /* The store is for our own record; the relay is what the visitor is
       actually asking for. So a Mongo outage must not swallow a message —
       dedupe and storage are both best-effort around the relay. */
    let collection: Collection | null = null;
    try {
      collection = (await getDb()).collection("website_chats");
      const duplicate = await collection.findOne({
        name,
        message,
        createdAt: { $gte: new Date(Date.now() - 2 * 60 * 1000) },
      });
      /* Double-tap on the send button, or a reload, should not post twice. */
      if (duplicate) return NextResponse.json({ ok: true, delivered: true });
    } catch (error) {
      console.error("[contact-chat] store unavailable, relaying anyway:", error);
    }

    /* The team must be able to tell this apart from a Telegram message: the
       sender has no Telegram identity here, so nobody can just hit reply. */
    const text = [
      "<b>yaikh.com · chat</b>",
      "<i>From the website form — not a Telegram user. Ask for an email or phone to reply on.</i>",
      `<b>From:</b> ${escapeHtml(name)}`,
      contact ? `<b>Reach:</b> ${escapeHtml(contact)}` : "",
      page ? `<b>Page:</b> ${escapeHtml(page)}` : "",
      "",
      escapeHtml(message),
    ]
      .filter(Boolean)
      .join("\n");

    const relay = await relayToTelegram(text);

    let stored = false;
    if (collection) {
      try {
        await collection.insertOne({
          name,
          contact: contact || null,
          message,
          page: page || null,
          delivered: relay.delivered,
          telegramMessageId: relay.delivered ? relay.messageId ?? null : null,
          deliveryNote: relay.delivered ? null : relay.reason,
          createdAt: new Date(),
        });
        stored = true;
      } catch (error) {
        console.error("[contact-chat] could not store:", error);
      }
    }

    /* Nothing kept it and nothing sent it — that is a real failure, say so. */
    if (!relay.delivered && !stored) {
      return NextResponse.json({ ok: false, error: "Could not send just now. Please try again." }, { status: 503 });
    }

    return NextResponse.json({ ok: true, delivered: relay.delivered });
  } catch (error) {
    console.error("[contact-chat] failed:", error);
    return NextResponse.json({ ok: false, error: "Could not send just now. Please try again." }, { status: 500 });
  }
}
