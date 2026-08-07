import { baseApi } from '@mobile/shared/api-client';

import { mapAdminCategories } from '../mappers/catalog-categories.mapper';
import { mapAdminProductPage } from '../mappers/catalog-products.mapper';
import { toCatalogProductsParams } from '../queries/catalog-query.mapper';

import type { AdminCategoryDto } from '../contracts/admin-categories.dto';
import type { AdminProductPageDto } from '../contracts/admin-products.dto';
import type { CatalogCategoryOption, CatalogPage, CatalogQuery } from '@mobile/catalog/model';

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
  }),
});

export const { useGetCatalogCategoriesQuery, useGetCatalogProductsQuery } = catalogApi;
