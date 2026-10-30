import { baseApi } from '@admin/shared/api-client';

import { mapAdminCategories, mapAdminCategory } from '../mappers/admin-category.mapper';
import {
  mapCategoryContent,
  mapCategoryContentItem,
  toSaveCategoryContentBody,
} from '../mappers/category-content.mapper';

import type { ChangeSlugBody, ChangeSlugResult } from '../contracts/admin-categories.contract';
import type { CategoryContentByLanguage } from '../mappers/category-content.mapper';
import type {
  AdminCategory,
  CategoryContent,
  CategoryContentDraft,
  ContentLanguage,
} from '@admin/categories/model';

const root = '/api/categories';

/** A typed address or a request to rebuild it from the name. */
export type SlugChange = { slug: string } | { regenerate: true };

export const adminCategoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminCategories: build.query<AdminCategory[], { deleted: boolean }>({
      query: ({ deleted }) => ({
        url: root,
        method: 'GET',
        params: deleted ? { deleted: true } : undefined,
      }),
      transformResponse: mapAdminCategories,
      providesTags: (_result, _error, { deleted }) => [
        { type: 'Categories', id: deleted ? 'DELETED' : 'LIST' },
      ],
    }),
    getAdminCategory: build.query<AdminCategory, number>({
      query: (id) => ({ url: `${root}/${id}`, method: 'GET' }),
      transformResponse: mapAdminCategory,
      providesTags: (_result, _error, id) => [{ type: 'Categories', id }],
    }),
    getCategoryContent: build.query<CategoryContentByLanguage, number>({
      query: (id) => ({ url: `${root}/${id}/content`, method: 'GET' }),
      transformResponse: mapCategoryContent,
      providesTags: (_result, _error, id) => [{ type: 'Categories', id: `content-${id}` }],
    }),
    saveCategoryContent: build.mutation<
      CategoryContent,
      { id: number; language: ContentLanguage; draft: CategoryContentDraft }
    >({
      query: ({ draft, id, language }) => ({
        url: `${root}/${id}/content/${language}`,
        method: 'PUT',
        data: toSaveCategoryContentBody(draft),
      }),
      transformResponse: mapCategoryContentItem,
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
      query: ({ id, input }) => ({
        url: `${root}/${id}/slug`,
        method: 'PUT',
        data: ('regenerate' in input
          ? { regenerate: true }
          : { slug: input.slug, regenerate: false }) satisfies ChangeSlugBody,
      }),
      invalidatesTags: (_result, error, { id }) =>
        error
          ? []
          : [
              { type: 'Categories', id },
              { type: 'Categories', id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useChangeCategorySlugMutation,
  useGetAdminCategoriesQuery,
  useGetAdminCategoryQuery,
  useGetCategoryContentQuery,
  useSaveCategoryContentMutation,
} = adminCategoriesApi;
