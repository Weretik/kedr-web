import { describe, expect, it } from 'vitest';

import { isCartQuantity } from './quantity';

describe('cart quantity', () => {
  it.each([1, 99, 1000])('accepts permitted integer %s', (value) => {
    expect(isCartQuantity(value)).toBe(true);
  });
  it.each([0, -1, 1.5, 1001, Number.NaN, Infinity, -Infinity, '2', null, undefined])(
    'rejects %s without rounding or coercion',
    (value) => {
      expect(isCartQuantity(value)).toBe(false);
    },
  );
});
