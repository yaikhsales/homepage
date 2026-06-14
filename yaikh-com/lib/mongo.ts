/* MongoDB client — singleton.
 *
 * Reads MONGO_URL from env (set on Railway as a server-side variable;
 * NEVER hard-coded in the repo). Caches a single MongoClient instance
 * across Next.js hot-reload cycles in dev and serverless invocations
 * in prod, so we don't open a new connection per request.
 *
 * Usage from a server component or route handler:
 *   import { getDb } from "@/lib/mongo";
 *   const db = await getDb();
 *   const docs = await db.collection("accounting").find({}).toArray();
 */

import { MongoClient, type Db, type MongoClientOptions } from "mongodb";

const uri = process.env.MONGO_URL;
if (!uri) {
  // Throw lazily inside getDb() so that pages not touching Mongo can still
  // build, but anything that calls getDb() blows up loudly with a clear message.
}

const options: MongoClientOptions = {
  // Atlas Singapore region — let driver pick the nearest primary.
  // Modest timeouts so a misconfigured URL fails fast instead of hanging the request.
  serverSelectionTimeoutMS: 5_000,
  connectTimeoutMS: 5_000,
};

// Cache across hot reloads in dev (Next.js wipes module state per request
// when fast refresh kicks in). In prod each Node instance gets its own
// cache and warms up once.
type GlobalWithMongo = typeof globalThis & {
  __yaikhMongoClient?: Promise<MongoClient>;
};
const g = globalThis as GlobalWithMongo;

function getClient(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(
      new Error(
        "MONGO_URL is not set. Add it as an environment variable (Railway → yaikh-com → Variables)."
      )
    );
  }
  if (!g.__yaikhMongoClient) {
    g.__yaikhMongoClient = new MongoClient(uri, options).connect();
  }
  return g.__yaikhMongoClient;
}

/** Get the default database (the one in the connection string's path or
 * "yaikh" if the URL doesn't specify). */
export async function getDb(name = "yaikh"): Promise<Db> {
  const client = await getClient();
  return client.db(name);
}

/** Best-effort health check — confirms we can reach the cluster.
 * Returns the ping latency in ms, or throws. */
export async function pingDb(): Promise<{ ok: boolean; ms: number }> {
  const t0 = Date.now();
  const client = await getClient();
  const admin = client.db().admin();
  const res = await admin.ping();
  return { ok: res?.ok === 1, ms: Date.now() - t0 };
}
