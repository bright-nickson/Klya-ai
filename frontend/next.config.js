/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://klya-ai-backend.onrender.com' 
        : 'http://localhost:3001')
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'production'
        ? 'https://klya-ai-backend.onrender.com'
        : 'http://localhost:3001');

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`
      }
    ];
  }
};

module.exports = nextConfig;