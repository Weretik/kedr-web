import 'server-only';

import { siteConfig } from '@site/core/config';

import { DEFAULT_RETRY_POLICY, getWithRetry } from './get-with-retry';

import type { ApiResult } from './api-result';
import type { RetryPolicy } from './get-with-retry';
import type { paths } from '@shared/api-contracts';

type GetPath = { [P in keyof paths]: paths[P] extends { get: unknown } ? P : never }[keyof paths];

/** Public catalog and content read paths; the anonymous order mutation has its own fixed server-only transport. */
export type PublicGetPath = Extract<
  GetPath,
  | `/api/catalog/${string}`
  | `/api/content/{lang}/${string}`
  | '/api/content/contacts'
  | '/api/content/requisites'
  | '/api/content/seo-settings'
>;

type GetOperation<P extends GetPath> = paths[P] extends { get: infer Operation }
  ? Operation
  : never;

type JsonResponse<Operation> = Operation extends {
  responses: { 200: { content: { 'application/json': infer Body } } };
}
  ? Body
  : unknown;

type ParametersOf<Operation, Key extends 'path' | 'query'> = Operation extends {
  parameters: infer Params;
}
  ? Params extends { [K in Key]?: infer Value }
    ? Exclude<Value, undefined>
    : never
  : never;

export type SiteApiGetOptions<P extends PublicGetPath> = {
  path?: ParametersOf<GetOperation<P>, 'path'>;
  query?: ParametersOf<GetOperation<P>, 'query'>;
  /** Longest wait of one attempt; the whole read still ends within the retry budget. */
  timeoutMs?: number;
};

type Fetch = typeof fetch;

const readJsonBody = async (response: Response): Promise<unknown> => {
  if (!response.headers.get('Content-Type')?.includes('json')) return undefined;
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

const buildUrl = (
  template: string,
  options: { path?: object; query?: object },
  apiUrl: string,
): URL => {
  const pathParams = (options.path ?? {}) as Record<string, string | number>;
  const resolved = template.replace(/\{(\w+)\}/g, (_, name: string) =>
    encodeURIComponent(String(pathParams[name] ?? '')),
  );
  const url = new URL(resolved, `${apiUrl}/`);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value === undefined || value === null) continue;
    for (const item of Array.isArray(value) ? value : [value])
      url.searchParams.append(key, String(item));
  }
  url.searchParams.sort();
  return url;
};

/**
 * Typed GET against the KedrStore OpenAPI contract, for Server Components, metadata, and sitemaps only.
 * A brief failure (dropped connection, timeout, 429, 5xx) is repeated for up to 20 s (`DEFAULT_RETRY_POLICY`) before
 * it counts as `unavailable`; the reason is logged, so the Worker logs show why a page failed.
 * Caching is the caller's job: domain `data-access` wraps calls in `'use cache'` with `cacheTag` and `cacheLife`.
 */
export async function siteApiGet<P extends PublicGetPath>(
  template: P,
  options: SiteApiGetOptions<P> = {},
  fetchImpl: Fetch = fetch,
  apiUrl: string = siteConfig.apiUrl,
  retry: RetryPolicy = DEFAULT_RETRY_POLICY,
): Promise<ApiResult<JsonResponse<GetOperation<P>>>> {
  const url = buildUrl(template, options, apiUrl);
  const policy = options.timeoutMs ? { ...retry, attemptTimeoutMs: options.timeoutMs } : retry;

  try {
    const response = await getWithRetry(fetchImpl, url, { Accept: 'application/json' }, policy);

    if (response.status === 404) {
      const body = await readJsonBody(response);
      return body === undefined ? { kind: 'not-found' } : { kind: 'not-found', body };
    }
    if (response.status === 410) return { kind: 'gone' };
    if (!response.ok) {
      console.error('Site API read failed', { path: template, status: response.status });
      return { kind: 'unavailable', status: response.status };
    }

    return { kind: 'ok', data: (await response.json()) as JsonResponse<GetOperation<P>> };
  } catch (error) {
    console.error('Site API read failed', {
      path: template,
      name: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
    });
    return { kind: 'unavailable' };
  }
}
