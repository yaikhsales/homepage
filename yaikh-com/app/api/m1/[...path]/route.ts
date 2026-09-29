/* /api/m1/<path> — same-origin proxy to the M1 guard (llm.ggmt.sg).
 *
 * Why this exists: the /experience bundle used to call the guard directly,
 * which meant REACT_APP_M1_LLM_TOKEN was compiled into public JavaScript —
 * anyone reading the bundle could call the M1. The browser now calls this
 * route instead; the bearer token stays on the server.
 *
 * Env (server-only):
 *   M1_LLM_URL    e.g. https://llm.ggmt.sg
 *   M1_LLM_TOKEN  bearer token for the guard
 *
 * Only the guard routes the app actually uses are forwarded; anything else
 * gets a 404 so this cannot be used as an open relay.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const M1_URL = (process.env.M1_LLM_URL || "").replace(/\/$/, "");
const M1_TOKEN = process.env.M1_LLM_TOKEN || "";
const TIMEOUT_MS = Number(process.env.M1_LLM_TIMEOUT_MS || 20000);

const ALLOWED = new Set([
  "pa/query",
  "boss/query",
  "v1/chat/claude",
  "v1/chat/completions",
]);

export async function POST(req: Request, { params }: { params: { path: string[] } }) {
  const path = (params.path || []).join("/");

  if (!ALLOWED.has(path)) {
    return NextResponse.json({ ok: false, error: "Unknown route." }, { status: 404 });
  }
  if (!M1_URL || !M1_TOKEN) {
    console.error("[api/m1] M1_LLM_URL / M1_LLM_TOKEN are not set");
    return NextResponse.json(
      { ok: false, error: "The assistant is unavailable right now. Please try again in a moment." },
      { status: 503 }
    );
  }

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const body = await req.text();
    const upstream = await fetch(`${M1_URL}/${path}`, {
      method: "POST",
      signal: ctl.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M1_TOKEN}`,
      },
      body,
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      // Upstream detail is for us, not for the visitor.
      console.error(`[api/m1/${path}] upstream ${upstream.status}: ${text.slice(0, 300)}`);
      return NextResponse.json(
        { ok: false, error: "The assistant is unavailable right now. Please try again in a moment." },
        { status: 503 }
      );
    }
    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" },
    });
  } catch (err) {
    console.error(`[api/m1/${path}]`, err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { ok: false, error: "The assistant is unavailable right now. Please try again in a moment." },
      { status: 503 }
    );
  } finally {
    clearTimeout(timer);
  }
}
