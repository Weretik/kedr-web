import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapAdminCategory } from '../mappers/admin-category.mapper';

import type { AdminCategory } from '@admin/categories/model';

export interface NewCategoryInput {
  nameUk: string;
  nameRu: string;
  parentId: number | null;
  isShownOnSite: boolean;
}

// The tree, the details, and «Моделі» all follow a change of place, order, or models.
const changed = (_result: unknown, error: unknown) =>
  error ? [] : (['Categories', 'SiteModels'] as const);

/** Managing the tree by hand (spec 002, backend catalog/011): create, move, order, delete, add models. */
export const categoryPlacementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCategory: build.mutation<AdminCategory, NewCategoryInput>({
      queryFn: (input, { signal }) =>
        apiCall(apiClient.POST('/api/categories', { body: input, signal }), mapAdminCategory),
      invalidatesTags: changed,
    }),
    moveCategory: build.mutation<AdminCategory, { id: number; parentId: number | null }>({
      queryFn: ({ id, parentId }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/categories/{id}/parent', {
            params: { path: { id } },
            body: { parentId },
            signal,
          }),
          mapAdminCategory,
        ),
      invalidatesTags: changed,
    }),
    reorderCategory: build.mutation<AdminCategory, { id: number; direction: 'up' | 'down' }>({
      queryFn: ({ direction, id }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/categories/{id}/order', {
            params: { path: { id } },
            body: { direction },
            signal,
          }),
          mapAdminCategory,
        ),
      invalidatesTags: changed,
    }),
    deleteCategory: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(apiClient.DELETE('/api/categories/{id}', { params: { path: { id } }, signal })),
      invalidatesTags: changed,
    }),
    addCategorySiteModels: build.mutation<void, { id: number; modelIds: readonly number[] }>({
      queryFn: ({ id, modelIds }, { signal }) =>
        apiCall(
          apiClient.POST('/api/categories/{id}/site-models', {
            params: { path: { id } },
            body: { modelIds: [...modelIds] },
            signal,
          }),
        ),
      invalidatesTags: changed,
    }),
  }),
});

export const {
  useAddCategorySiteModelsMutation,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useMoveCategoryMutation,
  useReorderCategoryMutation,
} = categoryPlacementApi;
