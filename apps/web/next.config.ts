import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@apps/ui', '@apps/utils', '@apps/types'],
}

export default nextConfig
