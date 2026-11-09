/// <reference types="jest" />
/// <reference types="node" />
const root = '<rootDir>/../../../..';

module.exports = {
  displayName: 'mobile-profile-ui',
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
    '^@mobile/profile/model$': '<rootDir>/../model/src/index.ts',
    '^@mobile/shared/model$': '<rootDir>/../../shared/model/src/index.ts',
    '^@mobile/shared/ui$': '<rootDir>/../../shared/ui/src/index.ts',
    '^@gorhom/bottom-sheet$': `${root}/node_modules/@gorhom/bottom-sheet/mock.js`,
  },
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  coverageDirectory: '../../../../coverage/libs/mobile/profile/ui',
};
