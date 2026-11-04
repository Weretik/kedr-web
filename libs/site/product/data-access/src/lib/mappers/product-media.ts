import type { ProductMediaItem } from '@site/product/model';

const PRODUCT_IMAGE_HOST = 'images-kedr.cdn.express';

function toMediaUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (
      url.protocol !== 'https:' ||
      url.hostname !== PRODUCT_IMAGE_HOST ||
      url.username ||
      url.password ||
      url.port
    )
      return null;
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Gallery photos in the stated order, then the scheme. `photos` is the linked list; an older backend sends only
 * `photo`, which then stands alone. A fragment does not identify a different image fetch, so duplicates are dropped.
 */
export function mapProductMedia(
  photos: unknown,
  photo: unknown,
  scheme: unknown,
): ProductMediaItem[] {
  const photoValues = Array.isArray(photos) && photos.length > 0 ? photos : [photo];
  const result: ProductMediaItem[] = [];
  const entries: Array<readonly ['photo' | 'scheme', unknown]> = [
    ...photoValues.map((value) => ['photo', value] as const),
    ['scheme', scheme],
  ];
  for (const [kind, value] of entries) {
    const url = toMediaUrl(value);
    if (url && !result.some((item) => item.url === url)) result.push({ kind, url });
  }
  return result;
}
