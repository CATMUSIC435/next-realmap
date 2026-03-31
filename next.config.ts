import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dxmdvietnam.vn',
      },
      {
        protocol: 'http',
        hostname: 'dxmdvietnam.vn',
      },
    ],
  },
};

export default nextConfig;
