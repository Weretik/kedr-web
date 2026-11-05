import 'server-only';

import { applyPageSeo } from './apply-page-seo';
import { getPageSeoTexts } from './page-seo-loader';

import type { SitePage } from './page-seo-types';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** The page's metadata with the search texts editors set for it, if any. */
export async function withPageSeo(
  locale: Locale,
  page: SitePage,
  metadata: Metadata,
): Promise<Metadata> {
  const texts = await getPageSeoTexts(locale);
  return applyPageSeo(metadata, texts[page]);
}
