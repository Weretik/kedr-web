import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { PRODUCT_CACHE_TAGS, PRODUCT_FAILURE_LIFE } from '../cache-tags';
import { readModelIndexPage, readProductIndexPage } from './product-index-page-loader';
import { walkProductIndex } from './product-index-walker';

import type { Locale } from '@site/core/i18n';
import type { ProductIndexResult } from '@site/product/model';

const cacheResult = (result: ProductIndexResult) => {
  if (result.kind === 'ok') cacheLife('hours');
  else cacheLife(PRODUCT_FAILURE_LIFE);
  return result;
};

/** Read one real page only; route preparation validates a candidate against detail before prerendering. */
export async function getProductPrerenderCandidates(locale: Locale): Promise<ProductIndexResult> {
  'use cache';
  cacheTag(PRODUCT_CACHE_TAGS.all, PRODUCT_CACHE_TAGS.products, PRODUCT_CACHE_TAGS.index);
  const result = await readProductIndexPage(locale, 1);
  return cacheResult(result.kind === 'ok' ? { kind: 'ok', items: result.page.items } : result);
}

/**
 * One locale's bounded public index of page addresses for the sitemap: model slugs, including a product shown as a
 * model of its own. No detail requests or invented modification dates.
 */
export async function getProductIndex(locale: Locale): Promise<ProductIndexResult> {
  'use cache';
  cacheTag(PRODUCT_CACHE_TAGS.all, PRODUCT_CACHE_TAGS.models, PRODUCT_CACHE_TAGS.index);
  return cacheResult(await walkProductIndex((page) => readModelIndexPage(locale, page)));
}
