import 'server-only';

import { siteApiGet } from '@site/shared/api-client';

import { mapProductIndexPage } from '../mappers/product-index.mapper';

import type { ProductIndexPageResult } from './product-index.types';
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
