import type { Product } from '../entities/product';

export interface ProductImage {
  kind: 'photo' | 'scheme';
  url: string;
}

/** Photos in their order, then the scheme: the order of the detail gallery and the full-screen viewer. */
export function productImages(product: Pick<Product, 'photos' | 'scheme'>): ProductImage[] {
  const photos = product.photos.map((url) => ({ kind: 'photo' as const, url }));
  return product.scheme ? [...photos, { kind: 'scheme', url: product.scheme }] : photos;
}

/** What is kept for offline use without asking: the main photo of every product and every scheme (R-008). */
export function essentialImageUrls(
  products: readonly Pick<Product, 'photos' | 'scheme'>[],
): string[] {
  const urls = new Set<string>();
  for (const product of products) {
    if (product.photos[0]) urls.add(product.photos[0]);
    if (product.scheme) urls.add(product.scheme);
  }
  return [...urls];
}

/** Every photo and scheme, for «Завантажити всі фото». */
export function allImageUrls(products: readonly Pick<Product, 'photos' | 'scheme'>[]): string[] {
  const urls = new Set<string>();
  for (const product of products) {
    for (const url of product.photos) urls.add(url);
    if (product.scheme) urls.add(product.scheme);
  }
  return [...urls];
}
