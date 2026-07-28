module.exports = {
  displayName: 'mobile-shared-api-client',
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
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
