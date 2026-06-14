import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin";

export const runtime = "nodejs";

// POST form-action friendly: clears admin cookie + redirects back to /admin.
export async function POST(req: Request) {
  const url = new URL("/admin", req.url);
  const res = NextResponse.redirect(url, 303); // 303 → browser switches to GET
  res.cookies.set({ name: ADMIN_COOKIE_NAME, value: "", path: "/", maxAge: 0 });
  return res;
}
