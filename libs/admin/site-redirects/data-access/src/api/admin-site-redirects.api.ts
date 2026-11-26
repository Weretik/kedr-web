import { apiCall, apiClient, baseApi, isConflict } from '@admin/shared/api-client';

import {
  mapSiteRedirect,
  mapSiteRedirectPage,
  toSaveSiteRedirectBody,
} from '../mappers/site-redirect.mapper';

import type { SiteRedirectListParams } from '../contracts/site-redirect.contract';
import type {
  SiteRedirect,
  SiteRedirectDraft,
  SiteRedirectPage,
  SiteRedirectPageQuery,
} from '@admin/site-redirects/model';

const tag = 'SiteRedirects' as const;
const list = { type: tag, id: 'LIST' } as const;

/** Spec content/013: the admin list and the three changes; every change reloads the list. */
export const adminSiteRedirectsApi = baseApi
  .enhanceEndpoints({ addTagTypes: [tag] })
  .injectEndpoints({
    endpoints: (build) => ({
      getSiteRedirects: build.query<SiteRedirectPage, SiteRedirectPageQuery>({
        queryFn: ({ page, pageSize, search }, { signal }) =>
          apiCall(
            apiClient.GET('/api/admin/content/redirects', {
              params: {
                query: {
                  page,
                  pageSize,
                  ...(search && { search }),
                } satisfies SiteRedirectListParams,
              },
              signal,
            }),
            mapSiteRedirectPage,
          ),
        providesTags: [list],
      }),
      createSiteRedirect: build.mutation<SiteRedirect, SiteRedirectDraft>({
        queryFn: (draft, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/content/redirects', {
              body: toSaveSiteRedirectBody(draft),
              signal,
            }),
            mapSiteRedirect,
          ),
        invalidatesTags: (result) => (result ? [list] : []),
      }),
      /** A 409 (changed meanwhile or the old address is taken) reloads the list for the current version. */
      updateSiteRedirect: build.mutation<
        SiteRedirect,
        { id: number; draft: SiteRedirectDraft; version: number }
      >({
        queryFn: ({ id, draft, version }, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/content/redirects/{id}', {
              params: { path: { id } },
              body: toSaveSiteRedirectBody(draft, version),
              signal,
            }),
            mapSiteRedirect,
          ),
        invalidatesTags: (result, error) => (result || isConflict(error) ? [list] : []),
      }),
      deleteSiteRedirect: build.mutation<null, number>({
        queryFn: (id, { signal }) =>
          apiCall(
            apiClient.DELETE('/api/admin/content/redirects/{id}', {
              params: { path: { id } },
              signal,
            }),
            () => null,
          ),
        invalidatesTags: [list],
      }),
    }),
  });

export const {
  useCreateSiteRedirectMutation,
  useDeleteSiteRedirectMutation,
  useGetSiteRedirectsQuery,
  useUpdateSiteRedirectMutation,
} = adminSiteRedirectsApi;
