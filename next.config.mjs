/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // @sparticuz/chromium ships a native Linux binary that must NOT be
  // bundled by Next.js — it has to be loaded from node_modules at runtime.
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
