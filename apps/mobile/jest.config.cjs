const libs = '<rootDir>/../../libs';
const modules = '<rootDir>/../../node_modules';

module.exports = {
  displayName: 'mobile',
  preset: 'jest-expo',
  // FlashList ships ES modules: transform it like the other React Native packages.
  transformIgnorePatterns: require('jest-expo/jest-preset').transformIgnorePatterns.map((pattern) =>
    pattern.replace('(?!(', '(?!(@shopify/flash-list|'),
  ),
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  setupFilesAfterEnv: [
    '@shopify/flash-list/jestSetup',
    '<rootDir>/src/test-setup.ts',
    '<rootDir>/../../libs/mobile/shared/ui/src/testing/vector-icons-mock.tsx',
  ],
  moduleNameMapper: {
    '^@mobile/calculation/feature$': `${libs}/mobile/calculation/feature/src/index.ts`,
    '^@mobile/profile/feature$': `${libs}/mobile/profile/feature/src/index.ts`,
    '^@mobile/orders/feature$': `${libs}/mobile/orders/feature/src/index.ts`,
    '^@mobile/catalog/feature$': `${libs}/mobile/catalog/feature/src/index.ts`,
    '^@mobile/core/auth$': `${libs}/mobile/core/auth/src/index.ts`,
    '^@mobile/core/connectivity$': `${libs}/mobile/core/connectivity/src/index.ts`,
    '^@mobile/core/local-db$': `${libs}/mobile/core/local-db/src/index.ts`,
    '^@mobile/core/shell$': `${libs}/mobile/core/shell/src/index.ts`,
    '^@mobile/customers/data-access$': `${libs}/mobile/customers/data-access/src/index.ts`,
    '^@mobile/customers/feature$': `${libs}/mobile/customers/feature/src/index.ts`,
    '^@mobile/customers/model$': `${libs}/mobile/customers/model/src/index.ts`,
    '^@mobile/customers/ui$': `${libs}/mobile/customers/ui/src/index.ts`,
    '^@mobile/sync/feature$': `${libs}/mobile/sync/feature/src/index.ts`,
    '^@mobile/shared/api-client$': `${libs}/mobile/shared/api-client/src/index.ts`,
    '^@mobile/shared/config$': `${libs}/mobile/shared/config/src/index.ts`,
    '^@mobile/shared/model$': `${libs}/mobile/shared/model/src/index.ts`,
    '^@mobile/shared/ui$': `${libs}/mobile/shared/ui/src/index.ts`,
    '^@gorhom/bottom-sheet$': `${modules}/@gorhom/bottom-sheet/mock.js`,
    '^@react-native-async-storage/async-storage$': `${modules}/@react-native-async-storage/async-storage/jest/async-storage-mock.js`,
    '^@react-native-community/netinfo$': `${libs}/mobile/core/shell/src/test-mocks/netinfo.ts`,
    '^react$': `${modules}/react/index.js`,
    '^react/jsx-runtime$': `${modules}/react/jsx-runtime.js`,
    '[.]svg$': '@nx/expo/plugins/jest/svg-mock',
  },
  coverageDirectory: '../../coverage/apps/mobile',
};
