/* Mongo-backed storage for the admin portal sections.
 *
 * Each admin section (sales-income, salaries, expenses, budget, about,
 * events…) lives as one doc in collection `admin_kv`, keyed by section
 * name. This survives Railway redeploys, unlike the original
 * data/<section>.json files in the ephemeral container fs.
 *
 * Stores keep their existing public read/write API; they delegate
 * storage to these helpers instead of fs reads/writes.
 *
 * If Mongo is unavailable (e.g. local dev with no MONGO_URL), reads
 * return null so the caller can fall back to a file snapshot or seed
 * defaults.
 */

import { getDb } from "@/lib/mongo";

const COLLECTION = "admin_kv";

/** Read a section's stored payload from Mongo. Returns null if missing or unreachable. */
export async function readAdminDoc<T>(name: string): Promise<T | null> {
  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION).findOne<{ _id: string; payload: T }>({ _id: name as unknown as never });
    return doc?.payload ?? null;
  } catch (err) {
    console.warn(`[admin-mongo] read "${name}" failed:`, err instanceof Error ? err.message : err);
    return null;
  }
}

/** Upsert a section's payload into Mongo. Throws on real errors. */
export async function writeAdminDoc<T extends Record<string, unknown>>(
  name: string,
  payload: T
): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { _id: name as unknown as never },
    {
      $set: {
        _id: name,
        payload,
        _updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}
