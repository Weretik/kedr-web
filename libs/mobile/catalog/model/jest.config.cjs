/// <reference types="jest" />
/// <reference types="node" />
module.exports = {
  displayName: 'mobile-catalog-model',
  preset: 'jest-expo',
  // FlashList ships ES modules: transform it like the other React Native packages.
  transformIgnorePatterns: require('jest-expo/jest-preset').transformIgnorePatterns.map((pattern) =>
    pattern.replace('(?!(', '(?!(@shopify/flash-list|'),
  ),
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  moduleNameMapper: {
    '^@mobile/shared/model$': '<rootDir>/../../shared/model/src/index.ts',
  },
  setupFilesAfterEnv: ['@shopify/flash-list/jestSetup', '<rootDir>/src/test-setup.ts'],
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  coverageDirectory: '../../../../coverage/libs/mobile/catalog/model',
};
