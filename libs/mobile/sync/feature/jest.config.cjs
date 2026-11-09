/// <reference types="jest" />
/// <reference types="node" />
const root = '<rootDir>/../../../..';

module.exports = {
  displayName: 'mobile-sync-feature',
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  setupFilesAfterEnv: [
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
    '^@gorhom/bottom-sheet$': `${root}/node_modules/@gorhom/bottom-sheet/mock.js`,
  },
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  coverageDirectory: '../../../../coverage/libs/mobile/sync/feature',
};
