module.exports = {
  displayName: 'mobile-shared-ui',
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: { '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }] },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^react-native-paper$': '<rootDir>/../../core/shell/src/test-mocks/react-native-paper.tsx',
    '^react-native-actions-sheet$':
      '<rootDir>/../../core/shell/src/test-mocks/react-native-actions-sheet.tsx',
    '^react-native-safe-area-context$':
      '<rootDir>/../../core/shell/src/test-mocks/react-native-safe-area-context.tsx',
  },
  coverageDirectory: '../../../../coverage/libs/mobile/shared/ui',
};
