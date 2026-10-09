import { baseApi } from '@mobile/shared/api-client';
import { defaultSerializeQueryArgs } from '@reduxjs/toolkit/query';

import { buildMissingPhotoProductsRequest } from './missing-photo-products.requests';
import { mapAdminCategories } from '../mappers/catalog-categories.mapper';
import { mapPublicProductDetails } from '../mappers/catalog-product-details.mapper';
import { mapAdminProductPage } from '../mappers/catalog-products.mapper';
import { mapMissingPhotoProductPage } from '../mappers/missing-photo-products.mapper';
import { mergeCatalogPages } from '../pagination/catalog-pages';
import { toCatalogProductsParams } from '../queries/catalog-query.mapper';
import { toProductDetailsRequest } from '../queries/product-details-query.mapper';

import type { MissingPhotoProductsQuery } from './missing-photo-products.requests';
import type {
  CatalogCategoryOption,
  CatalogPage,
  CatalogProductDetails,
  CatalogQuery,
} from '@mobile/catalog/model';

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogCategories: build.query<CatalogCategoryOption[], void>({
      providesTags: [{ type: 'Catalog', id: 'CATEGORIES' }],
      query: () => ({
        method: 'GET',
        url: '/api/categories',
      }),
      transformResponse: (response: unknown) => mapAdminCategories(response),
    }),
    getCatalogProducts: build.query<CatalogPage, CatalogQuery>({
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
      merge: mergeCatalogPages,
      providesTags: (result) => [
        { type: 'Catalog', id: 'LIST' },
        ...(result?.items.map((product) => ({ type: 'Catalog' as const, id: product.id })) ?? []),
      ],
      query: (query) => ({
        method: 'GET',
        params: toCatalogProductsParams(query),
        url: '/api/admin/products',
      }),
      serializeQueryArgs: ({ queryArgs, ...context }) =>
        defaultSerializeQueryArgs({
          ...context,
          queryArgs: { ...queryArgs, page: undefined },
        }),
      transformResponse: (response: unknown) => mapAdminProductPage(response),
    }),
    getCatalogProductDetails: build.query<CatalogProductDetails, string>({
      providesTags: (_result, _error, productSlug) => [{ type: 'Catalog', id: productSlug }],
      query: toProductDetailsRequest,
      transformResponse: (response: unknown) => mapPublicProductDetails(response),
    }),
    getMissingPhotoProducts: build.query<CatalogPage, MissingPhotoProductsQuery>({
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
      merge: mergeCatalogPages,
      providesTags: (result) => [
        { type: 'Catalog', id: 'MISSING_PHOTOS' },
        ...(result?.items.map((product) => ({ type: 'Catalog' as const, id: product.id })) ?? []),
      ],
      query: buildMissingPhotoProductsRequest,
      serializeQueryArgs: ({ queryArgs, ...context }) =>
        defaultSerializeQueryArgs({
          ...context,
          queryArgs: { ...queryArgs, page: undefined },
        }),
      transformResponse: (response: unknown) => mapMissingPhotoProductPage(response),
    }),
  }),
});

export const {
  useGetCatalogCategoriesQuery,
  useGetCatalogProductDetailsQuery,
  useGetCatalogProductsQuery,
  useGetMissingPhotoProductsQuery,
} = catalogApi;
