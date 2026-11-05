import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/wholesale-content/model',
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    name: 'admin-wholesale-content-model',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/admin/wholesale-content/model',
      provider: 'v8' as const,
    },
  },
}));
