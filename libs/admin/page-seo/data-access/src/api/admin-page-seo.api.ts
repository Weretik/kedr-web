import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

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
    /** The saved page replaces its row in the cached list without a refetch. */
    updatePageSeo: build.mutation<PageSeoEntry, { page: SitePage; texts: PageSeoTexts }>({
      queryFn: ({ page, texts }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/content/page-seo/{page}', {
            params: { path: { page } },
            body: toSavePageSeoBody(texts),
            signal,
          }),
          mapPageSeoEntry,
        ),
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
