import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CartPurchaseController } from './cart-purchase-controller';
import { CartHeaderAction } from '../cart/cart-header-action';
import { CartProvider } from '../runtime/cart-provider';
import { createCartClientStore } from '../state/cart-client-store';
import { createCartStorage } from '../storage/cart-storage';

const { getBrowserCartStore } = vi.hoisted(() => ({ getBrowserCartStore: vi.fn() }));
vi.mock('../state/browser-cart-store', () => ({ getBrowserCartStore }));

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('CartPurchaseController add feedback', () => {
  it('clears the previous success and its timer when the next add is rejected', () => {
    vi.useFakeTimers();
    const browserStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    const store = createCartClientStore(createCartStorage(() => browserStorage));
    getBrowserCartStore.mockReturnValue(store);
    const submitOrderAction = vi.fn(async () => ({ kind: 'uncertain' as const, messages: [] }));
    render(
      <CartProvider submitOrderAction={submitOrderAction}>
        <CartHeaderAction locale="uk" />
        <CartPurchaseController
          locale="uk"
          input={{
            productId: '101',
            title: 'Ручка Kedr',
            unitPrice: 125,
            currency: 'UAH',
            slug: 'ruchka-kedr',
            available: true,
          }}
        />
      </CartProvider>,
    );

    const quantity = screen.getByRole('spinbutton', { name: 'Кількість' }) as HTMLInputElement;
    fireEvent.change(quantity, { target: { value: '1000' } });
    fireEvent.click(screen.getByRole('button', { name: 'У кошик' }));
    const successButton = screen.getByRole('button', { name: 'Додано' });
    const countBeforeRejection = screen
      .getByRole('button', { name: /^Кошик:/ })
      .getAttribute('aria-label');
    expect(store.getSnapshot().lines[0].quantity).toBe(1000);
    expect(browserStorage.setItem).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(1);

    fireEvent.click(successButton);

    expect(store.getSnapshot().notice).toBe('quantity-overflow');
    expect(screen.queryByRole('button', { name: 'Додано' })).toBeNull();
    expect(screen.getByRole('button', { name: 'У кошик' })).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe(
      'Для одного товару можна замовити не більше 1000 одиниць.',
    );
    expect(quantity.value).toBe('1000');
    expect(store.getSnapshot().lines).toHaveLength(1);
    expect(store.getSnapshot().lines[0].quantity).toBe(1000);
    expect(screen.getByRole('button', { name: /^Кошик:/ }).getAttribute('aria-label')).toBe(
      countBeforeRejection,
    );
    expect(browserStorage.setItem).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByRole('button', { name: 'У кошик' })).toBeTruthy();
    expect(submitOrderAction).not.toHaveBeenCalled();
  });
});
