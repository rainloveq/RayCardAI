/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'static.aiquickdraw.com' },
      { protocol: 'https', hostname: '**.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'api.kie.ai' },
      { protocol: 'https', hostname: '*.kie.ai' },
      { protocol: 'https', hostname: 'd2xsxph8kpxj0f.cloudfront.net' },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude @imgly/background-removal from server bundling (client-only)
      config.externals = [...(config.externals || []), '@imgly/background-removal'];
    }
    // Handle .mjs files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    return config;
  },
};

const withSerwist = require('@serwist/next').default({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withSerwist(nextConfig);
