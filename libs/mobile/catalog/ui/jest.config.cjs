module.exports = {
  displayName: 'mobile-catalog-ui',
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@mobile/catalog/model$': '<rootDir>/../model/src/index.ts',
    '^@shopify/flash-list$': '<rootDir>/src/test-mocks/flash-list.tsx',
    '^expo-image$': '<rootDir>/src/test-mocks/expo-image.tsx',
    '^react-native-reanimated-carousel$': '<rootDir>/src/test-mocks/reanimated-carousel.tsx',
    '^react-native-reanimated$': '<rootDir>/src/test-mocks/react-native-reanimated.ts',
    '^@react-native-assets/slider$': '<rootDir>/src/test-mocks/react-native-assets-slider.tsx',
    '^react-native-actions-sheet$': '<rootDir>/src/test-mocks/react-native-actions-sheet.tsx',
    '^react-native-tree-multi-select$':
      '<rootDir>/src/test-mocks/react-native-tree-multi-select.tsx',
    '^react-native-paper$': '<rootDir>/../../core/shell/src/test-mocks/react-native-paper.tsx',
    '^react-native-safe-area-context$':
      '<rootDir>/../../core/shell/src/test-mocks/react-native-safe-area-context.tsx',
  },
  coverageDirectory: '../../../../coverage/libs/mobile/catalog/ui',
};
