import 'server-only';

import { GALLERY_SOURCE } from './gallery-source';

import type { GallerySourceEntry } from './gallery-source';
import type { GalleryMedia } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isGalleryAssetPath(value: unknown): value is string {
  const prefix = '/images/gallery/';
  if (typeof value !== 'string' || !value.startsWith(prefix) || /[\\%?#]/u.test(value)) {
    return false;
  }
  if (
    [...value].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
  ) {
    return false;
  }
  return value
    .slice(prefix.length)
    .split('/')
    .every(
      (segment) =>
        segment.length > 0 && segment.trim() === segment && segment !== '.' && segment !== '..',
    );
}

function invalidSource(reason: string): never {
  throw new Error(`Invalid gallery source: ${reason}`);
}

/** Internal source preparation contract; not a public-index export. */
export function validateGallerySource(
  source: unknown,
): asserts source is readonly GallerySourceEntry[] {
  if (!Array.isArray(source)) invalidSource('the collection must be an array');
  const ids = new Set<string>();
  for (const [index, entry] of source.entries()) {
    if (!isRecord(entry)) invalidSource(`entry ${index} must be an object`);
    if (!hasText(entry.id)) invalidSource(`entry ${index} needs a stable ID`);
    if (ids.has(entry.id)) invalidSource(`duplicate ID ${entry.id}`);
    ids.add(entry.id);

    if (!isRecord(entry.translations)) invalidSource(`${entry.id} needs both translations`);
    let hasCaption: boolean | undefined;
    for (const locale of ['uk', 'ru'] as const) {
      const translation = entry.translations[locale];
      if (!isRecord(translation) || !hasText(translation.title) || !hasText(translation.alt)) {
        invalidSource(`${entry.id} needs a nonempty ${locale} title and alt`);
      }
      const translatedCaption = Object.prototype.hasOwnProperty.call(translation, 'caption');
      if (translatedCaption && !hasText(translation.caption)) {
        invalidSource(`${entry.id} has an empty ${locale} caption`);
      }
      if (hasCaption !== undefined && hasCaption !== translatedCaption) {
        invalidSource(`${entry.id} needs both caption translations`);
      }
      hasCaption = translatedCaption;
    }

    if (entry.kind !== 'photo' && entry.kind !== 'video') {
      invalidSource(`${entry.id} has an unsupported media kind`);
    }
    if (
      entry.kind === 'video' &&
      (entry.provider !== 'youtube' ||
        typeof entry.youtubeId !== 'string' ||
        !/^[A-Za-z0-9_-]{11}$/u.test(entry.youtubeId))
    ) {
      invalidSource(`${entry.id} needs the YouTube provider and a valid video ID`);
    }
    const image = entry.kind === 'photo' ? entry.image : entry.poster;
    if (!isRecord(image) || !isGalleryAssetPath(image.src)) {
      invalidSource(`${entry.id} needs a local image inside /images/gallery/`);
    }
    for (const dimension of ['width', 'height'] as const) {
      const pixels = image[dimension];
      if (typeof pixels !== 'number' || !Number.isInteger(pixels) || pixels <= 0) {
        invalidSource(`${entry.id} needs a positive integer ${dimension}`);
      }
    }
  }
}

/** Internal mapper contract for focused source tests; not a public-index export. */
export function localizeGallerySource(source: unknown, locale: Locale): readonly GalleryMedia[] {
  validateGallerySource(source);
  return Object.freeze(
    source.map((entry): GalleryMedia => {
      const translation = entry.translations[locale];
      const details = {
        id: entry.id,
        title: translation.title,
        ...(translation.caption === undefined ? {} : { caption: translation.caption }),
      };
      const asset = entry.kind === 'photo' ? entry.image : entry.poster;
      const image = Object.freeze({
        src: asset.src,
        width: asset.width,
        height: asset.height,
        alt: translation.alt,
      });
      return entry.kind === 'photo'
        ? Object.freeze({ ...details, kind: 'photo', image })
        : Object.freeze({
            ...details,
            kind: 'video',
            provider: 'youtube',
            youtubeId: entry.youtubeId,
            poster: image,
          });
    }),
  );
}

const GALLERY_BY_LOCALE: Readonly<Record<Locale, readonly GalleryMedia[]>> = Object.freeze({
  uk: localizeGallerySource(GALLERY_SOURCE, 'uk'),
  ru: localizeGallerySource(GALLERY_SOURCE, 'ru'),
});

/** Reads only the selected locale; authoring and source validation stay on the server. */
export function getGalleryMedia(locale: Locale): readonly GalleryMedia[] {
  return GALLERY_BY_LOCALE[locale];
}
