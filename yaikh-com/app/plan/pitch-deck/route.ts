/* Seed-round pitch deck ($3M) — embedded in /plan Appendix A4.
 * The deck HTML lives in /private (NOT /public), so it is only reachable
 * through this route: middleware (/plan/*) + the same signed-cookie check
 * as /plan. Source of truth: deck/v4-work/make-yai-deck-v4.js → re-copy the
 * built yai-deck-v4.html to private/pitch-deck-v4.html after edits. */

import { cookies } from "next/headers";
import { readFile } from "fs/promises";
import path from "path";
import { verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const viewer = verifySession(cookies().get("yai_session")?.value);
  if (!viewer) {
    return new Response(null, { status: 302, headers: { Location: "/SDTV?redirected=1" } });
  }
  const html = await readFile(path.join(process.cwd(), "private", "pitch-deck-v4.html"), "utf8");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
