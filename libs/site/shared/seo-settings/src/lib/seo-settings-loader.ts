import 'server-only';

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import {
  SEO_SETTINGS_CACHE_TAGS,
  SEO_SETTINGS_FAILURE_LIFE,
  SEO_SETTINGS_LIFE,
} from './seo-settings-cache';
import { EMPTY_SITE_SEO_SETTINGS, mapSiteSeoSettings } from './seo-settings.mapper';
import { applySharePicture } from './share-picture';

import type { SiteSeoSettings } from './seo-settings.mapper';
import type { Metadata } from 'next';

/**
 * Codes and the link-preview picture from the admin. When the API cannot be reached the site adds no codes and
 * keeps its own picture, so pages and builds never fail on it.
 */
export async function getSiteSeoSettings(): Promise<SiteSeoSettings> {
  'use cache';
  cacheTag(SEO_SETTINGS_CACHE_TAGS.all, SEO_SETTINGS_CACHE_TAGS.settings);

  const result = await siteApiGet('/api/content/seo-settings');
  if (result.kind !== 'ok') {
    cacheLife(SEO_SETTINGS_FAILURE_LIFE);
    return EMPTY_SITE_SEO_SETTINGS;
  }

  cacheLife(SEO_SETTINGS_LIFE);
  return mapSiteSeoSettings(result.data);
}

/** Page metadata with the admin link-preview picture in place of the site default, if one is chosen. */
export async function withSiteSharePicture(
  metadata: Metadata | Promise<Metadata>,
): Promise<Metadata> {
  const [resolved, settings] = await Promise.all([metadata, getSiteSeoSettings()]);
  return applySharePicture(resolved, settings.sharePicture);
}
