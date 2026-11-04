import 'server-only';

import { siteConfig } from '@site/core/config';

import type { operations } from '@shared/api-contracts';

type CreateQuickOrderRequest =
  operations['createQuickOrder']['requestBody']['content']['application/json'];

export type SiteOrderApiResult =
  { kind: 'response'; status: number; body: unknown } | { kind: 'unavailable' };

export type SiteOrderApiOptions = { timeoutMs?: number };

const readJsonBody = async (response: Response): Promise<unknown> => {
  if (!response.headers.get('Content-Type')?.toLowerCase().includes('json')) return undefined;
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

/** The anonymous order mutation is separate from the cacheable public catalog GET surface. */
export async function siteApiCreateQuickOrder(
  request: CreateQuickOrderRequest,
  options: SiteOrderApiOptions = {},
  fetchImpl: typeof fetch = fetch,
  apiUrl: string = siteConfig.apiUrl,
): Promise<SiteOrderApiResult> {
  try {
    const response = await fetchImpl(new URL('/api/orders', `${apiUrl}/`), {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      credentials: 'omit',
      redirect: 'error',
      cache: 'no-store',
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(options.timeoutMs ?? 10_000),
    });

    return { kind: 'response', status: response.status, body: await readJsonBody(response) };
  } catch {
    // A failed response does not prove the mutation was rejected. The domain owns that uncertainty.
    return { kind: 'unavailable' };
  }
}
