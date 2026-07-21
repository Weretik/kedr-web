import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/admin',
    base: env['VITE_ASSET_BASE'] || '/',
    plugins: [
      nxViteTsPaths(),
      react({
        babel: {
          plugins: [
            ['babel-plugin-react-compiler', { panicThreshold: 'none' }],
          ],
        },
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
  };
});
