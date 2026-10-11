import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-runtime middleware: presence check on the session cookie. Real
// signature verification happens in the page server component (Node
// runtime, lib/auth.ts).
//
// Unauthenticated visitors to /plan/* are bounced to /SDTV (the Strategic
// DTV access-code page), NOT to /, which is the public yaikh.com marketing
// homepage and would silently erase the visitor's intent.
export function middleware(req: NextRequest) {
  const session = req.cookies.get("yai_session");
  if (!session?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/SDTV";
    url.searchParams.set("redirected", "1");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // /strategy is the internal funding board — same access code as /plan, never
  // public. It names real people and how to reach them, so it must never be
  // reachable without the cookie.
  matcher: ["/plan/:path*", "/strategy", "/strategy/:path*"],
};
