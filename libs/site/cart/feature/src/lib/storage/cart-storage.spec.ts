import { describe, expect, it, vi } from 'vitest';

import { createCartStorage } from './cart-storage';

import type { CartLine } from '@site/cart/model';

const line: CartLine = {
  variantId: '123',
  quantity: 2,
  snapshot: { title: 'Ручка', unitPrice: 10, currency: 'UAH', slug: '' },
};
function backend(raw: string | null = null) {
  return { getItem: vi.fn(() => raw), setItem: vi.fn(), removeItem: vi.fn() };
}

describe('cart browser storage adapter', () => {
  it('does not touch storage until explicitly called and never rewrites a read', () => {
    const source = backend(JSON.stringify({ lines: [line, { ...line, quantity: 1.5 }] }));
    const resolve = vi.fn(() => source);
    const storage = createCartStorage(resolve);
    expect(resolve).not.toHaveBeenCalled();
    expect(storage.read()).toEqual({
      ok: true,
      value: { kind: 'recovery-required', lines: [line], discardedCount: 1 },
    });
    expect(source.getItem).toHaveBeenCalledWith('cart_v1');
    expect(source.setItem).not.toHaveBeenCalled();
    expect(source.removeItem).not.toHaveBeenCalled();
  });
  it('saves exactly the accepted legacy basket when the owner explicitly requests a write', () => {
    const source = backend();
    expect(createCartStorage(() => source).write([line])).toEqual({ ok: true });
    expect(source.setItem).toHaveBeenCalledWith('cart_v1', JSON.stringify({ lines: [line] }));
  });
  it('removes the key for an intentionally empty basket', () => {
    const source = backend();
    expect(createCartStorage(() => source).write([])).toEqual({ ok: true });
    expect(source.removeItem).toHaveBeenCalledWith('cart_v1');
    expect(source.setItem).not.toHaveBeenCalled();
  });
  it('refuses malformed state without accessing storage', () => {
    const resolve = vi.fn(() => backend());
    expect(createCartStorage(resolve).write([{ ...line, quantity: 0 }])).toEqual({
      ok: false,
      reason: 'invalid-data',
    });
    expect(resolve).not.toHaveBeenCalled();
  });
  it('returns a typed read failure for denied localStorage access', () => {
    expect(
      createCartStorage(() => {
        throw new Error('denied');
      }).read(),
    ).toEqual({ ok: false, reason: 'read-failed' });
  });
  it('returns a typed write failure for quota errors', () => {
    const source = backend();
    source.setItem.mockImplementation(() => {
      throw new Error('quota');
    });
    expect(createCartStorage(() => source).write([line])).toEqual({
      ok: false,
      reason: 'write-failed',
    });
  });
  it('returns cleanup failure separately so accepted order state is not replaced', () => {
    const source = backend();
    source.removeItem.mockImplementation(() => {
      throw new Error('denied');
    });
    expect(createCartStorage(() => source).clear()).toEqual({ ok: false, reason: 'remove-failed' });
    expect(source.setItem).not.toHaveBeenCalled();
  });
  it('clears the saved basket explicitly without sending any order', () => {
    const source = backend();
    expect(createCartStorage(() => source).clear()).toEqual({ ok: true });
    expect(source.removeItem).toHaveBeenCalledWith('cart_v1');
    expect(source.setItem).not.toHaveBeenCalled();
  });
});
