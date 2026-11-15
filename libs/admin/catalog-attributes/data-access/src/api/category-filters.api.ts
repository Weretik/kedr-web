import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapCategoryFilters } from '../mappers/catalog-attributes.mapper';

import type { CategoryFilter } from '@admin/catalog-attributes/model';

const filtersTag = (categoryId: number) => ({
  type: 'CatalogAttributes' as const,
  id: `filters-${categoryId}`,
});

/** «Фільтри категорій»: which attributes filter the site listing of a category, in which order. */
export const categoryFiltersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategoryFilters: build.query<CategoryFilter[], number>({
      queryFn: (categoryId, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/catalog-attributes/category-filters/{categoryId}', {
            params: { path: { categoryId } },
            signal,
          }),
          mapCategoryFilters,
        ),
      providesTags: (_result, _error, categoryId) => [filtersTag(categoryId)],
    }),
    setCategoryFilters: build.mutation<
      CategoryFilter[],
      { categoryId: number; filters: readonly CategoryFilter[] }
    >({
      queryFn: ({ categoryId, filters }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/catalog-attributes/category-filters/{categoryId}', {
            params: { path: { categoryId } },
            body: {
              filters: filters.map(({ attributeId, isFilterable, sortOrder }) => ({
                attributeId,
                isFilterable,
                sortOrder,
              })),
            },
            signal,
          }),
          mapCategoryFilters,
        ),
      // The «Фільтри категорій» tree shows each category's filter count from the site models data.
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
      async onQueryStarted({ categoryId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(categoryFiltersApi.util.upsertQueryData('getCategoryFilters', categoryId, data));
        } catch {
          // The page shows the error from the mutation result.
        }
      },
    }),
  }),
});

export const { useGetCategoryFiltersQuery, useSetCategoryFiltersMutation } = categoryFiltersApi;
