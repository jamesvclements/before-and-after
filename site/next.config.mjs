/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/before-and-after',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
