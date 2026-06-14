/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // /experience serves the absorbed CRA dashboard directly — no
  // intermediate /dashboard URL, no redirect chain. The CRA build
  // emits assets prefixed with /experience (set via homepage in
  // yaikh-dashboard/package.json) so URLs like /experience/static/...
  // resolve to the real files in public/experience/.
  async rewrites() {
    return [
      // /experience exact → serve the CRA SPA entry. URL bar stays at
      // /experience, which AppLayout's isHome gate matches to render
      // the agent constellation.
      {
        source: "/experience",
        destination: "/experience/index.html",
      },
      // Deep links inside the CRA (e.g. /experience/yhr) → index.html
      // so BrowserRouter handles them client-side. Excludes /static/*
      // /assets/* and anything ending in a file extension.
      {
        source: "/experience/:path((?!static|assets|.*\\..*).*)",
        destination: "/experience/index.html",
      },
    ];
  },
};

export default nextConfig;
