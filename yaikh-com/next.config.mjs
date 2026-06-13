/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // /experience → /dashboard (no index.html suffix). V2's BrowserRouter
      // has no basename — it expects the URL bar to be exactly "/" or
      // "/dashboard" to match its <Route path="/dashboard"> rule that
      // renders AppLayout (the agent constellation). If we redirect to
      // /dashboard/index.html, BrowserRouter sees the literal string
      // ".../index.html" and falls through to an empty fallback view.
      {
        source: "/experience",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
  // trailingSlash:false is the Next.js default — it strips trailing
  // slashes via 308. We need /dashboard to actually serve the CRA
  // index.html, so the rewrites below run on the post-strip URL.
  async rewrites() {
    return [
      // /dashboard exact → serve the CRA SPA entry. URL bar stays at
      // /dashboard, which is exactly what BrowserRouter matches.
      {
        source: "/dashboard",
        destination: "/dashboard/index.html",
      },
      // Deep links inside the CRA app (e.g. /dashboard/yhr,
      // /dashboard/accountant/verify-pr) — fall back to index.html so
      // the BrowserRouter takes over client-side. Excludes /static/*
      // /assets/* and anything ending in a file extension so real
      // asset URLs still resolve directly.
      {
        source: "/dashboard/:path((?!static|assets|.*\\..*).*)",
        destination: "/dashboard/index.html",
      },
    ];
  },
};

export default nextConfig;
