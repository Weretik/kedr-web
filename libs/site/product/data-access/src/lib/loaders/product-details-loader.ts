import 'server-only';

import { isValidProductSlug } from '@site/product/model';
import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { PRODUCT_CACHE_TAGS, PRODUCT_FAILURE_LIFE } from '../cache-tags';
import { categoryRedirectSlug } from '../contracts/product-redirect.parser';
import { mapProductDetails } from '../mappers/product-details.mapper';

import type { Locale } from '@site/core/i18n';
import type { ProductResult } from '@site/product/model';

/** Public facts only. The feature owns HTTP responses; no cookies, cart or session enter this cache. */
export async function getProductDetails(locale: Locale, slug: string): Promise<ProductResult> {
  'use cache';
  cacheTag(PRODUCT_CACHE_TAGS.all, PRODUCT_CACHE_TAGS.products, PRODUCT_CACHE_TAGS.slug(slug));
  if (!isValidProductSlug(slug)) {
    cacheLife(PRODUCT_FAILURE_LIFE);
    return { kind: 'not-found' };
  }

  const result = await siteApiGet('/api/catalog/{lang}/product/{productSlug}', {
    path: { lang: locale, productSlug: slug },
    query: { priceTypeId: 11 },
  });
  if (result.kind === 'ok') {
    const product = mapProductDetails(result.data);
    if (!product) {
      cacheLife(PRODUCT_FAILURE_LIFE);
      return { kind: 'unavailable' };
    }
    cacheTag(PRODUCT_CACHE_TAGS.product(product.sku), PRODUCT_CACHE_TAGS.slug(product.slug));
    if (product.slug !== slug) {
      cacheLife(PRODUCT_FAILURE_LIFE);
      return { kind: 'moved', slug: product.slug, product };
    }
    cacheLife('hours');
    return { kind: 'ok', product };
  }

  cacheLife(PRODUCT_FAILURE_LIFE);
  if (result.kind === 'not-found') {
    const target = categoryRedirectSlug(result.body);
    return target ? { kind: 'category-redirect', slug: target } : { kind: 'not-found' };
  }
  // Including an unexpected 410: the current operation does not declare a separate gone response.
  return { kind: 'unavailable' };
}
