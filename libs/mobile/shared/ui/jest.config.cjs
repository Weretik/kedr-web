module.exports = {
  displayName: 'mobile-shared-ui',
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '<rootDir>/src/test-setup.ts',
    '<rootDir>/src/testing/vector-icons-mock.tsx',
  ],
  transform: { '[.][jt]sx?$': ['babel-jest', { configFile: __dirname + '/.babelrc.js' }] },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@gorhom/bottom-sheet$': '<rootDir>/../../../../node_modules/@gorhom/bottom-sheet/mock.js',
  },
  coverageDirectory: '../../../../coverage/libs/mobile/shared/ui',
};
