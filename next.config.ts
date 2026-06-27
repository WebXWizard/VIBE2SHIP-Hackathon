import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   typescript: {
    // ✅ Ignore build errors from TypeScript
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeRouterScrolling: true,
  },
};

export default nextConfig;
