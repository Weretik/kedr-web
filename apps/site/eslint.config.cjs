const nextPlugin = require('@next/eslint-plugin-next');

const baseConfig = require('../../eslint.config.cjs');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    ...nextPlugin.configs['core-web-vitals'],
    settings: { next: { rootDir: 'apps/site' } },
  },
  {
    ignores: ['.next/**', 'next-env.d.ts'],
  },
];
