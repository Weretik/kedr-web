'use client';

import { GalleryCollection } from './collection/gallery-collection';

import type { GalleryDictionary, GalleryMedia } from '@site/content/model';

type GalleryBrowserProps = {
  items: readonly GalleryMedia[];
  dictionary: GalleryDictionary;
};

/** Locale or immutable media content changes start a fresh collection and unmount any previous player. */
export function GalleryBrowser(props: GalleryBrowserProps) {
  return (
    <GalleryCollection key={JSON.stringify([props.dictionary.locale, props.items])} {...props} />
  );
}
