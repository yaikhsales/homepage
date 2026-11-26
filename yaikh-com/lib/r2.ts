/* Cloudflare R2 (S3-compatible) for event files — handouts and slides.
 *
 * Files do not go in Mongo: yaikh's Atlas cluster is the free 512 MB tier
 * shared with the Newsroom, and it has already filled up and blocked every
 * write twice. R2 is built for files and the free tier is 10 GB.
 *
 * Needs four Railway variables on yaikh-com. Until they are set this
 * module reports not-configured and the upload UI says so, instead of
 * failing obscurely:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 */
import "server-only";
import { AwsClient } from "aws4fetch";
import { promises as fs } from "fs";
import path from "path";

/* Fallback store: a Railway volume. Railway sets RAILWAY_VOLUME_MOUNT_PATH
 * as soon as a volume is attached to the service, so uploads work with no
 * keys at all. R2 wins when its four variables are set. */
function diskDir(): string | null {
  return process.env.FILES_DIR || process.env.RAILWAY_VOLUME_MOUNT_PATH || null;
}

function diskPath(key: string): string {
  const root = path.resolve(diskDir() as string, "event-files");
  const full = path.resolve(root, key);
  if (!full.startsWith(root + path.sep)) throw new Error("Bad file key.");
  return full;
}

function cfg() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) return null;
  return {
    client: new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region: "auto" }),
    base: `https://${accountId}.r2.cloudflarestorage.com/${bucket}`,
  };
}

export function r2Configured(): boolean {
  return cfg() !== null || diskDir() !== null;
}

function urlFor(base: string, key: string) {
  return `${base}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export async function r2Put(key: string, body: ArrayBuffer, contentType: string): Promise<void> {
  const c = cfg();
  if (!c) {
    if (!diskDir()) throw new Error("File storage is not configured.");
    const full = diskPath(key);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, Buffer.from(body));
    await fs.writeFile(`${full}.type`, contentType);
    return;
  }
  const res = await c.client.fetch(urlFor(c.base, key), {
    method: "PUT",
    body,
    headers: { "Content-Type": contentType },
  });
  if (!res.ok) throw new Error(`Storage refused the file (${res.status}).`);
}

export async function r2Get(key: string): Promise<Response> {
  const c = cfg();
  if (!c) {
    if (!diskDir()) throw new Error("File storage is not configured.");
    try {
      const full = diskPath(key);
      const data = await fs.readFile(full);
      const type = await fs.readFile(`${full}.type`, "utf8").catch(() => "application/octet-stream");
      return new Response(new Uint8Array(data), { status: 200, headers: { "Content-Type": type } });
    } catch {
      return new Response(null, { status: 404 });
    }
  }
  return c.client.fetch(urlFor(c.base, key), { method: "GET" });
}

export async function r2Delete(key: string): Promise<void> {
  const c = cfg();
  if (!c) {
    if (!diskDir()) return;
    const full = diskPath(key);
    await fs.rm(full, { force: true });
    await fs.rm(`${full}.type`, { force: true });
    return;
  }
  await c.client.fetch(urlFor(c.base, key), { method: "DELETE" });
}
