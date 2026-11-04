import type { GalleryTexts } from '../entities/gallery-item';

export const emptyGalleryTexts: GalleryTexts = {
  titleUk: '',
  titleRu: '',
  captionUk: '',
  captionRu: '',
};

/** The same title in both languages: YouTube gives one, the manager can translate it. */
export const galleryTextsFromTitle = (title: string | null): GalleryTexts => ({
  ...emptyGalleryTexts,
  titleUk: title ?? '',
  titleRu: title ?? '',
});

/** The card name the admin shows: the Ukrainian title, otherwise the Russian one. */
export const galleryItemLabel = (texts: GalleryTexts): string | null =>
  texts.titleUk.trim() || texts.titleRu.trim() || null;
