import { parseAppConfig } from './app-config';

describe('parseAppConfig', () => {
  it('returns a configured API URL', () => {
    expect(parseAppConfig({ EXPO_PUBLIC_API_BASE_URL: 'https://api.kedr.example' })).toMatchObject({
      apiBaseUrl: 'https://api.kedr.example',
      enableHttpLogs: false,
    });
  });

  it('returns null when the API URL is not configured', () => {
    expect(parseAppConfig({})).toMatchObject({ apiBaseUrl: null, enableHttpLogs: false });
  });

  it('enables HTTP logs only when the public flag is true', () => {
    expect(parseAppConfig({ EXPO_PUBLIC_ENABLE_HTTP_LOGS: 'true' })).toMatchObject({
      enableHttpLogs: true,
    });
  });

  it('explains which public environment variable is invalid', () => {
    expect(() => parseAppConfig({ EXPO_PUBLIC_API_BASE_URL: 'ftp://api.kedr.example' })).toThrow(
      'Некоректне значення EXPO_PUBLIC_API_BASE_URL',
    );
  });
});
