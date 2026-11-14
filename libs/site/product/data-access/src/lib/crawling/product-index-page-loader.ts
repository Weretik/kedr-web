import 'server-only';

import { siteApiGet } from '@site/shared/api-client';

import { mapModelIndexPage } from '../mappers/model-index.mapper';
import { mapProductIndexPage } from '../mappers/product-index.mapper';

import type { ProductIndexPageResult } from './product-index-page';
import type { Locale } from '@site/core/i18n';

/** Cache the complete index, not its pages, so an inconsistency retry actually reads a fresh attempt. */
export async function readProductIndexPage(
  locale: Locale,
  page: number,
): Promise<ProductIndexPageResult> {
  const result = await siteApiGet('/api/catalog/{lang}/products', {
    path: { lang: locale },
    query: { availability: 'All', sort: 'IdAsc', page, pageSize: 100, priceTypeId: 11 },
  });
  return result.kind === 'ok'
    ? mapProductIndexPage(result.data, page)
    : { kind: 'unavailable', reason: 'transport' };
}

/** Model addresses in name order; product addresses inside accepted models answer 308 and stay out. */
export async function readModelIndexPage(
  locale: Locale,
  page: number,
): Promise<ProductIndexPageResult> {
  const result = await siteApiGet('/api/catalog/{lang}/models', {
    path: { lang: locale },
    query: { sort: 'name_asc', page, pageSize: 100 },
  });
  return result.kind === 'ok'
    ? mapModelIndexPage(result.data, page)
    : { kind: 'unavailable', reason: 'transport' };
}
