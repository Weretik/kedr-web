import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import {
  mapSiteModel,
  mapSiteModelCategories,
  mapSiteModelHealth,
  mapSiteShowcase,
  toSetSiteModelTextBody,
  toSiteShowcaseParams,
} from '../mappers/site-models.mapper';

import type {
  SiteModel,
  SiteModelCategory,
  SiteModelHealth,
  SiteModelLanguage,
  SiteModelsPage,
  SiteModelTextInput,
  SiteShowcaseQuery,
  SiteShowcaseRow,
} from '@admin/site-models/model';

const modelTag = (id: number) => ({ type: 'SiteModels' as const, id: `model-${id}` });

/**
 * Site models of spec catalog/007: «Вітрина сайту», «Моделі», and the model card. Every change refreshes all site
 * models data, because one change moves products, problems, and counts on every screen.
 */
export const siteModelsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSiteShowcase: build.query<SiteModelsPage<SiteShowcaseRow>, SiteShowcaseQuery>({
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/site-models/showcase', {
            params: { query: toSiteShowcaseParams(query) },
            signal,
          }),
          mapSiteShowcase,
        ),
      providesTags: ['SiteModels'],
    }),
    getSiteModelCategories: build.query<SiteModelCategory[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/site-models/categories', { signal }),
          mapSiteModelCategories,
        ),
      providesTags: ['SiteModels'],
    }),
    getSiteModel: build.query<SiteModel, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/site-models/{id}', { params: { path: { id } }, signal }),
          mapSiteModel,
        ),
      providesTags: (_result, _error, id) => ['SiteModels', modelTag(id)],
    }),
    createSiteModel: build.mutation<
      SiteModel,
      { categoryId: number; name: string; productIds: readonly number[] }
    >({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/site-models', {
            body: { ...body, productIds: [...body.productIds] },
            signal,
          }),
          mapSiteModel,
        ),
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    acceptSiteModels: build.mutation<SiteModelHealth, readonly number[]>({
      queryFn: (ids, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/site-models/accept', { body: { ids: [...ids] }, signal }),
          mapSiteModelHealth,
        ),
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    renameSiteModel: build.mutation<SiteModel, { id: number; name: string }>({
      queryFn: ({ id, name }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/site-models/{id}', {
            params: { path: { id } },
            body: { name },
            signal,
          }),
          mapSiteModel,
        ),
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    setSiteModelAxes: build.mutation<SiteModel, { id: number; attributeIds: readonly number[] }>({
      queryFn: ({ id, attributeIds }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/site-models/{id}/axes', {
            params: { path: { id } },
            body: { attributeIds: [...attributeIds] },
            signal,
          }),
          mapSiteModel,
        ),
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    addSiteModelProducts: build.mutation<SiteModel, { id: number; productIds: readonly number[] }>({
      queryFn: ({ id, productIds }, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/site-models/{id}/products', {
            params: { path: { id } },
            body: { productIds: [...productIds] },
            signal,
          }),
          mapSiteModel,
        ),
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    removeSiteModelProduct: build.mutation<SiteModel, { id: number; productId: number }>({
      queryFn: ({ id, productId }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/admin/site-models/{id}/products/{productId}', {
            params: { path: { id, productId } },
            signal,
          }),
          mapSiteModel,
        ),
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    setSiteModelText: build.mutation<
      SiteModel,
      { id: number; language: SiteModelLanguage; text: SiteModelTextInput }
    >({
      queryFn: ({ id, language, text }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/site-models/{id}/texts/{language}', {
            params: { path: { id, language } },
            body: toSetSiteModelTextBody(text),
            signal,
          }),
          mapSiteModel,
        ),
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    fillSiteModelFromNames: build.mutation<SiteModel, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/site-models/{id}/fill-from-names', {
            params: { path: { id } },
            signal,
          }),
          mapSiteModel,
        ),
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
  }),
});

export const {
  useAcceptSiteModelsMutation,
  useAddSiteModelProductsMutation,
  useCreateSiteModelMutation,
  useFillSiteModelFromNamesMutation,
  useGetSiteModelCategoriesQuery,
  useGetSiteModelQuery,
  useGetSiteShowcaseQuery,
  useRemoveSiteModelProductMutation,
  useRenameSiteModelMutation,
  useSetSiteModelAxesMutation,
  useSetSiteModelTextMutation,
} = siteModelsApi;
