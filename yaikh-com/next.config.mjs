/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // @sparticuz/chromium ships a native Linux binary that must NOT be
  // bundled by Next.js — it has to be loaded from node_modules at runtime
  // (used by /api/pdf for server-side PDF generation in the absorbed
  // yai-plan portal).
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  },
  async headers() {
    // Portal pages (/plan, /admin) are confidential — strip them from
    // public crawlers and add baseline hardening. The marketing pages at
    // /, /about, /experience are still publicly indexable (handled by
    // their own per-route metadata where needed).
    return [
      {
        source: "/(plan|admin)/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  // /experience serves the absorbed CRA dashboard directly — no
  // intermediate /dashboard URL, no redirect chain. The CRA build emits
  // assets prefixed with /experience (set via homepage in
  // yaikh-dashboard/package.json) so URLs like /experience/static/...
  // resolve to the real files in public/experience/.
  async rewrites() {
    return [
      {
        source: "/experience",
        destination: "/experience/index.html",
      },
      {
        source: "/experience/:path((?!static|assets|.*\\..*).*)",
        destination: "/experience/index.html",
      },
    ];
  },
};

export default nextConfig;
