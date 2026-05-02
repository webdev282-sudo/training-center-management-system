import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  // Proxy API calls in development to avoid CORS issues
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
      },
    ]
  },
 
  // Remove X-Powered-By header
  poweredByHeader: false,
 
  // Strict mode for better React error detection
  reactStrictMode: true,
 
  // Image domains if needed later
  images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
    },
  ],
}
  
}
 
export default nextConfig