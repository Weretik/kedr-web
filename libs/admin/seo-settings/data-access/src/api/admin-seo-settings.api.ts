import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapSeoSettings, toSaveSeoSettingsBody } from '../mappers/seo-settings.mapper';

import type { SeoSettings, SeoSettingsDraft } from '@admin/seo-settings/model';

const tag = 'SeoSettings' as const;

export const adminSeoSettingsApi = baseApi
  .enhanceEndpoints({ addTagTypes: [tag] })
  .injectEndpoints({
    endpoints: (build) => ({
      getSeoSettings: build.query<SeoSettings, void>({
        queryFn: (_arg, { signal }) =>
          apiCall(apiClient.GET('/api/admin/content/seo-settings', { signal }), mapSeoSettings),
        providesTags: [tag],
      }),
      /** The saved settings replace the cached ones without a refetch. */
      updateSeoSettings: build.mutation<SeoSettings, SeoSettingsDraft>({
        queryFn: (draft, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/content/seo-settings', {
              body: toSaveSeoSettingsBody(draft),
              signal,
            }),
            mapSeoSettings,
          ),
        async onQueryStarted(_draft, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(adminSeoSettingsApi.util.upsertQueryData('getSeoSettings', undefined, data));
          } catch {
            // The panel shows the error; the page keeps the saved values.
          }
        },
      }),
    }),
  });

export const { useGetSeoSettingsQuery, useUpdateSeoSettingsMutation } = adminSeoSettingsApi;
