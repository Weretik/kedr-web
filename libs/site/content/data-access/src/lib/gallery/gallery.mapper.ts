import type { components } from '@shared/api-contracts';
import type { GalleryDictionary, GalleryMedia } from '@site/content/model';

type PublicGalleryItem = components['schemas']['PublicGalleryItem'];

// The site lays pictures out by aspect box, so a size the library does not know only feeds next/image.
const UNKNOWN_PHOTO_SIZE = { width: 1600, height: 1200 };

/** API cards in site order → view models; a card without a title gets a neutral one for links and alt text. */
export function toGalleryMedia(
  items: readonly PublicGalleryItem[],
  dictionary: Pick<GalleryDictionary, 'untitledPhoto' | 'untitledVideo' | 'posterAlt'>,
): readonly GalleryMedia[] {
  return items.flatMap((item): GalleryMedia[] => {
    const id = `${item.kind}-${item.id}`;
    const caption = item.caption ?? undefined;
    if (item.kind === 'video') {
      if (!item.youtubeId) return [];
      const title = item.title ?? dictionary.untitledVideo;
      return [
        {
          id,
          kind: 'video',
          provider: 'youtube',
          youtubeId: item.youtubeId,
          title,
          ...(caption ? { caption } : {}),
          poster: {
            src: item.imageUrl,
            width: item.width ?? 480,
            height: item.height ?? 360,
            alt: dictionary.posterAlt.replace('{title}', title),
          },
        },
      ];
    }
    const title = item.title ?? dictionary.untitledPhoto;
    return [
      {
        id,
        kind: 'photo',
        title,
        ...(caption ? { caption } : {}),
        image: {
          src: item.imageUrl,
          width: item.width ?? UNKNOWN_PHOTO_SIZE.width,
          height: item.height ?? UNKNOWN_PHOTO_SIZE.height,
          alt: title,
        },
      },
    ];
  });
}
