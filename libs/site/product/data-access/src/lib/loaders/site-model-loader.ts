import 'server-only';

import { isValidProductSlug } from '@site/product/model';
import {
  SiteApiUnavailableError,
  readWithoutCachingFailure,
  siteApiGet,
} from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { PRODUCT_CACHE_TAGS, PRODUCT_FAILURE_LIFE } from '../cache-tags';
import { mapSiteModel, parseModelAddress } from '../mappers/site-model.mapper';

import type { Locale } from '@site/core/i18n';
import type { SiteModelResult } from '@site/product/model';

const MODEL_PATH = '/api/catalog/{lang}/model/{modelSlug}';

/**
 * The model page facts (spec site/product/002); the feature owns the 308 and the fallback to the product page.
 * An API failure is not cached: the next request reads the API again.
 */
export async function getSiteModel(locale: Locale, slug: string): Promise<SiteModelResult> {
  return readWithoutCachingFailure(() => readSiteModel(locale, slug), { kind: 'unavailable' });
}

async function readSiteModel(locale: Locale, slug: string): Promise<SiteModelResult> {
  'use cache';
  cacheTag(PRODUCT_CACHE_TAGS.all, PRODUCT_CACHE_TAGS.models, PRODUCT_CACHE_TAGS.slug(slug));
  if (!isValidProductSlug(slug)) {
    cacheLife(PRODUCT_FAILURE_LIFE);
    return { kind: 'not-found' };
  }

  const result = await siteApiGet(MODEL_PATH, {
    path: { lang: locale, modelSlug: slug },
  });
  if (result.kind === 'ok') {
    const model = mapSiteModel(result.data);
    if (!model) throw new SiteApiUnavailableError(MODEL_PATH);
    cacheLife('hours');
    return { kind: 'ok', model };
  }
  if (result.kind === 'not-found') {
    const address = parseModelAddress(result.body);
    if (!address) {
      cacheLife(PRODUCT_FAILURE_LIFE);
      return { kind: 'not-found' };
    }
    cacheLife('hours');
    return { kind: 'moved', ...address };
  }
  throw new SiteApiUnavailableError(MODEL_PATH);
}
