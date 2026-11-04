// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./cart-client-store', async (importOriginal) => {
  const original = await importOriginal<typeof import('./cart-client-store')>();
  return { ...original, createCartClientStore: vi.fn(original.createCartClientStore) };
});

function browser(document: object = {}) {
  return {
    document,
    localStorage: { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() },
  };
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('browser document cart factory', () => {
  it('never creates a server store without window', async () => {
    vi.stubGlobal('window', undefined);
    const { getBrowserCartStore } = await import('./browser-cart-store');
    const { createCartClientStore } = await import('./cart-client-store');
    expect(getBrowserCartStore()).toBeNull();
    expect(createCartClientStore).not.toHaveBeenCalled();
  });

  it('creates one owner and stable getters for two consumers of one document', async () => {
    const current = browser();
    vi.stubGlobal('window', current);
    const { getBrowserCartStore } = await import('./browser-cart-store');
    const { createCartClientStore } = await import('./cart-client-store');
    const first = getBrowserCartStore();
    expect(first).not.toBeNull();
    const second = getBrowserCartStore();
    expect(second).toBe(first);
    expect(second?.getSnapshot).toBe(first?.getSnapshot);
    expect(second?.subscribe).toBe(first?.subscribe);
    expect(first?.getSnapshot()).toBe(first?.getSnapshot());
    expect(createCartClientStore).toHaveBeenCalledTimes(1);
    expect(current.localStorage.getItem).not.toHaveBeenCalled();
  });

  it('starts a new document with neutral contacts instead of reusing PII', async () => {
    const firstWindow = browser();
    vi.stubGlobal('window', firstWindow);
    const { getBrowserCartStore } = await import('./browser-cart-store');
    const first = getBrowserCartStore();
    expect(first).not.toBeNull();
    first?.setDraft('firstName', 'Private customer');
    vi.stubGlobal('window', browser());
    const next = getBrowserCartStore();
    expect(next).not.toBeNull();
    expect(next).not.toBe(first);
    expect(next?.getSnapshot().draft).toEqual({ firstName: '', phone: '' });
  });

  it('does not access localStorage while creating the owner', async () => {
    const denied = vi.fn(() => {
      throw new Error('denied');
    });
    vi.stubGlobal('window', {
      document: {},
      get localStorage() {
        return denied();
      },
    });
    const { getBrowserCartStore } = await import('./browser-cart-store');
    const store = getBrowserCartStore();
    expect(store).not.toBeNull();
    expect(denied).not.toHaveBeenCalled();
    store?.initialize();
    expect(store?.getSnapshot()).toMatchObject({ hydrated: true, storageIssue: 'read-failed' });
    expect(denied).toHaveBeenCalledTimes(1);
  });
});
