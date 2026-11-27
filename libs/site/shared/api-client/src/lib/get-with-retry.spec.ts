import { getWithRetry } from './get-with-retry';

import type { RetryPolicy } from './get-with-retry';

const URL_ = new URL('https://api.example.com/api/catalog/uk/categories');
const NO_WAIT: RetryPolicy = {
  delaysMs: [0, 0, 0, 0],
  attemptTimeoutMs: 1000,
  budgetMs: 60_000,
  maxRetryAfterMs: 0,
};

const respond = (status: number, headers?: HeadersInit) => new Response('{}', { status, headers });
const timeout = () => new DOMException('The operation timed out.', 'TimeoutError');
const call = (fetchMock: typeof fetch, policy: RetryPolicy = NO_WAIT) =>
  getWithRetry(fetchMock, URL_, { Accept: 'application/json' }, policy);

describe('getWithRetry', () => {
  it('returns the first answer that is not a brief failure', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(respond(503))
      .mockResolvedValueOnce(respond(200));

    const response = await call(fetchMock);

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('waits out a cold start: dropped connections, a busy API and a timeout are all repeated', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Network connection lost.'))
      .mockResolvedValueOnce(respond(429))
      .mockRejectedValueOnce(timeout())
      .mockResolvedValueOnce(respond(503))
      .mockResolvedValueOnce(respond(200));

    expect((await call(fetchMock)).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it('gives up after five attempts with the last answer or error', async () => {
    const failing = vi.fn().mockImplementation(async () => respond(502));
    expect((await call(failing)).status).toBe(502);
    expect(failing).toHaveBeenCalledTimes(5);

    const offline = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
    await expect(call(offline)).rejects.toThrow('fetch failed');
    expect(offline).toHaveBeenCalledTimes(5);
  });

  it('does not repeat answers about the data', async () => {
    for (const status of [200, 400, 404, 410]) {
      const fetchMock = vi.fn().mockResolvedValue(respond(status));
      expect((await call(fetchMock)).status).toBe(status);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }
  });

  it('stops repeating once the whole wait budget is spent', async () => {
    let clock = 0;
    const slow = vi.fn().mockImplementation(async () => {
      clock += 6_000;
      throw timeout();
    });

    await expect(call(slow, { ...NO_WAIT, budgetMs: 15_000, now: () => clock })).rejects.toThrow(
      'timed out',
    );
    // 6 s + 6 s leave 3 s: a third attempt still fits, a fourth does not.
    expect(slow).toHaveBeenCalledTimes(3);
  });

  it('never lets one attempt wait past the budget', async () => {
    const timeoutSpy = vi.spyOn(AbortSignal, 'timeout');
    try {
      await call(vi.fn().mockResolvedValue(respond(200)), {
        ...NO_WAIT,
        attemptTimeoutMs: 10_000,
        budgetMs: 4_000,
        now: () => 0,
      });
      expect(timeoutSpy).toHaveBeenCalledWith(4_000);
    } finally {
      timeoutSpy.mockRestore();
    }
  });

  it('honors a short Retry-After of a 429, capped by the policy', async () => {
    vi.useFakeTimers();
    try {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(respond(429, { 'Retry-After': '2' }))
        .mockResolvedValueOnce(respond(200));

      const pending = call(fetchMock, { ...NO_WAIT, maxRetryAfterMs: 1_500 });
      await vi.advanceTimersByTimeAsync(1_499);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1);

      expect((await pending).status).toBe(200);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });
});
