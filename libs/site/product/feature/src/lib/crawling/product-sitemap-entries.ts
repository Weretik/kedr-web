import { siteConfig } from '@site/core/config';
import { LOCALES, LOCALE_LANGUAGE_TAGS, localizedPath } from '@site/core/i18n';
import { isValidProductSlug, productPath } from '@site/product/model';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { ProductIndexItem } from '@site/product/model';
import type { MetadataRoute } from 'next';

export type ProductLocaleIndexes = Record<Locale, readonly ProductIndexItem[]>;

function normalizeIndex(items: readonly ProductIndexItem[], locale: Locale) {
  const bySku = new Map<string, ProductIndexItem>();
  const bySlug = new Map<string, string>();
  for (const item of items) {
    if (
      typeof item.sku !== 'string' ||
      !item.sku.trim() ||
      item.sku.trim() !== item.sku ||
      !item.name.trim() ||
      !isValidProductSlug(item.slug)
    )
      continue;
    const previous = bySku.get(item.sku);
    const previousSku = bySlug.get(item.slug);
    if ((previous && previous.slug !== item.slug) || (previousSku && previousSku !== item.sku)) {
      throw new Error('Conflicting canonical identity in product index: ' + locale);
    }
    bySku.set(item.sku, item);
    bySlug.set(item.slug, item.sku);
  }
  return bySku;
}

/** A language URL exists only when that locale's list confirms the same SKU and its current slug. */
export function buildProductSitemapEntries(
  indexes: ProductLocaleIndexes,
  config: Pick<SiteConfig, 'siteUrl'> = siteConfig,
): MetadataRoute.Sitemap {
  const normalized = {
    uk: normalizeIndex(indexes.uk, 'uk'),
    ru: normalizeIndex(indexes.ru, 'ru'),
  };
  const skus = [...new Set(LOCALES.flatMap((locale) => [...normalized[locale].keys()]))].sort();
  const entries: MetadataRoute.Sitemap = [];
  for (const sku of skus) {
    const languages: Record<string, string> = {};
    const urls: Partial<Record<Locale, string>> = {};
    for (const locale of LOCALES) {
      const item = normalized[locale].get(sku);
      if (!item) continue;
      const url = new URL(localizedPath(locale, productPath(item.slug)), config.siteUrl).toString();
      urls[locale] = url;
      languages[LOCALE_LANGUAGE_TAGS[locale]] = url;
    }
    if (urls.uk) languages['x-default'] = urls.uk;
    for (const locale of LOCALES) {
      const url = urls[locale];
      if (url) entries.push({ url, alternates: { languages: { ...languages } } });
    }
  }
  return entries;
}
