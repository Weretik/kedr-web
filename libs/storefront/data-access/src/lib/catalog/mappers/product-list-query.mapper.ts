import {
  GetProductListQuery,
  ProductListQuery,
  ProductListSortUi,
  ProductSort,
} from '@storefront/contracts';

export function mapProductListQueryToApi(
  query: ProductListQuery,
): GetProductListQuery {
  return {
    SearchTerm: query.search?.trim() || undefined,

    InStock: toBool(query.inStock),
    IsSale: toBool(query.isSale),
    IsNew: toBool(query.isNew),

    PriceFrom: toDecimal(query.priceFrom),
    PriceTo: toDecimal(query.priceTo),

    Sort: mapSortUiToApi(query.sort),

    Page: toInt(query.page) ?? 1,
    PageSize: toInt(query.pageSize) ?? 20,
  };
}

export function mapSortUiToApi(
  sort: ProductListSortUi | undefined,
): ProductSort | undefined {
  if (!sort) return undefined;

  switch (sort) {
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
