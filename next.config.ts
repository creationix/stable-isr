import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true, // Enable Cache Components in Next.js 16
  cacheLife: {
    max: {
      stale: 31536000, // 1 year
      revalidate: 31536000, // 1 year
      expire: 31536000, // 1 year
    },
  },
};

export default nextConfig;
