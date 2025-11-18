import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true, // Enable Cache Components in Next.js 16
  cacheLife: {
    // "max" profile - uses stale-while-revalidate behavior
    // When revalidateTag("tag", "max") is called, Next.js serves stale
    // content immediately while fetching fresh data in the background
    max: {
      stale: 31536000, // 1 year - allow serving stale content
      revalidate: 31536000, // 1 year - cache duration
      expire: 31536000, // 1 year - hard expiration
    },
  },
};

export default nextConfig;
