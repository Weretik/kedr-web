import { baseApi } from '@admin/shared/api-client';

import {
  mapSiteModel,
  mapSiteModelCategories,
  mapSiteModelHealth,
  mapSiteModelList,
  mapSiteShowcase,
  toSetSiteModelTextBody,
  toSiteModelsParams,
  toSiteShowcaseParams,
} from '../mappers/site-models.mapper';

import type {
  SiteModel,
  SiteModelCategory,
  SiteModelHealth,
  SiteModelLanguage,
  SiteModelListItem,
  SiteModelsPage,
  SiteModelsQuery,
  SiteModelTextInput,
  SiteShowcaseItem,
  SiteShowcaseQuery,
} from '@admin/site-models/model';

const base = '/api/admin/site-models';
const modelTag = (id: number) => ({ type: 'SiteModels' as const, id: `model-${id}` });

/**
 * Site models of spec catalog/007: «Вітрина сайту», «Моделі», and the model card. Every change refreshes all site
 * models data, because one change moves products, problems, and counts on every screen.
 */
export const siteModelsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSiteShowcase: build.query<SiteModelsPage<SiteShowcaseItem>, SiteShowcaseQuery>({
      query: (query) => ({
        url: `${base}/showcase`,
        method: 'GET',
        params: toSiteShowcaseParams(query),
      }),
      transformResponse: mapSiteShowcase,
      providesTags: ['SiteModels'],
    }),
    getSiteModelCategories: build.query<SiteModelCategory[], void>({
      query: () => ({ url: `${base}/categories`, method: 'GET' }),
      transformResponse: mapSiteModelCategories,
      providesTags: ['SiteModels'],
    }),
    getSiteModelHealth: build.query<SiteModelHealth, void>({
      query: () => ({ url: `${base}/health`, method: 'GET' }),
      transformResponse: mapSiteModelHealth,
      providesTags: ['SiteModels'],
    }),
    getSiteModels: build.query<SiteModelsPage<SiteModelListItem>, SiteModelsQuery>({
      query: (query) => ({ url: base, method: 'GET', params: toSiteModelsParams(query) }),
      transformResponse: mapSiteModelList,
      providesTags: ['SiteModels'],
    }),
    getSiteModel: build.query<SiteModel, number>({
      query: (id) => ({ url: `${base}/${id}`, method: 'GET' }),
      transformResponse: mapSiteModel,
      providesTags: (_result, _error, id) => ['SiteModels', modelTag(id)],
    }),
    createSiteModel: build.mutation<
      SiteModel,
      { categoryId: number; name: string; productIds: readonly number[] }
    >({
      query: (body) => ({ url: base, method: 'POST', data: body }),
      transformResponse: mapSiteModel,
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    acceptSiteModels: build.mutation<SiteModelHealth, readonly number[]>({
      query: (ids) => ({ url: `${base}/accept`, method: 'POST', data: { ids } }),
      transformResponse: mapSiteModelHealth,
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    renameSiteModel: build.mutation<SiteModel, { id: number; name: string }>({
      query: ({ id, name }) => ({ url: `${base}/${id}`, method: 'PUT', data: { name } }),
      transformResponse: mapSiteModel,
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    setSiteModelAxes: build.mutation<SiteModel, { id: number; attributeIds: readonly number[] }>({
      query: ({ id, attributeIds }) => ({
        url: `${base}/${id}/axes`,
        method: 'PUT',
        data: { attributeIds },
      }),
      transformResponse: mapSiteModel,
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    addSiteModelProducts: build.mutation<SiteModel, { id: number; productIds: readonly number[] }>({
      query: ({ id, productIds }) => ({
        url: `${base}/${id}/products`,
        method: 'POST',
        data: { productIds },
      }),
      transformResponse: mapSiteModel,
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    removeSiteModelProduct: build.mutation<SiteModel, { id: number; productId: number }>({
      query: ({ id, productId }) => ({
        url: `${base}/${id}/products/${productId}`,
        method: 'DELETE',
      }),
      transformResponse: mapSiteModel,
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    setSiteModelText: build.mutation<
      SiteModel,
      { id: number; language: SiteModelLanguage; text: SiteModelTextInput }
    >({
      query: ({ id, language, text }) => ({
        url: `${base}/${id}/texts/${language}`,
        method: 'PUT',
        data: toSetSiteModelTextBody(text),
      }),
      transformResponse: mapSiteModel,
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    fillSiteModelFromNames: build.mutation<SiteModel, number>({
      query: (id) => ({ url: `${base}/${id}/fill-from-names`, method: 'POST' }),
      transformResponse: mapSiteModel,
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
  useGetSiteModelHealthQuery,
  useGetSiteModelQuery,
  useGetSiteModelsQuery,
  useGetSiteShowcaseQuery,
  useRemoveSiteModelProductMutation,
  useRenameSiteModelMutation,
  useSetSiteModelAxesMutation,
  useSetSiteModelTextMutation,
} = siteModelsApi;
