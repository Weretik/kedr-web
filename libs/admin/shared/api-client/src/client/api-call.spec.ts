import { afterEach, describe, expect, it, vi } from 'vitest';

import { apiCall } from './api-call';
import { apiClient } from './api-client';

vi.mock('@admin/shared/config', () => ({
  appConfig: { apiBaseUrl: 'https://api.test', isDevelopment: false, enableHttpLogs: false },
}));

const respond = (status: number, body?: unknown) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async (request: Request) => {
      respond.requests.push(request);
      return new Response(body === undefined ? null : JSON.stringify(body), {
        status,
        headers: { 'Content-Type': status < 300 ? 'application/json' : 'application/problem+json' },
      });
    }),
  );
respond.requests = [] as Request[];

afterEach(() => {
  vi.unstubAllGlobals();
  respond.requests = [];
});

describe('apiCall', () => {
  it('maps the typed body of a successful call', async () => {
    respond(200, [{ id: 7, slug: 'a', title: 'A' }]);

    const result = await apiCall(apiClient.GET('/api/admin/articles'), (articles) =>
      articles.map((article) => article.id),
    );

    expect(result).toEqual({ data: [7] });
    expect(new URL(respond.requests[0].url).pathname).toBe('/api/admin/articles');
  });

  it('fills path parameters from the contract', async () => {
    respond(204);

    await apiCall(apiClient.DELETE('/api/admin/articles/{id}', { params: { path: { id: 5 } } }));

    expect(new URL(respond.requests[0].url).pathname).toBe('/api/admin/articles/5');
  });

  it('returns the normalized problem details of a failed call', async () => {
    respond(400, {
      code: 'slug_taken',
      detail: 'Такий slug вже є.',
      errors: { slug: ['Зайнятий.'] },
    });

    const result = await apiCall(
      apiClient.DELETE('/api/admin/articles/{id}', { params: { path: { id: 5 } } }),
    );

    expect(result).toEqual({
      error: {
        code: 'Validation',
        reason: 'slug_taken',
        status: 400,
        message: 'Такий slug вже є.',
        fieldErrors: { slug: ['Зайнятий.'] },
        traceId: undefined,
      },
    });
  });

  it('reports a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    const result = await apiCall(apiClient.GET('/api/admin/articles'));

    expect(result).toMatchObject({ error: { code: 'Network' } });
  });
});
