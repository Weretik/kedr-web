module.exports = {
  displayName: 'mobile-orders-feature',
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: { '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }] },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@reduxjs/toolkit$': '<rootDir>/../../../../node_modules/@reduxjs/toolkit/dist/cjs/index.js',
    '^immer$': '<rootDir>/../../../../node_modules/immer/dist/cjs/index.js',
    '^@mobile/orders/data-access$': '<rootDir>/../data-access/src/index.ts',
    '^@mobile/orders/model$': '<rootDir>/../model/src/index.ts',
    '^@mobile/orders/ui$': '<rootDir>/../ui/src/index.ts',
    '^@mobile/customers/data-access$': '<rootDir>/../../customers/data-access/src/index.ts',
    '^@mobile/customers/model$': '<rootDir>/../../customers/model/src/index.ts',
    '^@mobile/customers/ui$': '<rootDir>/../../customers/ui/src/index.ts',
    '^@mobile/shared/api-client$': '<rootDir>/../../shared/api-client/src/index.ts',
    '^@shopify/flash-list$': '<rootDir>/../../catalog/ui/src/test-mocks/flash-list.tsx',
    '^react-native-actions-sheet$':
      '<rootDir>/../../catalog/ui/src/test-mocks/react-native-actions-sheet.tsx',
    '^react-native-paper$': '<rootDir>/../../core/shell/src/test-mocks/react-native-paper.tsx',
    '^react-redux$': '<rootDir>/../../core/shell/src/test-mocks/react-redux.tsx',
  },
  coverageDirectory: '../../../../coverage/libs/mobile/orders/feature',
};
