import { adminGalleryListSchema, youtubePreviewSchema } from '../validators/gallery.schemas';

import type { GalleryTextsBody } from '../contracts/admin-gallery.contract';
import type { GalleryItem, GalleryTexts, YoutubePreview } from '@admin/gallery/model';

export const mapGallery = (response: unknown): GalleryItem[] =>
  adminGalleryListSchema
    .parse(response)
    .map(({ titleUk, titleRu, captionUk, captionRu, ...item }) => ({
      ...item,
      texts: {
        titleUk: titleUk ?? '',
        titleRu: titleRu ?? '',
        captionUk: captionUk ?? '',
        captionRu: captionRu ?? '',
      },
    }));

export const mapYoutubePreview = (response: unknown): YoutubePreview =>
  youtubePreviewSchema.parse(response);

const optional = (value: string) => value.trim() || null;

export const toGalleryTextsBody = (texts: GalleryTexts): GalleryTextsBody => ({
  titleUk: optional(texts.titleUk),
  titleRu: optional(texts.titleRu),
  captionUk: optional(texts.captionUk),
  captionRu: optional(texts.captionRu),
});
