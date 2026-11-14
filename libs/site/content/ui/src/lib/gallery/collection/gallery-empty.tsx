import { Button } from '@site/shared/ui';

import type { GalleryDictionary, GalleryFilter } from '@site/content/model';

/** No media at all, or none for the chosen filter with «Показати все». */
export function GalleryEmpty({
  dictionary,
  filter,
  onShowAll,
}: {
  dictionary: GalleryDictionary;
  filter: GalleryFilter;
  onShowAll: () => void;
}) {
  return (
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
          onClick={onShowAll}
        >
          {dictionary.showAll}
        </Button>
      )}
    </div>
  );
}
