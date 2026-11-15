import { apiCall, apiClient, baseApi, formDataBody } from '@admin/shared/api-client';

import {
  mapArticle,
  mapArticleCoverUpload,
  mapArticleSummaries,
  mapLegacyCoversMoved,
  toSaveArticleBody,
} from '../mappers/article.mapper';

import type { Article, ArticleCover, ArticleDraft, ArticleSummary } from '@admin/articles/model';

export const adminArticlesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Articles'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getAdminArticles: build.query<ArticleSummary[], void>({
        queryFn: (_arg, { signal }) =>
          apiCall(apiClient.GET('/api/admin/articles', { signal }), mapArticleSummaries),
        providesTags: [{ type: 'Articles', id: 'LIST' }],
      }),
      getAdminArticle: build.query<Article, number>({
        queryFn: (id, { signal }) =>
          apiCall(
            apiClient.GET('/api/admin/articles/{id}', { params: { path: { id } }, signal }),
            mapArticle,
          ),
        providesTags: (_result, _error, id) => [{ type: 'Articles', id }],
      }),
      createArticle: build.mutation<Article, ArticleDraft>({
        queryFn: (draft, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/articles', { body: toSaveArticleBody(draft), signal }),
            mapArticle,
          ),
        invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Articles', id: 'LIST' }]),
      }),
      updateArticle: build.mutation<Article, { id: number; draft: ArticleDraft }>({
        queryFn: ({ id, draft }, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/articles/{id}', {
              params: { path: { id } },
              body: toSaveArticleBody(draft),
              signal,
            }),
            mapArticle,
          ),
        invalidatesTags: (_result, error, { id }) =>
          error
            ? []
            : [
                { type: 'Articles', id },
                { type: 'Articles', id: 'LIST' },
              ],
      }),
      deleteArticle: build.mutation<void, number>({
        queryFn: (id, { signal }) =>
          apiCall(
            apiClient.DELETE('/api/admin/articles/{id}', { params: { path: { id } }, signal }),
          ),
        invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Articles', id: 'LIST' }]),
      }),
      /** Puts the picture into the media library (CDN `articles/`); the article takes it on save. */
      uploadArticleCover: build.mutation<ArticleCover, Blob>({
        queryFn: (file, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/articles/covers', { ...formDataBody({ file }), signal }),
            mapArticleCoverUpload,
          ),
      }),
      /** Moves the pre-CDN covers to the CDN; answers how many moved. Safe to repeat. */
      moveLegacyArticleCovers: build.mutation<number, void>({
        queryFn: (_arg, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/articles/covers/move-legacy', { signal }),
            mapLegacyCoversMoved,
          ),
        invalidatesTags: (_result, error) => (error ? [] : ['Articles']),
      }),
    }),
  });

export const {
  useCreateArticleMutation,
  useDeleteArticleMutation,
  useGetAdminArticleQuery,
  useGetAdminArticlesQuery,
  useMoveLegacyArticleCoversMutation,
  useUpdateArticleMutation,
  useUploadArticleCoverMutation,
} = adminArticlesApi;
