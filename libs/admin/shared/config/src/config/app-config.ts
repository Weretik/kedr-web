import { readBoolean, readString } from '../env/environment-reader';

import type { AdminEnvironment } from '../env/environment-reader';

export interface AppConfig {
  readonly apiBaseUrl: string;
  readonly enableHttpLogs: boolean;
  readonly features: {
    readonly catalog: boolean;
    readonly dashboard: boolean;
  };
  readonly isDevelopment: boolean;
  readonly name: string;
  readonly routerBasename: string;
  readonly storefrontBaseUrl: string;
  readonly version: string;
}

export function createAppConfig(environment: AdminEnvironment): AppConfig {
  return {
    isDevelopment: environment.DEV,
    name: readString(environment.VITE_APP_NAME, 'Кабінет менеджера'),
    version: readString(environment.VITE_APP_VERSION, '0.1.0'),
    apiBaseUrl: readString(environment.VITE_API_BASE_URL, ''),
    enableHttpLogs: readBoolean(environment.VITE_ENABLE_HTTP_LOGS, false),
    routerBasename: readString(environment.VITE_ROUTER_BASENAME, '/'),
    storefrontBaseUrl: readString(environment.VITE_STOREFRONT_BASE_URL, 'https://classkedr.com.ua'),
    features: {
      dashboard: readBoolean(environment.VITE_FEATURE_DASHBOARD, true),
      catalog: readBoolean(environment.VITE_FEATURE_CATALOG, true),
    },
  };
}
