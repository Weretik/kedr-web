import { TextEncoder as NodeTextEncoder } from 'node:util';

import { resolveSitemap } from 'next/dist/build/webpack/loaders/metadata/resolve-route-data';

import {
  estimateProductSitemapXmlBytes,
  PRODUCT_SITEMAP_MAX_URLS,
  PRODUCT_SITEMAP_XML_BUDGET,
  shardProductSitemapEntries,
} from './product-sitemap-shards';

import type { MetadataRoute } from 'next';

beforeAll(() => vi.stubGlobal('TextEncoder', NodeTextEncoder));
afterAll(() => vi.unstubAllGlobals());

describe('product sitemap shard budgets', () => {
  it('splits at 20000 URLs without omitting or repeating the boundary product', () => {
    const entries: MetadataRoute.Sitemap = Array.from({ length: 20_001 }, (_, id) => ({
      url: 'https://example.test/uk/product/p-' + id,
    }));
    const shards = shardProductSitemapEntries(entries);
    expect(shards.map((shard) => shard.length)).toEqual([20_000, 1]);
    expect(shards[0]?.[19_999]?.url).toBe(entries[19_999]?.url);
    expect(shards[1]?.[0]?.url).toBe(entries[20_000]?.url);
  });

  it('accounts for UTF-8 XML bytes and alternate-link overhead, independently of URL count', () => {
    const entries: MetadataRoute.Sitemap = Array.from({ length: 12 }, (_, id) => {
      const url = 'https://example.test/uk/product/' + 'я'.repeat(150) + id;
      return { url, alternates: { languages: { 'uk-UA': url, 'ru-UA': url + '-ru' } } };
    });
    const budget = 4000;
    const shards = shardProductSitemapEntries(entries, { maxXmlBytes: budget });
    expect(shards.length).toBeGreaterThan(1);
    expect(shards.flat()).toEqual(entries);
    for (const shard of shards) {
      const realBytes = new NodeTextEncoder().encode(resolveSitemap(shard)).byteLength;
      expect(estimateProductSitemapXmlBytes(shard)).toBeGreaterThanOrEqual(realBytes);
      expect(realBytes).toBeLessThan(budget);
    }
  });

  it('keeps the conservative limit below 50MB and preserves the configured URL ceiling', () => {
    expect(PRODUCT_SITEMAP_XML_BUDGET).toBeLessThan(50_000_000);
    expect(PRODUCT_SITEMAP_MAX_URLS).toBeLessThanOrEqual(20_000);
  });

  it('rejects an oversized individual entry rather than looping or emitting an oversized file', () => {
    expect(() =>
      shardProductSitemapEntries([{ url: 'https://example.test/' + 'a'.repeat(2000) }], {
        maxXmlBytes: 1024,
      }),
    ).toThrow(RangeError);
  });

  it('returns no shard for no confirmed URLs', () => {
    expect(shardProductSitemapEntries([])).toEqual([]);
  });

  it.each([
    { maxUrls: 0 },
    { maxUrls: 20_001 },
    { maxXmlBytes: 0 },
    { maxXmlBytes: PRODUCT_SITEMAP_XML_BUDGET + 1 },
  ])('does not allow budget relaxation %o', (options) => {
    expect(() => shardProductSitemapEntries([], options)).toThrow(RangeError);
  });
});
