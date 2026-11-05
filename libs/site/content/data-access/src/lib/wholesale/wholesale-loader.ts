import 'server-only';

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { WHOLESALE_CACHE_TAGS, WHOLESALE_FAILURE_LIFE, WHOLESALE_LIFE } from './wholesale-cache';
import { toWholesaleTexts } from './wholesale.mapper';

import type { WholesaleTexts } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** The «Співпраця» texts read: the admin's copy, or a failure that leaves the code copy on the page. */
export type WholesaleTextsResult = { kind: 'ok'; texts: WholesaleTexts } | { kind: 'unavailable' };

/** The «Співпраця» copy in one language, as managers saved it in the admin. */
export async function getWholesaleTexts(locale: Locale): Promise<WholesaleTextsResult> {
  'use cache';
  cacheTag(WHOLESALE_CACHE_TAGS.all, WHOLESALE_CACHE_TAGS.wholesale);

  const result = await siteApiGet('/api/content/{lang}/wholesale', { path: { lang: locale } });
  const texts = result.kind === 'ok' ? toWholesaleTexts(result.data.text) : null;
  if (texts) {
    cacheLife(WHOLESALE_LIFE);
    return { kind: 'ok', texts };
  }

  cacheLife(WHOLESALE_FAILURE_LIFE);
  return { kind: 'unavailable' };
}
