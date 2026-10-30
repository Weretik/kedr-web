// Locale-free catalog URLs; they keep the current storefront addresses. Add the locale with `localizedPath`.

export const ALL_PRODUCTS_PATH = '/catalog/products';

export function categoryPath(slug: string): string {
  return `/catalog/${encodeURIComponent(slug)}/products`;
}

export function productPath(slug: string): string {
  return `/catalog/product/${encodeURIComponent(slug)}`;
}
