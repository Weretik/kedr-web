module.exports = {
  displayName: 'mobile-cart-ui',
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@reduxjs/toolkit$': '<rootDir>/../../../../node_modules/@reduxjs/toolkit/dist/cjs/index.js',
    '^immer$': '<rootDir>/../../../../node_modules/immer/dist/cjs/index.js',
    '^@mobile/cart/model$': '<rootDir>/../model/src/index.ts',
    '^@mobile/orders/model$': '<rootDir>/../../orders/model/src/index.ts',
    '^@shopify/flash-list$': '<rootDir>/../../catalog/ui/src/test-mocks/flash-list.tsx',
    '^expo-image$': '<rootDir>/../../catalog/ui/src/test-mocks/expo-image.tsx',
    '^react-native-actions-sheet$':
      '<rootDir>/../../catalog/ui/src/test-mocks/react-native-actions-sheet.tsx',
    '^react-native-paper$': '<rootDir>/../../core/shell/src/test-mocks/react-native-paper.tsx',
    '^react-native-safe-area-context$':
      '<rootDir>/../../core/shell/src/test-mocks/react-native-safe-area-context.tsx',
  },
  coverageDirectory: '../../../../coverage/libs/mobile/cart/ui',
};
