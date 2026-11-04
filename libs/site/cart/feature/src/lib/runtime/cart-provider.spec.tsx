import { act, cleanup, render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CartProvider, useCart } from './cart-provider';
import {
  createCartClientStore,
  type CartClientStore,
  type SubmitOrderAction,
} from '../state/cart-client-store';
import { createCartStorage } from '../storage/cart-storage';

import type { CheckoutResult } from '@site/cart/model';

const bridge = vi.hoisted(() => ({ store: null as CartClientStore | null }));
vi.mock('../state/browser-cart-store', () => ({ getBrowserCartStore: () => bridge.store }));

function setup() {
  let raw = JSON.stringify({
    lines: [
      {
        variantId: '101',
        quantity: 2,
        snapshot: {
          title: 'Ручка',
          unitPrice: 425,
          currency: 'UAH',
          slug: '',
        },
      },
    ],
  });
  const backend = {
    getItem: vi.fn(() => raw),
    setItem: vi.fn((_key: string, value: string) => {
      raw = value;
    }),
    removeItem: vi.fn(() => {
      raw = '';
    }),
  };
  const store = createCartClientStore(createCartStorage(() => backend));
  bridge.store = store;
  return { store, backend, readRaw: () => raw };
}

function Consumer({ name }: { name: string }) {
  const { snapshot } = useCart();
  return (
    <output data-testid={name}>
      {JSON.stringify({
        hydrated: snapshot.hydrated,
        quantity: snapshot.lines[0]?.quantity ?? 0,
        name: snapshot.draft.firstName,
        phone: snapshot.draft.phone,
        pending: snapshot.pending,
      })}
    </output>
  );
}
function current(name = 'first') {
  return JSON.parse(screen.getByTestId(name).textContent ?? '{}');
}
function children() {
  return (
    <>
      <Consumer name="first" />
      <Consumer name="second" />
    </>
  );
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
beforeEach(() => {
  bridge.store = null;
});
afterEach(() => {
  cleanup();
  bridge.store = null;
  vi.clearAllMocks();
});

describe('cart provider document lifetime', () => {
  it('provides a neutral snapshot without a provider instead of throwing', () => {
    render(<Consumer name="first" />);
    expect(current()).toEqual({
      hydrated: false,
      quantity: 0,
      name: '',
      phone: '',
      pending: false,
    });
  });

  it('initializes once in StrictMode and keeps two consumers subscribed to one owner', () => {
    const { store, backend } = setup();
    const action = vi.fn<SubmitOrderAction>();
    render(
      <StrictMode>
        <CartProvider submitOrderAction={action}>{children()}</CartProvider>
      </StrictMode>,
    );
    expect(backend.getItem).toHaveBeenCalledTimes(1);
    expect(current()).toMatchObject({ hydrated: true, quantity: 2 });
    act(() => {
      store.setQuantity('101', 3);
    });
    expect(current('first')).toEqual(current('second'));
    expect(current('first').quantity).toBe(3);
    expect(action).not.toHaveBeenCalled();
  });

  it('retains the draft on provider remount and stores no contact values', () => {
    const { store, backend, readRaw } = setup();
    const action = vi.fn<SubmitOrderAction>();
    const view = render(
      <CartProvider key="uk" submitOrderAction={action}>
        {children()}
      </CartProvider>,
    );
    act(() => {
      store.setDraft('firstName', 'Олександр');
      store.setDraft('phone', '0687135049');
      store.setQuantity('101', 3);
    });
    view.rerender(
      <CartProvider key="ru" submitOrderAction={action}>
        {children()}
      </CartProvider>,
    );
    expect(current()).toMatchObject({
      name: 'Олександр',
      phone: '+38 (068) 713-50-49',
      quantity: 3,
    });
    view.unmount();
    render(<CartProvider submitOrderAction={action}>{children()}</CartProvider>);
    expect(current('first')).toEqual(current('second'));
    expect(current().name).toBe('Олександр');
    expect(backend.getItem).toHaveBeenCalledTimes(1);
    expect(readRaw()).not.toContain('Олександр');
    expect(readRaw()).not.toContain('068');
    expect(JSON.parse(readRaw())).toEqual({
      lines: [
        {
          variantId: '101',
          quantity: 3,
          snapshot: {
            title: 'Ручка',
            unitPrice: 425,
            currency: 'UAH',
            slug: '',
          },
        },
      ],
    });
    expect(action).not.toHaveBeenCalled();
  });

  it('keeps an immutable pending attempt across locale remount without invoking the replacement action', async () => {
    const { store, backend } = setup();
    const response = deferred<CheckoutResult>();
    const action = vi.fn<SubmitOrderAction>(() => response.promise);
    const replacement = vi.fn<SubmitOrderAction>();
    const view = render(
      <CartProvider key="uk" submitOrderAction={action}>
        {children()}
      </CartProvider>,
    );
    act(() => {
      store.setDraft('firstName', 'Олександр');
      store.setDraft('phone', '0687135049');
    });
    let attempt!: Promise<void>;
    await act(async () => {
      attempt = store.submit();
      await Promise.resolve();
    });
    expect(current().pending).toBe(true);
    view.rerender(
      <CartProvider key="ru" submitOrderAction={replacement}>
        {children()}
      </CartProvider>,
    );
    expect(current('first')).toEqual(current('second'));
    expect(current()).toMatchObject({ pending: true, quantity: 2, name: 'Олександр' });
    act(() => {
      store.setDraft('firstName', 'Changed');
      store.setQuantity('101', 5);
    });
    expect(current()).toMatchObject({ quantity: 2, name: 'Олександр' });
    expect(action).toHaveBeenCalledTimes(1);
    expect(replacement).not.toHaveBeenCalled();
    expect(backend.getItem).toHaveBeenCalledTimes(1);
    await act(async () => {
      response.resolve({ kind: 'conflict', messages: ['Уточніть'] });
      await attempt;
    });
    expect(current().pending).toBe(false);
    expect(current().name).toBe('Олександр');
    expect(action).toHaveBeenCalledTimes(1);
    expect(replacement).not.toHaveBeenCalled();
  });

  it('changes presentation children without resetting a draft or submitting', () => {
    const { store, backend } = setup();
    const action = vi.fn<SubmitOrderAction>();
    const view = render(
      <CartProvider submitOrderAction={action}>
        <section data-theme="light" lang="uk">
          {children()}
        </section>
      </CartProvider>,
    );
    act(() => {
      store.setDraft('firstName', 'Ірина');
    });
    view.rerender(
      <CartProvider submitOrderAction={action}>
        <section data-theme="dark" lang="ru">
          {children()}
        </section>
      </CartProvider>,
    );
    expect(current().name).toBe('Ірина');
    expect(backend.getItem).toHaveBeenCalledTimes(1);
    expect(action).not.toHaveBeenCalled();
  });
});
