import { getProductDetails } from './product-details-loader';
import { detailsFixture } from '../testing/product-fixtures';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

describe('getProductDetails', () => {
  beforeEach(() => vi.resetAllMocks());

  it('loads localized retail facts and caches the public identity', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: detailsFixture({ price: null }) });
    expect(await getProductDetails('uk', 'ruchka-731')).toMatchObject({
      kind: 'ok',
      product: { sku: '731', price: null, inStock: true },
    });
    expect(siteApiGet).toHaveBeenCalledWith('/api/catalog/{lang}/product/{productSlug}', {
      path: { lang: 'uk', productSlug: 'ruchka-731' },
      query: { priceTypeId: 11 },
    });
    expect(cacheTag.mock.calls.flat()).toEqual(
      expect.arrayContaining([
        'catalog',
        'catalog:products',
        'product:slug:ruchka-731',
        'product:731',
      ]),
    );
    expect(cacheLife).toHaveBeenCalledWith('hours');
  });

  it('returns the current slug and facts from a former slug with short freshness', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: detailsFixture() });
    expect(await getProductDetails('ru', 'old-ruchka')).toMatchObject({
      kind: 'moved',
      slug: 'ruchka-731',
      product: { sku: '731', slug: 'ruchka-731' },
    });
    expect(cacheTag.mock.calls.flat()).toContain('product:slug:ruchka-731');
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });

  it('distinguishes a safe category redirect from a missing product', async () => {
    siteApiGet.mockResolvedValue({
      kind: 'not-found',
      body: {
        redirectType: 'category',
        redirectSlug: 'ruchky',
      },
    });
    expect(await getProductDetails('uk', 'removed-product')).toEqual({
      kind: 'category-redirect',
      slug: 'ruchky',
    });
  });

  it.each([
    undefined,
    { redirectType: 'product', redirectSlug: 'new-product' },
    { redirectType: 'category', redirectSlug: 'https://example.com' },
    { redirectType: 'category', redirectSlug: '../catalog' },
  ])('treats a bare 404 or invalid redirect as missing (%o)', async (body) => {
    siteApiGet.mockResolvedValue({ kind: 'not-found', body });
    expect(await getProductDetails('uk', 'missing')).toEqual({ kind: 'not-found' });
  });

  it.each([
    { kind: 'unavailable', status: 500 },
    { kind: 'unavailable', status: 400 },
    { kind: 'unavailable' },
    { kind: 'gone' },
  ])('does not turn failure %o into 404 or a product', async (result) => {
    siteApiGet.mockResolvedValue(result);
    expect(await getProductDetails('uk', 'ruchka-731')).toEqual({ kind: 'unavailable' });
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });

  it('rejects a malformed mandatory identity as unavailable', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: detailsFixture({ name: ' ' }) });
    expect(await getProductDetails('uk', 'ruchka-731')).toEqual({ kind: 'unavailable' });
  });

  it('does not call transport for an unsafe requested segment', async () => {
    expect(await getProductDetails('uk', '../catalog')).toEqual({ kind: 'not-found' });
    expect(siteApiGet).not.toHaveBeenCalled();
  });

  it('keeps a failed second language from replacing the current language facts', async () => {
    siteApiGet.mockImplementation((_path, options) =>
      Promise.resolve(
        options.path.lang === 'uk'
          ? { kind: 'ok', data: detailsFixture({ name: 'Ручка' }) }
          : { kind: 'unavailable' },
      ),
    );
    expect(await getProductDetails('uk', 'ruchka-731')).toMatchObject({
      kind: 'ok',
      product: { name: 'Ручка' },
    });
    expect(await getProductDetails('ru', 'ruchka-731')).toEqual({ kind: 'unavailable' });
  });
});
