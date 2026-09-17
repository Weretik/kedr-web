module.exports = {
  displayName: 'mobile-customers-ui',
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@mobile/customers/model$': '<rootDir>/../model/src/index.ts',
    '^@shopify/flash-list$': '<rootDir>/../../catalog/ui/src/test-mocks/flash-list.tsx',
    '^react-native-actions-sheet$':
      '<rootDir>/../../catalog/ui/src/test-mocks/react-native-actions-sheet.tsx',
    '^react-native-paper$': '<rootDir>/../../core/shell/src/test-mocks/react-native-paper.tsx',
    '^react-native-safe-area-context$':
      '<rootDir>/../../core/shell/src/test-mocks/react-native-safe-area-context.tsx',
  },
  coverageDirectory: '../../../../coverage/libs/mobile/customers/ui',
};
