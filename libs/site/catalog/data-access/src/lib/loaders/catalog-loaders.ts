import 'server-only';

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { CATALOG_CACHE_TAGS, FAILURE_LIFE } from '../cache-tags';
import { mapCatalogSections } from '../mappers/catalog-sections.mapper';
import { mapSiteCatalogTree, mapSiteCrawlTree } from '../mappers/category-tree.mapper';

import type { CatalogCrawlNode, CatalogSection, CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Category tree for menus and the catalog index; `null` when the API is unavailable. */
export async function getCatalogSections(locale: Locale): Promise<CatalogSection[] | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAGS.all, CATALOG_CACHE_TAGS.categories);

  const result = await siteApiGet('/api/catalog/{lang}/categories', { path: { lang: locale } });
  if (result.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }

  cacheLife('hours');
  return mapCatalogSections(result.data);
}

/** The site's category tree with counts for the tree panel and mega menu; `null` when unavailable. */
export async function getCatalogTree(locale: Locale): Promise<CatalogTreeNode[] | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAGS.all, CATALOG_CACHE_TAGS.categories);

  const result = await siteApiGet('/api/catalog/{lang}/categories', { path: { lang: locale } });
  if (result.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }

  cacheLife('hours');
  return mapSiteCatalogTree(result.data);
}

/**
 * The site's category tree for the sitemaps, with the search closing and the change date of each category;
 * `null` when unavailable. Same request and cache as {@link getCatalogTree}.
 */
export async function getCatalogCrawlTree(locale: Locale): Promise<CatalogCrawlNode[] | null> {
  'use cache';
  cacheTag(CATALOG_CACHE_TAGS.all, CATALOG_CACHE_TAGS.categories);

  const result = await siteApiGet('/api/catalog/{lang}/categories', { path: { lang: locale } });
  if (result.kind !== 'ok') {
    cacheLife(FAILURE_LIFE);
    return null;
  }

  cacheLife('hours');
  return mapSiteCrawlTree(result.data);
}
