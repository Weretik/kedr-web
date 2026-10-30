import { normalizeProductsListQuery } from '@admin/products/model';
import { baseApi } from '@admin/shared/api-client';

import { mapAdminProductCategories } from '../mappers/admin-product-categories.mapper';
import {
  mapAdminProductsListResponse,
  mapAllAdminProductsResponse,
} from '../mappers/admin-products-list.mapper';
import {
  mapAdminProductDetailsResponse,
  mapMissingPhotoProductsResponse,
} from '../mappers/product-read.mapper';
import {
  mapMissingPhotoQueryToApi,
  mapProductsListQueryToApi,
} from '../mappers/products-list-query.mapper';

import type {
  MissingPhotoQuery,
  AdminProductListItem,
  ProductDetails,
  ProductsListPage,
  ProductsListQuery,
} from '@admin/products/model';
import type { components } from '@shared/api-contracts';

type ChangeSlugBody = components['schemas']['ChangeSlugRequest'];
type ChangeSlugResult = components['schemas']['ChangeSlugResponse'];

/** A typed address or a request to rebuild it from the name. */
export type ProductSlugChange = { slug: string } | { regenerate: true };

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllAdminProducts: build.query<AdminProductListItem[], void>({
      query: () => ({ url: '/api/admin/products/all', method: 'GET' }),
      transformResponse: mapAllAdminProductsResponse,
      providesTags: ['Products'],
    }),
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
    getAdminProductCategories: build.query<ReturnType<typeof mapAdminProductCategories>, void>({
      query: () => ({ url: '/api/categories', method: 'GET' }),
      transformResponse: mapAdminProductCategories,
    }),
    getMissingPhotoProducts: build.query<ProductsListPage, MissingPhotoQuery>({
      query: (query) => ({
        url: '/api/admin/products/missing-photos',
        method: 'GET',
        params: mapMissingPhotoQueryToApi(query),
      }),
      transformResponse: mapMissingPhotoProductsResponse,
    }),
    getAdminProductDetails: build.query<ProductDetails, string>({
      query: (slug) => ({
        url: `/api/admin/products/by-slug/${encodeURIComponent(slug)}`,
        method: 'GET',
      }),
      transformResponse: mapAdminProductDetailsResponse,
      providesTags: (result) => (result ? [{ type: 'Products' as const, id: result.id }] : []),
    }),
    changeProductSlug: build.mutation<ChangeSlugResult, { id: number; input: ProductSlugChange }>({
      query: ({ id, input }) => ({
        url: `/api/admin/products/${id}/slug`,
        method: 'PUT',
        data: ('regenerate' in input
          ? { regenerate: true }
          : { slug: input.slug, regenerate: false }) satisfies ChangeSlugBody,
      }),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: 'Products', id },
              { type: 'Products', id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useChangeProductSlugMutation,
  useGetAllAdminProductsQuery,
  useGetProductsListQuery,
  useGetMissingPhotoProductsQuery,
  useGetAdminProductDetailsQuery,
  useGetAdminProductCategoriesQuery,
} = productsApi;
