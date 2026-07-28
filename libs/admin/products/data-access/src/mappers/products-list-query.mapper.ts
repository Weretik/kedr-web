import type { AdminProductsListParams } from '../contracts/admin-products-list.contract';
import type { ProductsListQuery, ProductsListSort } from '@admin/products/model';

const sortToApiValue: Record<ProductsListSort, number> = {
  'id-asc': 0,
  'id-desc': 1,
  'name-asc': 2,
  'name-desc': 3,
  'price-asc': 4,
  'price-desc': 5,
};

export function mapProductsListQueryToApi(query: ProductsListQuery): AdminProductsListParams {
  return {
    SearchTerm: query.searchTerm,
    InStock: query.inStock,
    IsSale: query.isSale,
    IsNew: query.isNew,
    PriceFrom: query.priceFrom,
    PriceTo: query.priceTo,
    Sort: sortToApiValue[query.sort],
    Page: query.page,
    PageSize: query.pageSize,
  };
}
