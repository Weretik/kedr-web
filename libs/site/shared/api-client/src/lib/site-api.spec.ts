import { siteApiGet } from './site-api';

vi.mock('server-only', () => ({}));

const jsonResponse = (status: number, body: unknown = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('siteApiGet', () => {
  it('fills path parameters, sorts the query, and passes cache tags', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, { slug: 'locks' }));

    const result = await siteApiGet(
      '/api/catalog/{lang}/categories/by-slug/{categorySlug}',
      { path: { lang: 'uk', categorySlug: 'zamki 1' }, tags: ['category:zamki'], revalidate: 3600 },
      fetchMock,
      'https://api.example.com',
    );

    expect(result).toEqual({ kind: 'ok', data: { slug: 'locks' } });
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit & { next: unknown }];
    expect(url.toString()).toBe(
      'https://api.example.com/api/catalog/uk/categories/by-slug/zamki%201',
    );
    expect(init.next).toEqual({ tags: ['category:zamki'], revalidate: 3600 });
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
