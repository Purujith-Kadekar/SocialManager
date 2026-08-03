import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // NOTE: do NOT use `output: "standalone"` on Vercel — that mode is for
  // self-hosted Docker/Node deployments and breaks Vercel's serverless build.
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
}

export default nextConfig
