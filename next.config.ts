import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "getstream.io",
      },
       {
        protocol: "https",
        hostname: "cdn.pfps.gg",
      },
    ],
  },
};

export default nextConfig;
