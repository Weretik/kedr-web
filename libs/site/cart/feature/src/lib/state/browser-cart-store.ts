import { createCartClientStore, type CartClientStore } from './cart-client-store';
import { createCartStorage } from '../storage/cart-storage';

let browserOwner: { document: Document; store: CartClientStore } | null = null;

export function getBrowserCartStore(): CartClientStore | null {
  if (typeof window === 'undefined' || typeof window.document === 'undefined') return null;
  const currentWindow = window;
  if (!browserOwner || browserOwner.document !== currentWindow.document) {
    browserOwner = {
      document: currentWindow.document,
      store: createCartClientStore(createCartStorage(() => currentWindow.localStorage)),
    };
  }
  return browserOwner.store;
}
