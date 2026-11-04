import 'server-only';

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import {
  HOME_BLOCKS_CACHE_TAGS,
  HOME_BLOCKS_FAILURE_LIFE,
  HOME_BLOCKS_LIFE,
} from './home-blocks-cache';

import type { HomeBlocksResult } from './home-blocks';
import type { Locale } from '@site/core/i18n';

/** The home page FAQ and brands in one language, as the admin arranged them. */
export async function getHomeBlocks(locale: Locale): Promise<HomeBlocksResult> {
  'use cache';
  cacheTag(HOME_BLOCKS_CACHE_TAGS.all, HOME_BLOCKS_CACHE_TAGS.home);

  const result = await siteApiGet('/api/content/{lang}/home', { path: { lang: locale } });
  if (result.kind !== 'ok') {
    cacheLife(HOME_BLOCKS_FAILURE_LIFE);
    return { kind: 'unavailable' };
  }

  cacheLife(HOME_BLOCKS_LIFE);
  return {
    kind: 'ok',
    faq: result.data.faq.map(({ question, answer }) => ({ question, answer })),
    brands: result.data.brands.map((brand) => ({
      name: brand.name,
      src: brand.logoUrl,
      width: brand.width ?? undefined,
      height: brand.height ?? undefined,
    })),
  };
}
