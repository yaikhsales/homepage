import { createHash, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { makeSessionValue, verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COOKIE = "yqms_floor_session";
const TTL = 60 * 60 * 8;
const noStore = { "Cache-Control": "private, no-store" };
const attempts = new Map<string, { count: number; until: number }>();
const validMode = (mode: unknown) => ["first-output", "endline", "inline", "roaming", "checkout", "qa20"].includes(String(mode));

function sameOrigin() {
  const origin = headers().get("origin");
  const host = headers().get("x-forwarded-host") || headers().get("host");
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}

function authorized(mode: string) {
  const payload = verifySession(cookies().get(COOKIE)?.value);
  if (!payload) return false;
  const [scope, allowedMode, expiry] = payload.split(":");
  return scope === "yqms-floor" && allowedMode === mode && Number(expiry) > Date.now();
}

export async function GET(request: Request) {
  const mode = new URL(request.url).searchParams.get("mode");
  return NextResponse.json({ ok: validMode(mode) && authorized(mode!) }, { headers: noStore });
}

export async function POST(request: Request) {
  if (!sameOrigin()) return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers: noStore });
  let body: { mode?: string; code?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400, headers: noStore }); }
  if (!validMode(body.mode) || typeof body.code !== "string" || !/^\d{6}$/.test(body.code)) return NextResponse.json({ ok: false, error: "Enter a six-digit code." }, { status: 400, headers: noStore });
  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = createHash("sha256").update(ip).digest("hex");
  const previous = attempts.get(key);
  if (previous && previous.until > Date.now() && previous.count >= 5) return NextResponse.json({ ok: false, error: "Too many attempts. Try again in 15 minutes." }, { status: 429, headers: noStore });
  const expected = process.env.YQMS_FLOOR_PIN || "111111";
  const enteredHash = createHash("sha256").update(body.code).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  if (!timingSafeEqual(enteredHash, expectedHash)) {
    attempts.set(key, { count: previous && previous.until > Date.now() ? previous.count + 1 : 1, until: Date.now() + 15 * 60 * 1000 });
    return NextResponse.json({ ok: false, error: "Incorrect code." }, { status: 401, headers: noStore });
  }
  attempts.delete(key);
  const response = NextResponse.json({ ok: true }, { headers: noStore });
  response.cookies.set(COOKIE, makeSessionValue(`yqms-floor:${body.mode}:${Date.now() + TTL * 1000}`), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: TTL });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { headers: noStore });
  response.cookies.set(COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
