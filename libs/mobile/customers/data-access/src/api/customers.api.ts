import { baseApi, type ApiError } from '@mobile/shared/api-client';

import { parseCustomerPage } from '../contracts/customer-page.contract';
import { loadAllCustomers } from '../lib/customer-pages';

import type { Customer } from '@mobile/customers/model';

const runtimeContractError: ApiError = {
  code: 'Unknown',
  message: 'Не вдалося прочитати відповідь сервера.',
};

export const customersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomers: build.query<Customer[], void>({
      queryFn: async (_arg, _api, _extraOptions, fetchWithBQ) => {
        let requestError: ApiError | undefined;

        try {
          const customers = await loadAllCustomers(async (page, pageSize) => {
            const result = await fetchWithBQ({
              method: 'GET',
              params: { page, pageSize },
              url: '/api/admin/customers',
            });

            if (result.error) {
              requestError = result.error;
              throw new Error('customer-request-failed');
            }

            return parseCustomerPage(result.data);
          });

          return { data: customers };
        } catch {
          return { error: requestError ?? runtimeContractError };
        }
      },
    }),
  }),
});

export const { useGetCustomersQuery } = customersApi;
