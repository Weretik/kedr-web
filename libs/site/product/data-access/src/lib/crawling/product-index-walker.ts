import type { ProductIndexPage, ProductIndexPageReader } from './product-index.types';
import type { ProductIndexItem, ProductIndexResult } from '@site/product/model';

/** Finite operational budget: at most 100,000 source rows per locale at 100 rows/page. */
export const PRODUCT_INDEX_PAGE_LIMIT = 1000;

const samePaging = (first: ProductIndexPage, next: ProductIndexPage) =>
  first.pageSize === next.pageSize &&
  first.totalPages === next.totalPages &&
  first.totalRecords === next.totalRecords;

async function readAttempt(readPage: ProductIndexPageReader): Promise<ProductIndexResult> {
  const initial = await readPage(1);
  if (initial.kind !== 'ok') return initial;
  const first = initial.page;
  if (first.totalPages > PRODUCT_INDEX_PAGE_LIMIT) {
    return { kind: 'unavailable', reason: 'page-limit' };
  }

  const items: ProductIndexItem[] = [];
  const skus = new Set<string>();
  const slugs = new Set<string>();
  const append = (page: ProductIndexPage) => {
    for (const item of page.items) {
      if (skus.has(item.sku) || slugs.has(item.slug)) return false;
      skus.add(item.sku);
      slugs.add(item.slug);
      items.push(item);
    }
    return true;
  };
  append(first);
  for (let number = 2; number <= first.totalPages; number++) {
    const next = await readPage(number);
    if (next.kind !== 'ok') return next;
    if (!samePaging(first, next.page) || !append(next.page)) {
      return { kind: 'unavailable', reason: 'inconsistent' };
    }
  }
  return { kind: 'ok', items };
}

/** Offset paging cannot prove an atomic snapshot. Retry one observable inconsistency, never publish a prefix. */
export async function walkProductIndex(
  readPage: ProductIndexPageReader,
): Promise<ProductIndexResult> {
  const result = await readAttempt(readPage);
  return result.kind === 'unavailable' && result.reason === 'inconsistent'
    ? readAttempt(readPage)
    : result;
}
