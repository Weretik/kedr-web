import { appConfig } from '@mobile/shared/config';
import axios from 'axios';

import { installBearerAuth } from '../interceptors/bearer-auth';
import { installHttpLogging } from '../interceptors/http-logging';

export const axiosClient = axios.create({
  baseURL: appConfig.apiBaseUrl ?? undefined,
  timeout: 15_000,
});

installBearerAuth(axiosClient);
installHttpLogging(axiosClient);
