import { mapProductIdentity } from './product-identity';

import type { ApiProductPage } from '../contracts/product.dto';
import type { ProductIndexPageResult } from '../crawling/product-index.types';

type IndexPaging = { page: number; pageSize: number; totalPages: number; totalRecords: number };

/** Validate provider paging before a walker uses it to schedule further requests; null when it is sound. */
export function checkIndexPaging(
  info: IndexPaging,
  rows: number,
  requestedPage: number,
): Extract<ProductIndexPageResult, { kind: 'unavailable' }> | null {
  if (
    ![info.page, info.pageSize, info.totalPages, info.totalRecords].every(Number.isSafeInteger) ||
    info.page < 1 ||
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
    info.page !== requestedPage ||
    requestedPage > Math.max(1, info.totalPages) ||
    (!emptyFirstPage && info.totalPages !== expectedPages) ||
    rows !== expectedRows
  ) {
    return { kind: 'unavailable', reason: 'inconsistent' };
  }
  return null;
}

/** Validate provider paging before a walker uses it to schedule further requests. */
export function mapProductIndexPage(
  value: ApiProductPage,
  requestedPage: number,
): ProductIndexPageResult {
  if (!value || !Array.isArray(value.value) || !value.pagedInfo) {
    return { kind: 'unavailable', reason: 'invalid-page' };
  }
  const info = value.pagedInfo;
  const paging = checkIndexPaging(
    {
      page: info.pageNumber,
      pageSize: info.pageSize,
      totalPages: info.totalPages,
      totalRecords: info.totalRecords,
    },
    value.value.length,
    requestedPage,
  );
  if (paging) return paging;

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
