import { EMPTY_REDIRECTS, toRedirectMap } from './redirect-lookup';

import type { SiteRedirectMap } from './redirect-lookup';

export interface RedirectListOptions {
  apiUrl: string;
  fetchImpl?: typeof fetch;
  now?: () => number;
  /** How long a loaded list is used before it is asked again; 5 minutes. */
  ttlMs?: number;
  /** After a failed load the last list is kept and the next try waits this long; 30 seconds. */
  retryMs?: number;
  /** A slow API must not hold a page; 1.5 seconds. */
  timeoutMs?: number;
}

export interface RedirectList {
  /**
   * The current list. A stale list is answered at once while a new one loads in the background
   * (`waitUntil` keeps the worker alive for it); a request with no list yet waits for its own load.
   */
  get(waitUntil?: (promise: Promise<unknown>) => void): Promise<SiteRedirectMap>;
}

/**
 * In-memory copy of the redirect table for the proxy; an API failure never breaks the site.
 *
 * Only data is shared between requests, never a promise: on Cloudflare Workers a promise created by
 * one request can never settle in another once the first one ended (a cancelled prefetch), and the
 * waiting request fails with a 500. So every load belongs to the request that started it; a timestamp
 * keeps concurrent requests from starting a background refresh each.
 */
export function createRedirectList({
  apiUrl,
  fetchImpl = fetch,
  now = Date.now,
  ttlMs = 5 * 60_000,
  retryMs = 30_000,
  timeoutMs = 1_500,
}: RedirectListOptions): RedirectList {
  const url = `${apiUrl}/api/content/redirects`;
  let current: SiteRedirectMap | null = null;
  let freshUntil = 0;
  let refreshingUntil = 0;

  async function load(): Promise<SiteRedirectMap> {
    try {
      const response = await fetchImpl(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) throw new Error(`Redirect list answered ${response.status}`);
      current = toRedirectMap(await response.json());
      freshUntil = now() + ttlMs;
    } catch {
      current ??= EMPTY_REDIRECTS;
      freshUntil = Math.max(freshUntil, now() + retryMs);
    }
    return current;
  }

  return {
    get(waitUntil) {
      if (now() < freshUntil && current) return Promise.resolve(current);
      if (!current) return load();
      if (now() >= refreshingUntil) {
        refreshingUntil = now() + timeoutMs;
        waitUntil?.(load());
      }
      return Promise.resolve(current);
    },
  };
}
