import { type CartLine } from '@mobile/cart/model';
import { useCallback, useEffect, useRef, useState } from 'react';

import { clearStoredCart, loadCart, saveCart } from './cart-storage';

export type CartStorageError = 'clear' | 'restore' | 'save' | null;

/** Cart lines restored from storage on mount and saved after every update, in write order. */
export function usePersistedCartLines() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState<CartStorageError>(null);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;

    void loadCart().then((result) => {
      if (active) {
        setLines(result.lines);
        setStorageError(result.error ? 'restore' : null);
        setIsReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback((next: readonly CartLine[]) => {
    writeQueue.current = writeQueue.current
      .then(() => saveCart(next))
      .catch(() => setStorageError('save'));
  }, []);

  const updateLines = useCallback(
    (update: (current: readonly CartLine[]) => CartLine[]) => {
      setLines((current) => {
        const next = update(current);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const clearLines = useCallback(async () => {
    setLines([]);
    await writeQueue.current;

    try {
      await clearStoredCart();
      return true;
    } catch {
      setStorageError('clear');
      return false;
    }
  }, []);

  const dismissStorageError = useCallback(() => setStorageError(null), []);

  return { clearLines, dismissStorageError, isReady, lines, storageError, updateLines };
}
