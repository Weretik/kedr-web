import 'server-only';

import { siteConfig } from '@site/core/config';

import type { operations } from '@shared/api-contracts';

type CreateQuickOrderRequest =
  operations['createQuickOrder']['requestBody']['content']['application/json'];

export type SiteOrderApiResult =
  { kind: 'response'; status: number; body: unknown } | { kind: 'unavailable' };

/**
 * `idempotencyKey`: the attempt key; the backend answers a repeat with the first order.
 * `timeoutMs`: 25 s by default, longer than an API cold start plus the Telegram attempt; the backend keeps a valid
 * order even when this side stops waiting (KedrStore spec sales/009, R-002).
 */
export type SiteOrderApiOptions = { timeoutMs?: number; idempotencyKey?: string };

const ORDER_TIMEOUT_MS = 25_000;

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
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.idempotencyKey ? { 'Idempotency-Key': options.idempotencyKey } : {}),
      },
      // Cloudflare Workers reject redirect 'error' and do not implement credentials: either one made every order fail
      // before it left the site (fixed 2026-11-24). A redirect is never followed; it is an unknown outcome below.
      redirect: 'manual',
      cache: 'no-store',
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(options.timeoutMs ?? ORDER_TIMEOUT_MS),
    });

    if (response.status >= 300 && response.status < 400) {
      console.error('Quick order request was redirected', { status: response.status });
      return { kind: 'unavailable' };
    }

    return { kind: 'response', status: response.status, body: await readJsonBody(response) };
  } catch (error) {
    // A failed response does not prove the mutation was rejected. The domain owns that uncertainty; the log says why.
    console.error('Quick order request failed', {
      name: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
    });
    return { kind: 'unavailable' };
  }
}
