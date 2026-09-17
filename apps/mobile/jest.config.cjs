module.exports = {
  displayName: 'mobile',
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '^@reduxjs/toolkit$': '<rootDir>/../../node_modules/@reduxjs/toolkit/dist/cjs/index.js',
    '^@mobile/core/connectivity$': '<rootDir>/../../libs/mobile/core/connectivity/src/index.ts',
    '^@mobile/core/shell$': '<rootDir>/../../libs/mobile/core/shell/src/index.ts',
    '^@mobile/catalog/feature$': '<rootDir>/../../libs/mobile/catalog/feature/src/index.ts',
    '^@mobile/cart/data-access$': '<rootDir>/../../libs/mobile/cart/data-access/src/index.ts',
    '^@mobile/cart/feature$': '<rootDir>/../../libs/mobile/cart/feature/src/index.ts',
    '^@mobile/cart/model$': '<rootDir>/../../libs/mobile/cart/model/src/index.ts',
    '^@mobile/cart/ui$': '<rootDir>/../../libs/mobile/cart/ui/src/index.ts',
    '^@mobile/orders/feature$': '<rootDir>/../../libs/mobile/orders/feature/src/index.ts',
    '^@mobile/orders/data-access$': '<rootDir>/../../libs/mobile/orders/data-access/src/index.ts',
    '^@mobile/orders/model$': '<rootDir>/../../libs/mobile/orders/model/src/index.ts',
    '^@mobile/orders/ui$': '<rootDir>/../../libs/mobile/orders/ui/src/index.ts',
    '^@mobile/customers/data-access$': '<rootDir>/../../libs/mobile/customers/data-access/src/index.ts',
    '^@mobile/customers/model$': '<rootDir>/../../libs/mobile/customers/model/src/index.ts',
    '^@mobile/customers/ui$': '<rootDir>/../../libs/mobile/customers/ui/src/index.ts',
    '^@mobile/shared/api-client$': '<rootDir>/../../libs/mobile/shared/api-client/src/index.ts',
    '^@mobile/shared/config$': '<rootDir>/../../libs/mobile/shared/config/src/index.ts',
    '^@react-native-community/netinfo$':
      '<rootDir>/../../libs/mobile/core/shell/src/test-mocks/netinfo.ts',
    '^immer$': '<rootDir>/../../node_modules/immer/dist/cjs/index.js',
    '^react-native-paper$':
      '<rootDir>/../../libs/mobile/core/shell/src/test-mocks/react-native-paper.tsx',
    '^react-native-safe-area-context$':
      '<rootDir>/../../libs/mobile/core/shell/src/test-mocks/react-native-safe-area-context.tsx',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/../../libs/mobile/core/shell/src/test-mocks/async-storage.ts',
    '^expo-router/react-navigation$':
      '<rootDir>/../../libs/mobile/core/shell/src/test-mocks/expo-router-react-navigation.tsx',
    '^expo-blur$': '<rootDir>/src/test-mocks/expo-blur.tsx',
    '^expo-image$': '<rootDir>/../../libs/mobile/catalog/ui/src/test-mocks/expo-image.tsx',
    '^@shopify/flash-list$': '<rootDir>/../../libs/mobile/catalog/ui/src/test-mocks/flash-list.tsx',
    '^react-native-actions-sheet$':
      '<rootDir>/../../libs/mobile/catalog/ui/src/test-mocks/react-native-actions-sheet.tsx',
    '^react-redux$': '<rootDir>/../../libs/mobile/core/shell/src/test-mocks/react-redux.tsx',
    '^react$': '<rootDir>/../../node_modules/react/index.js',
    '^react/jsx-runtime$': '<rootDir>/../../node_modules/react/jsx-runtime.js',
    '[.]svg$': '@nx/expo/plugins/jest/svg-mock',
  },
  coverageDirectory: '../../coverage/apps/mobile',
};
