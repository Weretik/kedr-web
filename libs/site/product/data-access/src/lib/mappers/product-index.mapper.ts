import { mapProductIdentity } from './product-identity';

import type { ApiProductPage } from '../contracts/product.dto';
import type { ProductIndexPageResult } from '../crawling/product-index.types';

/** Validate provider paging before a walker uses it to schedule further requests. */
export function mapProductIndexPage(
  value: ApiProductPage,
  requestedPage: number,
): ProductIndexPageResult {
  if (!value || !Array.isArray(value.value) || !value.pagedInfo) {
    return { kind: 'unavailable', reason: 'invalid-page' };
  }
  const info = value.pagedInfo;
  if (
    ![info.pageNumber, info.pageSize, info.totalPages, info.totalRecords].every(
      Number.isSafeInteger,
    ) ||
    info.pageNumber < 1 ||
    info.pageSize < 1 ||
    info.pageSize > 100 ||
    info.totalPages < 0 ||
    info.totalRecords < 0
  ) {
    return { kind: 'unavailable', reason: 'invalid-page' };
  }
  const expectedPages = Math.ceil(info.totalRecords / info.pageSize);
  const emptyFirstPage = info.totalRecords === 0 && [0, 1].includes(info.totalPages);
  const expectedRows = Math.min(
    info.pageSize,
    Math.max(0, info.totalRecords - (requestedPage - 1) * info.pageSize),
  );
  if (
    info.pageNumber !== requestedPage ||
    requestedPage > Math.max(1, info.totalPages) ||
    (!emptyFirstPage && info.totalPages !== expectedPages) ||
    value.value.length !== expectedRows
  ) {
    return { kind: 'unavailable', reason: 'inconsistent' };
  }

  const bySku = new Map<string, string>();
  const bySlug = new Map<string, string>();
  const items = [];
  for (const source of value.value) {
    const item = mapProductIdentity(source);
    if (!item) continue;
    const existingSlug = bySku.get(item.sku);
    const existingSku = bySlug.get(item.slug);
    if ((existingSlug && existingSlug !== item.slug) || (existingSku && existingSku !== item.sku)) {
      return { kind: 'unavailable', reason: 'inconsistent' };
    }
    if (existingSlug || existingSku) continue;
    bySku.set(item.sku, item.slug);
    bySlug.set(item.slug, item.sku);
    items.push(item);
  }
  return {
    kind: 'ok',
    page: {
      items,
      page: info.pageNumber,
      pageSize: info.pageSize,
      totalPages: info.totalPages,
      totalRecords: info.totalRecords,
    },
  };
}
