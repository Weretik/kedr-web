import { GetProductListQuery, ProductSort } from '@storefront/contracts';

import { ProductListQuery, ProductListSortUi } from '../models/product-list-query.model';

export function mapProductListQueryToApi(query: ProductListQuery): GetProductListQuery {
  return {
    searchTerm: query.search?.trim() || undefined,

    inStock: toBool(query.inStock),
    isSale: toBool(query.isSale),
    isNew: toBool(query.isNew),

    priceFrom: toDecimal(query.priceFrom),
    priceTo: toDecimal(query.priceTo),

    sort: mapSortUiToApi(query.sort),

    page: toInt(query.page) ?? 1,
    pageSize: toInt(query.pageSize) ?? 50,
  };
}

export function mapSortUiToApi(sort: ProductListSortUi | undefined): ProductSort | undefined {
  if (!sort) return undefined;

  switch (sort) {
    case 'id-asc':
      return ProductSort.IdAsc;
    case 'id-desc':
      return ProductSort.IdDesc;
    case 'name-asc':
      return ProductSort.NameAsc;
    case 'name-desc':
      return ProductSort.NameDesc;
    case 'price-asc':
      return ProductSort.PriceAsc;
    case 'price-desc':
      return ProductSort.PriceDesc;
    default:
      return undefined;
  }
}

// ===== helpers =====

function toInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isInteger(n) ? n : undefined;
}

function toDecimal(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function toBool(value: string | null | undefined): boolean | undefined {
  if (value === null || value === undefined) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;

  return undefined;
}
