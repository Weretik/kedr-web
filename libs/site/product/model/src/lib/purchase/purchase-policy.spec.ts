import { getProductPurchaseMode, isValidProductQuantity } from './purchase-policy';

describe('product purchase policy', () => {
  it('prioritizes missing stock over the independently unknown price', () => {
    expect(getProductPurchaseMode({ inStock: false, price: null })).toBe('request-stock');
  });

  it('accepts a positive count independently of an informational pack size', () => {
    expect(isValidProductQuantity(2)).toBe(true);
  });

  it.each([
    [{ inStock: true, price: 245.5 }, 'cart'],
    [{ inStock: true, price: null }, 'request-price'],
    [{ inStock: false, price: 245.5 }, 'request-stock'],
    [{ inStock: false, price: null }, 'request-stock'],
  ] as const)('selects the action for independent price/stock facts %o', (product, mode) => {
    expect(getProductPurchaseMode(product)).toBe(mode);
  });

  it.each([
    0,
    -1,
    0.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    '2',
    null,
    undefined,
    Number.MAX_SAFE_INTEGER + 1,
  ])('rejects an invalid count %s', (value) => {
    expect(isValidProductQuantity(value)).toBe(false);
  });

  it('does not invent a maximum of 99 or require a full pack', () => {
    expect(isValidProductQuantity(101)).toBe(true);
    expect(isValidProductQuantity(2)).toBe(true);
  });
});
