import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/site/home/feature',
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    name: 'site-home-feature',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/site/home/feature',
      provider: 'v8' as const,
    },
  },
}));
