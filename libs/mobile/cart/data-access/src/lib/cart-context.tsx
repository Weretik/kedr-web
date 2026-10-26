import {
  addProductToCart,
  decrementCartLine,
  incrementCartLine,
  removeCartLine,
  type CartLine,
  type CartProductInput,
} from '@mobile/cart/model';
import { createContext, type PropsWithChildren, useCallback, useContext, useMemo } from 'react';

import { type CartStorageError, usePersistedCartLines } from './use-persisted-cart-lines';

export type { CartStorageError } from './use-persisted-cart-lines';

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
  const { clearLines, dismissStorageError, isReady, lines, storageError, updateLines } =
    usePersistedCartLines();

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
  const value = useMemo(
    () => ({
      addProduct,
      clear: clearLines,
      decrement,
      dismissStorageError,
      increment,
      isReady,
      lines,
      remove,
      storageError,
    }),
    [
      addProduct,
      clearLines,
      decrement,
      dismissStorageError,
      increment,
      isReady,
      lines,
      remove,
      storageError,
    ],
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
