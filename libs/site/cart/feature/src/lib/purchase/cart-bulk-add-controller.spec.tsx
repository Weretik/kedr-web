import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderCartBulkAddAction } from './render-cart-purchase-action';
import { CartProvider } from '../runtime/cart-provider';
import { createCartClientStore } from '../state/cart-client-store';
import { createCartStorage } from '../storage/cart-storage';

const { getBrowserCartStore } = vi.hoisted(() => ({ getBrowserCartStore: vi.fn() }));
vi.mock('../state/browser-cart-store', () => ({ getBrowserCartStore }));

const row = (productId: string, details: string, available = true) => ({
  productId,
  title: `Завіса ${details}`,
  unitPrice: 65.7,
  currency: 'UAH' as const,
  slug: `zavisa-${productId}`,
  available,
  details,
  href: `/uk/product/zavisa?kolir=${productId}`,
  current: productId === '1',
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('cart bulk add', () => {
  it('adds the quantities of two variants with one press and opens the drawer', () => {
    const storage = { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() };
    const store = createCartClientStore(createCartStorage(() => storage));
    getBrowserCartStore.mockReturnValue(store);
    render(
      <CartProvider submitOrderAction={vi.fn()}>
        {renderCartBulkAddAction('uk', [
          row('1', 'Хром'),
          row('2', 'Золото'),
          row('3', 'Чорний', false),
        ])}
      </CartProvider>,
    );

    expect(screen.queryByRole('spinbutton', { name: 'Кількість: Завіса Чорний' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Додати вибране в кошик' }));
    expect(screen.getByRole('status').textContent).toBe(
      'Вкажіть кількість хоча б для одного варіанта.',
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Кількість: Завіса Хром' }), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Кількість: Завіса Золото' }), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Додати вибране в кошик' }));

    expect(store.getSnapshot().lines.map((line) => [line.variantId, line.quantity])).toEqual([
      ['1', 2],
      ['2', 5],
    ]);
    expect(store.getSnapshot().drawerOpen).toBe(true);
  });

  it('renders nothing for a model of one variant', () => {
    expect(renderCartBulkAddAction('uk', [row('1', 'Хром')])).toBeNull();
  });
});
