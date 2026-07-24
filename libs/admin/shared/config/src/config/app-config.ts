import { readBoolean, readString } from '../env/environment-reader';

import type { AppConfig } from './app-config.types';
import type { AdminEnvironment } from '../env/admin-environment.types';

export function createAppConfig(environment: AdminEnvironment): AppConfig {
  return {
    isDevelopment: environment.DEV,
    name: readString(environment.VITE_APP_NAME, 'Кабінет менеджера'),
    version: readString(environment.VITE_APP_VERSION, '0.1.0'),
    apiBaseUrl: readString(environment.VITE_API_BASE_URL, ''),
    enableHttpLogs: readBoolean(environment.VITE_ENABLE_HTTP_LOGS, false),
    routerBasename: readString(environment.VITE_ROUTER_BASENAME, '/'),
    features: {
      dashboard: readBoolean(environment.VITE_FEATURE_DASHBOARD, true),
      catalog: readBoolean(environment.VITE_FEATURE_CATALOG, true),
    },
  };
}
