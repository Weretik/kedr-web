import 'server-only';

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { PAGE_SEO_CACHE_TAGS, PAGE_SEO_FAILURE_LIFE, PAGE_SEO_LIFE } from './page-seo-cache';

import type { PageSeoText, SitePage } from './page-seo-types';
import type { Locale } from '@site/core/i18n';

/**
 * The search texts editors set in the admin, by page, in one language. A failed read gives an empty map,
 * so every page keeps the title and description it has in code.
 */
export async function getPageSeoTexts(
  locale: Locale,
): Promise<Partial<Record<SitePage, PageSeoText>>> {
  'use cache';
  cacheTag(PAGE_SEO_CACHE_TAGS.all, PAGE_SEO_CACHE_TAGS.pageSeo);

  const result = await siteApiGet('/api/content/{lang}/page-seo', { path: { lang: locale } });
  if (result.kind !== 'ok') {
    cacheLife(PAGE_SEO_FAILURE_LIFE);
    return {};
  }

  cacheLife(PAGE_SEO_LIFE);
  return Object.fromEntries(
    result.data.map((row) => [
      row.page,
      { title: row.title?.trim() || null, description: row.description?.trim() || null },
    ]),
  );
}
