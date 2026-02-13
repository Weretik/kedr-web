export type VariantId = string;

export interface CartLineSnapshot {
  title: string;
  imageUrl?: string;
  unitPrice: number;
  currency: 'UAH';
}

export interface CartLine {
  variantId: VariantId;
  quantity: number;
  snapshot: CartLineSnapshot;
}

export interface CartState {
  lines: CartLine[];
}
