import { baseApi } from '@admin/shared/api-client';

import { mapAdminProductsListResponse } from '../mappers/admin-products-list.mapper';
import { mapProductsListQueryToApi } from '../mappers/products-list-query.mapper';
import { normalizeProductsListQuery } from '../models/products-list-query';

import type { ProductsListPage, ProductsListQuery } from '../models/products-list.types';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProductsList: build.query<ProductsListPage, ProductsListQuery>({
      query: (query) => ({
        url: '/api/admin/products',
        method: 'GET',
        params: mapProductsListQueryToApi(normalizeProductsListQuery(query)),
      }),
      transformResponse: mapAdminProductsListResponse,
    }),
  }),
});

export const { useGetProductsListQuery } = productsApi;
