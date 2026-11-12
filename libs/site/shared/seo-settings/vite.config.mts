import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/site/shared/seo-settings',
  resolve: { tsconfigPaths: true },
  test: {
    name: 'site-shared-seo-settings',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/site/shared/seo-settings',
      provider: 'v8' as const,
    },
  },
}));
