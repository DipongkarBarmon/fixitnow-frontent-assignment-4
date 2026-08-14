import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: `${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000"}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
