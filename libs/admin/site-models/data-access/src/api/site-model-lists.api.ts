import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapSiteModelList, toSiteModelListParams } from '../mappers/site-model-list.mapper';
import { mapSiteCategoryRefs, mapSiteModelCategories } from '../mappers/site-models.mapper';

import type {
  SiteCategoryRef,
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
    getSiteCategoryOptions: build.query<SiteCategoryRef[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/categories', { signal }), mapSiteCategoryRefs),
      providesTags: ['SiteModels', { type: 'Categories', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetSiteCategoryOptionsQuery,
  useGetSiteModelCategoriesQuery,
  useGetSiteModelsQuery,
} = siteModelListsApi;
