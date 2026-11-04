import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderCartQuickAddAction } from './render-cart-purchase-action';
import { CartProvider } from '../runtime/cart-provider';
import { createCartClientStore } from '../state/cart-client-store';
import { createCartStorage } from '../storage/cart-storage';

const { getBrowserCartStore } = vi.hoisted(() => ({ getBrowserCartStore: vi.fn() }));
vi.mock('../state/browser-cart-store', () => ({ getBrowserCartStore }));

const input = {
  productId: '101',
  title: 'Ручка Kedr',
  unitPrice: 125,
  currency: 'UAH' as const,
  slug: 'ruchka-kedr',
  available: true,
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('cart quick add', () => {
  it('adds one unit and opens the cart drawer', () => {
    const storage = { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() };
    const store = createCartClientStore(createCartStorage(() => storage));
    getBrowserCartStore.mockReturnValue(store);
    render(
      <CartProvider submitOrderAction={vi.fn()}>
        {renderCartQuickAddAction('uk', input)}
      </CartProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'У кошик: Ручка Kedr' }));

    expect(store.getSnapshot().lines[0]?.quantity).toBe(1);
    expect(store.getSnapshot().drawerOpen).toBe(true);
  });

  it('renders nothing for a product without a price or stock', () => {
    expect(renderCartQuickAddAction('uk', { ...input, unitPrice: null })).toBeNull();
    expect(renderCartQuickAddAction('uk', { ...input, available: false })).toBeNull();
  });
});
