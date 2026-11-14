import type { GalleryFilter, GalleryMedia } from '../entities/gallery-types';

export const INITIAL_GALLERY_COUNT = 7;
export const GALLERY_BATCH_SIZE = 4;

/** Filter the complete source before taking a portion, preserving its editorial order and IDs. */
export function filterGalleryMedia(
  items: readonly GalleryMedia[],
  filter: GalleryFilter,
): readonly GalleryMedia[] {
  return filter === 'all' ? items : items.filter((item) => item.kind === filter);
}

/** Used on first render and whenever the format changes. Total is the filtered collection length. */
export function getInitialGalleryCount(total: number): number {
  return Math.min(INITIAL_GALLERY_COUNT, total);
}

/** Reveal the next portion without inventing positions beyond the actual collection. */
export function getNextGalleryCount(visibleCount: number, total: number): number {
  return Math.min(visibleCount + GALLERY_BATCH_SIZE, total);
}
