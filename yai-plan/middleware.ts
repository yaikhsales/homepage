import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware runs in the edge runtime, so we only do a *presence* check here.
// Real signature verification happens in the page server component (Node runtime).
export function middleware(req: NextRequest) {
  const session = req.cookies.get("yai_session");
  if (!session?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirected", "1");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/plan/:path*"],
};
