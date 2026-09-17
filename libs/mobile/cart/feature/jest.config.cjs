module.exports = {
  displayName: 'mobile-cart-feature',
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@reduxjs/toolkit$': '<rootDir>/../../../../node_modules/@reduxjs/toolkit/dist/cjs/index.js',
    '^immer$': '<rootDir>/../../../../node_modules/immer/dist/cjs/index.js',
    '^@mobile/core/connectivity$': '<rootDir>/../../core/connectivity/src/index.ts',
    '^@mobile/cart/data-access$': '<rootDir>/../data-access/src/index.ts',
    '^@mobile/cart/model$': '<rootDir>/../model/src/index.ts',
    '^@mobile/cart/ui$': '<rootDir>/../ui/src/index.ts',
    '^@mobile/orders/model$': '<rootDir>/../../orders/model/src/index.ts',
    '^@mobile/customers/data-access$': '<rootDir>/../../customers/data-access/src/index.ts',
    '^@mobile/customers/model$': '<rootDir>/../../customers/model/src/index.ts',
    '^@mobile/customers/ui$': '<rootDir>/../../customers/ui/src/index.ts',
    '^@mobile/shared/api-client$': '<rootDir>/../../shared/api-client/src/index.ts',
    '^@mobile/shared/config$': '<rootDir>/../../shared/config/src/index.ts',
    '^@mobile/core/shell$': '<rootDir>/../../core/shell/src/index.ts',
    '^@shopify/flash-list$': '<rootDir>/../../catalog/ui/src/test-mocks/flash-list.tsx',
    '^expo-image$': '<rootDir>/../../catalog/ui/src/test-mocks/expo-image.tsx',
    '^react-native-actions-sheet$':
      '<rootDir>/../../catalog/ui/src/test-mocks/react-native-actions-sheet.tsx',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/../../core/shell/src/test-mocks/async-storage.ts',
    '^@react-native-community/netinfo$': '<rootDir>/../../core/shell/src/test-mocks/netinfo.ts',
    '^react-native-paper$': '<rootDir>/../../core/shell/src/test-mocks/react-native-paper.tsx',
    '^react-redux$': '<rootDir>/../../core/shell/src/test-mocks/react-redux.tsx',
    '^react-native-safe-area-context$':
      '<rootDir>/../../core/shell/src/test-mocks/react-native-safe-area-context.tsx',
  },
  coverageDirectory: '../../../../coverage/libs/mobile/cart/feature',
};
