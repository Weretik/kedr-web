import { apiCall, apiClient, baseApi, isConflict } from '@admin/shared/api-client';

import { mapPageSeoEntry, mapPageSeoList, toSavePageSeoBody } from '../mappers/page-seo.mapper';

import type { PageSeoEntry, PageSeoTexts, SitePage } from '@admin/page-seo/model';

const tag = 'PageSeo' as const;

export const adminPageSeoApi = baseApi.enhanceEndpoints({ addTagTypes: [tag] }).injectEndpoints({
  endpoints: (build) => ({
    getPageSeoList: build.query<PageSeoEntry[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/admin/content/page-seo', { signal }), mapPageSeoList),
      providesTags: [{ type: tag, id: 'LIST' }],
    }),
    /**
     * The saved page replaces its row in the cached list without a refetch. A 409 (someone saved the page meanwhile)
     * reloads the list, so the panel gets the current version.
     */
    updatePageSeo: build.mutation<
      PageSeoEntry,
      { page: SitePage; texts: PageSeoTexts; version: number }
    >({
      queryFn: ({ page, texts, version }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/content/page-seo/{page}', {
            params: { path: { page } },
            body: { ...toSavePageSeoBody(texts), version },
            signal,
          }),
          mapPageSeoEntry,
        ),
      invalidatesTags: (_result, error) => (isConflict(error) ? [{ type: tag, id: 'LIST' }] : []),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            adminPageSeoApi.util.updateQueryData('getPageSeoList', undefined, (draft) => {
              const index = draft.findIndex((entry) => entry.page === data.page);
              if (index >= 0) draft[index] = data;
            }),
          );
        } catch {
          // The panel shows the error; the list stays as it was.
        }
      },
    }),
  }),
});

export const { useGetPageSeoListQuery, useUpdatePageSeoMutation } = adminPageSeoApi;
