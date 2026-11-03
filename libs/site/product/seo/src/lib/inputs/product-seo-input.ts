import type { Locale } from '@site/core/i18n';

export type ProductSeoInput = {
  locale: Locale;
  /** Locale-free canonical product path, supplied by the domain feature. */
  path: string;
  name: string;
  sku: string;
  categoryName: string;
  price: number | null;
  inStock: boolean;
  images: readonly string[];
  breadcrumbs: readonly { name: string; path: string }[];
  /** Only locale-specific URLs confirmed for this product identity. */
  languagePaths: Partial<Record<Locale, string>>;
};
