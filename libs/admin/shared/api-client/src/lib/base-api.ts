import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './axios-base-query';

export const baseApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
});
