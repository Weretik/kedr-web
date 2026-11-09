/// <reference types="jest" />
/// <reference types="node" />

module.exports = {
  displayName: 'mobile-sync-feature',
  preset: 'jest-expo',
  // FlashList ships ES modules: transform it like the other React Native packages.
  transformIgnorePatterns: require('jest-expo/jest-preset').transformIgnorePatterns.map((pattern) =>
    pattern.replace('(?!(', '(?!(@shopify/flash-list|'),
  ),
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  setupFilesAfterEnv: [
    '@shopify/flash-list/jestSetup',
    '<rootDir>/src/test-setup.ts',
    '<rootDir>/../../shared/ui/src/testing/vector-icons-mock.tsx',
  ],
  moduleNameMapper: {
    '^@mobile/core/local-db/testing$': '<rootDir>/../../core/local-db/src/testing.ts',
    '^@mobile/core/local-db$': '<rootDir>/../../core/local-db/src/index.ts',
    '^@mobile/sync/model$': '<rootDir>/../model/src/index.ts',
    '^@mobile/sync/data-access$': '<rootDir>/../data-access/src/index.ts',
    '^@mobile/shared/api-client$': '<rootDir>/../../shared/api-client/src/index.ts',
    '^@mobile/shared/config$': '<rootDir>/../../shared/config/src/index.ts',
    '^@mobile/shared/ui$': '<rootDir>/../../shared/ui/src/index.ts',
  },
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  coverageDirectory: '../../../../coverage/libs/mobile/sync/feature',
};
