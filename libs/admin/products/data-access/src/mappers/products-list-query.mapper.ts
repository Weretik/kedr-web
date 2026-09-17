import type { AdminProductsListParams } from '../contracts/admin-products-list.contract';
import type { ProductsListQuery, ProductsListSort } from '@admin/products/model';

const sortToApiValue: Record<ProductsListSort, NonNullable<AdminProductsListParams['sort']>> = {
  'id-asc': 'IdAsc',
  'id-desc': 'IdDesc',
  'name-asc': 'NameAsc',
  'name-desc': 'NameDesc',
  'price-asc': 'PriceAsc',
  'price-desc': 'PriceDesc',
};

export function mapProductsListQueryToApi(query: ProductsListQuery): AdminProductsListParams {
  return {
    searchTerm: query.searchTerm,
    inStock: query.inStock,
    isSale: query.isSale,
    isNew: query.isNew,
    priceFrom: query.priceFrom,
    priceTo: query.priceTo,
    sort: sortToApiValue[query.sort],
    page: query.page,
    pageSize: query.pageSize,
  };
}
