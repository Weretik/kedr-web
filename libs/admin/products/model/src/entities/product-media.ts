/** A media library file linked to a product. */
export interface ProductMediaItem {
  id: number;
  url: string;
  fileName: string;
}

/** Photos in gallery order (the first is the list photo) and an optional scheme. */
export interface ProductMedia {
  productId: number;
  photos: ProductMediaItem[];
  scheme: ProductMediaItem | null;
}

/** Matches the backend rule R-30. */
export const productMaxPhotos = 20;

/** The set the PUT endpoint replaces. */
export interface ProductMediaChange {
  photoIds: number[];
  schemeId: number | null;
}

export function toProductMediaChange(media: ProductMedia): ProductMediaChange {
  return { photoIds: media.photos.map((photo) => photo.id), schemeId: media.scheme?.id ?? null };
}

/** Moves the photo at `index` by `offset` places; other photos keep their order. */
export function movePhoto(
  media: ProductMediaChange,
  index: number,
  offset: -1 | 1,
): ProductMediaChange {
  const target = index + offset;
  if (target < 0 || target >= media.photoIds.length) return media;
  const photoIds = [...media.photoIds];
  [photoIds[index], photoIds[target]] = [photoIds[target], photoIds[index]];
  return { ...media, photoIds };
}

/** Adds files as photos at the end, skipping ones already linked and the scheme, up to the limit. */
export function addPhotos(
  media: ProductMediaChange,
  fileIds: readonly number[],
): ProductMediaChange {
  const photoIds = [...media.photoIds];
  for (const id of fileIds) {
    if (photoIds.length >= productMaxPhotos) break;
    if (!photoIds.includes(id) && id !== media.schemeId) photoIds.push(id);
  }
  return { ...media, photoIds };
}

export function removePhoto(media: ProductMediaChange, fileId: number): ProductMediaChange {
  return { ...media, photoIds: media.photoIds.filter((id) => id !== fileId) };
}

/** Sets the scheme; a file that was a photo stops being one, since a file is linked once. */
export function setScheme(media: ProductMediaChange, fileId: number | null): ProductMediaChange {
  return {
    photoIds: fileId === null ? media.photoIds : media.photoIds.filter((id) => id !== fileId),
    schemeId: fileId,
  };
}
