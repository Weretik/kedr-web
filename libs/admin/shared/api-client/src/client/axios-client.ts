import { appConfig } from '@admin/shared/config';
import axios from 'axios';

import { installAxiosInterceptors } from '../interceptors/axios-interceptors';

export const axiosClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  withCredentials: true,
});

installAxiosInterceptors(axiosClient);
