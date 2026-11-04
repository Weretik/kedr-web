import 'server-only';

import { siteConfig } from '@site/core/config';
import { getProductIndex } from '@site/product/data-access';
import { notFound } from 'next/navigation';

import { buildProductSitemapEntries } from './product-sitemap-entries';
import { shardProductSitemapEntries } from './product-sitemap-shards';

import type { MetadataRoute } from 'next';

async function getProductSitemapShards(): Promise<MetadataRoute.Sitemap[]> {
  // Two locale reads only; each data-access walker is itself sequential and bounded.
  const [uk, ru] = await Promise.all([getProductIndex('uk'), getProductIndex('ru')]);
  if (uk.kind !== 'ok' || ru.kind !== 'ok') {
    throw new Error('The complete public product index is unavailable');
  }
  return shardProductSitemapEntries(buildProductSitemapEntries({ uk: uk.items, ru: ru.items }));
}

export async function getProductSitemapIds(): Promise<Array<{ id: string }>> {
  return (await getProductSitemapShards()).map((_, id) => ({ id: String(id) }));
}

export async function getProductSitemap(id: string): Promise<MetadataRoute.Sitemap> {
  if (!/^(0|[1-9]\d*)$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  const shard = (await getProductSitemapShards())[Number(id)];
  if (!shard) notFound();
  return shard;
}

/** Static address of the product sitemap index; robots.txt lists it without reading the catalog. */
export const PRODUCT_SITEMAP_INDEX_PATH = '/product/sitemap-index.xml';

export async function getProductSitemapUrls(): Promise<string[]> {
  return (await getProductSitemapIds()).map(({ id }) =>
    new URL('/product/sitemap/' + id + '.xml', siteConfig.siteUrl).toString(),
  );
}

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Sitemap index of the product shards. When the product list cannot be read completely it answers 503 with
 * Retry-After, so crawlers keep the previous index instead of seeing products disappear.
 */
export async function getProductSitemapIndexResponse(): Promise<Response> {
  let urls: string[];
  try {
    urls = await getProductSitemapUrls();
  } catch {
    return new Response('Product sitemap is temporarily unavailable', {
      status: 503,
      headers: { 'retry-after': '3600', 'content-type': 'text/plain; charset=utf-8' },
    });
  }
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((url) => `<sitemap><loc>${escapeXml(url)}</loc></sitemap>\n`).join('') +
    '</sitemapindex>\n';
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
