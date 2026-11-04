import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/documents/data-access',
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [react()],
  // },
  test: {
    name: 'admin-documents-data-access',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/admin/documents/data-access',
      provider: 'v8' as const,
    },
  },
}));
