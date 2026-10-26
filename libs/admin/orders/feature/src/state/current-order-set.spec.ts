import { beforeEach, describe, expect, it, vi } from 'vitest';

const storageKey = 'kedr-admin-current-order-set';
async function subject() {
  return import('./current-order-set');
}
describe('current Admin order set', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.resetModules();
  });

  it('persists only product identity and quantity and restores them after module reload', async () => {
    const first = await subject();
    expect(first.addProductToCurrentOrder('42')).toBe('saved');
    expect(first.addProductToCurrentOrder('42', 2)).toBe('saved');
    expect(JSON.parse(window.localStorage.getItem(storageKey) ?? '{}')).toEqual({
      version: 1,
      lines: [{ productId: '42', quantity: 3 }],
    });
    vi.resetModules();
    expect((await subject()).getCurrentOrderSet().lines).toEqual([
      { productId: '42', quantity: 3 },
    ]);
  });

  it('rejects damaged persisted data and keeps the editor usable', async () => {
    window.localStorage.setItem(storageKey, '{bad');
    const current = await subject();
    expect(current.getCurrentOrderSet()).toEqual({ lines: [], warning: 'invalid' });
    expect(current.addProductToCurrentOrder('7')).toBe('saved');
    expect(current.getCurrentOrderSet().lines).toEqual([{ productId: '7', quantity: 1 }]);
  });

  it('does not silently overwrite another tab and can accept its version', async () => {
    const current = await subject();
    current.addProductToCurrentOrder('7');
    const incoming = JSON.stringify({ version: 1, lines: [{ productId: '8', quantity: 2 }] });
    window.dispatchEvent(new StorageEvent('storage', { key: storageKey, newValue: incoming }));
    expect(current.getCurrentOrderSet().warning).toBe('conflict');
    expect(current.addProductToCurrentOrder('9')).toBe('rejected');
    current.acceptExternalOrderSet();
    expect(current.getCurrentOrderSet().lines).toEqual([{ productId: '8', quantity: 2 }]);
  });

  it('merges a saved draft by product ID without deleting its source', async () => {
    const current = await subject();
    current.addProductToCurrentOrder('7', 2);
    expect(
      current.mergeDraftIntoCurrentOrder([
        { productId: '7', quantity: 3 },
        { productId: '8', quantity: 1 },
      ]),
    ).toBe(true);
    expect(current.getCurrentOrderSet().lines).toEqual([
      { productId: '7', quantity: 5 },
      { productId: '8', quantity: 1 },
    ]);
  });
  it('reports a volatile addition when browser storage rejects a write', async () => {
    const current = await subject();
    current.getCurrentOrderSet();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });
    try {
      expect(current.addProductToCurrentOrder('7')).toBe('volatile');
      expect(current.getCurrentOrderSet()).toEqual({
        lines: [{ productId: '7', quantity: 1 }],
        warning: 'storage',
      });
    } finally {
      vi.restoreAllMocks();
    }
  });
  it('removes the persisted set when clearing after submit or explicit logout', async () => {
    const current = await subject();
    current.addProductToCurrentOrder('7');
    current.clearCurrentOrder();
    expect(current.getCurrentOrderSet().lines).toEqual([]);
    expect(window.localStorage.getItem(storageKey)).toBeNull();
  });

  it('keeps the checkout customer until the set is cleared', async () => {
    const customer = await import('./current-order-customer');
    customer.setCurrentOrderCustomer('C1');
    vi.resetModules();
    expect((await import('./current-order-customer')).getCurrentOrderCustomer()).toBe('C1');
    (await subject()).clearCurrentOrder();
    expect((await import('./current-order-customer')).getCurrentOrderCustomer()).toBe('');
  });
});
