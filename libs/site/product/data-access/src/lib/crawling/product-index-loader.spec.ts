import { getProductIndex, getProductPrerenderCandidates } from './product-index-loader';
import { modelPageFixture, pageFixture } from '../testing/product-fixtures';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));
const ok = (data: unknown) => ({ kind: 'ok', data });

describe('product index and prerender candidates', () => {
  beforeEach(() => vi.resetAllMocks());

  it('reads only the first page for seeds, including unknown price and missing stock', async () => {
    siteApiGet.mockResolvedValue(ok(pageFixture([1, 2], { size: 2, total: 3 })));
    expect(await getProductPrerenderCandidates('ru')).toEqual({
      kind: 'ok',
      items: [
        { sku: '1', name: 'Товар 1', slug: 'product-1' },
        { sku: '2', name: 'Товар 2', slug: 'product-2' },
      ],
    });
    expect(siteApiGet).toHaveBeenCalledTimes(1);
    expect(siteApiGet).toHaveBeenCalledWith('/api/catalog/{lang}/products', {
      path: { lang: 'ru' },
      query: { availability: 'All', sort: 'IdAsc', page: 1, pageSize: 100, priceTypeId: 11 },
    });
  });

  it('walks sequentially and returns only identity without detail calls or fabricated dates', async () => {
    siteApiGet
      .mockResolvedValueOnce(ok(modelPageFixture([1, 2], { size: 2, total: 3 })))
      .mockResolvedValueOnce(ok(modelPageFixture([3], { number: 2, size: 2, total: 3 })));
    expect(await getProductIndex('uk')).toEqual({
      kind: 'ok',
      items: [
        { sku: 'model-1', slug: 'model-1', name: 'Модель 1' },
        { sku: 'model-2', slug: 'model-2', name: 'Модель 2' },
        { sku: 'model-3', slug: 'model-3', name: 'Модель 3' },
      ],
    });
    expect(siteApiGet.mock.calls.map((call) => call[1].query)).toEqual([
      { sort: 'name_asc', page: 1, pageSize: 100 },
      { sort: 'name_asc', page: 2, pageSize: 100 },
    ]);
    expect(siteApiGet.mock.calls.every((call) => call[0] === '/api/catalog/{lang}/models')).toBe(
      true,
    );
    expect(cacheLife).toHaveBeenCalledWith('hours');
  });

  it('filters empty identity and same-page duplicates without replacement products', async () => {
    const data = modelPageFixture([1, 1, 2]);
    data.items[2]!.slug = '../bad';
    siteApiGet.mockResolvedValue(ok(data));
    expect(await getProductIndex('uk')).toEqual({
      kind: 'ok',
      items: [{ sku: 'model-1', slug: 'model-1', name: 'Модель 1' }],
    });
  });

  it('restarts once when a later page exposes changed totals', async () => {
    siteApiGet
      .mockResolvedValueOnce(ok(modelPageFixture([1, 2], { size: 2, total: 3 })))
      .mockResolvedValueOnce(ok(modelPageFixture([3, 4], { number: 2, size: 2, total: 4 })))
      .mockResolvedValueOnce(ok(modelPageFixture([5, 6], { size: 2, total: 2 })));
    expect(await getProductIndex('uk')).toEqual({
      kind: 'ok',
      items: [
        { sku: 'model-5', slug: 'model-5', name: 'Модель 5' },
        { sku: 'model-6', slug: 'model-6', name: 'Модель 6' },
      ],
    });
    expect(siteApiGet.mock.calls.map((call) => call[1].query.page)).toEqual([1, 2, 1]);
  });

  it('restarts once for cross-page duplicates and never combines the attempts', async () => {
    siteApiGet
      .mockResolvedValueOnce(ok(modelPageFixture([1, 2], { size: 2, total: 3 })))
      .mockResolvedValueOnce(ok(modelPageFixture([2], { number: 2, size: 2, total: 3 })))
      .mockResolvedValueOnce(ok(modelPageFixture([7], { total: 1 })));
    expect(await getProductIndex('uk')).toEqual({
      kind: 'ok',
      items: [{ sku: 'model-7', slug: 'model-7', name: 'Модель 7' }],
    });
    expect(siteApiGet).toHaveBeenCalledTimes(3);
  });

  it('reports repeated observable inconsistency after one bounded retry', async () => {
    siteApiGet.mockImplementation((_path, options) =>
      Promise.resolve(
        ok(
          options.query.page === 1
            ? modelPageFixture([1, 2], { size: 2, total: 3 })
            : modelPageFixture([2], { number: 2, size: 2, total: 3 }),
        ),
      ),
    );
    expect(await getProductIndex('uk')).toEqual({ kind: 'unavailable', reason: 'inconsistent' });
    expect(siteApiGet).toHaveBeenCalledTimes(4);
  });

  it('does not publish partial success when a later page fails', async () => {
    siteApiGet
      .mockResolvedValueOnce(ok(modelPageFixture([1, 2], { size: 2, total: 3 })))
      .mockResolvedValueOnce({ kind: 'unavailable', status: 500 });
    expect(await getProductIndex('uk')).toEqual({ kind: 'unavailable', reason: 'transport' });
    expect(siteApiGet).toHaveBeenCalledTimes(2);
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });

  it('diagnoses the 1000-page operational budget instead of truncating', async () => {
    siteApiGet.mockResolvedValue(ok(modelPageFixture([1, 2], { size: 2, total: 2002 })));
    expect(await getProductIndex('uk')).toEqual({ kind: 'unavailable', reason: 'page-limit' });
    expect(siteApiGet).toHaveBeenCalledTimes(1);
  });

  it('rejects malformed paging instead of looping or publishing an empty feed', async () => {
    siteApiGet.mockResolvedValue(ok({ pagedInfo: { pageNumber: '1' }, value: [] }));
    expect(await getProductIndex('uk')).toEqual({ kind: 'unavailable', reason: 'invalid-page' });
    expect(siteApiGet).toHaveBeenCalledTimes(1);
  });

  it('represents a genuinely empty public list without a fake seed', async () => {
    siteApiGet
      .mockResolvedValueOnce(ok(modelPageFixture([])))
      .mockResolvedValueOnce(ok(pageFixture([])));
    expect(await getProductIndex('uk')).toEqual({ kind: 'ok', items: [] });
    expect(await getProductPrerenderCandidates('uk')).toEqual({ kind: 'ok', items: [] });
  });
});
