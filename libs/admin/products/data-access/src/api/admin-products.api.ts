import { normalizeProductsListQuery } from '@admin/products/model';
import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapAdminProductCategories } from '../mappers/admin-product-categories.mapper';
import {
  mapAdminProductsListResponse,
  mapAllAdminProductsResponse,
} from '../mappers/admin-products-list.mapper';
import { mapProductMedia, toSetProductMediaBody } from '../mappers/product-media.mapper';
import { mapAdminProductDetailsResponse } from '../mappers/product-read.mapper';
import {
  mapMissingPhotoQueryToApi,
  mapProductsListQueryToApi,
} from '../mappers/products-list-query.mapper';

import type {
  MissingPhotoQuery,
  AdminProductListItem,
  ProductDetails,
  ProductMedia,
  ProductMediaChange,
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
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/admin/products/all', { signal }), mapAllAdminProductsResponse),
      providesTags: ['Products'],
    }),
    getProductsList: build.query<ProductsListPage, ProductsListQuery>({
      providesTags: (result) => [
        { type: 'Products', id: 'LIST' },
        ...(result?.items.map((product) => ({ type: 'Products' as const, id: product.id })) ?? []),
      ],
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/products', {
            params: { query: mapProductsListQueryToApi(normalizeProductsListQuery(query)) },
            signal,
          }),
          mapAdminProductsListResponse,
        ),
    }),
    getAdminProductCategories: build.query<ReturnType<typeof mapAdminProductCategories>, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/categories', { signal }), mapAdminProductCategories),
    }),
    getMissingPhotoProducts: build.query<ProductsListPage, MissingPhotoQuery>({
      providesTags: [{ type: 'Products', id: 'LIST' }],
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/products', {
            params: { query: mapMissingPhotoQueryToApi(query) },
            signal,
          }),
          mapAdminProductsListResponse,
        ),
    }),
    getAdminProductDetails: build.query<ProductDetails, string>({
      queryFn: (slug, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/products/by-slug/{productSlug}', {
            params: { path: { productSlug: slug } },
            signal,
          }),
          mapAdminProductDetailsResponse,
        ),
      providesTags: (result) => (result ? [{ type: 'Products' as const, id: result.id }] : []),
    }),
    getProductMedia: build.query<ProductMedia, number>({
      queryFn: (productId, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/products/{id}/media', {
            params: { path: { id: productId } },
            signal,
          }),
          mapProductMedia,
        ),
      providesTags: (_result, _error, productId) => [
        { type: 'Products', id: `media-${productId}` },
      ],
    }),
    /** Replaces the whole set; the details and lists refresh because the list photo can change. */
    setProductMedia: build.mutation<
      ProductMedia,
      { productId: number; change: ProductMediaChange }
    >({
      queryFn: ({ productId, change }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/products/{id}/media', {
            params: { path: { id: productId } },
            body: toSetProductMediaBody(change),
            signal,
          }),
          mapProductMedia,
        ),
      async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(productsApi.util.upsertQueryData('getProductMedia', productId, data));
        } catch {
          // The page shows the error from the mutation result.
        }
      },
      invalidatesTags: (_result, error, { productId }) =>
        error
          ? []
          : [
              { type: 'Products', id: productId },
              { type: 'Products', id: 'LIST' },
            ],
    }),
    changeProductSlug: build.mutation<ChangeSlugResult, { id: number; input: ProductSlugChange }>({
      queryFn: ({ id, input }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/products/{id}/slug', {
            params: { path: { id } },
            body: ('regenerate' in input
              ? { slug: null, regenerate: true }
              : { slug: input.slug, regenerate: false }) satisfies ChangeSlugBody,
            signal,
          }),
        ),
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
  useGetProductMediaQuery,
  useSetProductMediaMutation,
} = productsApi;
