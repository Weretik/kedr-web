import { CartProvider } from './index';

describe('mobile cart feature boundary', () => {
  it('exposes the cart provider to the application layer', () => {
    expect(CartProvider).toEqual(expect.any(Function));
  });
});
