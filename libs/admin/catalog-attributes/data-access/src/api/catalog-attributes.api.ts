import { baseApi } from '@admin/shared/api-client';

import {
  mapCatalogAttributeDetails,
  mapCatalogAttributes,
  mapCategoryFilters,
  mapCodeDecisionResult,
  mapFilterCategories,
  mapUnresolvedCodes,
  toValueBody,
} from '../mappers/catalog-attributes.mapper';

import type {
  CatalogAttribute,
  CatalogAttributeChange,
  CatalogAttributeDetails,
  CatalogAttributeValueChange,
  CategoryFilter,
  CodeDecision,
  CodeDecisionResult,
  FilterCategoryOption,
  UnresolvedCode,
} from '@admin/catalog-attributes/model';

const listTag = { type: 'CatalogAttributes' as const, id: 'LIST' };
const codesTag = { type: 'CatalogAttributes' as const, id: 'CODES' };
const filtersTag = (categoryId: number) => ({
  type: 'CatalogAttributes' as const,
  id: `filters-${categoryId}`,
});

/** The «Властивості» page (spec catalog/006): Managers read, Admins change. */
export const catalogAttributesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogAttributes: build.query<CatalogAttribute[], void>({
      query: () => ({ url: '/api/admin/catalog-attributes', method: 'GET' }),
      transformResponse: mapCatalogAttributes,
      providesTags: [listTag],
    }),
    getCatalogAttribute: build.query<CatalogAttributeDetails, number>({
      query: (id) => ({ url: `/api/admin/catalog-attributes/${id}`, method: 'GET' }),
      transformResponse: mapCatalogAttributeDetails,
      providesTags: (_result, _error, id) => [{ type: 'CatalogAttributes', id }],
    }),
    updateCatalogAttribute: build.mutation<
      CatalogAttributeDetails,
      { id: number; change: CatalogAttributeChange }
    >({
      query: ({ id, change }) => ({
        url: `/api/admin/catalog-attributes/${id}`,
        method: 'PUT',
        data: { ...change, nameUk: change.nameUk.trim(), nameRu: change.nameRu?.trim() || null },
      }),
      transformResponse: mapCatalogAttributeDetails,
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [listTag, { type: 'CatalogAttributes', id }, 'Products'],
    }),
    createAttributeValue: build.mutation<
      CatalogAttributeDetails,
      { attributeId: number; change: CatalogAttributeValueChange }
    >({
      query: ({ attributeId, change }) => ({
        url: `/api/admin/catalog-attributes/${attributeId}/values`,
        method: 'POST',
        data: toValueBody(change),
      }),
      transformResponse: mapCatalogAttributeDetails,
      invalidatesTags: (_result, error, { attributeId }) =>
        error ? [] : [listTag, { type: 'CatalogAttributes', id: attributeId }],
    }),
    updateAttributeValue: build.mutation<
      CatalogAttributeDetails,
      { attributeId: number; valueId: number; change: CatalogAttributeValueChange }
    >({
      query: ({ attributeId, valueId, change }) => ({
        url: `/api/admin/catalog-attributes/${attributeId}/values/${valueId}`,
        method: 'PUT',
        data: toValueBody(change),
      }),
      transformResponse: mapCatalogAttributeDetails,
      invalidatesTags: (_result, error, { attributeId }) =>
        error ? [] : [{ type: 'CatalogAttributes', id: attributeId }, 'Products'],
    }),
    getUnresolvedCodes: build.query<UnresolvedCode[], void>({
      query: () => ({ url: '/api/admin/catalog-attributes/unresolved-codes', method: 'GET' }),
      transformResponse: mapUnresolvedCodes,
      providesTags: [codesTag],
    }),
    decideAttributeCode: build.mutation<
      CodeDecisionResult,
      { aliasId: number; decision: CodeDecision }
    >({
      query: ({ aliasId, decision }) => ({
        url: `/api/admin/catalog-attributes/codes/${aliasId}`,
        method: 'PUT',
        data: decision,
      }),
      transformResponse: mapCodeDecisionResult,
      invalidatesTags: (_result, error) =>
        error ? [] : [codesTag, 'CatalogAttributes', 'Products'],
    }),
    getFilterCategories: build.query<FilterCategoryOption[], void>({
      query: () => ({ url: '/api/categories', method: 'GET' }),
      transformResponse: mapFilterCategories,
    }),
    getCategoryFilters: build.query<CategoryFilter[], number>({
      query: (categoryId) => ({
        url: `/api/admin/catalog-attributes/category-filters/${categoryId}`,
        method: 'GET',
      }),
      transformResponse: mapCategoryFilters,
      providesTags: (_result, _error, categoryId) => [filtersTag(categoryId)],
    }),
    setCategoryFilters: build.mutation<
      CategoryFilter[],
      { categoryId: number; filters: readonly CategoryFilter[] }
    >({
      query: ({ categoryId, filters }) => ({
        url: `/api/admin/catalog-attributes/category-filters/${categoryId}`,
        method: 'PUT',
        data: {
          filters: filters.map(({ attributeId, isFilterable, sortOrder }) => ({
            attributeId,
            isFilterable,
            sortOrder,
          })),
        },
      }),
      transformResponse: mapCategoryFilters,
      async onQueryStarted({ categoryId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            catalogAttributesApi.util.upsertQueryData('getCategoryFilters', categoryId, data),
          );
        } catch {
          // The page shows the error from the mutation result.
        }
      },
    }),
  }),
});

export const {
  useCreateAttributeValueMutation,
  useDecideAttributeCodeMutation,
  useGetCatalogAttributeQuery,
  useGetCatalogAttributesQuery,
  useGetCategoryFiltersQuery,
  useGetFilterCategoriesQuery,
  useGetUnresolvedCodesQuery,
  useSetCategoryFiltersMutation,
  useUpdateAttributeValueMutation,
  useUpdateCatalogAttributeMutation,
} = catalogAttributesApi;
