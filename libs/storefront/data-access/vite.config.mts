/// <reference types="vitest" />

import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../node_modules/.vite/libs/storefront/data-access',
  plugins: [angular({ tsconfig: 'tsconfig.spec.json' })],
  resolve: { tsconfigPaths: true },
  test: {
    name: 'storefront-data-access',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      provider: 'v8' as const,
      reportsDirectory: '../../../coverage/libs/storefront/data-access',
      reporter: ['text', 'html', 'lcov'],
    },
  },
}));
