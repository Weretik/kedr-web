import { apiCall, apiClient, baseApi, formDataBody } from '@admin/shared/api-client';

import type {
  RetailPriceImportResultDto,
  RetailPriceStatusDto,
  RetailPriceUpload,
} from '../contracts/retail-prices.contract';

/** Site retail prices from the owner's 1C price file (KedrStore spec catalog/010). */
export const adminRetailPricesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRetailPriceStatus: build.query<RetailPriceStatusDto, void>({
      queryFn: (_arg, { signal }) => apiCall(apiClient.GET('/api/admin/retail-prices', { signal })),
      providesTags: ['RetailPrices'],
    }),
    /** Changes only the retail price type, by product code; the product lists show the new prices. */
    importRetailPrices: build.mutation<RetailPriceImportResultDto, RetailPriceUpload>({
      queryFn: ({ file, protectFromOneC }, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/retail-prices/import', {
            ...formDataBody({ file, protectFromOneC }),
            signal,
          }),
        ),
      invalidatesTags: (result) => (result ? ['RetailPrices', 'Products'] : []),
    }),
    unlockRetailPrices: build.mutation<RetailPriceStatusDto, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.POST('/api/admin/retail-prices/unlock', { signal })),
      invalidatesTags: (result) => (result ? ['RetailPrices'] : []),
    }),
  }),
});

export const {
  useGetRetailPriceStatusQuery,
  useImportRetailPricesMutation,
  useUnlockRetailPricesMutation,
} = adminRetailPricesApi;
