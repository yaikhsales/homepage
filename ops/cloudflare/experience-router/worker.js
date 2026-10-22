const BACKUP = 'https://yai-backup.gamini.workers.dev';
export default {
  async fetch(request) {
    const original = new URL(request.url);
    const experience = original.pathname === '/experience' || original.pathname.startsWith('/experience/');
    if (!experience || !['GET', 'HEAD'].includes(request.method)) return fetch(request);
    const target = new URL(original.pathname + original.search, BACKUP);
    const headers = new Headers(request.headers);
    // Only public SPA documents/assets are proxied; session credentials stay on yaikh.com.
    headers.delete('host');
    headers.delete('cookie');
    headers.delete('authorization');
    try {
      const result = await fetch(new Request(target, { method: request.method, headers, redirect: 'manual' }));
      if (result.status >= 500) throw new Error('Backup unavailable');
      const response = new Response(result.body, result);
      response.headers.set('X-Yai-Experience-Origin', 'cloudflare');
      response.headers.delete('set-cookie');
      const location = response.headers.get('location');
      if (location) {
        const redirect = new URL(location, target);
        if (redirect.origin === BACKUP) response.headers.set('location', original.origin + redirect.pathname + redirect.search + redirect.hash);
      }
      return response;
    } catch {
      // Same-zone subrequest bypasses this route and reaches the existing Railway origin.
      if (original.hostname === 'yaikh.com') return fetch(request);
      return new Response('Experience backup temporarily unavailable', { status: 503 });
    }
  }
};
