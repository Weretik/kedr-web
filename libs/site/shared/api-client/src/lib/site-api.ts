import 'server-only';

import { siteConfig } from '@site/core/config';

import type { ApiResult } from './api-result';
import type { paths } from '@shared/api-contracts';

type GetPath = { [P in keyof paths]: paths[P] extends { get: unknown } ? P : never }[keyof paths];

/** Only the public catalog API: the site never calls admin, order, or auth endpoints from the server. */
export type PublicGetPath = Extract<GetPath, `/api/catalog/${string}`>;

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
  timeoutMs?: number;
};

type Fetch = typeof fetch;

const DEFAULT_TIMEOUT_MS = 10_000;

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
 * Caching is the caller's job: domain `data-access` wraps calls in `'use cache'` with `cacheTag` and `cacheLife`.
 */
export async function siteApiGet<P extends PublicGetPath>(
  template: P,
  options: SiteApiGetOptions<P> = {},
  fetchImpl: Fetch = fetch,
  apiUrl: string = siteConfig.apiUrl,
): Promise<ApiResult<JsonResponse<GetOperation<P>>>> {
  const url = buildUrl(template, options, apiUrl);

  try {
    const response = await fetchImpl(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    });

    if (response.status === 404) return { kind: 'not-found' };
    if (response.status === 410) return { kind: 'gone' };
    if (!response.ok) return { kind: 'unavailable', status: response.status };

    return { kind: 'ok', data: (await response.json()) as JsonResponse<GetOperation<P>> };
  } catch {
    return { kind: 'unavailable' };
  }
}
