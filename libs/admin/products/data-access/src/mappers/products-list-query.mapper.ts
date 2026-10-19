import type { AdminProductsListParams } from '../contracts/admin-products-list.contract';
import type { MissingPhotoQuery, ProductsListQuery, ProductsListSort } from '@admin/products/model';
import type { operations } from '@shared/api-contracts';

type MissingPhotoParams = NonNullable<operations['getAdminProductsWithUnavailablePhotos']['parameters']['query']>;

const sortToApiValue: Record<ProductsListSort, NonNullable<AdminProductsListParams['sort']>> = {
  'id-asc': 'IdAsc',
  'id-desc': 'IdDesc',
  'name-asc': 'NameAsc',
  'name-desc': 'NameDesc',
  'price-asc': 'PriceAsc',
  'price-desc': 'PriceDesc',
  'category-asc': 'CategoryAsc',
  'category-desc': 'CategoryDesc',
};

export function mapProductsListQueryToApi(query: ProductsListQuery) {
  return {
    searchTerm: query.searchTerm,
    inStock: query.inStock,
    isSale: query.isSale,
    isNew: query.isNew,
    exportToSite: query.exportToSite,
    categoryId: query.categoryId,
    priceFrom: query.priceFrom,
    priceTo: query.priceTo,
    sort: sortToApiValue[query.sort],
    page: query.page,
    pageSize: query.pageSize,
  } satisfies AdminProductsListParams;
}

export function mapMissingPhotoQueryToApi(query: MissingPhotoQuery) {
  return {
    searchTerm: query.searchTerm?.trim().slice(0, 100) || undefined,
    inStock: query.inStock,
    isSale: query.isSale,
    isNew: query.isNew,
    exportToSite: query.exportToSite,
    categoryId: query.categoryId,
    sort: sortToApiValue[query.sort],
    page: query.page,
    pageSize: query.pageSize,
  } satisfies MissingPhotoParams;
}
