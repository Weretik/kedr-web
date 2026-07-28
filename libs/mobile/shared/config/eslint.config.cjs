const nx = require('@nx/eslint-plugin');
const tseslint = require('typescript-eslint');

const baseConfig = require('../../../../eslint.config.cjs');

module.exports = [
  ...nx.configs['flat/react'].map((config) => ({
    ...config,
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      ...config.plugins,
    },
  })),
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    ignores: ['.expo', 'web-build', 'cache', 'dist'],
  },
];
