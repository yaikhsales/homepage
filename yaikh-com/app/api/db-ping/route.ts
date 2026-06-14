/* GET /api/db-ping — confirms the Mongo connection is alive.
 *
 * Returns { connected: true, ms: 42 } on success, or
 *         { connected: false, error: "..." } with a 503 on failure.
 *
 * Always evaluated dynamically (no caching) so each ping really pings. */

import { NextResponse } from "next/server";
import { pingDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { ok, ms } = await pingDb();
    return NextResponse.json({ connected: ok, ms });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { connected: false, error: msg },
      { status: 503 }
    );
  }
}
