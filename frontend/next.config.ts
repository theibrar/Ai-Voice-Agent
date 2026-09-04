import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    allowedDevOrigins: ["agents.ibrasoft.com", "*.ibrasoft.com", "localhost:3000", "127.0.0.1:3000"],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://backend:8080/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
