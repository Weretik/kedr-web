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
    }),
  }),
});

export const {
  useGetAllAdminProductsQuery,
  useGetProductsListQuery,
  useGetMissingPhotoProductsQuery,
  useGetAdminProductDetailsQuery,
  useGetAdminProductCategoriesQuery,
} = productsApi;
