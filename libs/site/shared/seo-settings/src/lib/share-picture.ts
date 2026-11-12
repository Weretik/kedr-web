import { DEFAULT_OG_IMAGE } from '@site/core/config';

import type { Metadata } from 'next';

/** A picture for link previews chosen in the admin. */
export type SharePicture = { url: string; width: number | null; height: number | null };

const usesDefaultPicture = (images: unknown): boolean => {
  const list = Array.isArray(images) ? images : [images];
  const [first] = list;
  return (
    list.length === 1 &&
    typeof first === 'object' &&
    first !== null &&
    (first as { url?: unknown }).url === DEFAULT_OG_IMAGE.url
  );
};

/**
 * Puts the admin picture in place of the site's default link-preview picture. A page's `openGraph` replaces the
 * layout's whole, so each page's metadata passes through here; pages with their own picture (products, articles)
 * keep it, and without an admin picture the default stays.
 */
export function applySharePicture(metadata: Metadata, picture: SharePicture | null): Metadata {
  const openGraph = metadata.openGraph;
  if (!picture || !openGraph || !usesDefaultPicture(openGraph.images)) return metadata;
  const image = {
    url: picture.url,
    ...(picture.width ? { width: picture.width } : {}),
    ...(picture.height ? { height: picture.height } : {}),
    alt: DEFAULT_OG_IMAGE.alt,
  };
  return { ...metadata, openGraph: { ...openGraph, images: [image] } };
}
