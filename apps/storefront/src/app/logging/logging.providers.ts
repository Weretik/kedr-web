import { APP_LOGGING_CONFIG } from '@shared/logging';

export function provideStorefrontLogging(environment: {
  production: boolean;
  app: { name: string; version: string };
  logging: { enabled: boolean; endpoint: string | null; sampleRate: number };
}) {
  return {
    provide: APP_LOGGING_CONFIG,
    useValue: {
      enabled: environment.logging.enabled,
      endpoint: environment.logging.endpoint,
      environment: environment.production ? 'production' : 'development',
      appName: environment.app.name,
      appVersion: environment.app.version,
      sampleRate: environment.logging.sampleRate,
    },
  };
}
