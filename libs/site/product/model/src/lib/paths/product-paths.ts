/** Slugs are opaque provider-owned path segments, never generated from a product name. */
export function isValidProductSlug(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value !== '.' &&
    value !== '..' &&
    !/[\u0000-\u0020\u007f/\\?#%]/u.test(value)
  );
}

export function productPath(slug: string): string {
  if (!isValidProductSlug(slug)) throw new TypeError('A product slug must be a safe path segment');
  return `/product/${encodeURIComponent(slug)}`;
}
