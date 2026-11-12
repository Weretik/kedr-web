import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/seo-settings/ui',
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    name: 'admin-seo-settings-ui',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/admin/seo-settings/ui',
      provider: 'v8' as const,
    },
  },
}));
