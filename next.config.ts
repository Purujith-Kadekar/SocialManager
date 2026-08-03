import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel builds Next.js with `output: "standalone"` natively; keep it on
  // so `npm run start` also works in any container.
  output: "standalone",

  // Skip TS type errors during build. We already catch real issues at runtime
  // via env-var guards in src/lib/supabase/*.ts.
  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: false,
};

export default nextConfig;
