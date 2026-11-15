import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapAdminCategories, mapAdminCategory } from '../mappers/admin-category.mapper';
import {
  mapCategoryContent,
  mapCategoryContentItem,
  toSaveCategoryContentBody,
} from '../mappers/category-content.mapper';

import type {
  CategorySiteVisibilityResult,
  ChangeSlugBody,
  ChangeSlugResult,
  SetCategorySiteVisibilityBody,
} from '../contracts/admin-categories.contract';
import type { CategoryContentByLanguage } from '../mappers/category-content.mapper';
import type {
  AdminCategory,
  CategoryContent,
  CategoryContentDraft,
  ContentLanguage,
} from '@admin/categories/model';

/** A typed address or a request to rebuild it from the name. */
export type SlugChange = { slug: string } | { regenerate: true };

export const adminCategoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminCategories: build.query<AdminCategory[], { deleted: boolean }>({
      queryFn: ({ deleted }, { signal }) =>
        apiCall(
          apiClient.GET('/api/categories', {
            params: { query: deleted ? { deleted: true } : undefined },
            signal,
          }),
          mapAdminCategories,
        ),
      providesTags: (_result, _error, { deleted }) => [
        { type: 'Categories', id: deleted ? 'DELETED' : 'LIST' },
      ],
    }),
    getAdminCategory: build.query<AdminCategory, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/categories/{id}', { params: { path: { id } }, signal }),
          mapAdminCategory,
        ),
      providesTags: (_result, _error, id) => [{ type: 'Categories', id }],
    }),
    getCategoryContent: build.query<CategoryContentByLanguage, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/categories/{id}/content', { params: { path: { id } }, signal }),
          mapCategoryContent,
        ),
      providesTags: (_result, _error, id) => [{ type: 'Categories', id: `content-${id}` }],
    }),
    saveCategoryContent: build.mutation<
      CategoryContent,
      { id: number; language: ContentLanguage; draft: CategoryContentDraft }
    >({
      queryFn: ({ draft, id, language }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/categories/{id}/content/{lang}', {
            params: { path: { id, lang: language } },
            body: toSaveCategoryContentBody(draft),
            signal,
          }),
          mapCategoryContentItem,
        ),
      // The response is the stored (sanitized) content; put it in the cache without a refetch.
      async onQueryStarted({ id, language }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled.catch(() => ({ data: undefined }));
        if (!data) return;
        dispatch(
          adminCategoriesApi.util.updateQueryData('getCategoryContent', id, (content) => {
            content[language] = data;
          }),
        );
      },
    }),
    changeCategorySlug: build.mutation<ChangeSlugResult, { id: number; input: SlugChange }>({
      queryFn: ({ id, input }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/categories/{id}/slug', {
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
              { type: 'Categories', id },
              { type: 'Categories', id: 'LIST' },
            ],
    }),
    setCategorySiteVisibility: build.mutation<
      CategorySiteVisibilityResult,
      { id: number; isShownOnSite: boolean }
    >({
      queryFn: ({ id, isShownOnSite }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/categories/{id}/site-visibility', {
            params: { path: { id } },
            body: { isShownOnSite } satisfies SetCategorySiteVisibilityBody,
            signal,
          }),
        ),
      // Subcategories and parents change too, and the site lists follow the mark.
      invalidatesTags: (_result, error) => (error ? [] : ['Categories', 'SiteModels']),
    }),
  }),
});

export const {
  useChangeCategorySlugMutation,
  useGetAdminCategoriesQuery,
  useGetAdminCategoryQuery,
  useGetCategoryContentQuery,
  useSaveCategoryContentMutation,
  useSetCategorySiteVisibilityMutation,
} = adminCategoriesApi;
