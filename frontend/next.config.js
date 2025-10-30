/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensures Vercel builds the app as a serverless standalone app
  output: 'standalone',

  reactStrictMode: true,

  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },

  // Environment variables for API calls
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_URL || 'https://klya-ai-backend.onrender.com'
        : 'http://localhost:3001',
  },

  // Rewrites: this makes sure API calls work locally and in production
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'production'
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
            : 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
