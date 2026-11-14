import { describe, expect, it } from 'vitest';

import { createAppConfig } from './app-config';

describe('createAppConfig', () => {
  it('falls back to defaults when variables are missing', () => {
    const config = createAppConfig({ DEV: false });
    expect(config).toMatchObject({
      apiBaseUrl: '',
      enableHttpLogs: false,
      routerBasename: '/',
      storefrontBaseUrl: 'https://classkedr.com.ua',
      features: { catalog: true, dashboard: true },
    });
  });

  it('reads the Vite variables', () => {
    const config = createAppConfig({
      DEV: true,
      VITE_API_BASE_URL: 'https://api.classkedr.com.ua',
      VITE_ENABLE_HTTP_LOGS: 'true',
      VITE_FEATURE_CATALOG: 'false',
    });
    expect(config.isDevelopment).toBe(true);
    expect(config.apiBaseUrl).toBe('https://api.classkedr.com.ua');
    expect(config.enableHttpLogs).toBe(true);
    expect(config.features.catalog).toBe(false);
  });
});
