import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getGalleryMedia, localizeGallerySource, validateGallerySource } from './gallery';

import type { GalleryVideo } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

vi.mock('server-only', () => ({}));

// Independently verified public channel listing, RSS, oEmbed, and original JPEG digests.
const APPROVED_VIDEOS = [
  {
    youtubeId: '0FDRbSaQ9Ec',
    ru: 'Петля скрытая ZCG 40',
    uk: 'Прихована петля ZCG 40',
    sha256: '11cb8ba4f7a03641ecf923a0314393eaa088604d853fc8c5101954101c983b8c',
  },
  {
    youtubeId: 'j9wrjRub9xI',
    ru: 'Сравнение скрытых петель с ZCG 40 KEDR',
    uk: 'Порівняння прихованих петель із ZCG 40 KEDR',
    sha256: '3b339774d614d1c2291dc7e15cd82cb885c229d526c4ec843551db5d69a228ee',
  },
  {
    youtubeId: '1eB0xxFgwlw',
    ru: '1 апреля 2021 г.',
    uk: '1 квітня 2021 р.',
    sha256: 'bf2517e2a8c1991212baf68e7ca897a17863f07079db7cac763330396f933419',
  },
  {
    youtubeId: '8hLIBALylkQ',
    ru: 'CLASS Броненакладка Z 1021 CP (пустотелая)',
    uk: 'CLASS Броненакладка Z 1021 CP (порожниста)',
    sha256: '1ea3b2a5f666fa4e136d08da170aa663dfae6b6ca751aa2624b90749cd6bd5c6',
  },
  {
    youtubeId: 'LQcVX5dC9MM',
    ru: 'Сравнение замка Apecs 2600 с замком Class 2800',
    uk: 'Порівняння замка Apecs 2600 із замком Class 2800',
    sha256: '140b422d0c11f0e30c6212a72ca0f220fcac37bb3ae5c3c4f1bad5fe24dd538d',
  },
  {
    youtubeId: 'SIWCZ5uVY_4',
    ru: 'CLASS Броненакладка Z 1021 CP (пустотелая)',
    uk: 'CLASS Броненакладка Z 1021 CP (порожниста)',
    sha256: '97442258b7b32319795783d761800a6c0edc11558c95bf6800eb8bd8c1edfa59',
  },
  {
    youtubeId: 'ekr7ceJlJcg',
    ru: 'Замок Class 2800 (тех упаковка)',
    uk: 'Замок Class 2800 (технічне пакування)',
    sha256: '10e0656f7bfc6d7aba93e92c97f991c900c011b598e0a38eae56d0dc4a203990',
  },
] as const;
const repositoryRoot = resolve(import.meta.dirname, '../../../../../..');
const translations = {
  uk: { title: 'Назва відео', alt: 'Постер відео' },
  ru: { title: 'Название видео', alt: 'Постер видео' },
};

function videoSource(overrides: Record<string, unknown> = {}) {
  return {
    id: 'fixture-video',
    kind: 'video',
    provider: 'youtube',
    youtubeId: '0FDRbSaQ9Ec',
    poster: { src: '/images/gallery/fixture-video.jpg', width: 480, height: 360 },
    translations: structuredClone(translations),
    ...overrides,
  };
}

function videosFor(locale: Locale): readonly GalleryVideo[] {
  const media = getGalleryMedia(locale);
  expect(media.every((item) => item.kind === 'video')).toBe(true);
  return media.filter((item): item is GalleryVideo => item.kind === 'video');
}

