/** @type {import('next').NextConfig} */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // object-hash advertises a browser UMD build which Next's webpack loader
  // treats as a non-callable default export. Tailwind needs its Node entry.
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "object-hash$": require.resolve("object-hash/index.js"),
    };
    return config;
  },
  // @sparticuz/chromium ships a native Linux binary that must NOT be
  // bundled by Next.js — it has to be loaded from node_modules at runtime
  // (used by /api/pdf for server-side PDF generation in the absorbed
  // yai-plan portal).
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  },
  // pptxgenjs is used client-side by the SlideShow export helper. Its
  // ES bundle contains `import 'node:fs'` / `import 'node:https'` from
  // its Node code path. Webpack 5's `resolve.fallback` doesn't apply to
  // the `node:` URI scheme — those requests need an IgnorePlugin (or the
  // static `import` never runs at runtime anyway because pptxgenjs's
  // browser code path never reaches it). We do BOTH: the IgnorePlugin
  // strips the request at bundle time, and the bare-specifier fallbacks
  // cover the non-schemed variants.
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        https: false,
        os: false,
        path: false,
      };
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^node:(fs|https|os|path|http|url|zlib|stream|util|crypto|buffer|child_process|events|assert)$/,
        }),
      );
    }
    return config;
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
