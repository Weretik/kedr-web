import { baseApi } from '@admin/shared/api-client';

import { mapWholesalePage, toSaveWholesaleBody } from '../mappers/wholesale-content.mapper';

import type { WholesaleDraft, WholesalePage } from '@admin/wholesale-content/model';

const url = '/api/admin/content/wholesale';

export const adminWholesaleContentApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['WholesalePage'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getWholesalePage: build.query<WholesalePage, void>({
        query: () => ({ url, method: 'GET' }),
        transformResponse: mapWholesalePage,
        providesTags: ['WholesalePage'],
      }),
      updateWholesalePage: build.mutation<WholesalePage, WholesaleDraft>({
        query: (draft) => ({ url, method: 'PUT', data: toSaveWholesaleBody(draft) }),
        transformResponse: mapWholesalePage,
        invalidatesTags: (_result, error) => (error ? [] : ['WholesalePage']),
      }),
    }),
  });

export const { useGetWholesalePageQuery, useUpdateWholesalePageMutation } =
  adminWholesaleContentApi;
