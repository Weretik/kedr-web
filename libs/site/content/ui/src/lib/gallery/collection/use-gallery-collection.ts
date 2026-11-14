import {
  filterGalleryMedia,
  getInitialGalleryCount,
  getNextGalleryCount,
} from '@site/content/model';
import { useRef, useState } from 'react';

import type { GalleryDictionary, GalleryFilter, GalleryMedia } from '@site/content/model';

/** The chosen filter, how many items are shown, the screen-reader note, and the open media of the gallery. */
export function useGalleryCollection(
  items: readonly GalleryMedia[],
  dictionary: GalleryDictionary,
) {
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [visibleCount, setVisibleCount] = useState(() => getInitialGalleryCount(items.length));
  const [announcement, setAnnouncement] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const filtered = filterGalleryMedia(items, filter);
  const visible = filtered.slice(0, visibleCount);

  return {
    filter,
    filtered,
    visible,
    hasMore: visible.length < filtered.length,
    announcement,
    activeId,
    setActiveId,
    triggerRef,
    changeFilter: (next: GalleryFilter) => {
      if (next === filter) return;
      setActiveId(null);
      setFilter(next);
      setVisibleCount(getInitialGalleryCount(filterGalleryMedia(items, next).length));
      setAnnouncement('');
    },
    revealMore: () => {
      const next = getNextGalleryCount(visibleCount, filtered.length);
      setVisibleCount(next);
      setAnnouncement(dictionary.itemsAdded.replace('{count}', String(next - visible.length)));
    },
    selectMedia: (mediaId: string, trigger: HTMLAnchorElement) => {
      triggerRef.current = trigger;
      setActiveId(mediaId);
    },
  };
}
