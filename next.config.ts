import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tough-cow-842.convex.*",
      },
    ],
  },
};

export default nextConfig;
