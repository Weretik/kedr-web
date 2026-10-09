import { ProductDetails, ProductListItem } from '@storefront/contracts';

import { CartLine } from '../models/cart.types';

const currency = 'UAH' as const;

function requirePrice(price: number | null): number {
  return price ?? 0;
}

export function cartLineFromListRow(product: ProductListItem, qty = 1): CartLine {
  return {
    variantId: String(product.id),
    quantity: Math.max(1, Math.floor(qty)),
    snapshot: {
      title: product.name,
      imageUrl: product.photo,
      unitPrice: requirePrice(product.price),
      currency,
      slug: product.productSlug,
    },
  };
}

export function cartLineFromBySlug(product: ProductDetails, qty: number): CartLine {
  return {
    variantId: String(product.id),
    quantity: Math.max(1, Math.floor(qty)),
    snapshot: {
      title: product.name,
      imageUrl: product.photo,
      unitPrice: requirePrice(product.price),
      currency,
      slug: '',
    },
  };
}
