import { describe, expect, it } from 'vitest';

import { cartViewProps } from './cart-view-props';
import { SERVER_CART_SNAPSHOT } from '../state/cart-client-store';

import type { CartSnapshot } from '../state/cart-client-store';

function snapshotWithSlug(slug: string): CartSnapshot {
  return {
    ...SERVER_CART_SNAPSHOT,
    hydrated: true,
    lines: [
      {
        variantId: '7',
        quantity: 2,
        snapshot: { title: 'Дверна ручка', slug, unitPrice: 245.5, currency: 'UAH' },
      },
    ],
  };
}

describe('cartViewProps product destinations', () => {
  it.each(['uk', 'ru'] as const)(
    'uses the canonical encoded product path in %s without mutating the owner',
    (locale) => {
      const source = snapshotWithSlug('ручка-7');

      const view = cartViewProps(locale, source, null);

      expect(view.lines[0].productHref).toBe(`/${locale}/product/%D1%80%D1%83%D1%87%D0%BA%D0%B0-7`);
      expect(view.lines[0]).toMatchObject(source.lines[0]);
      expect(view.lines[0]).not.toBe(source.lines[0]);
      expect(source.lines[0]).not.toHaveProperty('productHref');
    },
  );

  it.each([
    '',
    '.',
    '..',
    'two words',
    'bad/path',
    'bad\\path',
    'bad?query',
    'bad#hash',
    'bad%encoded',
  ])('keeps the row but omits the destination for invalid slug %j', (slug) => {
    const source = snapshotWithSlug(slug);

    const view = cartViewProps('uk', source, null);

    expect(view.lines).toHaveLength(1);
    expect(view.lines[0]).toEqual({ ...source.lines[0], productHref: null });
    expect(source.lines[0].snapshot.slug).toBe(slug);
    expect(source.lines[0]).not.toHaveProperty('productHref');
  });
});
