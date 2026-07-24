import { axiosClient } from '../client/axios-client';
import { toApiError } from '../errors/api-error';

import type { ApiError, ApiRequest } from '../contracts/api-client.types';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

export const axiosBaseQuery: BaseQueryFn<ApiRequest, unknown, ApiError> = async (
  { url, method, data, params, headers },
  { signal },
) => {
  try {
    const response = await axiosClient.request({ url, method, data, params, headers, signal });

    return { data: response.data };
  } catch (error) {
    return { error: toApiError(error) };
  }
};
