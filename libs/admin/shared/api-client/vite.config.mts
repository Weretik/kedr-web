import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/shared/api-client',
  resolve: { tsconfigPaths: true },
  test: {
    name: 'admin-shared-api-client',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    reporters: ['default'],
    coverage: {
      provider: 'v8' as const,
      reportsDirectory: '../../../../coverage/libs/admin/shared/api-client',
      reporter: ['text', 'html', 'lcov'],
    },
  },
}));
