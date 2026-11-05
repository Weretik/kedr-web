/// <reference types="jest" />
/// <reference types="node" />
const root = '<rootDir>/../../../..';

module.exports = {
  displayName: 'shell',
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  setupFilesAfterEnv: [
    '<rootDir>/src/test-setup.ts',
    '<rootDir>/../../shared/ui/src/testing/unistyles-mock.ts',
    '<rootDir>/../../shared/ui/src/testing/vector-icons-mock.tsx',
  ],
  moduleNameMapper: {
    '^@mobile/core/connectivity$': '<rootDir>/../connectivity/src/index.ts',
    '^@mobile/shared/ui$': '<rootDir>/../../shared/ui/src/index.ts',
    '^@gorhom/bottom-sheet$': `${root}/node_modules/@gorhom/bottom-sheet/mock.js`,
    '^@react-native-async-storage/async-storage$': `${root}/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock.js`,
    '^@react-native-community/netinfo$': '<rootDir>/src/test-mocks/netinfo.ts',
  },
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  coverageDirectory: '../../../../coverage/libs/mobile/core/shell',
};
