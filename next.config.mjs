/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'bcryptjs', 'jsonwebtoken']
  },
  // Ensure proper handling of API routes
  async rewrites() {
    return []
  },
};

export default nextConfig;
