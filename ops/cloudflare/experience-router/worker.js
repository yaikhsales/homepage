/* yai-experience-router — Worker on route yaikh.com/experience*.
 *
 * Railway is the primary. Every push to main goes live there, so visitors see
 * the latest /experience without a Cloudflare publish.
 *
 * The yai-backup Worker's copy is the standby, used only when Railway answers
 * with a 5xx, cannot be reached, or takes longer than RAILWAY_TIMEOUT_MS to
 * start answering. The standby holds whatever was last published with
 * wrangler, so during an outage it can be older than Railway.
 *
 * Response header X-Yai-Experience-Origin says which one answered:
 * "railway" or "cloudflare".
 */
const BACKUP = 'https://yai-backup.gamini.workers.dev';
const RAILWAY_TIMEOUT_MS = 10000;

export default {
  async fetch(request) {
    const original = new URL(request.url);
    const experience = original.pathname === '/experience' || original.pathname.startsWith('/experience/');
    if (!experience || !['GET', 'HEAD'].includes(request.method)) return fetch(request);

    const entry = original.pathname === '/experience' || original.pathname === '/experience/';
    // React owns dashboard document routes; serve its shell while keeping the requested URL.
    // File requests must retain their path so missing assets still return a real 404.
    const dashboardDocument = /^\/experience\/dashboard(?:\/|$)/.test(original.pathname) && !/\.[^/]+$/.test(original.pathname);
    const documentRoute = entry || dashboardDocument;

    const primary = await fromRailway(request, documentRoute);
    if (primary) return primary;
    return fromBackup(request, original, documentRoute);
  }
};

async function fromRailway(request, documentRoute) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RAILWAY_TIMEOUT_MS);
  try {
    // Same-zone subrequest bypasses this route and reaches the Railway origin.
    const result = await fetch(request, { signal: controller.signal, redirect: 'manual' });
    if (result.status >= 500) return null;
    const response = new Response(result.body, result);
    response.headers.set('X-Yai-Experience-Origin', 'railway');
    if (documentRoute) response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fromBackup(request, original, documentRoute) {
  const target = new URL((documentRoute ? '/experience/' : original.pathname) + original.search, BACKUP);
  const headers = new Headers(request.headers);
  // Only public SPA documents/assets are proxied; session credentials stay on yaikh.com.
  headers.delete('host');
  headers.delete('cookie');
  headers.delete('authorization');
  try {
    const result = await fetch(new Request(target, { method: request.method, headers, redirect: documentRoute ? 'follow' : 'manual' }));
    if (result.status >= 500) throw new Error('Backup unavailable');
    const response = new Response(result.body, result);
    response.headers.set('X-Yai-Experience-Origin', 'cloudflare');
    if (documentRoute) response.headers.set('Cache-Control', 'no-store');
    response.headers.delete('set-cookie');
    const location = response.headers.get('location');
    if (location) {
      const redirect = new URL(location, target);
      if (redirect.origin === BACKUP) response.headers.set('location', original.origin + redirect.pathname + redirect.search + redirect.hash);
    }
    return response;
  } catch {
    return new Response('Experience temporarily unavailable', { status: 503 });
  }
}
