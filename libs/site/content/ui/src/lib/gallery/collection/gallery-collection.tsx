'use client';

import { Button } from '@site/shared/ui';

import { GalleryEmpty } from './gallery-empty';
import { useGalleryCollection } from './use-gallery-collection';
import { GalleryFilters } from '../gallery-filters';
import { GalleryGrid } from '../gallery-grid';
import { MediaViewer } from '../media/media-viewer';

import type { GalleryDictionary, GalleryMedia } from '@site/content/model';

type GalleryCollectionProps = {
  items: readonly GalleryMedia[];
  dictionary: GalleryDictionary;
};

/** Filters, the grid with «Показати ще», and the media viewer of one gallery collection. */
export function GalleryCollection({ items, dictionary }: GalleryCollectionProps) {
  const gallery = useGalleryCollection(items, dictionary);

  return (
    <section aria-label={dictionary.collectionLabel} className="mt-8">
      <GalleryFilters
        value={gallery.filter}
        dictionary={dictionary}
        onChange={gallery.changeFilter}
      />
      <div className="mt-7">
        {gallery.filtered.length > 0 ? (
          <GalleryGrid
            items={gallery.visible}
            dictionary={dictionary}
            onSelect={gallery.selectMedia}
          />
        ) : (
          <GalleryEmpty
            dictionary={dictionary}
            filter={gallery.filter}
            onShowAll={() => gallery.changeFilter('all')}
          />
        )}
      </div>
      {gallery.hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            className="min-h-11 rounded-lg px-6 motion-reduce:transition-none"
            onClick={gallery.revealMore}
          >
            {dictionary.showMore}
          </Button>
        </div>
      )}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {gallery.announcement}
      </p>
      <MediaViewer
        items={gallery.filtered}
        activeId={gallery.activeId}
        dictionary={dictionary}
        onNavigate={gallery.setActiveId}
        onClose={() => gallery.setActiveId(null)}
        triggerRef={gallery.triggerRef}
      />
    </section>
  );
}
