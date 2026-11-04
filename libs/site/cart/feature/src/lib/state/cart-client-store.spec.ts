import { afterEach, describe, expect, it, vi } from 'vitest';

import { createCartClientStore, SERVER_CART_SNAPSHOT } from './cart-client-store';
import { createCartStorage } from '../storage/cart-storage';

import type { CartLine, CartPurchaseInput, CheckoutResult } from '@site/cart/model';

const input: CartPurchaseInput = {
  productId: '101',
  title: 'Ручка Kedr',
  unitPrice: 425,
  currency: 'UAH',
  slug: 'ruchka-kedr',
  available: true,
};
const legacy: CartLine = {
  variantId: '101',
  quantity: 2,
  snapshot: { title: 'Ручка Kedr', unitPrice: 425, currency: 'UAH', slug: 'ruchka-kedr' },
};
const orderId = '11111111-2222-4333-8444-555555555555';

function setup(raw: string | null = null) {
  const browserStorage = {
    getItem: vi.fn(() => raw),
    setItem: vi.fn((_key: string, value: string) => {
      raw = value;
    }),
    removeItem: vi.fn(() => {
      raw = null;
    }),
  };
  const store = createCartClientStore(createCartStorage(() => browserStorage));
  const fill = () => {
    store.setDraft('firstName', 'Олександр');
    store.setDraft('phone', '+38 (068) 713-50-49');
  };
  return { store, browserStorage, fill };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function placeButton(kind: string, top = 10) {
  const button = document.createElement('button');
  button.dataset.cartTrigger = kind;
  button.dataset.focusTest = '';
  const rect = new DOMRect(10, top, 44, 44);
  vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(rect);
  vi.spyOn(button, 'getClientRects').mockReturnValue([rect] as unknown as DOMRectList);
  document.body.append(button);
  return button;
}

afterEach(() => {
  document.querySelectorAll('[data-focus-test]').forEach((element) => element.remove());
});

describe('document cart owner', () => {
  it('has a deterministic neutral server snapshot and reads storage once after initialization', () => {
    const { store, browserStorage } = setup(JSON.stringify({ lines: [legacy] }));
    expect(store.getSnapshot()).toEqual(SERVER_CART_SNAPSHOT);
    expect(browserStorage.getItem).not.toHaveBeenCalled();
    store.initialize();
    store.initialize();
    expect(browserStorage.getItem).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().hydrated).toBe(true);
    expect(store.getSnapshot().lines).toEqual([legacy]);
    expect(browserStorage.setItem).not.toHaveBeenCalled();
  });

  it('merges additions into one persisted cart and notifies all subscriptions', () => {
    const { store, browserStorage } = setup();
    const first = vi.fn(),
      second = vi.fn();
    store.subscribe(first);
    const unsubscribe = store.subscribe(second);
    store.initialize();
    first.mockClear();
    second.mockClear();
    expect(store.add(input, 2)).toBe(true);
    expect(store.add({ ...input, title: 'Changed', unitPrice: 999 }, 1)).toBe(true);
    expect(store.getSnapshot().lines[0]).toMatchObject({
      quantity: 3,
      snapshot: { title: input.title, unitPrice: 425 },
    });
    expect(browserStorage.setItem).toHaveBeenCalledTimes(2);
    expect(first).toHaveBeenCalledTimes(2);
    expect(second).toHaveBeenCalledTimes(2);
    unsubscribe();
    store.setQuantity('101', 5);
    expect(first).toHaveBeenCalledTimes(3);
    expect(second).toHaveBeenCalledTimes(2);
  });

  it('does not persist invalid quantity or invalid purchase input', () => {
    const { store, browserStorage } = setup();
    store.initialize();
    expect(store.add({ ...input, available: false })).toBe(false);
    store.add(input);
    expect(store.setQuantity('101', 0)).toBe(false);
    expect(store.setQuantity('101', 1001)).toBe(false);
    expect(store.getSnapshot().lines[0].quantity).toBe(1);
    expect(browserStorage.setItem).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().notice).toBeTruthy();
  });

  it('does not rewrite a partially recovered source until acknowledgement', async () => {
    const source = JSON.stringify({
      lines: [legacy, { ...legacy, variantId: 'bad', quantity: 1001 }],
    });
    const { store, browserStorage, fill } = setup(source);
    const action = vi.fn();
    store.setSubmitOrderAction(action);
    store.initialize();
    fill();
    expect(store.getSnapshot()).toMatchObject({ recoveryRequired: true, discardedCount: 1 });
    store.setQuantity('101', 3);
    await store.submit();
    expect(action).not.toHaveBeenCalled();
    expect(browserStorage.setItem).not.toHaveBeenCalled();
    store.acceptRecovery();
    expect(store.getSnapshot().recoveryRequired).toBe(false);
    expect(browserStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('discards a damaged source only through the explicit discard action', () => {
    const { store, browserStorage } = setup('{broken');
    store.initialize();
    expect(store.getSnapshot().recoveryRequired).toBe(true);
    expect(browserStorage.removeItem).not.toHaveBeenCalled();
    store.discardRecovery();
    expect(store.getSnapshot().lines).toEqual([]);
    expect(store.getSnapshot().recoveryRequired).toBe(false);
    expect(browserStorage.removeItem).toHaveBeenCalledTimes(1);
  });

  it('keeps a usable memory cart when the browser denies storage', () => {
    const store = createCartClientStore(
      createCartStorage(() => {
        throw new Error('denied');
      }),
    );
    store.initialize();
    store.add(input, 2);
    expect(store.getSnapshot()).toMatchObject({ hydrated: true, storageIssue: expect.any(String) });
    expect(store.getSnapshot().lines[0].quantity).toBe(2);
  });

  it('persists no contacts or order receipt and starts a new document with an empty draft', () => {
    const { store, browserStorage, fill } = setup();
    store.initialize();
    store.add(input);
    fill();
    const saved =
      browserStorage.setItem.mock.calls[browserStorage.setItem.mock.calls.length - 1]?.[1] ?? '';
    expect(saved).not.toContain('Олександр');
    expect(saved).not.toContain('068');
    const restored = setup(saved);
    restored.store.initialize();
    expect(restored.store.getSnapshot().lines).toHaveLength(1);
    expect(restored.store.getSnapshot().draft).toEqual({ firstName: '', phone: '' });
  });

  it('preserves cart and contacts while the drawer opens and closes, restoring its opener', () => {
    const { store, fill } = setup();
    store.initialize();
    store.add(input);
    fill();
    const opener = placeButton('main');
    store.openDrawer(opener);
    expect(store.getSnapshot().drawerOpen).toBe(true);
    store.closeDrawer();
    store.restoreDrawerFocus();
    expect(document.activeElement).toBe(opener);
    expect(store.getSnapshot().draft.firstName).toBe('Олександр');
    expect(store.getSnapshot().lines).toHaveLength(1);
    opener.remove();
  });

  it('returns focus to a visible trigger when the connected opener becomes hidden', () => {
    const { store } = setup();
    const opener = placeButton('compact');
    const visible = placeButton('main');
    store.openDrawer(opener);
    opener.style.display = 'none';
    vi.mocked(opener.getClientRects).mockReturnValue([] as unknown as DOMRectList);
    store.closeDrawer();
    store.restoreDrawerFocus();
    expect(document.activeElement).toBe(visible);
  });

  it('uses the visible compact trigger when the main opener is above the viewport', () => {
    const { store } = setup();
    const opener = placeButton('main', -100);
    const visible = placeButton('compact');
    store.openDrawer(opener);
    store.closeDrawer();
    store.restoreDrawerFocus();
    expect(document.activeElement).toBe(visible);
  });

  it('skips a visibility-hidden fallback after the original opener disconnects', () => {
    const { store } = setup();
    const opener = placeButton('main');
    const hidden = placeButton('main');
    hidden.style.visibility = 'hidden';
    const visible = placeButton('compact');
    store.openDrawer(opener);
    opener.remove();
    store.closeDrawer();
    store.restoreDrawerFocus();
    expect(document.activeElement).toBe(visible);
  });

  it('cannot submit an empty, not-yet-restored or invalid draft', async () => {
    const { store } = setup();
    const action = vi.fn();
    store.setSubmitOrderAction(action);
    await store.submit();
    store.initialize();
    await store.submit();
    store.add(input);
    store.setDraft('firstName', 'Ів');
    await store.submit();
    expect(action).not.toHaveBeenCalled();
    expect(store.getSnapshot().touched.firstName).toBe(true);
  });

  it('locks one immutable attempt against duplicate submit and cart/contact mutations', async () => {
    const { store, fill } = setup();
    store.initialize();
    store.add(input, 2);
    fill();
    const response = deferred<CheckoutResult>();
    const action = vi.fn<(command: unknown) => Promise<CheckoutResult>>(() => response.promise);
    store.setSubmitOrderAction(action);
    const first = store.submit(),
      second = store.submit();
    await Promise.resolve();
    expect(store.getSnapshot().pending).toBe(true);
    expect(action).toHaveBeenCalledTimes(1);
    store.setQuantity('101', 5);
    store.remove('101');
    store.setDraft('firstName', 'Changed');
    store.add(input, 4);
    expect(store.getSnapshot().lines[0].quantity).toBe(2);
    expect(store.getSnapshot().draft.firstName).toBe('Олександр');
    expect(action.mock.calls[0][0]).toMatchObject({
      firstName: 'Олександр',
      lines: [{ productId: '101', quantity: 2 }],
    });
    response.resolve({ kind: 'conflict', messages: ['Уточніть замовлення'] });
    await Promise.all([first, second]);
    expect(store.getSnapshot().pending).toBe(false);
    expect(store.getSnapshot().lines).toHaveLength(1);
  });

  it.each<CheckoutResult>([
    { kind: 'validation', fieldErrors: { phone: ['Перевірте телефон'] }, messages: [] },
    { kind: 'conflict', messages: ['Уточніть замовлення'] },
    { kind: 'uncertain', messages: [] },
  ])('retains data for $kind without retry', async (result) => {
    const { store, fill, browserStorage } = setup();
    store.initialize();
    store.add(input, 2);
    fill();
    const action = vi.fn(async () => result);
    store.setSubmitOrderAction(action);
    await store.submit();
    expect(store.getSnapshot().result).toEqual(result);
    expect(store.getSnapshot().draft.firstName).toBe('Олександр');
    expect(store.getSnapshot().lines[0].quantity).toBe(2);
    expect(action).toHaveBeenCalledTimes(1);
    expect(browserStorage.removeItem).not.toHaveBeenCalled();
  });

  it('reports uncertainty when the action throws and does not retry', async () => {
    const { store, fill } = setup();
    store.initialize();
    store.add(input);
    fill();
    const action = vi.fn(async () => {
      throw new Error('lost response');
    });
    store.setSubmitOrderAction(action);
    await store.submit();
    expect(store.getSnapshot().result?.kind).toBe('uncertain');
    expect(action).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().draft.firstName).toBe('Олександр');
  });

  it('blocks a reentrant submit from a synchronous pending subscriber', async () => {
    const { store, fill } = setup();
    store.initialize();
    store.add(input);
    fill();
    const action = vi.fn(async (): Promise<CheckoutResult> => ({ kind: 'created', orderId }));
    store.setSubmitOrderAction(action);
    let replayed = false;
    store.subscribe(() => {
      if (store.getSnapshot().pending && !replayed) {
        replayed = true;
        void store.submit();
      }
    });
    await store.submit();
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('clears only after confirmed success and preserves the accepted receipt before empty state', async () => {
    const { store, fill, browserStorage } = setup();
    store.initialize();
    store.add(input, 2);
    fill();
    store.setSubmitOrderAction(async () => ({ kind: 'created', orderId }));
    await store.submit();
    expect(store.getSnapshot().receipt).toEqual({ orderId, unitCount: 2, goodsSubtotal: 850 });
    expect(store.getSnapshot().lines).toEqual([]);
    expect(store.getSnapshot().draft).toEqual({ firstName: '', phone: '' });
    expect(browserStorage.removeItem).toHaveBeenCalledTimes(1);
    store.add(input);
    expect(store.getSnapshot().receipt).toBeNull();
  });

  it('preserves accepted receipt when local cleanup fails and never resends it', async () => {
    const { store, fill, browserStorage } = setup();
    store.initialize();
    store.add(input);
    fill();
    browserStorage.removeItem.mockImplementation(() => {
      throw new Error('denied');
    });
    const action = vi.fn(async (): Promise<CheckoutResult> => ({ kind: 'created', orderId }));
    store.setSubmitOrderAction(action);
    await store.submit();
    await store.submit();
    expect(store.getSnapshot().receipt?.orderId).toBe(orderId);
    expect(store.getSnapshot().storageIssue).toBe('remove-failed');
    expect(store.getSnapshot().lines).toEqual([]);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('allows a corrected explicit retry without replaying the failed attempt', async () => {
    const { store, fill } = setup();
    store.initialize();
    store.add(input);
    fill();
    const action = vi
      .fn<(input: unknown) => Promise<CheckoutResult>>()
      .mockResolvedValueOnce({
        kind: 'validation',
        fieldErrors: { phone: ['bad phone'] },
        messages: [],
      })
      .mockResolvedValueOnce({ kind: 'created', orderId });
    store.setSubmitOrderAction(action);
    await store.submit();
    store.setDraft('phone', '+38 (050) 111-22-33');
    expect(action).toHaveBeenCalledTimes(1);
    await store.submit();
    expect(action).toHaveBeenCalledTimes(2);
    expect(store.getSnapshot().receipt?.orderId).toBe(orderId);
  });
});
