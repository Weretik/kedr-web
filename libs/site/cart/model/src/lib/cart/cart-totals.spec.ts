import { describe, expect, it } from 'vitest';

import { getCartTotals } from './cart-totals';

import type { CartLine } from './cart-types';

function row(variantId: string, quantity: number, unitPrice: number): CartLine {
  return {
    variantId,
    quantity,
    snapshot: { title: variantId, unitPrice, currency: 'UAH', slug: '' },
  };
}

describe('cart totals', () => {
  it('counts units rather than positions and totals the saved prices', () => {
    expect(getCartTotals([row('a', 2, 425), row('b', 5, 186)])).toEqual({
      unitCount: 7,
      goodsSubtotal: 1780,
    });
  });
  it('does not add delivery or impose a minimum order amount', () => {
    expect(getCartTotals([row('a', 1, 0.01)])).toEqual({ unitCount: 1, goodsSubtotal: 0.01 });
  });
  it('retains decimal snapshots and supports the maximum quantity', () => {
    const rows = [row('a', 1000, 0.125), row('b', 3, 0.1)];
    expect(getCartTotals(rows).goodsSubtotal).toBeCloseTo(125.3);
    expect(rows[0].snapshot.unitPrice).toBe(0.125);
  });
  it('has a zero total for an empty basket', () => {
    expect(getCartTotals([])).toEqual({ unitCount: 0, goodsSubtotal: 0 });
  });
});
