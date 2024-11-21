/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['recharts'],
  typescript: {
    // Don't fail build on type errors during deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Don't fail build on eslint errors during deployment
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig