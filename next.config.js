/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Don't fail production builds on lint warnings
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Don't fail on TypeScript errors in production (warnings only)
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Image optimization
  images: {
    domains: ['localhost', 'hankgamgdgodxtpwflpn.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Bundle analyzer (only in development)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer')())({
          enabled: true,
        })
      );
      return config;
    },
  }),
};

module.exports = nextConfig;