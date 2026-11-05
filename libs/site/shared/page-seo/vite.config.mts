import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/site/shared/page-seo',
  resolve: { tsconfigPaths: true },
  test: {
    name: 'site-shared-page-seo',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/site/shared/page-seo',
      provider: 'v8' as const,
    },
  },
}));
