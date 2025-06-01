/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', 'jsonwebtoken']
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
