import { appConfig } from '@admin/shared/config';

import type { Middleware } from 'openapi-fetch';

const startedAt = new Map<string, number>();
const enabled = () => appConfig.isDevelopment && appConfig.enableHttpLogs;

/** Development-only request log with the duration of each call. */
export const loggingMiddleware: Middleware = {
  onRequest({ id, request }) {
    if (!enabled()) return;
    startedAt.set(id, Date.now());
    console.info('[Admin API]', request.method, request.url);
  },
  onResponse({ id, request, response }) {
    if (!enabled()) return;
    const started = startedAt.get(id);
    startedAt.delete(id);
    const duration = started ? `${Date.now() - started}ms` : 'unknown duration';
    console.info('[Admin API]', response.status, request.method, request.url, duration);
  },
};
