import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapSeoReview } from '../mappers/seo-review.mapper';

import type { SeoReviewItem } from '@admin/seo-review/model';

/** Spec platform/010: each module reviews its own pages; the page asks again on every visit. */
export const adminSeoReviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogSeoReview: build.query<SeoReviewItem[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/admin/catalog/seo-review', { signal }), mapSeoReview),
      keepUnusedDataFor: 0,
    }),
    getContentSeoReview: build.query<SeoReviewItem[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/admin/content/seo-review', { signal }), mapSeoReview),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetCatalogSeoReviewQuery, useGetContentSeoReviewQuery } = adminSeoReviewApi;