describe('approved server-only gallery video source', () => {
  it.each(['uk', 'ru'] as const)(
    'returns all seven confirmed %s videos in the official newest-first order',
    (locale) => {
      const videos = videosFor(locale);
      expect(videos).toHaveLength(7);
      expect(videos.map(({ youtubeId }) => youtubeId)).toEqual(
        APPROVED_VIDEOS.map(({ youtubeId }) => youtubeId),
      );
      expect(videos.map(({ id }) => id)).toEqual(
        APPROVED_VIDEOS.map(({ youtubeId }) => `youtube-${youtubeId}`),
      );
      expect(new Set(videos.map(({ id }) => id)).size).toBe(7);
      expect(videos.map(({ title }) => title)).toEqual(APPROVED_VIDEOS.map((item) => item[locale]));
      for (const video of videos) {
        expect(video.provider).toBe('youtube');
        expect(video.poster).toEqual({
          src: `/images/gallery/${video.youtubeId}.jpg`,
          width: 480,
          height: 360,
          alt: locale === 'uk' ? `Постер відео «${video.title}»` : `Постер видео «${video.title}»`,
        });
      }
    },
  );

  it.each(['uk', 'ru'] as const)(
    'returns only the selected %s presentation fields as an immutable collection',
    (locale) => {
      const media = getGalleryMedia(locale);
      expect(media).toHaveLength(7);
      expect(Object.isFrozen(media)).toBe(true);
      for (const item of media) {
        expect(Object.isFrozen(item)).toBe(true);
        expect(Object.keys(item).sort()).toEqual(
          ['id', 'kind', 'poster', 'provider', 'title', 'youtubeId'].sort(),
        );
        if (item.kind === 'video') expect(Object.isFrozen(item.poster)).toBe(true);
      }
    },
  );

  it('keeps stable identities across locales and retains both distinct duplicate-title videos', () => {
    const uk = videosFor('uk');
    const ru = videosFor('ru');
    expect(uk.map(({ id }) => id)).toEqual(ru.map(({ id }) => id));
    expect(
      ru.filter(({ title }) => title === APPROVED_VIDEOS[3].ru).map(({ youtubeId }) => youtubeId),
    ).toEqual(['8hLIBALylkQ', 'SIWCZ5uVY_4']);
  });

  it('preserves the generic official date title without adding an inferred description', () => {
    const uk = getGalleryMedia('uk').find(({ id }) => id === 'youtube-1eB0xxFgwlw');
    const ru = getGalleryMedia('ru').find(({ id }) => id === 'youtube-1eB0xxFgwlw');
    expect(uk).toMatchObject({ title: '1 квітня 2021 р.' });
    expect(ru).toMatchObject({ title: '1 апреля 2021 г.' });
    expect(uk).not.toHaveProperty('caption');
    expect(ru).not.toHaveProperty('caption');
  });

  it('retains all seven unchanged verified local poster files', () => {
    for (const { youtubeId, sha256 } of APPROVED_VIDEOS) {
      const poster = readFileSync(
        resolve(repositoryRoot, 'apps/site/public/images/gallery', `${youtubeId}.jpg`),
      );
      expect([...poster.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
      expect(createHash('sha256').update(poster).digest('hex')).toBe(sha256);
    }
  });
});

describe('gallery source preparation integrity', () => {
  it('allows an empty source or a confirmed video-only source without inventing photos', () => {
    expect(() => validateGallerySource([])).not.toThrow();
    expect(() => validateGallerySource([videoSource()])).not.toThrow();
    expect(localizeGallerySource([], 'uk')).toEqual([]);
    expect(localizeGallerySource([videoSource()], 'uk')).toHaveLength(1);
  });

  it('maps a real photo contract without provider fields or filesystem access', () => {
    const result = localizeGallerySource(
      [
        {
          id: 'fixture-photo',
          kind: 'photo',
          image: { src: '/images/gallery/fixture-photo.jpg', width: 800, height: 600 },
          translations,
        },
      ],
      'uk',
    );
    expect(result).toEqual([
      {
        id: 'fixture-photo',
        kind: 'photo',
        title: 'Назва відео',
        image: {
          src: '/images/gallery/fixture-photo.jpg',
          width: 800,
          height: 600,
          alt: 'Постер відео',
        },
      },
    ]);
  });

  it('selects complete translated captions without exposing or mutating authoring data', () => {
    const source = [
      videoSource({
        translations: {
          uk: { title: 'Назва', alt: 'Локальний постер', caption: 'Підтверджений підпис' },
          ru: { title: 'Название', alt: 'Локальный постер', caption: 'Подтверждённая подпись' },
        },
      }),
    ];
    const original = structuredClone(source);
    const media = localizeGallerySource(source, 'uk');
    expect(media).toEqual([
      {
        id: 'fixture-video',
        kind: 'video',
        provider: 'youtube',
        youtubeId: '0FDRbSaQ9Ec',
        title: 'Назва',
        caption: 'Підтверджений підпис',
        poster: {
          src: '/images/gallery/fixture-video.jpg',
          width: 480,
          height: 360,
          alt: 'Локальний постер',
        },
      },
    ]);
    expect(source).toEqual(original);
    expect(Object.isFrozen(media)).toBe(true);
    expect(Object.isFrozen(media[0])).toBe(true);
    if (media[0]?.kind === 'video') expect(Object.isFrozen(media[0].poster)).toBe(true);
  });

  it('fails the whole source instead of silently dropping an invalid entry', () => {
    expect(() =>
      localizeGallerySource(
        [videoSource(), videoSource({ id: 'invalid', provider: 'other' })],
        'uk',
      ),
    ).toThrow();
  });

  it.each([
    { reason: 'a non-array source', source: null },
    { reason: 'a non-object entry', source: [null] },
    { reason: 'an empty ID', source: [videoSource({ id: ' ' })] },
    {
      reason: 'a duplicate stable ID',
      source: [videoSource(), videoSource({ youtubeId: 'j9wrjRub9xI' })],
    },
    {
      reason: 'a missing UK translation',
      source: [videoSource({ translations: { ru: translations.ru } })],
    },
    {
      reason: 'a missing RU translation',
      source: [videoSource({ translations: { uk: translations.uk } })],
    },
    {
      reason: 'an empty UK title',
      source: [
        videoSource({ translations: { ...translations, uk: { ...translations.uk, title: ' ' } } }),
      ],
    },
    {
      reason: 'an empty RU title',
      source: [
        videoSource({ translations: { ...translations, ru: { ...translations.ru, title: '' } } }),
      ],
    },
    {
      reason: 'an empty UK alt',
      source: [
        videoSource({ translations: { ...translations, uk: { ...translations.uk, alt: ' ' } } }),
      ],
    },
    {
      reason: 'an empty RU alt',
      source: [
        videoSource({ translations: { ...translations, ru: { ...translations.ru, alt: '' } } }),
      ],
    },
    {
      reason: 'a caption missing its other translation',
      source: [
        videoSource({
          translations: { ...translations, uk: { ...translations.uk, caption: 'Підпис' } },
        }),
      ],
    },
    { reason: 'an unsupported media kind', source: [videoSource({ kind: 'audio' })] },
    { reason: 'an unsupported video provider', source: [videoSource({ provider: 'vimeo' })] },
    {
      reason: 'a URL supplied instead of a YouTube ID',
      source: [videoSource({ youtubeId: 'https://www.youtube.com/watch?v=0FDRbSaQ9Ec' })],
    },
    {
      reason: 'a YouTube ID with the wrong length',
      source: [videoSource({ youtubeId: '0FDRbSaQ9E' })],
    },
    { reason: 'a malformed YouTube ID', source: [videoSource({ youtubeId: '0FDRbSaQ9E!' })] },
    { reason: 'a missing poster', source: [videoSource({ poster: null })] },
  ])('rejects $reason', ({ source }) => {
    expect(() => validateGallerySource(source)).toThrow();
  });

  it.each([
    { width: 0, height: 360 },
    { width: 480, height: -1 },
    { width: Number.NaN, height: 360 },
    { width: 480, height: Number.POSITIVE_INFINITY },
    { width: 0.5, height: 360 },
  ])('rejects invalid pixel dimensions $width × $height', ({ width, height }) => {
    expect(() =>
      validateGallerySource([
        videoSource({ poster: { src: '/images/gallery/fixture.jpg', width, height } }),
      ]),
    ).toThrow();
  });

  it.each([
    'https://example.com/poster.jpg',
    '//example.com/poster.jpg',
    '/images/articles/Article_1.jpg',
    '/images/gallery/../outside.jpg',
    '/images/gallery/nested/../../outside.jpg',
    '/images/gallery/%2e%2e/outside.jpg',
    '/images/gallery/nested%2f..%2foutside.jpg',
    '/images/gallery/..\\outside.jpg',
    '/images/gallery/poster.jpg?replacement=other',
    '/images/gallery/poster.jpg#fragment',
    '/images/gallery/',
  ])('rejects an unsafe or out-of-directory local asset path %s', (src) => {
    expect(() =>
      validateGallerySource([videoSource({ poster: { src, width: 480, height: 360 } })]),
    ).toThrow();
  });
});
