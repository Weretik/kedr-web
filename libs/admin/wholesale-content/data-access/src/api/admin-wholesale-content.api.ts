import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapWholesalePage, toSaveWholesaleBody } from '../mappers/wholesale-content.mapper';

import type { WholesaleDraft, WholesalePage } from '@admin/wholesale-content/model';

export const adminWholesaleContentApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['WholesalePage'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getWholesalePage: build.query<WholesalePage, void>({
        queryFn: (_arg, { signal }) =>
          apiCall(apiClient.GET('/api/admin/content/wholesale', { signal }), mapWholesalePage),
        providesTags: ['WholesalePage'],
      }),
      updateWholesalePage: build.mutation<WholesalePage, WholesaleDraft>({
        queryFn: (draft, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/content/wholesale', {
              body: toSaveWholesaleBody(draft),
              signal,
            }),
            mapWholesalePage,
          ),
        invalidatesTags: (_result, error) => (error ? [] : ['WholesalePage']),
      }),
    }),
  });

export const { useGetWholesalePageQuery, useUpdateWholesalePageMutation } =
  adminWholesaleContentApi;
