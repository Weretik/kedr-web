import { appConfig } from '@admin/shared/config';
import createClient from 'openapi-fetch';

import { csrfMiddleware } from '../middleware/csrf-middleware';
import { loggingMiddleware } from '../middleware/logging-middleware';
import { unauthorizedMiddleware } from '../middleware/unauthorized-middleware';

import type { paths } from '@shared/api-contracts';

/**
 * The typed KedrStore client: paths, parameters, bodies and responses come from the OpenAPI snapshot, so a call that
 * does not match the backend contract does not compile. The browser sends the HttpOnly session cookie.
 */
export const apiClient = createClient<paths>({
  baseUrl: appConfig.apiBaseUrl,
  credentials: 'include',
  // Resolved on every call, so tests can stub the global fetch.
  fetch: (request) => globalThis.fetch(request),
});

apiClient.use(csrfMiddleware, loggingMiddleware, unauthorizedMiddleware);
