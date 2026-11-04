import 'server-only';

import { getGalleryDictionary } from '@site/content/model';
import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import { GALLERY_CACHE_TAGS, GALLERY_FAILURE_LIFE, GALLERY_LIFE } from './gallery-cache';
import { toGalleryMedia } from './gallery.mapper';

import type { GalleryMedia } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** The gallery read: its cards in site order, or an API failure. */
export type GalleryResult =
  { kind: 'ok'; items: readonly GalleryMedia[] } | { kind: 'unavailable' };

/** The site gallery in one language, as the admin arranged it. */
export async function getGallery(locale: Locale): Promise<GalleryResult> {
  'use cache';
  cacheTag(GALLERY_CACHE_TAGS.all, GALLERY_CACHE_TAGS.gallery);

  const result = await siteApiGet('/api/content/{lang}/gallery', { path: { lang: locale } });
  if (result.kind === 'ok') {
    cacheLife(GALLERY_LIFE);
    return { kind: 'ok', items: toGalleryMedia(result.data, getGalleryDictionary(locale)) };
  }

  cacheLife(GALLERY_FAILURE_LIFE);
  return { kind: 'unavailable' };
}
