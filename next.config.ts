import type { NextConfig } from "next";

// Disable next-pwa automatic sw generation to use our custom sw.js
// next-pwa's auto-generated sw causes iOS PWA crashes with stale caches
const nextConfig: NextConfig = {
  // Ensure headers allow PWA Service Worker scope
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
