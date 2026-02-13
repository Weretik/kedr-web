import { Injectable, computed, signal } from '@angular/core';

import { CartLine, CartState, VariantId } from './cart.types';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private state = signal<CartState>({ lines: [] });

  lines = computed(() => this.state().lines);

  itemsCount = computed(() =>
    this.state().lines.reduce((count, line) => count + line.quantity, 0),
  );

  subtotal = computed(() =>
    this.state().lines.reduce(
      (subtotal, line) => subtotal + line.quantity * line.snapshot.unitPrice,
      0,
    ),
  );

  addItem(newLine: CartLine) {
    this.state.update((cartState) => {
      const idx = cartState.lines.findIndex(
        (cartLine) => cartLine.variantId === newLine.variantId,
      );
      if (idx >= 0) {
        const existing = cartState.lines[idx];
        const nextLines = [...cartState.lines];
        nextLines[idx] = {
          ...existing,
          quantity: existing.quantity + newLine.quantity,
        };
        return { ...cartState, lines: nextLines };
      }
      return { ...cartState, lines: [...cartState.lines, newLine] };
    });
  }

  setQty(variantId: VariantId, qty: number) {
    const newQty = Math.max(0, Math.floor(qty));
    this.state.update((cartState) => ({
      ...cartState,
      lines: cartState.lines
        .map((cartLine) =>
          cartLine.variantId === variantId
            ? { ...cartLine, quantity: newQty }
            : cartLine,
        )
        .filter((cartLine) => cartLine.quantity > 0),
    }));
  }

  remove(variantId: VariantId) {
    this.state.update((cartState) => ({
      ...cartState,
      lines: cartState.lines.filter(
        (cartLine) => cartLine.variantId !== variantId,
      ),
    }));
  }

  setState(next: CartState) {
    this.state.set(next);
  }

  snapshot(): CartState {
    return this.state();
  }

  clear() {
    this.state.set({ lines: [] });
  }
}
