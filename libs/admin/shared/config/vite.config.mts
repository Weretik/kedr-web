import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/shared/config',
  resolve: { tsconfigPaths: true },
  test: {
    name: 'admin-shared-config',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    reporters: ['default'],
    coverage: {
      provider: 'v8' as const,
      reportsDirectory: '../../../../coverage/libs/admin/shared/config',
      reporter: ['text', 'html', 'lcov'],
    },
  },
}));
