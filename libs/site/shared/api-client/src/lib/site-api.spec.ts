import { siteApiGet } from './site-api';

vi.mock('server-only', () => ({}));

const jsonResponse = (status: number, body: unknown = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('siteApiGet', () => {
  it('fills path parameters, encodes them, and sorts the query', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, { slug: 'locks' }));

    const result = await siteApiGet(
      '/api/catalog/{lang}/{categorySlug}/products',
      { path: { lang: 'uk', categorySlug: 'zamki 1' }, query: { pageSize: 8, inStock: true } },
      fetchMock,
      'https://api.example.com',
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
        'https://api.example.com',
      );

    expect(await call(404)).toEqual({ kind: 'not-found' });
    expect(await call(410)).toEqual({ kind: 'gone' });
    expect(await call(503)).toEqual({ kind: 'unavailable', status: 503 });
  });

  it('reports a network error as unavailable', async () => {
    const result = await siteApiGet(
      '/api/catalog/{lang}/categories',
      { path: { lang: 'uk' } },
      vi.fn().mockRejectedValue(new TypeError('fetch failed')),
      'https://api.example.com',
    );

    expect(result).toEqual({ kind: 'unavailable' });
  });
});
