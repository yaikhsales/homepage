import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-runtime middleware: presence check on the session cookie. Real
// signature verification happens in the page server component (Node
// runtime, lib/auth.ts).
//
// Unauthenticated visitors to /plan/* are bounced to /plan-login (NOT to
// /, which is the public yaikh.com marketing homepage and would silently
// erase the visitor's intent).
export function middleware(req: NextRequest) {
  const session = req.cookies.get("yai_session");
  if (!session?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/plan-login";
    url.searchParams.set("redirected", "1");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/plan/:path*"],
};
