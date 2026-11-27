import { siteApiGet } from './site-api';

import type { RetryPolicy } from './get-with-retry';

vi.mock('server-only', () => ({}));

const API = 'https://api.example.com';
const NO_WAIT: RetryPolicy = {
  delaysMs: [0, 0, 0, 0],
  attemptTimeoutMs: 1000,
  budgetMs: 60_000,
  maxRetryAfterMs: 0,
};

const jsonResponse = (status: number, body: unknown = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('siteApiGet', () => {
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => undefined));
  afterEach(() => vi.restoreAllMocks());

  it('fills path parameters, encodes them, and sorts the query', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, { slug: 'locks' }));

    const result = await siteApiGet(
      '/api/catalog/{lang}/{categorySlug}/products',
      { path: { lang: 'uk', categorySlug: 'zamki 1' }, query: { pageSize: 8, inStock: true } },
      fetchMock,
      API,
      NO_WAIT,
    );

    expect(result).toEqual({ kind: 'ok', data: { slug: 'locks' } });
    const [url] = fetchMock.mock.calls[0] as [URL];
    expect(url.toString()).toBe(
      'https://api.example.com/api/catalog/uk/zamki%201/products?inStock=true&pageSize=8',
    );
  });

  it('maps 404, 410, and other failures to typed results', async () => {
    const call = (status: number) =>
      siteApiGet(
        '/api/catalog/{lang}/categories',
        { path: { lang: 'ru' } },
        vi.fn().mockResolvedValue(jsonResponse(status)),
        API,
        NO_WAIT,
      );

    expect(await call(404)).toEqual({ kind: 'not-found', body: {} });
    expect(await call(410)).toEqual({ kind: 'gone' });
    expect(await call(503)).toEqual({ kind: 'unavailable', status: 503 });
  });

  it('repeats a brief API failure before it reports unavailable', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(503))
      .mockResolvedValueOnce(jsonResponse(200, [{ slug: 'zamky' }]));

    const result = await siteApiGet(
      '/api/catalog/{lang}/categories',
      { path: { lang: 'uk' } },
      fetchMock,
      API,
      NO_WAIT,
    );

    expect(result).toEqual({ kind: 'ok', data: [{ slug: 'zamky' }] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('keeps the JSON body of a 404 and ignores an empty one', async () => {
    const call = (response: Response) =>
      siteApiGet(
        '/api/catalog/{lang}/categories',
        { path: { lang: 'uk' } },
        vi.fn().mockResolvedValue(response),
        API,
        NO_WAIT,
      );

    expect(await call(jsonResponse(404, { redirectSlug: 'zamky' }))).toEqual({
      kind: 'not-found',
      body: { redirectSlug: 'zamky' },
    });
    expect(await call(new Response(null, { status: 404 }))).toEqual({ kind: 'not-found' });
  });

  it('reports a network error as unavailable', async () => {
    const result = await siteApiGet(
      '/api/catalog/{lang}/categories',
      { path: { lang: 'uk' } },
      vi.fn().mockRejectedValue(new TypeError('fetch failed')),
      API,
      NO_WAIT,
    );

    expect(result).toEqual({ kind: 'unavailable' });
    expect(console.error).toHaveBeenCalledWith('Site API read failed', {
      path: '/api/catalog/{lang}/categories',
      name: 'TypeError',
      message: 'fetch failed',
    });
  });

  it('uses the caller timeout for each attempt', async () => {
    const timeoutSpy = vi.spyOn(AbortSignal, 'timeout');
    await siteApiGet(
      '/api/catalog/{lang}/categories',
      { path: { lang: 'uk' }, timeoutMs: 2_500 },
      vi.fn().mockResolvedValue(jsonResponse(200)),
      API,
      NO_WAIT,
    );

    expect(timeoutSpy).toHaveBeenCalledWith(2_500);
  });
});
