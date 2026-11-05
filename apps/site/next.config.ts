import path from 'node:path';

import { articleRedirects } from './article-redirects';

import type { NextConfig } from 'next';

// Nx libraries live outside the app folder, so the workspace root is the build and tracing root.
const workspaceRoot = path.join(__dirname, '../..');

// Article covers are served by the API (Content module); keep the host in sync with siteConfig.apiUrl.
const apiUrl = new URL(process.env['KEDR_API_URL'] || 'https://api.classkedr.com.ua');

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
    remotePatterns: [
      { protocol: 'https', hostname: 'images-kedr.cdn.express' },
      // YouTube's own posters of the gallery videos.
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
      // The `v` query of a cover URL changes with every new cover.
      {
        protocol: apiUrl.protocol === 'http:' ? 'http' : 'https',
        hostname: apiUrl.hostname,
        ...(apiUrl.port ? { port: apiUrl.port } : {}),
        pathname: '/api/content/articles/**',
      },
    ],
  },
  experimental: {
    // The root layout sits under [locale], so unmatched URLs get a global 404 document rendered on the server.
    globalNotFound: true,
  },
  async redirects() {
    return [
      ...articleRedirects,
      { source: '/', destination: '/uk', permanent: true },
      // The Angular storefront served the same catalog index at /categories; the home page replaces it.
      { source: '/:locale(uk|ru)/categories', destination: '/:locale', permanent: true },
      // Company content lives on the localized home page; keep the old public addresses working.
      { source: '/:locale(uk|ru)/about-company', destination: '/:locale', permanent: true },
      // The Angular storefront had 23 regional landing pages; delivery terms for every region live on «Співпраця».
      {
        source: '/:locale(uk|ru)/region/:city',
        destination: '/:locale/wholesale',
        permanent: true,
      },
      // The Angular storefront had a demo sign-in and cabinet; the site has no accounts (owner decision 2026-11-04).
      { source: '/:locale(uk|ru)/login', destination: '/:locale', permanent: true },
      { source: '/:locale(uk|ru)/cabinet/:path*', destination: '/:locale', permanent: true },
      // Old catalog addresses of the Angular storefront; the category page then redirects former slugs.
      {
        source: '/:locale(uk|ru)/catalog/products',
        has: [{ type: 'query', key: 'search', value: '(?<term>.+)' }],
        destination: '/:locale/search?q=:term',
        permanent: true,
      },
      {
        source: '/:locale(uk|ru)/catalog/products',
        destination: '/:locale/catalog',
        permanent: true,
      },
      {
        source: '/:locale(uk|ru)/catalog/product/:slug',
        destination: '/:locale/product/:slug',
        permanent: true,
      },
      {
        source: '/:locale(uk|ru)/catalog/:slug/products',
        destination: '/:locale/catalog/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
