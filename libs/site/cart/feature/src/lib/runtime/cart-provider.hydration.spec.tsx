import { act } from '@testing-library/react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CartProvider, useCart } from './cart-provider';
import {
  createCartClientStore,
  SERVER_CART_SNAPSHOT,
  type CartClientStore,
  type CartSnapshot,
  type SubmitOrderAction,
} from '../state/cart-client-store';
import { createCartStorage } from '../storage/cart-storage';

const bridge = vi.hoisted(() => ({ store: null as CartClientStore | null }));
vi.mock('../state/browser-cart-store', () => ({ getBrowserCartStore: () => bridge.store }));

const roots: Root[] = [];
const containers: HTMLElement[] = [];
afterEach(() => {
  for (const root of roots.splice(0))
    act(() => {
      root.unmount();
    });
  for (const container of containers.splice(0)) container.remove();
  bridge.store = null;
  vi.clearAllMocks();
});
function Consumer({ observe }: { observe?: (snapshot: CartSnapshot) => void }) {
  const { snapshot } = useCart();
  observe?.(snapshot);
  return (
    <output>
      {snapshot.hydrated ? 'ready' : 'restoring'}|{snapshot.lines.length}|{snapshot.draft.firstName}
      |{snapshot.storageIssue ?? ''}
    </output>
  );
}

describe('cart provider SSR and hydration', () => {
  it('renders the stable neutral server snapshot without storage reads or private draft', () => {
    const backend = { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() };
    const store = createCartClientStore(createCartStorage(() => backend));
    bridge.store = store;
    store.setDraft('firstName', 'Private customer');
    const action = vi.fn<SubmitOrderAction>();
    const observed: CartSnapshot[] = [];
    const html = renderToString(
      <CartProvider submitOrderAction={action}>
        <Consumer observe={(snapshot) => observed.push(snapshot)} />
      </CartProvider>,
    );
    expect(html).toContain('restoring');
    expect(html).not.toContain('Private customer');
    expect(observed.length).toBeGreaterThan(0);
    expect(observed.every((snapshot) => snapshot === SERVER_CART_SNAPSHOT)).toBe(true);
    expect(backend.getItem).not.toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
  });

  it('hydrates saved goods after the effect with one read and no mismatch or action call', async () => {
    const raw = JSON.stringify({
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
    const backend = { getItem: vi.fn(() => raw), setItem: vi.fn(), removeItem: vi.fn() };
    bridge.store = createCartClientStore(createCartStorage(() => backend));
    const action = vi.fn<SubmitOrderAction>();
    const recoverable = vi.fn();
    const element = (
      <CartProvider submitOrderAction={action}>
        <Consumer />
      </CartProvider>
    );
    const container = document.createElement('div');
    containers.push(container);
    document.body.append(container);
    container.innerHTML = renderToString(element);
    expect(container.textContent).toBe('restoring|0||');
    expect(backend.getItem).not.toHaveBeenCalled();
    await act(async () => {
      roots.push(hydrateRoot(container, element, { onRecoverableError: recoverable }));
    });
    expect(container.textContent).toBe('ready|1||');
    expect(backend.getItem).toHaveBeenCalledTimes(1);
    expect(backend.setItem).not.toHaveBeenCalled();
    expect(backend.removeItem).not.toHaveBeenCalled();
    expect(recoverable).not.toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
  });

  it('settles denied browser storage after hydration without a thrown effect or submission', async () => {
    const resolve = vi.fn(() => {
      throw new Error('denied');
    });
    bridge.store = createCartClientStore(createCartStorage(resolve));
    const action = vi.fn<SubmitOrderAction>();
    const recoverable = vi.fn();
    const element = (
      <CartProvider submitOrderAction={action}>
        <Consumer />
      </CartProvider>
    );
    const container = document.createElement('div');
    containers.push(container);
    document.body.append(container);
    container.innerHTML = renderToString(element);
    expect(resolve).not.toHaveBeenCalled();
    await act(async () => {
      roots.push(hydrateRoot(container, element, { onRecoverableError: recoverable }));
    });
    expect(container.textContent).toBe('ready|0||read-failed');
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(recoverable).not.toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
  });
});
