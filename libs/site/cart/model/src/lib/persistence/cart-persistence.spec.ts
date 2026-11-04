import { describe, expect, it } from 'vitest';

import { CART_STORAGE_KEY, decodeCartStorage, serializeCartStorage } from './cart-persistence';

import type { CartLine } from '../cart/cart-types';

const line: CartLine = {
  variantId: '123',
  quantity: 2,
  snapshot: {
    title: 'Ручка',
    unitPrice: 425.25,
    currency: 'UAH',
    slug: '',
    imageUrl: 'https://cdn.example.com/a.jpg',
  },
};
const raw = (lines: unknown[]) => JSON.stringify({ lines });

describe('legacy cart persistence', () => {
  it('keeps the legacy storage key and restores exact accepted snapshots', () => {
    expect(CART_STORAGE_KEY).toBe('cart_v1');
    expect(decodeCartStorage(raw([line]))).toEqual({
      kind: 'ready',
      lines: [line],
      discardedCount: 0,
    });
    expect(serializeCartStorage([line])).toEqual({ ok: true, value: raw([line]) });
  });
  it.each([null, '{"lines":[]}'])('knows an absent or valid empty basket %s', (value) => {
    expect(decodeCartStorage(value)).toEqual({ kind: 'ready', lines: [], discardedCount: 0 });
  });
  it.each(['{broken', 'null', '[]', '42', '{}', '{"lines":null}'])(
    'requires explicit recovery for %s',
    (value) => {
      expect(decodeCartStorage(value)).toEqual({
        kind: 'recovery-required',
        lines: [],
        discardedCount: null,
      });
    },
  );
  it('retains valid rows but counts rejected source rows without rewriting values', () => {
    const source = raw([
      line,
      { ...line, variantId: 'bad-price', snapshot: { ...line.snapshot, unitPrice: 0 } },
      { ...line, variantId: 'fraction', quantity: 1.5 },
    ]);
    expect(decodeCartStorage(source)).toEqual({
      kind: 'recovery-required',
      lines: [line],
      discardedCount: 2,
    });
    expect(JSON.parse(source).lines[1].snapshot.unitPrice).toBe(0);
  });
  it.each([0, -1, 1001, 1.5, '2', null])('does not repair legacy quantity %s', (quantity) => {
    expect(decodeCartStorage(raw([{ ...line, quantity }]))).toMatchObject({
      kind: 'recovery-required',
      lines: [],
      discardedCount: 1,
    });
  });
  it.each([0, -1, '425', null])(
    'does not turn legacy price %s into a free or coerced item',
    (unitPrice) => {
      expect(
        decodeCartStorage(raw([{ ...line, snapshot: { ...line.snapshot, unitPrice } }])),
      ).toMatchObject({ kind: 'recovery-required', lines: [], discardedCount: 1 });
    },
  );
  it('merges duplicates while retaining the first existing snapshot', () => {
    const next = {
      ...line,
      quantity: 3,
      snapshot: { ...line.snapshot, title: 'Нове', unitPrice: 600 },
    };
    expect(decodeCartStorage(raw([line, next]))).toEqual({
      kind: 'ready',
      lines: [{ ...line, quantity: 5 }],
      discardedCount: 0,
    });
  });
  it('rejects the entire overflowing duplicate group without discarding other valid groups', () => {
    const other = { ...line, variantId: 'other', quantity: 1 };
    expect(
      decodeCartStorage(raw([{ ...line, quantity: 600 }, { ...line, quantity: 500 }, other])),
    ).toEqual({ kind: 'recovery-required', lines: [other], discardedCount: 2 });
  });
  it('accepts empty or missing navigation slugs but removes executable images/paths', () => {
    const unsafe = {
      ...line,
      snapshot: { ...line.snapshot, slug: '../checkout', imageUrl: 'javascript:alert(1)' },
    };
    const noSlug = {
      ...line,
      variantId: 'no-slug',
      snapshot: { title: 'Назва', unitPrice: 1, currency: 'UAH' },
    };
    const result = decodeCartStorage(raw([unsafe, noSlug]));
    expect(result).toMatchObject({
      kind: 'ready',
      lines: [{ snapshot: { slug: '' } }, { snapshot: { slug: '' } }],
    });
    expect(result.lines[0].snapshot).not.toHaveProperty('imageUrl');
  });
  it('persists only basket fields even if callers attach contacts or receipts', () => {
    const enriched = {
      ...line,
      firstName: 'Secret',
      phone: 'Secret',
      orderId: 'Secret',
      snapshot: { ...line.snapshot, email: 'Secret' },
    };
    const result = serializeCartStorage([enriched]);
    expect(result).toEqual({ ok: true, value: raw([line]) });
    if (result.ok) expect(result.value).not.toContain('Secret');
  });
  it('refuses invalid or duplicate state on write rather than fixing it silently', () => {
    expect(serializeCartStorage([{ ...line, quantity: 1.5 }])).toEqual({
      ok: false,
      reason: 'invalid-data',
    });
    expect(serializeCartStorage([line, line])).toEqual({ ok: false, reason: 'invalid-data' });
  });
});
