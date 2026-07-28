import { axiosClient } from '../client/axios-client';
import { toApiError } from '../errors/api-error';

import type { ApiError, ApiRequest } from '../contracts/api-client.types';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosInstance } from 'axios';

export function createAxiosBaseQuery(
  client: AxiosInstance,
): BaseQueryFn<ApiRequest, unknown, ApiError> {
  return async ({ url, method, data, params, headers }, { signal }) => {
    try {
      const response = await client.request({ data, headers, method, params, signal, url });
      return { data: response.data };
    } catch (error) {
      return { error: toApiError(error) };
    }
  };
}

export const axiosBaseQuery = createAxiosBaseQuery(axiosClient);
