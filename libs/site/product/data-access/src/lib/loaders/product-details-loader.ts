import 'server-only';

import { isValidProductSlug } from '@site/product/model';
import {
  SiteApiUnavailableError,
  readWithoutCachingFailure,
  siteApiGet,
} from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { PRODUCT_CACHE_TAGS, PRODUCT_FAILURE_LIFE } from '../cache-tags';
import { categoryRedirectSlug } from '../contracts/product-redirect.parser';
import { mapProductDetails } from '../mappers/product-details.mapper';

import type { Locale } from '@site/core/i18n';
import type { ProductResult } from '@site/product/model';

const PRODUCT_PATH = '/api/catalog/{lang}/product/{productSlug}';

/**
 * Public facts only. The feature owns HTTP responses; no cookies, cart or session enter this cache. An API failure
 * is not cached: the next request reads the API again.
 */
export async function getProductDetails(locale: Locale, slug: string): Promise<ProductResult> {
  return readWithoutCachingFailure(() => readProductDetails(locale, slug), { kind: 'unavailable' });
}

async function readProductDetails(locale: Locale, slug: string): Promise<ProductResult> {
  'use cache';
  cacheTag(PRODUCT_CACHE_TAGS.all, PRODUCT_CACHE_TAGS.products, PRODUCT_CACHE_TAGS.slug(slug));
  if (!isValidProductSlug(slug)) {
    cacheLife(PRODUCT_FAILURE_LIFE);
    return { kind: 'not-found' };
  }

  const result = await siteApiGet(PRODUCT_PATH, {
    path: { lang: locale, productSlug: slug },
  });
  if (result.kind === 'ok') {
    const product = mapProductDetails(result.data);
    if (!product) throw new SiteApiUnavailableError(PRODUCT_PATH);
    cacheTag(PRODUCT_CACHE_TAGS.product(product.sku), PRODUCT_CACHE_TAGS.slug(product.slug));
    if (product.slug !== slug) {
      cacheLife(PRODUCT_FAILURE_LIFE);
      return { kind: 'moved', slug: product.slug, product };
    }
    cacheLife('hours');
    return { kind: 'ok', product };
  }

  // Including an unexpected 410: the current operation does not declare a separate gone response.
  if (result.kind !== 'not-found') throw new SiteApiUnavailableError(PRODUCT_PATH);
  cacheLife(PRODUCT_FAILURE_LIFE);
  const target = categoryRedirectSlug(result.body);
  return target ? { kind: 'category-redirect', slug: target } : { kind: 'not-found' };
}
