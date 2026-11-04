import { normalizeProductsListQuery } from '@admin/products/model';
import { baseApi } from '@admin/shared/api-client';

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
      providesTags: [{ type: 'Products', id: 'LIST' }],
      query: (query) => ({
        url: '/api/admin/products',
        method: 'GET',
        params: mapMissingPhotoQueryToApi(query),
      }),
      transformResponse: mapAdminProductsListResponse,
    }),
    getAdminProductDetails: build.query<ProductDetails, string>({
      query: (slug) => ({
        url: `/api/admin/products/by-slug/${encodeURIComponent(slug)}`,
        method: 'GET',
      }),
      transformResponse: mapAdminProductDetailsResponse,
      providesTags: (result) => (result ? [{ type: 'Products' as const, id: result.id }] : []),
    }),
    getProductMedia: build.query<ProductMedia, number>({
      query: (productId) => ({ url: `/api/admin/products/${productId}/media`, method: 'GET' }),
      transformResponse: mapProductMedia,
      providesTags: (_result, _error, productId) => [
        { type: 'Products', id: `media-${productId}` },
      ],
    }),
    /** Replaces the whole set; the details and lists refresh because the list photo can change. */
    setProductMedia: build.mutation<
      ProductMedia,
      { productId: number; change: ProductMediaChange }
    >({
      query: ({ productId, change }) => ({
        url: `/api/admin/products/${productId}/media`,
        method: 'PUT',
        data: toSetProductMediaBody(change),
      }),
      transformResponse: mapProductMedia,
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
  useGetProductMediaQuery,
  useSetProductMediaMutation,
} = productsApi;
