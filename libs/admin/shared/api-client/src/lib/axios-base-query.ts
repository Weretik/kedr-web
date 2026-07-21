import { toApiError } from './api-error';
import { axiosClient } from './axios-client';

import type { ApiError, ApiRequest } from './api-client.types';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

export const axiosBaseQuery: BaseQueryFn<ApiRequest, unknown, ApiError> = async (
  { url, method, data, params, headers },
  { signal },
) => {
  try {
    const response = await axiosClient.request({
      url,
      method,
      data,
      params,
      headers,
      signal,
    });

    return { data: response.data };
  } catch (error) {
    return { error: toApiError(error) };
  }
};
