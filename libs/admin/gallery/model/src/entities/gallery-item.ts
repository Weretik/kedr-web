export type GalleryItemKind = 'photo' | 'video';

/** Title and caption of a card in both site languages; empty means none. */
export interface GalleryTexts {
  titleUk: string;
  titleRu: string;
  captionUk: string;
  captionRu: string;
}

/** One card of the site gallery as the admin sees it. */
export interface GalleryItem {
  id: number;
  kind: GalleryItemKind;
  /** Media library file; only for a photo. */
  mediaFileId: number | null;
  /** YouTube video ID; only for a video. */
  youtubeId: string | null;
  position: number;
  texts: GalleryTexts;
  /** CDN picture or YouTube poster; null when the photo's file was deleted. */
  previewUrl: string | null;
  fileName: string | null;
  /** The library file was deleted: the site hides this card. */
  fileMissing: boolean;
  updatedAt: string;
}

/** What a pasted link resolves to before it is added. */
export interface YoutubePreview {
  youtubeId: string;
  title: string | null;
  thumbnailUrl: string;
  alreadyInGallery: boolean;
}

/** Matches the backend limits. */
export const galleryTitleMaxLength = 150;
export const galleryCaptionMaxLength = 500;
export const galleryPhotosPerAdd = 100;

export const youtubeWatchUrl = (youtubeId: string) =>
  `https://www.youtube.com/watch?v=${encodeURIComponent(youtubeId)}`;
