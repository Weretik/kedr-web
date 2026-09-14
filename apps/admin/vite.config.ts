import babel from '@rolldown/plugin-babel';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/admin',
    base: env['VITE_ASSET_BASE'] || '/',
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      react(),
      babel({
        plugins: [['babel-plugin-react-compiler', { panicThreshold: 'none' }]],
      }),
    ],
    server: {
      host: 'localhost',
      port: 4200,
    },
    preview: {
      host: 'localhost',
      port: 4300,
    },
    build: {
      outDir: '../../dist/apps/admin',
      emptyOutDir: true,
    },
    test: {
      name: 'admin',
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      setupFiles: ['./src/test-setup.ts'],
      coverage: {
        provider: 'v8' as const,
        reportsDirectory: '../../coverage/apps/admin',
        reporter: ['text', 'html', 'lcov'],
      },
    },
  };
});
