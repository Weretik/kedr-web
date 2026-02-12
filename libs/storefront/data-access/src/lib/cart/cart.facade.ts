import { effect, inject, Injectable } from '@angular/core';
import { BrowserStorageService } from '@shared/util';

import { CartStore } from './cart.store';
import { CartLine } from './cart.types';

@Injectable({ providedIn: 'root' })
export class CartFacade {
  private readonly store = inject(CartStore);
  private readonly storage = inject(BrowserStorageService);

  private readonly STORAGE_KEY = 'cart_v1';

  readonly lines = this.store.lines;
  readonly itemsCount = this.store.itemsCount;
  readonly subtotal = this.store.subtotal;

  constructor() {
    this.loadFromStorage();

    effect(() => {
      const state = this.store.snapshot();

      if (!state.lines.length) {
        this.storage.removeItem(this.STORAGE_KEY);
        return;
      }

      this.storage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    });
  }

  addToCart(line: CartLine) {
    this.store.addItem(line);
  }

  setQty(variantId: string, qty: number) {
    this.store.setQty(variantId, qty);
  }

  remove(variantId: string) {
    this.store.remove(variantId);
  }

  clear() {
    this.store.clear();
  }

  private loadFromStorage() {
    const raw = this.storage.getItem(this.STORAGE_KEY);
    if (!raw) return;

    try {
      this.store.setState(JSON.parse(raw));
    } catch {
      this.storage.removeItem(this.STORAGE_KEY);
    }
  }
}
