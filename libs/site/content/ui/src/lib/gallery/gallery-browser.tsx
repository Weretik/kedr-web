'use client';

import {
  filterGalleryMedia,
  getInitialGalleryCount,
  getNextGalleryCount,
} from '@site/content/model';
import { Button } from '@site/shared/ui';
import { useRef, useState } from 'react';

import { GalleryFilters } from './gallery-filters';
import { GalleryGrid } from './gallery-grid';
import { MediaViewer } from './media-viewer';

import type { GalleryDictionary, GalleryFilter, GalleryMedia } from '@site/content/model';

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

function GalleryCollection({ items, dictionary }: GalleryBrowserProps) {
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [visibleCount, setVisibleCount] = useState(() => getInitialGalleryCount(items.length));
  const [announcement, setAnnouncement] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const filtered = filterGalleryMedia(items, filter);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visible.length < filtered.length;

  function changeFilter(next: GalleryFilter) {
    if (next === filter) return;
    setActiveId(null);
    setFilter(next);
    setVisibleCount(getInitialGalleryCount(filterGalleryMedia(items, next).length));
    setAnnouncement('');
  }

  function revealMore() {
    const next = getNextGalleryCount(visibleCount, filtered.length);
    setVisibleCount(next);
    setAnnouncement(dictionary.itemsAdded.replace('{count}', String(next - visible.length)));
  }

  function selectMedia(mediaId: string, trigger: HTMLAnchorElement) {
    triggerRef.current = trigger;
    setActiveId(mediaId);
  }

  return (
    <section aria-label={dictionary.collectionLabel} className="mt-8">
      <GalleryFilters value={filter} dictionary={dictionary} onChange={changeFilter} />
      <div className="mt-7">
        {filtered.length > 0 ? (
          <GalleryGrid items={visible} dictionary={dictionary} onSelect={selectMedia} />
        ) : (
          <div className="rounded-xl border border-border bg-muted/30 px-6 py-10 text-center">
            <h2 className="text-xl font-semibold">
              {filter === 'all' ? dictionary.emptyTitle : dictionary.emptyFilterTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {filter === 'all' ? dictionary.emptyText : dictionary.emptyFilterText}
            </p>
            {filter !== 'all' && (
              <Button
                type="button"
                className="mt-5 rounded-lg motion-reduce:transition-none"
                onClick={() => changeFilter('all')}
              >
                {dictionary.showAll}
              </Button>
            )}
          </div>
        )}
      </div>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            className="min-h-11 rounded-lg px-6 motion-reduce:transition-none"
            onClick={revealMore}
          >
            {dictionary.showMore}
          </Button>
        </div>
      )}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>
      <MediaViewer
        items={filtered}
        activeId={activeId}
        dictionary={dictionary}
        onNavigate={setActiveId}
        onClose={() => setActiveId(null)}
        triggerRef={triggerRef}
      />
    </section>
  );
}
