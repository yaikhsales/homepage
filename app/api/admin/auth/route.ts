import { NextResponse } from "next/server";
import { checkAdminCreds, makeAdminCookie, ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE, verifyAdminCookie } from "@/lib/admin";

export const runtime = "nodejs";

// Login
export async function POST(req: Request) {
  let user = "", pass = "";
  try {
    const body = await req.json();
    user = typeof body?.user === "string" ? body.user : "";
    pass = typeof body?.pass === "string" ? body.pass : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const label = checkAdminCreds(user, pass);
  if (!label) {
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  console.log(`[YAI ADMIN] Login: "${label}" at ${new Date().toISOString()}`);

  const res = NextResponse.json({ ok: true, user: label });
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: makeAdminCookie(label),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}

// Status check
export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  const user = verifyAdminCookie(value);
  return NextResponse.json({ ok: !!user, user: user ?? null });
}

// Logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: ADMIN_COOKIE_NAME, value: "", path: "/", maxAge: 0 });
  return res;
}
