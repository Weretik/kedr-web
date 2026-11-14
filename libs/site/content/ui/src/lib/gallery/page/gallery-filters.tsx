import { Button } from '@site/shared/ui';

import type { GalleryDictionary, GalleryFilter } from '@site/content/model';

const formats: readonly GalleryFilter[] = ['all', 'photo', 'video'];

export function GalleryFilters({
  value,
  dictionary,
  onChange,
}: {
  value: GalleryFilter;
  dictionary: GalleryDictionary;
  onChange: (value: GalleryFilter) => void;
}) {
  return (
    <div role="group" aria-label={dictionary.filtersLabel} className="flex flex-wrap gap-2">
      {formats.map((format) => (
        <Button
          key={format}
          type="button"
          aria-pressed={value === format}
          variant={value === format ? 'default' : 'outline'}
          className="min-h-11 min-w-20 rounded-lg px-5 motion-reduce:transition-none"
          onClick={() => onChange(format)}
        >
          {dictionary.filters[format]}
        </Button>
      ))}
    </div>
  );
}
