const readBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback;
  }

  return value === 'true';
};

export const appConfig = {
  isDevelopment: import.meta.env.DEV,
  name: import.meta.env['VITE_APP_NAME'] || 'Кабінет менеджера',
  version: import.meta.env['VITE_APP_VERSION'] || '0.1.0',
  apiBaseUrl: import.meta.env['VITE_API_BASE_URL'] || '',
  enableHttpLogs: readBoolean(import.meta.env['VITE_ENABLE_HTTP_LOGS'], false),
  routerBasename: import.meta.env['VITE_ROUTER_BASENAME'] || '/',
  features: {
    dashboard: readBoolean(import.meta.env['VITE_FEATURE_DASHBOARD'], true),
    catalog: readBoolean(import.meta.env['VITE_FEATURE_CATALOG'], true),
  },
} as const;
