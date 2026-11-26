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
  return cfg() !== null;
}

function urlFor(base: string, key: string) {
  return `${base}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export async function r2Put(key: string, body: ArrayBuffer, contentType: string): Promise<void> {
  const c = cfg();
  if (!c) throw new Error("File storage is not configured.");
  const res = await c.client.fetch(urlFor(c.base, key), {
    method: "PUT",
    body,
    headers: { "Content-Type": contentType },
  });
  if (!res.ok) throw new Error(`Storage refused the file (${res.status}).`);
}

export async function r2Get(key: string): Promise<Response> {
  const c = cfg();
  if (!c) throw new Error("File storage is not configured.");
  return c.client.fetch(urlFor(c.base, key), { method: "GET" });
}

export async function r2Delete(key: string): Promise<void> {
  const c = cfg();
  if (!c) return;
  await c.client.fetch(urlFor(c.base, key), { method: "DELETE" });
}
