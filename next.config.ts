import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'a1esportsbd.com',
      },
      {
        // Supabase-hosted images (cloud or self-hosted/Coolify)
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
