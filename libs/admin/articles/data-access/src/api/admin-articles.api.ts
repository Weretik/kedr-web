import { baseApi } from '@admin/shared/api-client';

import { mapArticle, mapArticleSummaries, toSaveArticleBody } from '../mappers/article.mapper';

import type { Article, ArticleDraft, ArticleSummary } from '@admin/articles/model';

const root = '/api/admin/articles';

const coverForm = (file: Blob) => {
  const form = new FormData();
  form.append('file', file);
  return form;
};

export const adminArticlesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Articles'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getAdminArticles: build.query<ArticleSummary[], void>({
        query: () => ({ url: root, method: 'GET' }),
        transformResponse: mapArticleSummaries,
        providesTags: [{ type: 'Articles', id: 'LIST' }],
      }),
      getAdminArticle: build.query<Article, number>({
        query: (id) => ({ url: `${root}/${id}`, method: 'GET' }),
        transformResponse: mapArticle,
        providesTags: (_result, _error, id) => [{ type: 'Articles', id }],
      }),
      createArticle: build.mutation<Article, ArticleDraft>({
        query: (draft) => ({ url: root, method: 'POST', data: toSaveArticleBody(draft) }),
        transformResponse: mapArticle,
        invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Articles', id: 'LIST' }]),
      }),
      updateArticle: build.mutation<Article, { id: number; draft: ArticleDraft }>({
        query: ({ id, draft }) => ({
          url: `${root}/${id}`,
          method: 'PUT',
          data: toSaveArticleBody(draft),
        }),
        transformResponse: mapArticle,
        invalidatesTags: (_result, error, { id }) =>
          error
            ? []
            : [
                { type: 'Articles', id },
                { type: 'Articles', id: 'LIST' },
              ],
      }),
      deleteArticle: build.mutation<void, number>({
        query: (id) => ({ url: `${root}/${id}`, method: 'DELETE' }),
        invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Articles', id: 'LIST' }]),
      }),
      uploadArticleCover: build.mutation<Article, { id: number; file: Blob }>({
        query: ({ id, file }) => ({
          url: `${root}/${id}/cover`,
          method: 'PUT',
          data: coverForm(file),
        }),
        transformResponse: mapArticle,
        invalidatesTags: (_result, error, { id }) =>
          error
            ? []
            : [
                { type: 'Articles', id },
                { type: 'Articles', id: 'LIST' },
              ],
      }),
      removeArticleCover: build.mutation<Article, number>({
        query: (id) => ({ url: `${root}/${id}/cover`, method: 'DELETE' }),
        transformResponse: mapArticle,
        invalidatesTags: (_result, error, id) =>
          error
            ? []
            : [
                { type: 'Articles', id },
                { type: 'Articles', id: 'LIST' },
              ],
      }),
    }),
  });

export const {
  useCreateArticleMutation,
  useDeleteArticleMutation,
  useGetAdminArticleQuery,
  useGetAdminArticlesQuery,
  useRemoveArticleCoverMutation,
  useUpdateArticleMutation,
  useUploadArticleCoverMutation,
} = adminArticlesApi;
