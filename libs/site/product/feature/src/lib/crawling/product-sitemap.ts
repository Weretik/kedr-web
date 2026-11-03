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

export async function getProductSitemapUrls(): Promise<string[]> {
  return (await getProductSitemapIds()).map(({ id }) =>
    new URL('/product/sitemap/' + id + '.xml', siteConfig.siteUrl).toString(),
  );
}
