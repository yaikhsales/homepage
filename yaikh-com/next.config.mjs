/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // /experience → straight into the absorbed Yai Data dashboard (V2
      // built into public/dashboard/). The agent constellation shows up
      // immediately instead of the old localhost:3002 landing page.
      {
        source: "/experience",
        destination: "/dashboard/index.html",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      // The CRA dashboard uses react-router BrowserRouter; deep links like
      // /dashboard/yhr or /dashboard/accountant/verify-pr must fall back
      // to index.html so the router can take over client-side. Excludes
      // static/ + assets/ + anything with a file extension.
      {
        source: "/dashboard/:path((?!static|assets|.*\\..*).*)",
        destination: "/dashboard/index.html",
      },
    ];
  },
};

export default nextConfig;
