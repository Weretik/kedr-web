import { isValidProductSlug } from '@site/product/model';

import { checkIndexPaging } from './product-index.mapper';

import type { ApiSiteModelList } from '../contracts/product.dto';
import type { ProductIndexPageResult } from '../crawling/product-index.types';
import type { ProductIndexItem } from '@site/product/model';

/**
 * One page of model addresses for the product sitemap (spec site/product/002 R-06). A model slug is the same in
 * both languages, so it is also the identity that joins the language versions.
 */
export function mapModelIndexPage(
  value: ApiSiteModelList,
  requestedPage: number,
): ProductIndexPageResult {
  if (!value || !Array.isArray(value.items)) return { kind: 'unavailable', reason: 'invalid-page' };
  const paging = checkIndexPaging(value, value.items.length, requestedPage);
  if (paging) return paging;

  const seen = new Set<string>();
  const items: ProductIndexItem[] = [];
  for (const model of value.items) {
    const name = typeof model?.name === 'string' ? model.name.trim() : '';
    if (!name || !isValidProductSlug(model.slug) || seen.has(model.slug)) continue;
    seen.add(model.slug);
    items.push({ sku: model.slug, slug: model.slug, name });
  }
  return {
    kind: 'ok',
    page: {
      items,
      page: value.page,
      pageSize: value.pageSize,
      totalPages: value.totalPages,
      totalRecords: value.totalRecords,
    },
  };
}
