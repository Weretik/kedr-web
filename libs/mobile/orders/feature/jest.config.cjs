/// <reference types="jest" />
/// <reference types="node" />
const root = '<rootDir>/../../../..';

module.exports = {
  displayName: 'mobile-orders-feature',
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
    '^@mobile/orders/model$': '<rootDir>/../model/src/index.ts',
    '^@mobile/orders/data-access$': '<rootDir>/../data-access/src/index.ts',
    '^@mobile/calculation/model$': '<rootDir>/../../calculation/model/src/index.ts',
    '^@mobile/calculation/data-access$': '<rootDir>/../../calculation/data-access/src/index.ts',
    '^@mobile/calculation/ui$': '<rootDir>/../../calculation/ui/src/index.ts',
    '^@mobile/customers/ui$': '<rootDir>/../../customers/ui/src/index.ts',
    '^@mobile/customers/model$': '<rootDir>/../../customers/model/src/index.ts',
    '^@mobile/customers/data-access$': '<rootDir>/../../customers/data-access/src/index.ts',
    '^@mobile/shared/api-client$': '<rootDir>/../../shared/api-client/src/index.ts',
    '^@mobile/shared/config$': '<rootDir>/../../shared/config/src/index.ts',
    '^@mobile/shared/model$': '<rootDir>/../../shared/model/src/index.ts',
    '^@mobile/shared/ui$': '<rootDir>/../../shared/ui/src/index.ts',
    '^@react-native-async-storage/async-storage$': `${root}/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock.js`,
  },
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  coverageDirectory: '../../../../coverage/libs/mobile/orders/feature',
};
