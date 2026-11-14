import {
  GALLERY_BATCH_SIZE,
  INITIAL_GALLERY_COUNT,
  filterGalleryMedia,
  getInitialGalleryCount,
  getNextGalleryCount,
} from './gallery-filter';
import { getGalleryDictionary } from '../copy/gallery/gallery-dictionary';

import type { GalleryMedia } from '../entities/gallery-types';

const media: readonly GalleryMedia[] = Object.freeze(
  Array.from({ length: 17 }, (_, index): GalleryMedia => {
    const image = Object.freeze({
      src: `/images/gallery/fixture-${index + 1}.jpg`,
      width: 1280,
      height: 720,
      alt: `Тестове зображення ${index + 1}`,
    });
    const common = { id: `media-${index + 1}`, title: `Матеріал ${index + 1}` };
    return index % 2 === 0
      ? Object.freeze({ ...common, kind: 'photo', image })
      : Object.freeze({
          ...common,
          kind: 'video',
          provider: 'youtube',
          youtubeId: '1eB0xxFgwlw',
          poster: image,
        });
  }),
);

describe('gallery filtering and portions', () => {
  it('keeps the full editorial order and stable identities for all media', () => {
    const result = filterGalleryMedia(media, 'all');
    expect(result.map(({ id }) => id)).toEqual(media.map(({ id }) => id));
    expect(new Set(result.map(({ id }) => id)).size).toBe(17);
    expect(result.every((item, index) => item === media[index])).toBe(true);
  });

  it.each([
    {
      filter: 'photo' as const,
      ids: [
        'media-1',
        'media-3',
        'media-5',
        'media-7',
        'media-9',
        'media-11',
        'media-13',
        'media-15',
        'media-17',
      ],
    },
    {
      filter: 'video' as const,
      ids: [
        'media-2',
        'media-4',
        'media-6',
        'media-8',
        'media-10',
        'media-12',
        'media-14',
        'media-16',
      ],
    },
  ])(
    'filters $filter across the complete collection without reordering or mutating it',
    ({ filter, ids }) => {
      const result = filterGalleryMedia(media, filter);
      expect(result.map(({ id }) => id)).toEqual(ids);
      expect(result.every((item) => item.kind === filter && media.includes(item))).toBe(true);
      expect(media.map(({ id }) => id)).toEqual(
        Array.from({ length: 17 }, (_, index) => `media-${index + 1}`),
      );
    },
  );

  it('returns an empty collection for an empty format or an empty source', () => {
    expect(filterGalleryMedia(filterGalleryMedia(media, 'video'), 'photo')).toEqual([]);
    expect(filterGalleryMedia([], 'all')).toEqual([]);
  });

  it.each([
    { total: 0, expected: 0 },
    { total: 2, expected: 2 },
    { total: 7, expected: 7 },
    { total: 17, expected: 7 },
  ])('starts with $expected real items when the collection has $total', ({ total, expected }) => {
    expect(INITIAL_GALLERY_COUNT).toBe(7);
    expect(getInitialGalleryCount(total)).toBe(expected);
  });

  it('reveals at most four more each time and stops at the actual total', () => {
    expect(GALLERY_BATCH_SIZE).toBe(4);
    const initial = getInitialGalleryCount(media.length);
    const next = getNextGalleryCount(initial, media.length);
    const second = getNextGalleryCount(next, media.length);
    const final = getNextGalleryCount(second, media.length);
    expect([initial, next, second, final]).toEqual([7, 11, 15, 17]);
    expect(getNextGalleryCount(final, media.length)).toBe(17);
    expect(media.slice(0, next).map(({ id }) => id)).toEqual(
      Array.from({ length: 11 }, (_, index) => `media-${index + 1}`),
    );
  });

  it('resets the portion for a changed filter instead of retaining an expanded count', () => {
    const expanded = getNextGalleryCount(getInitialGalleryCount(media.length), media.length);
    const photos = filterGalleryMedia(media, 'photo');
    expect(expanded).toBe(11);
    expect(getInitialGalleryCount(photos.length)).toBe(7);
    expect(getNextGalleryCount(getInitialGalleryCount(photos.length), photos.length)).toBe(9);
    expect(getInitialGalleryCount(filterGalleryMedia([], 'all').length)).toBe(0);
  });
});

describe('gallery localized presentation copy', () => {
  it.each([
    { locale: 'uk' as const, title: 'Галерея та відео', all: 'Усі', video: 'Відео' },
    { locale: 'ru' as const, title: 'Галерея и видео', all: 'Все', video: 'Видео' },
  ])(
    'returns complete serializable $locale copy for the collection and viewer',
    ({ locale, title, all, video }) => {
      const dictionary = getGalleryDictionary(locale);
      expect(dictionary.locale).toBe(locale);
      expect(dictionary.title).toBe(title);
      expect(dictionary.filters).toEqual({ all, photo: 'Фото', video });
      expect(JSON.parse(JSON.stringify(dictionary))).toEqual(dictionary);
      for (const [key, value] of Object.entries(dictionary)) {
        if (key !== 'filters')
          expect(typeof value === 'string' && value.trim().length > 0).toBe(true);
      }
      expect(dictionary.position).toContain('{current}');
      expect(dictionary.position).toContain('{total}');
      expect(dictionary.itemsAdded).toContain('{count}');
      expect(dictionary.openPhoto).toContain('{title}');
      expect(dictionary.openVideo).toContain('{title}');
    },
  );

  it('offers the same presentation keys in both languages without copying locale-specific text', () => {
    const uk = getGalleryDictionary('uk');
    const ru = getGalleryDictionary('ru');
    expect(Object.keys(uk).sort()).toEqual(Object.keys(ru).sort());
    for (const key of ['intro', 'close', 'previous', 'next', 'imageError', 'videoHelp'] as const) {
      expect(uk[key]).not.toBe(ru[key]);
    }
  });
});
