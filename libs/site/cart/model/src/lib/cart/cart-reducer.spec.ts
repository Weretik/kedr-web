import { describe, expect, it } from 'vitest';

import { addCartLine, changeCartQuantity, removeCartLine } from './cart-reducer';

import type { CartLine, CartPurchaseInput } from './cart-types';

const purchase: CartPurchaseInput = {
  productId: '123',
  title: 'Ручка',
  unitPrice: 425,
  currency: 'UAH',
  slug: 'ruchka',
  imageUrl: '/handle.jpg',
  available: true,
};
const line: CartLine = {
  variantId: '123',
  quantity: 2,
  snapshot: {
    title: 'Старе ім’я',
    unitPrice: 400,
    currency: 'UAH',
    slug: '',
    imageUrl: '/old.jpg',
  },
};

describe('cart changes', () => {
  it('adds a valid product to an empty basket', () => {
    expect(addCartLine([], purchase)).toEqual({
      ok: true,
      lines: [
        {
          variantId: '123',
          quantity: 1,
          snapshot: {
            title: 'Ручка',
            unitPrice: 425,
            currency: 'UAH',
            slug: 'ruchka',
            imageUrl: '/handle.jpg',
          },
        },
      ],
    });
  });
  it('merges quantities and retains the whole existing snapshot without mutation', () => {
    const previous = structuredClone(line);
    const result = addCartLine([line], purchase, 3);
    expect(result).toEqual({ ok: true, lines: [{ ...line, quantity: 5 }] });
    expect(line).toEqual(previous);
  });
  it.each([null, 0, -1, Number.NaN, Infinity])('refuses price %s', (unitPrice) => {
    expect(addCartLine([line], { ...purchase, unitPrice })).toEqual({
      ok: false,
      reason: 'invalid-price',
    });
  });
  it('refuses unavailable products without changing the basket', () => {
    expect(addCartLine([line], { ...purchase, available: false })).toEqual({
      ok: false,
      reason: 'unavailable',
    });
    expect(line.quantity).toBe(2);
  });
  it.each([0, -1, 1.5, 1001, Number.NaN, Infinity])(
    'refuses invalid addition quantity %s',
    (quantity) => {
      expect(addCartLine([], purchase, quantity)).toEqual({
        ok: false,
        reason: 'invalid-quantity',
      });
    },
  );
  it('rejects merge overflow rather than clamping', () => {
    expect(addCartLine([{ ...line, quantity: 999 }], purchase, 2)).toEqual({
      ok: false,
      reason: 'quantity-overflow',
    });
  });
  it('accepts quantity 1000 and keeps deletion explicit', () => {
    expect(changeCartQuantity([line], '123', 1000)).toEqual({
      ok: true,
      lines: [{ ...line, quantity: 1000 }],
    });
    expect(changeCartQuantity([line], '123', 0)).toEqual({ ok: false, reason: 'invalid-quantity' });
    expect(removeCartLine([line], '123')).toEqual([]);
  });
  it('reports a missing row', () => {
    expect(changeCartQuantity([line], 'missing', 3)).toEqual({ ok: false, reason: 'not-found' });
  });
  it('removes unsafe optional navigation data without creating an unsafe link', () => {
    const result = addCartLine([], {
      ...purchase,
      slug: '../checkout',
      imageUrl: 'javascript:alert(1)',
    });
    expect(result).toMatchObject({ ok: true, lines: [{ snapshot: { slug: '' } }] });
    if (result.ok) expect(result.lines[0].snapshot).not.toHaveProperty('imageUrl');
  });
});
