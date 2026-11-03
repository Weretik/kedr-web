import { getProductDetails, getProductPrerenderCandidates } from '@site/product/data-access';

import { getProductLanguagePaths } from './product-language-paths';
import { loadProductOrRespond } from './product-response';
import { getProductMetadata, getProductStaticParams } from './product-routing';
import { productFixture } from '../../test/product.fixture';

vi.mock('@site/product/data-access', () => ({
  getProductDetails: vi.fn(),
  getProductPrerenderCandidates: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NOT_FOUND_404');
  },
  permanentRedirect: (url: string) => {
    throw new Error(`MOVED_308:${url}`);
  },
}));

describe('product HTTP outcome resolution', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns only the real normalized product on the current URL', async () => {
    vi.mocked(getProductDetails).mockResolvedValue({ kind: 'ok', product: productFixture });
    expect(await loadProductOrRespond('uk', 'handle-7')).toEqual(productFixture);
  });

  it('resolves a former product slug as a permanent localized redirect', async () => {
    vi.mocked(getProductDetails).mockResolvedValue({
      kind: 'moved',
      slug: 'current',
      product: { ...productFixture, slug: 'current' },
    });
    await expect(loadProductOrRespond('ru', 'former')).rejects.toThrow(
      'MOVED_308:/ru/product/current',
    );
  });

  it('keeps unavailable data distinct from a missing product', async () => {
    vi.mocked(getProductDetails).mockResolvedValue({ kind: 'unavailable' });
    await expect(loadProductOrRespond('uk', 'handle-7')).rejects.toThrow('Product API unavailable');
  });

  it('keeps bare 404 and category redirects distinct', async () => {
    vi.mocked(getProductDetails).mockResolvedValueOnce({ kind: 'not-found' });
    await expect(loadProductOrRespond('uk', 'missing')).rejects.toThrow('NOT_FOUND_404');
    vi.mocked(getProductDetails).mockResolvedValueOnce({
      kind: 'category-redirect',
      slug: 'handles',
    });
    await expect(loadProductOrRespond('uk', 'removed')).rejects.toThrow(
      'MOVED_308:/uk/catalog/handles',
    );
  });

  it('rejects unsafe segments without calling the provider', async () => {
    await expect(loadProductOrRespond('uk', '../private')).rejects.toThrow('NOT_FOUND_404');
    expect(getProductDetails).not.toHaveBeenCalled();
  });
});

describe('language identity and prerender seeds', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not advertise a failed or different product as another locale', async () => {
    vi.mocked(getProductDetails).mockResolvedValueOnce({ kind: 'unavailable' });
    expect(await getProductLanguagePaths('uk', productFixture)).toEqual({
      uk: '/uk/product/handle-7',
    });
    vi.mocked(getProductDetails).mockResolvedValueOnce({
      kind: 'ok',
      product: { ...productFixture, sku: '8' },
    });
    expect(await getProductLanguagePaths('uk', productFixture)).toEqual({
      uk: '/uk/product/handle-7',
    });
  });

  it('uses a confirmed current alternate slug for the same SKU', async () => {
    vi.mocked(getProductDetails).mockResolvedValue({
      kind: 'moved',
      slug: 'current-ru',
      product: { ...productFixture, slug: 'current-ru' },
    });
    expect(await getProductLanguagePaths('uk', productFixture)).toEqual({
      uk: '/uk/product/handle-7',
      ru: '/ru/product/current-ru',
    });
  });

  it('keeps selected-locale metadata available if the peer locale fails', async () => {
    vi.mocked(getProductDetails).mockImplementation(async (locale) =>
      locale === 'uk' ? { kind: 'ok', product: productFixture } : { kind: 'unavailable' },
    );
    const metadata = await getProductMetadata('uk', 'handle-7');
    expect(metadata.title).toContain(productFixture.name);
    expect(metadata.alternates?.languages).not.toHaveProperty('ru-UA');
  });

  it('uses a real verified seed and never invents an empty-catalog placeholder', async () => {
    vi.mocked(getProductPrerenderCandidates).mockImplementation(async (locale) =>
      locale === 'uk'
        ? { kind: 'ok', items: [{ sku: '7', slug: 'handle-7', name: 'Ручка' }] }
        : { kind: 'unavailable' },
    );
    vi.mocked(getProductDetails).mockResolvedValue({ kind: 'ok', product: productFixture });
    expect(await getProductStaticParams()).toEqual([{ locale: 'uk', slug: 'handle-7' }]);
    vi.mocked(getProductPrerenderCandidates).mockResolvedValue({ kind: 'ok', items: [] });
    await expect(getProductStaticParams()).rejects.toThrow('real product prerender seed');
  });

  it('bounds stale candidate verification to five reads per locale', async () => {
    vi.mocked(getProductPrerenderCandidates).mockResolvedValue({
      kind: 'ok',
      items: Array.from({ length: 20 }, (_, i) => ({
        sku: String(i + 1),
        slug: `item-${i}`,
        name: 'Item',
      })),
    });
    vi.mocked(getProductDetails).mockResolvedValue({ kind: 'not-found' });
    await expect(getProductStaticParams()).rejects.toThrow('real product prerender seed');
    expect(getProductDetails).toHaveBeenCalledTimes(10);
  });
});
