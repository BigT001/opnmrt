import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@opnmart/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
