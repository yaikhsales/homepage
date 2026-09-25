/* Seed-round pitch decks — four raise sizes, listed in /plan Appendix A4.
 * The deck HTML + PDFs live in /private (NOT /public), so they are only
 * reachable through this route: middleware (/plan/*) + the same signed-cookie
 * check as /plan.
 *   /plan/pitch-deck?ask=1m          → deck (HTML, fits any window)
 *   /plan/pitch-deck?ask=1m&pdf=1    → the same deck as PDF
 * ask ∈ 0.5m · 1m · 2m · 3m (default 3m). Source of truth:
 * deck/v4-work/make-yai-deck-v4.js → `node make-yai-deck-v4.js all`, then
 * re-copy the built HTML and deck/Yai-Pitch-Deck-v4-*.pdf into /private. */

import { cookies } from "next/headers";
import { readFile } from "fs/promises";
import path from "path";
import { verifySession } from "@/lib/auth";
import { DECKS } from "@/lib/decks";

export const dynamic = "force-dynamic";

// The deck list lives in lib/decks.ts — shared with the .pdf route.

export async function GET(request: Request) {
  const viewer = verifySession(cookies().get("yai_session")?.value);
  if (!viewer) {
    return new Response(null, { status: 302, headers: { Location: "/SDTV?redirected=1" } });
  }
  const url = new URL(request.url);
  const deck = DECKS[url.searchParams.get("ask") ?? "3m"];
  if (!deck) return new Response("Unknown deck", { status: 404 });

  const common = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (url.searchParams.get("pdf") && deck.pdf) {
    const pdf = await readFile(path.join(process.cwd(), "private", deck.pdf));
    return new Response(pdf, {
      headers: { ...common, "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${deck.pdf}"` },
    });
  }
  const html = await readFile(path.join(process.cwd(), "private", deck.html), "utf8");
  return new Response(html, { headers: { ...common, "Content-Type": "text/html; charset=utf-8" } });
}
