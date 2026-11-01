import { buildSearchMetadata } from '@site/catalog/seo';

import { readSearchTerm } from './search-term';

import type { SearchParamsRecord } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Search metadata: always `noindex`, the term in the title. */
export async function generateSearchMetadata(
  locale: Locale,
  searchParams: Promise<SearchParamsRecord>,
): Promise<Metadata> {
  return buildSearchMetadata(locale, readSearchTerm(await searchParams));
}
