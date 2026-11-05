/** A product as the device keeps it (from the catalog snapshot). `id` is the 1C code. */
export interface Product {
  id: number;
  slug: string;
  name: string;
  categoryId: number;
  stock: number;
  quantityInPack: number;
  isSale: boolean;
  isNew: boolean;
  /** Photo URLs, main first. */
  photos: string[];
  scheme: string | null;
}

export interface Category {
  id: number;
  parentId: number | null;
  name: string;
  sortOrder: number;
}

/** A product with the chosen customer's price; null is «Ціну уточнюйте». */
export interface PricedProduct extends Product {
  priceKopecks: number | null;
}

/** Zero or negative stock: the product cannot be added (R-006). */
export function isOutOfStock(product: Pick<Product, 'stock'>): boolean {
  return product.stock <= 0;
}

/** Whether a priced product may go into a calculation. */
export function canAdd(product: Pick<PricedProduct, 'priceKopecks' | 'stock'>): boolean {
  return !isOutOfStock(product) && product.priceKopecks !== null;
}

/** «12 шт.»; fractional stock (metres, kilograms) keeps up to two decimals. */
export function formatStock(stock: number): string {
  const value = Number.isInteger(stock) ? stock.toString() : stock.toFixed(2).replace(/\.?0+$/, '');
  return `${value.replace('.', ',')} шт.`;
}
