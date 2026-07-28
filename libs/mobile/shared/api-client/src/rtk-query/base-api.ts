import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './axios-base-query';

export const baseApi = createApi({
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
  reducerPath: 'mobileApi',
});
