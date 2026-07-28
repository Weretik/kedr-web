/// <reference types="jest" />
/// <reference types="node" />
module.exports = {
  displayName: 'shell',
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '^@mobile/core/connectivity$': '<rootDir>/../connectivity/src/index.ts',
    '^@mobile/shared/api-client$': '<rootDir>/../../shared/api-client/src/index.ts',
    '^@mobile/shared/config$': '<rootDir>/../../shared/config/src/index.ts',
    '^@react-native-community/netinfo$': '<rootDir>/src/test-mocks/netinfo.ts',
    '^@reduxjs/toolkit$': '<rootDir>/../../../../node_modules/@reduxjs/toolkit/dist/cjs/index.js',
    '^immer$': '<rootDir>/../../../../node_modules/immer/dist/cjs/index.js',
    '^react-native-paper$': '<rootDir>/src/test-mocks/react-native-paper.tsx',
    '^react-native-safe-area-context$':
      '<rootDir>/src/test-mocks/react-native-safe-area-context.tsx',
    '^@react-native-async-storage/async-storage$': '<rootDir>/src/test-mocks/async-storage.ts',
    '^expo-router/react-navigation$': '<rootDir>/src/test-mocks/expo-router-react-navigation.tsx',
    '^react-redux$': '<rootDir>/src/test-mocks/react-redux.tsx',
    '[.]svg$': '@nx/expo/plugins/jest/svg-mock',
  },
  transform: {
    '[.][jt]sx?$': [
      'babel-jest',
      {
        configFile: __dirname + '/.babelrc.js',
      },
    ],
    '^.+[.](bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp|ttf|otf|m4v|mov|mp4|mpeg|mpg|webm|aac|aiff|caf|m4a|mp3|wav|html|pdf|obj)$':
      require.resolve('jest-expo/src/preset/assetFileTransformer.js'),
  },
  coverageDirectory: '../../../../coverage/libs/mobile/core/shell',
};
