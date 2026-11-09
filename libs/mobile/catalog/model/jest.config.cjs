/// <reference types="jest" />
/// <reference types="node" />
module.exports = {
  displayName: 'mobile-catalog-model',
  preset: 'jest-expo',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  moduleNameMapper: {
    '^@mobile/shared/model$': '<rootDir>/../../shared/model/src/index.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  coverageDirectory: '../../../../coverage/libs/mobile/catalog/model',
};
