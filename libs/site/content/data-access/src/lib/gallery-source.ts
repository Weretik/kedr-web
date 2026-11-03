import 'server-only';

import type { Locale } from '@site/core/i18n';

type GallerySourceImage = Readonly<{
  src: string;
  width: number;
  height: number;
}>;

type GallerySourceDetails = Readonly<{
  id: string;
  translations: Readonly<
    Record<Locale, Readonly<{ title: string; caption?: string; alt: string }>>
  >;
}>;

export type GallerySourceEntry = GallerySourceDetails &
  (
    | Readonly<{ kind: 'photo'; image: GallerySourceImage }>
    | Readonly<{
        kind: 'video';
        provider: 'youtube';
        youtubeId: string;
        poster: GallerySourceImage;
      }>
  );

/**
 * Owner-approved public videos from https://www.youtube.com/@kedrclass2334/videos.
 * The confirmed official order is newest first. Photographs await separate approval.
 */
export const GALLERY_SOURCE = [
  {
    id: 'youtube-0FDRbSaQ9Ec',
    kind: 'video',
    provider: 'youtube',
    youtubeId: '0FDRbSaQ9Ec',
    poster: { src: '/images/gallery/0FDRbSaQ9Ec.jpg', width: 480, height: 360 },
    translations: {
      uk: {
        title: 'Прихована петля ZCG 40',
        alt: 'Постер відео «Прихована петля ZCG 40»',
      },
      ru: {
        title: 'Петля скрытая ZCG 40',
        alt: 'Постер видео «Петля скрытая ZCG 40»',
      },
    },
  },
  {
    id: 'youtube-j9wrjRub9xI',
    kind: 'video',
    provider: 'youtube',
    youtubeId: 'j9wrjRub9xI',
    poster: { src: '/images/gallery/j9wrjRub9xI.jpg', width: 480, height: 360 },
    translations: {
      uk: {
        title: 'Порівняння прихованих петель із ZCG 40 KEDR',
        alt: 'Постер відео «Порівняння прихованих петель із ZCG 40 KEDR»',
      },
      ru: {
        title: 'Сравнение скрытых петель с ZCG 40 KEDR',
        alt: 'Постер видео «Сравнение скрытых петель с ZCG 40 KEDR»',
      },
    },
  },
  {
    id: 'youtube-1eB0xxFgwlw',
    kind: 'video',
    provider: 'youtube',
    youtubeId: '1eB0xxFgwlw',
    poster: { src: '/images/gallery/1eB0xxFgwlw.jpg', width: 480, height: 360 },
    translations: {
      uk: {
        title: '1 квітня 2021 р.',
        alt: 'Постер відео «1 квітня 2021 р.»',
      },
      ru: {
        title: '1 апреля 2021 г.',
        alt: 'Постер видео «1 апреля 2021 г.»',
      },
    },
  },
  {
    id: 'youtube-8hLIBALylkQ',
    kind: 'video',
    provider: 'youtube',
    youtubeId: '8hLIBALylkQ',
    poster: { src: '/images/gallery/8hLIBALylkQ.jpg', width: 480, height: 360 },
    translations: {
      uk: {
        title: 'CLASS Броненакладка Z 1021 CP (порожниста)',
        alt: 'Постер відео «CLASS Броненакладка Z 1021 CP (порожниста)»',
      },
      ru: {
        title: 'CLASS Броненакладка Z 1021 CP (пустотелая)',
        alt: 'Постер видео «CLASS Броненакладка Z 1021 CP (пустотелая)»',
      },
    },
  },
  {
    id: 'youtube-LQcVX5dC9MM',
    kind: 'video',
    provider: 'youtube',
    youtubeId: 'LQcVX5dC9MM',
    poster: { src: '/images/gallery/LQcVX5dC9MM.jpg', width: 480, height: 360 },
    translations: {
      uk: {
        title: 'Порівняння замка Apecs 2600 із замком Class 2800',
        alt: 'Постер відео «Порівняння замка Apecs 2600 із замком Class 2800»',
      },
      ru: {
        title: 'Сравнение замка Apecs 2600 с замком Class 2800',
        alt: 'Постер видео «Сравнение замка Apecs 2600 с замком Class 2800»',
      },
    },
  },
  {
    id: 'youtube-SIWCZ5uVY_4',
    kind: 'video',
    provider: 'youtube',
    youtubeId: 'SIWCZ5uVY_4',
    poster: { src: '/images/gallery/SIWCZ5uVY_4.jpg', width: 480, height: 360 },
    translations: {
      uk: {
        title: 'CLASS Броненакладка Z 1021 CP (порожниста)',
        alt: 'Постер відео «CLASS Броненакладка Z 1021 CP (порожниста)»',
      },
      ru: {
        title: 'CLASS Броненакладка Z 1021 CP (пустотелая)',
        alt: 'Постер видео «CLASS Броненакладка Z 1021 CP (пустотелая)»',
      },
    },
  },
  {
    id: 'youtube-ekr7ceJlJcg',
    kind: 'video',
    provider: 'youtube',
    youtubeId: 'ekr7ceJlJcg',
    poster: { src: '/images/gallery/ekr7ceJlJcg.jpg', width: 480, height: 360 },
    translations: {
      uk: {
        title: 'Замок Class 2800 (технічне пакування)',
        alt: 'Постер відео «Замок Class 2800 (технічне пакування)»',
      },
      ru: {
        title: 'Замок Class 2800 (тех упаковка)',
        alt: 'Постер видео «Замок Class 2800 (тех упаковка)»',
      },
    },
  },
] as const satisfies readonly GallerySourceEntry[];
