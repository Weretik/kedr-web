/** How patiently a public read waits for the API before the page shows its error view. */
export type RetryPolicy = {
  /** Pause before each repeat; their count is the number of repeats. */
  delaysMs: readonly number[];
  /** Longest one attempt waits for an answer. */
  attemptTimeoutMs: number;
  /** Whole wait of all attempts and pauses together; no attempt starts once less than a second is left. */
  budgetMs: number;
  /** Longest `Retry-After` of a 429 that is waited for; a longer one gets the normal pause. */
  maxRetryAfterMs: number;
  /** Clock, for tests. */
  now?: () => number;
};

/**
 * Pauses of about 6 s in total cover a Cloud Run cold start (3.8 s median, 5.2 s P95, measured 2026-11-19) and an
 * instance replaced during a deploy; the 20 s budget keeps a visitor from waiting forever when the API is really down.
 */
export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  delaysMs: [300, 1_000, 2_000, 3_000],
  attemptTimeoutMs: 10_000,
  budgetMs: 20_000,
  maxRetryAfterMs: 5_000,
};

const MIN_ATTEMPT_MS = 1_000;

type Fetch = typeof fetch;

/** A brief failure worth repeating: a busy or starting API (429, 5xx), not an answer about the data. */
const isTransientStatus = (status: number) => status === 429 || status >= 500;

const pause = (ms: number) =>
  ms > 0 ? new Promise<void>((resolve) => setTimeout(resolve, ms)) : Promise.resolve();

/** Seconds of a 429 `Retry-After` within the cap, otherwise the normal pause. */
const pauseAfter = (response: Response | undefined, delayMs: number, maxRetryAfterMs: number) => {
  const seconds = Number(response?.status === 429 ? response.headers.get('Retry-After') : NaN);
  if (!Number.isFinite(seconds) || seconds <= 0) return delayMs;
  return Math.max(delayMs, Math.min(seconds * 1_000, maxRetryAfterMs));
};

/**
 * A public GET that waits out a brief failure (dropped connection, timeout, 429, 5xx), so a Cloud Run instance that
 * is starting or being replaced does not turn into an error page. Each attempt has its own timeout, and all attempts
 * share one budget. Only safe reads go through here.
 */
export async function getWithRetry(
  fetchImpl: Fetch,
  url: URL,
  headers: HeadersInit,
  policy: RetryPolicy = DEFAULT_RETRY_POLICY,
): Promise<Response> {
  const now = policy.now ?? Date.now;
  const deadline = now() + policy.budgetMs;

  for (let attempt = 0; ; attempt++) {
    const isLast = attempt >= policy.delaysMs.length;
    let response: Response | undefined;
    let failure: unknown;
    try {
      response = await fetchImpl(url, {
        headers,
        signal: AbortSignal.timeout(Math.min(policy.attemptTimeoutMs, deadline - now())),
      });
      if (!isTransientStatus(response.status)) return response;
    } catch (error) {
      failure = error;
    }

    const wait = pauseAfter(response, policy.delaysMs[attempt] ?? 0, policy.maxRetryAfterMs);
    if (isLast || deadline - now() - wait < MIN_ATTEMPT_MS) {
      if (response) return response;
      throw failure;
    }
    // Release the connection of the discarded answer before the next attempt.
    await response?.body?.cancel();
    await pause(wait);
  }
}
