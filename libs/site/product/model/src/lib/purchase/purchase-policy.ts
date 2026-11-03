import type { ProductDetails } from '../entities/product-details';

export type ProductPurchaseMode = 'cart' | 'request-price' | 'request-stock';

export function getProductPurchaseMode(
  product: Pick<ProductDetails, 'price' | 'inStock'>,
): ProductPurchaseMode {
  if (!product.inStock) return 'request-stock';
  return product.price !== null && Number.isFinite(product.price) && product.price > 0
    ? 'cart'
    : 'request-price';
}

export function isValidProductQuantity(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}
