import { NextResponse } from "next/server";
import { findCode } from "@/lib/codes";
import { makeSessionValue, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let code = "";
  try {
    const body = await req.json();
    code = typeof body?.code === "string" ? body.code : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const entry = findCode(code);
  if (!entry) {
    // Tiny delay to discourage brute-force timing
    await new Promise((r) => setTimeout(r, 350));
    return NextResponse.json({ ok: false, error: "Invalid code" }, { status: 401 });
  }

  console.log(
    `[YAI] Access granted: "${entry.label}" at ${new Date().toISOString()}`
  );

  const res = NextResponse.json({ ok: true, viewer: entry.label });
  res.cookies.set({
    name: COOKIE_NAME,
    value: makeSessionValue(entry.label),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
