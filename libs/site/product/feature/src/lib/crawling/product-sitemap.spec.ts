import { TextEncoder as NodeTextEncoder } from 'node:util';

import {
  getProductSitemap,
  getProductSitemapIds,
  getProductSitemapIndexResponse,
  getProductSitemapUrls,
} from './product-sitemap';
import { buildProductSitemapEntries } from './product-sitemap-entries';

import type { ProductIndexItem } from '@site/product/model';

const { getProductIndex, notFound } = vi.hoisted(() => ({
  getProductIndex: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));
vi.mock('server-only', () => ({}));
vi.mock('@site/product/data-access', () => ({ getProductIndex }));
vi.mock('next/navigation', () => ({ notFound }));

const item = (sku: string, slug = 'handle-' + sku): ProductIndexItem => ({
  sku,
  slug,
  name: 'Ручка ' + sku,
});
const config = { siteUrl: 'https://example.test' };

beforeAll(() => vi.stubGlobal('TextEncoder', NodeTextEncoder));
afterAll(() => vi.unstubAllGlobals());

describe('product sitemap entries', () => {
  it('contains real canonical URLs and only confirmed language alternatives', () => {
    const entries = buildProductSitemapEntries({ uk: [item('7')], ru: [] });
    expect(entries).toHaveLength(1);
    expect(entries[0]?.url).toBe('https://classkedr.com.ua/uk/product/handle-7');
    expect(entries[0]?.alternates?.languages).not.toHaveProperty('ru-UA');
    expect(entries[0]).not.toHaveProperty('lastModified');
  });

  it('pairs reciprocal language URLs by SKU using their actual current slugs', () => {
    const entries = buildProductSitemapEntries(
      {
        uk: [item('7', 'current-uk')],
        ru: [item('7', 'current-ru')],
      },
      config,
    );
    expect(entries).toEqual([
      {
        url: 'https://example.test/uk/product/current-uk',
        alternates: {
          languages: {
            'uk-UA': 'https://example.test/uk/product/current-uk',
            'ru-UA': 'https://example.test/ru/product/current-ru',
            'x-default': 'https://example.test/uk/product/current-uk',
          },
        },
      },
      {
        url: 'https://example.test/ru/product/current-ru',
        alternates: {
          languages: {
            'uk-UA': 'https://example.test/uk/product/current-uk',
            'ru-UA': 'https://example.test/ru/product/current-ru',
            'x-default': 'https://example.test/uk/product/current-uk',
          },
        },
      },
    ]);
  });

  it('does not infer language alternatives from matching names or slugs of different SKUs', () => {
    const entries = buildProductSitemapEntries(
      {
        uk: [item('7', 'same')],
        ru: [item('8', 'same')],
      },
      config,
    );
    expect(entries[0]?.alternates?.languages).not.toHaveProperty('ru-UA');
    expect(entries[1]?.alternates?.languages).not.toHaveProperty('uk-UA');
    expect(entries[1]?.alternates?.languages).not.toHaveProperty('x-default');
  });

  it('deduplicates real URLs and returns the same ordering for reordered source rows', () => {
    const expected = buildProductSitemapEntries({ uk: [item('1'), item('2')], ru: [] }, config);
    expect(
      buildProductSitemapEntries(
        {
          uk: [item('2'), item('1'), item('1')],
          ru: [],
        },
        config,
      ),
    ).toEqual(expected);
  });

  it('filters unusable identity and encodes the original safe Unicode slug', () => {
    const entries = buildProductSitemapEntries(
      {
        uk: [item('1', '../bad'), { ...item('2'), name: ' ' }, item('3', 'ручка-3')],
        ru: [],
      },
      config,
    );
    expect(entries).toHaveLength(1);
    expect(entries[0]?.url).toBe(
      'https://example.test/uk/product/' + encodeURIComponent('ручка-3'),
    );
  });

  it('rejects conflicting canonical identities instead of choosing an arbitrary current slug', () => {
    expect(() =>
      buildProductSitemapEntries(
        {
          uk: [item('1', 'first'), item('1', 'second')],
          ru: [],
        },
        config,
      ),
    ).toThrow('Conflicting canonical identity');
    expect(() =>
      buildProductSitemapEntries(
        {
          uk: [item('1', 'same'), item('2', 'same')],
          ru: [],
        },
        config,
      ),
    ).toThrow('Conflicting canonical identity');
  });
});

describe('product sitemap source and routes', () => {
  beforeEach(() => {
    getProductIndex.mockReset();
    notFound.mockClear();
  });

  const confirmedBoth = () =>
    getProductIndex.mockImplementation(() => Promise.resolve({ kind: 'ok', items: [item('7')] }));

  it('exposes deterministic shard IDs, actual entries and absolute advertised URLs', async () => {
    confirmedBoth();
    expect(await getProductSitemapIds()).toEqual([{ id: '0' }]);
    expect(await getProductSitemapUrls()).toEqual([
      'https://classkedr.com.ua/product/sitemap/0.xml',
    ]);
    expect(await getProductSitemap('0')).toHaveLength(2);
    expect(getProductIndex).toHaveBeenCalledWith('uk');
    expect(getProductIndex).toHaveBeenCalledWith('ru');
  });

  it('distinguishes a confirmed empty public source from transport failure', async () => {
    getProductIndex.mockResolvedValue({ kind: 'ok', items: [] });
    expect(await getProductSitemapIds()).toEqual([]);
    expect(await getProductSitemapUrls()).toEqual([]);
  });

  it('throws for either unavailable language without publishing a partial source', async () => {
    getProductIndex.mockImplementation((locale) =>
      Promise.resolve(
        locale === 'uk'
          ? { kind: 'ok', items: [item('7')] }
          : { kind: 'unavailable', reason: 'transport' },
      ),
    );
    await expect(getProductSitemapIds()).rejects.toThrow('complete public product index');
    await expect(getProductSitemap('0')).rejects.toThrow('complete public product index');
    expect(notFound).not.toHaveBeenCalled();
  });

  it.each(['', '00', '01', '-1', '1.0', '1e3', ' 1', '0/foo', '9007199254740992'])(
    'rejects invalid shard ID %s before reading the feed',
    async (id) => {
      await expect(getProductSitemap(id)).rejects.toThrow('NEXT_NOT_FOUND');
      expect(getProductIndex).not.toHaveBeenCalled();
    },
  );

  it('serves a sitemap index of the shards, or 503 while the product list is unavailable', async () => {
    confirmedBoth();
    const ok = await getProductSitemapIndexResponse();
    expect(ok.status).toBe(200);
    expect(await ok.text()).toContain(
      '<sitemap><loc>https://classkedr.com.ua/product/sitemap/0.xml</loc></sitemap>',
    );

    getProductIndex.mockResolvedValue({ kind: 'unavailable', reason: 'transport' });
    const failed = await getProductSitemapIndexResponse();
    expect(failed.status).toBe(503);
    expect(failed.headers.get('retry-after')).toBe('3600');
  });

  it('returns notFound for a valid but out-of-range shard ID', async () => {
    confirmedBoth();
    await expect(getProductSitemap('1')).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('does not invent shard zero when the confirmed source is empty', async () => {
    getProductIndex.mockResolvedValue({ kind: 'ok', items: [] });
    await expect(getProductSitemap('0')).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
