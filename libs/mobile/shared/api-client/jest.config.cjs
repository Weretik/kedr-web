module.exports = {
  displayName: 'mobile-shared-api-client',
  preset: 'jest-expo',
  // FlashList ships ES modules: transform it like the other React Native packages.
  transformIgnorePatterns: require('jest-expo/jest-preset').transformIgnorePatterns.map((pattern) =>
    pattern.replace('(?!(', '(?!(@shopify/flash-list|'),
  ),
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['@shopify/flash-list/jestSetup', '<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '^@mobile/shared/config$': '<rootDir>/../config/src/index.ts',
  },
  transform: {
    '[.][jt]sx?$': [
      'babel-jest',
      {
        configFile: __dirname + '/.babelrc.js',
      },
    ],
  },
  coverageDirectory: '../../../../coverage/libs/mobile/shared/api-client',
};
