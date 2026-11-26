import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapSiteModelList, toSiteModelListParams } from '../mappers/site-model-list.mapper';
import { mapSiteModelCategories } from '../mappers/site-models.mapper';

import type {
  SiteModelCategory,
  SiteModelListItem,
  SiteModelListQuery,
  SiteModelsPage,
} from '@admin/site-models/model';

/** «Моделі» and the category tree of the site pages; refreshed by every site models change (tag `SiteModels`). */
export const siteModelListsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSiteModels: build.query<SiteModelsPage<SiteModelListItem>, SiteModelListQuery>({
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/site-models', {
            params: { query: toSiteModelListParams(query) },
            signal,
          }),
          mapSiteModelList,
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
  }),
});

export const { useGetSiteModelCategoriesQuery, useGetSiteModelsQuery } = siteModelListsApi;
