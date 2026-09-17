module.exports = {
  displayName: 'mobile-orders-ui',
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: { '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }] },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@reduxjs/toolkit$': '<rootDir>/../../../../node_modules/@reduxjs/toolkit/dist/cjs/index.js',
    '^immer$': '<rootDir>/../../../../node_modules/immer/dist/cjs/index.js',
    '^@mobile/orders/model$': '<rootDir>/../model/src/index.ts',
    '^@shopify/flash-list$': '<rootDir>/../../catalog/ui/src/test-mocks/flash-list.tsx',
    '^react-native-paper$': '<rootDir>/../../core/shell/src/test-mocks/react-native-paper.tsx',
  },
  coverageDirectory: '../../../../coverage/libs/mobile/orders/ui',
};
