module.exports = {
  displayName: 'mobile-catalog-feature',
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@mobile/catalog/data-access$': '<rootDir>/../data-access/src/index.ts',
    '^@mobile/catalog/model$': '<rootDir>/../model/src/index.ts',
    '^@mobile/catalog/ui$': '<rootDir>/../ui/src/index.ts',
    '^@mobile/core/shell$': '<rootDir>/../../core/shell/src/index.ts',
    '^@shopify/flash-list$': '<rootDir>/../ui/src/test-mocks/flash-list.tsx',
    '^react-native-actions-sheet$': '<rootDir>/../ui/src/test-mocks/react-native-actions-sheet.tsx',
    '^react-native-tree-multi-select$':
      '<rootDir>/../ui/src/test-mocks/react-native-tree-multi-select.tsx',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/../../core/shell/src/test-mocks/async-storage.ts',
    '^react-native-paper$': '<rootDir>/../../core/shell/src/test-mocks/react-native-paper.tsx',
    '^react-native-safe-area-context$':
      '<rootDir>/../../core/shell/src/test-mocks/react-native-safe-area-context.tsx',
  },
  coverageDirectory: '../../../../coverage/libs/mobile/catalog/feature',
};
