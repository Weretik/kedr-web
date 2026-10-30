import path from 'node:path';

import type { NextConfig } from 'next';

// Nx libraries live outside the app folder, so the workspace root is the build and tracing root.
const workspaceRoot = path.join(__dirname, '../..');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  // Caching is explicit: 'use cache' with cacheLife and cacheTag in data-access (docs/architecture/site/platform).
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingRoot: workspaceRoot,
  turbopack: {
    root: workspaceRoot,
  },
  images: {
    // Product photos; keep in sync with PRODUCT_IMAGE_HOST in @site/catalog/data-access.
    remotePatterns: [{ protocol: 'https', hostname: 'images-kedr.cdn.express' }],
  },
  experimental: {
    // The root layout sits under [locale], so unmatched URLs get a global 404 document rendered on the server.
    globalNotFound: true,
  },
  async redirects() {
    return [
      { source: '/', destination: '/uk', permanent: true },
      // The Angular storefront served the same catalog index at /categories; the home page replaces it.
      { source: '/:locale(uk|ru)/categories', destination: '/:locale', permanent: true },
    ];
  },
};

export default nextConfig;
