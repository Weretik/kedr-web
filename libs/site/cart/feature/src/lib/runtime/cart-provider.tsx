'use client';

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';

import { getBrowserCartStore } from '../state/browser-cart-store';
import { SERVER_CART_SNAPSHOT } from '../state/cart-client-store';

import type { CartClientStore, CartSnapshot, SubmitOrderAction } from '../state/cart-client-store';

export interface CartProviderProps {
  children: ReactNode;
  submitOrderAction: SubmitOrderAction;
}

const CartStoreContext = createContext<CartClientStore | null>(null);
const getNeutralSnapshot = () => SERVER_CART_SNAPSHOT;
const subscribeToNothing = () => () => {};

export function CartProvider({ children, submitOrderAction }: CartProviderProps) {
  const store = getBrowserCartStore();
  useEffect(() => {
    if (!store) return;
    store.setSubmitOrderAction(submitOrderAction);
    store.initialize();
  }, [store, submitOrderAction]);
  return <CartStoreContext.Provider value={store}>{children}</CartStoreContext.Provider>;
}

export function useCart(): { store: CartClientStore | null; snapshot: CartSnapshot } {
  const store = useContext(CartStoreContext);
  const snapshot = useSyncExternalStore(
    store?.subscribe ?? subscribeToNothing,
    store?.getSnapshot ?? getNeutralSnapshot,
    getNeutralSnapshot,
  );
  return { store, snapshot };
}
