import { normalizeProductsListQuery } from '@admin/products/model';
import { baseApi } from '@admin/shared/api-client';

import { mapAdminProductsListResponse } from '../mappers/admin-products-list.mapper';
import { mapProductsListQueryToApi } from '../mappers/products-list-query.mapper';

import type { ProductsListPage, ProductsListQuery } from '@admin/products/model';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProductsList: build.query<ProductsListPage, ProductsListQuery>({
      providesTags: (result) => [
        { type: 'Products', id: 'LIST' },
        ...(result?.items.map((product) => ({ type: 'Products' as const, id: product.id })) ?? []),
      ],
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
