const js = require('@eslint/js');
const nx = require('@nx/eslint-plugin');
const angular = require('angular-eslint');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const globals = require('globals');
const tseslint = require('typescript-eslint');

const only = (configs, files) =>
  configs.map((c) => ({
    ...c,
    files,
  }));

module.exports = [
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/.angular/**',
      '**/node_modules/**',
      '**/.nx/**',
      '**/tmp/**',
      '**/.vite/**',
      '**/vitest.config.*.timestamp*',
    ],
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  ...only(tseslint.configs.recommended, ['**/*.{ts,tsx,mts,cts}']),
  ...only(angular.configs.tsRecommended, ['apps/**/*.ts', 'libs/**/*.ts']),
  ...only(angular.configs.templateRecommended, [
    'apps/**/*.html',
    'libs/**/*.html',
  ]),

  {
    files: ['apps/**/*.html', 'libs/**/*.html'],
    rules: {
      '@angular-eslint/template/alt-text': 'off',
    },
  },
  {
    files: [
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/vitest.setup.ts',
      '**/test/**/*.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },

  {
    files: [
      '**/*.config.{js,ts,mjs,cjs}',
      'tools/**/*.{js,ts}',
      'scripts/**/*.{js,ts}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ['apps/**/*.ts', 'libs/**/*.ts'],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/use-lifecycle-interface': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts,js,mjs,cjs}'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    plugins: {
      '@nx': nx,
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],

          // Important: we prohibit “deep” imports into src/lib/*
          // We only allow public entry points (index.ts) via importPath aliases.
          banTransitiveDependencies: true,

          depConstraints: [
            // storefront can only depend on shared and storefront
            {
              sourceTag: 'scope:storefront',
              onlyDependOnLibsWithTags: ['scope:storefront', 'scope:shared'],
            },
            // admin can only depend on shared and admin
            {
              sourceTag: 'scope:admin',
              onlyDependOnLibsWithTags: ['scope:admin'],
            },

            // Admin composition root may only use its core, feature, and admin-shared libraries.
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:core',
                'type:feature',
                'scope:admin-shared',
              ],
            },

            // Admin core is cross-domain infrastructure and must not depend on domain libraries.
            {
              sourceTag: 'type:core',
              onlyDependOnLibsWithTags: ['scope:admin-shared'],
            },

            // Admin feature layers compose their domain's data, model, UI, and shared libraries.
            {
              allSourceTags: ['scope:admin', 'type:feature'],
              onlyDependOnLibsWithTags: [
                'type:data-access',
                'type:model',
                'type:ui',
                'scope:admin-shared',
              ],
            },

            // Admin data access may depend only on models and shared transport/utilities.
            {
              allSourceTags: ['scope:admin', 'type:data-access'],
              onlyDependOnLibsWithTags: ['type:model', 'scope:admin-shared'],
            },

            // Admin domain UI remains presentational and can use models plus shared UI/utilities.
            {
              allSourceTags: ['scope:admin', 'type:ui'],
              onlyDependOnLibsWithTags: ['type:model', 'scope:admin-shared'],
            },

            // Admin models remain framework-independent and may only use shared contracts/utilities.
            {
              allSourceTags: ['scope:admin', 'type:model'],
              onlyDependOnLibsWithTags: ['scope:admin-shared'],
            },

            // shared — from no one (except shared)
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },

            // UI libraries should stay presentational
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:util',
                'type:contracts',
                'scope:shared',
                'scope:admin-shared',
              ],
            },

            // data-access can be used from feature, but data-access should not pull feature
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: [
                'type:data-access',
                'type:util',
                'type:contracts',
                'scope:shared',
                'scope:admin-shared',
              ],
            },

            // feature can pull ui/util/data-access into its scope
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:util',
                'type:data-access',
                'type:contracts',
                'scope:shared',
                'scope:admin-shared',
              ],
            },

            // shell composes feature/ui/data-access for app layout
            {
              sourceTag: 'type:shell',
              onlyDependOnLibsWithTags: [
                'type:shell',
                'type:feature',
                'type:ui',
                'type:util',
                'type:data-access',
                'type:contracts',
                'scope:shared',
                'scope:admin-shared',
              ],
            },

            // contracts should only depend on utils and shared
            {
              sourceTag: 'type:contracts',
              onlyDependOnLibsWithTags: [
                'type:contracts',
                'type:util',
                'scope:shared',
              ],
            },
          ],
        },
      ],
    },
  },

  prettierConfig,
];
