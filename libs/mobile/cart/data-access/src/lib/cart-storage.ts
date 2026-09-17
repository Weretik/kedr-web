import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

import type { CartLine } from '@mobile/cart/model';

export const CART_STORAGE_KEY = 'mobile.cart.v1';

const cartLineSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().nullable(),
  unitPrice: z.number().finite().nonnegative(),
  stock: z.number(),
  quantityInPack: z.number(),
  quantity: z.number().int().positive(),
});

const cartSchema = z.array(cartLineSchema);

export interface CartLoadResult {
  error: boolean;
  lines: CartLine[];
}

export async function loadCart(): Promise<CartLoadResult> {
  try {
    const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);

    if (!stored) {
      return { error: false, lines: [] };
    }

    const parsed: unknown = JSON.parse(stored);
    return { error: false, lines: cartSchema.parse(parsed) };
  } catch {
    return { error: true, lines: [] };
  }
}

export async function saveCart(lines: readonly CartLine[]): Promise<void> {
  await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
}

export async function clearStoredCart(): Promise<void> {
  await AsyncStorage.removeItem(CART_STORAGE_KEY);
}
