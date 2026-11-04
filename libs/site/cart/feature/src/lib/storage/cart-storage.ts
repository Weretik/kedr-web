import {
  CART_STORAGE_KEY,
  decodeCartStorage,
  serializeCartStorage,
  type CartDecodeResult,
  type CartLine,
} from '@site/cart/model';

export interface CartStorageBackend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type CartStorageReadResult =
  { ok: true; value: CartDecodeResult } | { ok: false; reason: 'read-failed' };

export type CartStorageWriteResult =
  { ok: true } | { ok: false; reason: 'invalid-data' | 'write-failed' };

export type CartStorageClearResult = { ok: true } | { ok: false; reason: 'remove-failed' };

export interface CartStorage {
  read(): CartStorageReadResult;
  write(lines: readonly CartLine[]): CartStorageWriteResult;
  clear(): CartStorageClearResult;
}

export function createCartStorage(resolveStorage: () => CartStorageBackend): CartStorage {
  return {
    read: () => {
      try {
        return { ok: true, value: decodeCartStorage(resolveStorage().getItem(CART_STORAGE_KEY)) };
      } catch {
        return { ok: false, reason: 'read-failed' };
      }
    },
    write: (lines) => {
      const encoded = serializeCartStorage(lines);
      if (!encoded.ok) return { ok: false, reason: 'invalid-data' };
      try {
        const storage = resolveStorage();
        if (lines.length) storage.setItem(CART_STORAGE_KEY, encoded.value);
        else storage.removeItem(CART_STORAGE_KEY);
        return { ok: true };
      } catch {
        return { ok: false, reason: 'write-failed' };
      }
    },
    clear: () => {
      try {
        resolveStorage().removeItem(CART_STORAGE_KEY);
        return { ok: true };
      } catch {
        return { ok: false, reason: 'remove-failed' };
      }
    },
  };
}
