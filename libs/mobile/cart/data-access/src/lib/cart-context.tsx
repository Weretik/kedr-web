import {
  addProductToCart,
  decrementCartLine,
  incrementCartLine,
  removeCartLine,
  type CartLine,
  type CartProductInput,
} from '@mobile/cart/model';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { clearStoredCart, loadCart, saveCart } from './cart-storage';

export type CartStorageError = 'clear' | 'restore' | 'save' | null;

export interface CartContextValue {
  lines: readonly CartLine[];
  isReady: boolean;
  storageError: CartStorageError;
  addProduct: (product: CartProductInput) => void;
  clear: () => Promise<boolean>;
  decrement: (productId: string) => void;
  dismissStorageError: () => void;
  increment: (productId: string) => void;
  remove: (productId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
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

  const addProduct = useCallback(
    (product: CartProductInput) => updateLines((current) => addProductToCart(current, product)),
    [updateLines],
  );
  const increment = useCallback(
    (productId: string) => updateLines((current) => incrementCartLine(current, productId)),
    [updateLines],
  );
  const decrement = useCallback(
    (productId: string) => updateLines((current) => decrementCartLine(current, productId)),
    [updateLines],
  );
  const remove = useCallback(
    (productId: string) => updateLines((current) => removeCartLine(current, productId)),
    [updateLines],
  );
  const clear = useCallback(async () => {
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

  const value = useMemo(
    () => ({
      addProduct,
      clear,
      decrement,
      dismissStorageError: () => setStorageError(null),
      increment,
      isReady,
      lines,
      remove,
      storageError,
    }),
    [addProduct, clear, decrement, increment, isReady, lines, remove, storageError],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const cart = useContext(CartContext);

  if (!cart) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return cart;
}
