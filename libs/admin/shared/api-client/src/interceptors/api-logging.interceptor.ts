import { appConfig } from '@admin/shared/config';

import type { InternalAxiosRequestConfig } from 'axios';

export interface TimedRequestConfig extends InternalAxiosRequestConfig {
  requestStartedAt?: number;
}

export function logRequest(config: TimedRequestConfig): void {
  if (!appConfig.isDevelopment || !appConfig.enableHttpLogs) {
    return;
  }

  console.info('[Admin API]', config.method?.toUpperCase(), config.url);
}

export function logResponse(config: TimedRequestConfig, status: number): void {
  if (!appConfig.isDevelopment || !appConfig.enableHttpLogs) {
    return;
  }

  const duration = config.requestStartedAt
    ? `${Date.now() - config.requestStartedAt}ms`
    : 'unknown duration';

  console.info('[Admin API]', status, config.method?.toUpperCase(), config.url, duration);
}
