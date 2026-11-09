module.exports = {
  displayName: 'mobile-shared-ui',
  preset: 'jest-expo',
  // FlashList ships ES modules: transform it like the other React Native packages.
  transformIgnorePatterns: require('jest-expo/jest-preset').transformIgnorePatterns.map((pattern) =>
    pattern.replace('(?!(', '(?!(@shopify/flash-list|'),
  ),
  setupFilesAfterEnv: [
    '@shopify/flash-list/jestSetup',
    '<rootDir>/src/test-setup.ts',
    '<rootDir>/src/testing/vector-icons-mock.tsx',
  ],
  transform: { '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }] },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
  },
  coverageDirectory: '../../../../coverage/libs/mobile/shared/ui',
};
