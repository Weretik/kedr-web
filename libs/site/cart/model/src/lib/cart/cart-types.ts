export interface CartLineSnapshot {
  title: string;
  imageUrl?: string;
  unitPrice: number;
  currency: 'UAH';
  slug: string;
}

export interface CartLine {
  variantId: string;
  quantity: number;
  snapshot: CartLineSnapshot;
}

export interface CartLineSeed {
  productId: string;
  title: string;
  unitPrice: number;
  currency: 'UAH';
  slug: string;
  imageUrl?: string;
}

export interface CartPurchaseInput extends Omit<CartLineSeed, 'unitPrice'> {
  unitPrice: number | null;
  available: boolean;
}

export type CartMutationReason =
  | 'unavailable'
  | 'invalid-price'
  | 'invalid-product'
  | 'invalid-quantity'
  | 'quantity-overflow'
  | 'not-found';

export type CartMutationResult =
  { ok: true; lines: CartLine[] } | { ok: false; reason: CartMutationReason };
