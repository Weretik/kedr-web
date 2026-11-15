import { vi } from 'vitest';

/** A request the stubbed fetch received, in the shape tests assert on. */
export interface RecordedRequest {
  method: string;
  path: string;
  body: unknown;
}

/**
 * Replaces the global fetch for one test: every call answers `status` with `body` as JSON, and is recorded.
 * Mock `@admin/shared/config` with an absolute `apiBaseUrl` in the same spec, since tests have no page origin.
 */
export function stubApiFetch(body: unknown = null, status = 200): RecordedRequest[] {
  const requests: RecordedRequest[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (request: Request) => {
      const text = await request.text();
      requests.push({
        method: request.method,
        path: new URL(request.url).pathname,
        body: text ? JSON.parse(text) : undefined,
      });

      return new Response(body === null ? null : JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }),
  );

  return requests;
}

export const testApiConfig = {
  apiBaseUrl: 'https://api.test',
  isDevelopment: false,
  enableHttpLogs: false,
};
