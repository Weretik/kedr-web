module.exports = {
  displayName: 'mobile',
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '^@reduxjs/toolkit$': '<rootDir>/../../node_modules/@reduxjs/toolkit/dist/cjs/index.js',
    '^@mobile/core/connectivity$': '<rootDir>/../../libs/mobile/core/connectivity/src/index.ts',
    '^@mobile/core/shell$': '<rootDir>/../../libs/mobile/core/shell/src/index.ts',
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
    '^react-redux$': '<rootDir>/../../libs/mobile/core/shell/src/test-mocks/react-redux.tsx',
    '^react$': '<rootDir>/../../node_modules/react/index.js',
    '^react/jsx-runtime$': '<rootDir>/../../node_modules/react/jsx-runtime.js',
    '[.]svg$': '@nx/expo/plugins/jest/svg-mock',
  },
  coverageDirectory: '../../coverage/apps/mobile',
};
