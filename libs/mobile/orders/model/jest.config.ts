export default {
  displayName: 'mobile-orders-model',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  moduleNameMapper: {
    '^@mobile/shared/model$': '<rootDir>/../../shared/model/src/index.ts',
  },
  coverageDirectory: '../../../../coverage/libs/mobile/orders/model',
};
