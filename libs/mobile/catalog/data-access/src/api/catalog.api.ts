import { baseApi } from '@mobile/shared/api-client';

import { mapAdminCategories } from '../mappers/catalog-categories.mapper';
import { mapPublicProductDetails } from '../mappers/catalog-product-details.mapper';
import { mapAdminProductPage } from '../mappers/catalog-products.mapper';
import { toCatalogProductsParams } from '../queries/catalog-query.mapper';
import { toProductDetailsRequest } from '../queries/product-details-query.mapper';

import type { AdminCategoryDto } from '../contracts/admin-categories.dto';
import type { AdminProductPageDto } from '../contracts/admin-products.dto';
import type { PublicProductDetailsDto } from '../contracts/public-product-details.dto';
import type {
  CatalogCategoryOption,
  CatalogPage,
  CatalogProductDetails,
  CatalogQuery,
} from '@mobile/catalog/model';

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogCategories: build.query<CatalogCategoryOption[], void>({
      query: () => ({
        method: 'GET',
        url: '/api/categories',
      }),
      transformResponse: (response: AdminCategoryDto[]) => mapAdminCategories(response),
    }),
    getCatalogProducts: build.query<CatalogPage, CatalogQuery>({
      query: (query) => ({
        method: 'GET',
        params: toCatalogProductsParams(query),
        url: '/api/admin/products',
      }),
      transformResponse: (response: AdminProductPageDto) => mapAdminProductPage(response),
    }),
    getCatalogProductDetails: build.query<CatalogProductDetails, string>({
      query: toProductDetailsRequest,
      transformResponse: (response: PublicProductDetailsDto) => mapPublicProductDetails(response),
    }),
  }),
});

export const {
  useGetCatalogCategoriesQuery,
  useGetCatalogProductDetailsQuery,
  useGetCatalogProductsQuery,
} = catalogApi;
