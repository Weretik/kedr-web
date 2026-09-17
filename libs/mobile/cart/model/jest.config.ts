export default {
  displayName: 'mobile-cart-model',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  moduleNameMapper: {
    '^@mobile/orders/model$': '<rootDir>/../../orders/model/src/index.ts',
  },
  coverageDirectory: '../../../../coverage/libs/mobile/cart/model',
};
