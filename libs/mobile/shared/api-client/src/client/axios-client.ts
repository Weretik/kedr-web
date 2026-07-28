import { appConfig } from '@mobile/shared/config';
import axios from 'axios';

import { installHttpLogging } from '../interceptors/http-logging';

export const axiosClient = axios.create({
  baseURL: appConfig.apiBaseUrl ?? undefined,
  timeout: 15_000,
});

installHttpLogging(axiosClient);
