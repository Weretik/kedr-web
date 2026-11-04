import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CartLine } from './cart-line';

import type { CartLineView } from '../types/cart-ui-props';

const line: CartLineView = {
  variantId: '7',
  quantity: 2,
  productHref: '/opaque-destination?item=42',
  snapshot: { title: 'Дверна ручка', slug: 'ignored-slug', unitPrice: 245.5, currency: 'UAH' },
};

describe('CartLine product destination', () => {
  it.each(['uk', 'ru'] as const)(
    'renders the provided opaque href without deriving a route in %s',
    (locale) => {
      render(
        <CartLine
          locale={locale}
          line={line}
          disabled={false}
          onChangeQuantity={vi.fn()}
          onRemove={vi.fn()}
        />,
      );

      expect(screen.getByRole('link', { name: line.snapshot.title }).getAttribute('href')).toBe(
        '/opaque-destination?item=42',
      );
    },
  );

  it('keeps the product title and quantity usable when no destination is available', () => {
    render(
      <CartLine
        locale="uk"
        line={{ ...line, productHref: null }}
        disabled={false}
        onChangeQuantity={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: line.snapshot.title })).toBeTruthy();
    expect(screen.queryByRole('link', { name: line.snapshot.title })).toBeNull();
    expect(
      (
        screen.getByRole('spinbutton', {
          name: `Кількість: ${line.snapshot.title}`,
        }) as HTMLInputElement
      ).value,
    ).toBe('2');
  });
});
