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

/** Photo and scheme are independent; a fragment does not identify a different image fetch. */
export function mapProductMedia(photo: unknown, scheme: unknown): ProductMediaItem[] {
  const result: ProductMediaItem[] = [];
  for (const [kind, value] of [
    ['photo', photo],
    ['scheme', scheme],
  ] as const) {
    const url = toMediaUrl(value);
    if (url && !result.some((item) => item.url === url)) result.push({ kind, url });
  }
  return result;
}
