import { baseApi } from '@admin/shared/api-client';

import { mapPageSeoEntry, mapPageSeoList, toSavePageSeoBody } from '../mappers/page-seo.mapper';

import type { PageSeoEntry, PageSeoTexts, SitePage } from '@admin/page-seo/model';

const root = '/api/admin/content/page-seo';
const tag = 'PageSeo' as const;

export const adminPageSeoApi = baseApi.enhanceEndpoints({ addTagTypes: [tag] }).injectEndpoints({
  endpoints: (build) => ({
    getPageSeoList: build.query<PageSeoEntry[], void>({
      query: () => ({ url: root, method: 'GET' }),
      transformResponse: mapPageSeoList,
      providesTags: [{ type: tag, id: 'LIST' }],
    }),
    /** The saved page replaces its row in the cached list without a refetch. */
    updatePageSeo: build.mutation<PageSeoEntry, { page: SitePage; texts: PageSeoTexts }>({
      query: ({ page, texts }) => ({
        url: `${root}/${page}`,
        method: 'PUT',
        data: toSavePageSeoBody(texts),
      }),
      transformResponse: mapPageSeoEntry,
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
