// Locale-free catalog URLs (owner decision 2026-10-30: flat addresses). Add the locale with `localizedPath`.

export const CATALOG_PATH = '/catalog';

export const SEARCH_PATH = '/search';

export function categoryPath(slug: string): string {
  return `${CATALOG_PATH}/${encodeURIComponent(slug)}`;
}

export function productPath(slug: string): string {
  return `/product/${encodeURIComponent(slug)}`;
}
