import { baseApi } from '@admin/shared/api-client';

import type { SiteRefreshResultDto } from '../contracts/site-refresh.contract';

/** Asks the public site to drop its cached content and catalogue now (Content 007). */
export const adminSiteRefreshApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    refreshSite: build.mutation<SiteRefreshResultDto, void>({
      query: () => ({ url: '/api/admin/content/site-refresh', method: 'POST' }),
    }),
  }),
});

export const { useRefreshSiteMutation } = adminSiteRefreshApi;
