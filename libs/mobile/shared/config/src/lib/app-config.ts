import { z } from 'zod';

const apiBaseUrlSchema = z
  .string()
  .url()
  .refine((value) => value.startsWith('http://') || value.startsWith('https://'), {
    message: 'URL має використовувати протокол HTTP або HTTPS.',
  });

export interface AppConfig {
  apiBaseUrl: string | null;
  enableHttpLogs: boolean;
  isDevelopment: boolean;
}

export type PublicEnvironment = Readonly<{
  EXPO_PUBLIC_API_BASE_URL?: string;
  EXPO_PUBLIC_ENABLE_HTTP_LOGS?: string;
}>;

export function parseAppConfig(environment: PublicEnvironment): AppConfig {
  const apiBaseUrl = environment.EXPO_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return {
      apiBaseUrl: null,
      enableHttpLogs: environment.EXPO_PUBLIC_ENABLE_HTTP_LOGS === 'true',
      isDevelopment: process.env.NODE_ENV !== 'production',
    };
  }

  const parsedUrl = apiBaseUrlSchema.safeParse(apiBaseUrl);

  if (!parsedUrl.success) {
    throw new Error(
      `Некоректне значення EXPO_PUBLIC_API_BASE_URL: ${parsedUrl.error.issues[0].message}`,
    );
  }

  return {
    apiBaseUrl: parsedUrl.data,
    enableHttpLogs: environment.EXPO_PUBLIC_ENABLE_HTTP_LOGS === 'true',
    isDevelopment: process.env.NODE_ENV !== 'production',
  };
}

export const appConfig = parseAppConfig({
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_ENABLE_HTTP_LOGS: process.env.EXPO_PUBLIC_ENABLE_HTTP_LOGS,
});
