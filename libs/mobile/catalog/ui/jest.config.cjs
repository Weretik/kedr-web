/// <reference types="jest" />
/// <reference types="node" />
const root = '<rootDir>/../../../..';

module.exports = {
  displayName: 'mobile-catalog-ui',
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  setupFilesAfterEnv: [
    '<rootDir>/src/test-setup.ts',
    '<rootDir>/../../shared/ui/src/testing/unistyles-mock.ts',
    '<rootDir>/../../shared/ui/src/testing/vector-icons-mock.tsx',
  ],
  moduleNameMapper: {
    '^@mobile/catalog/model$': '<rootDir>/../model/src/index.ts',
    '^@mobile/shared/model$': '<rootDir>/../../shared/model/src/index.ts',
    '^@mobile/shared/ui$': '<rootDir>/../../shared/ui/src/index.ts',
    '^@gorhom/bottom-sheet$': `${root}/node_modules/@gorhom/bottom-sheet/mock.js`,
  },
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  coverageDirectory: '../../../../coverage/libs/mobile/catalog/ui',
};
