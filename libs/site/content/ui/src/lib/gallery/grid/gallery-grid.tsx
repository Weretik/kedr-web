import { cn } from '@site/shared/ui';

import { GalleryCard } from './gallery-card';

import type { GallerySelectHandler } from './gallery-card';
import type { GalleryDictionary, GalleryMedia } from '@site/content/model';

const fullWidthSizes = '(min-width: 1440px) 1392px, calc(100vw - 32px)';
const halfWidthSizes = '(min-width: 1440px) 684px, (min-width: 640px) 50vw, calc(100vw - 32px)';
const leadSizes = '(min-width: 1440px) 912px, (min-width: 1024px) 64vw, calc(100vw - 32px)';
const secondarySizes =
  '(min-width: 1440px) 456px, (min-width: 1024px) 32vw, (min-width: 640px) 50vw, calc(100vw - 32px)';
const regularSizes =
  '(min-width: 1440px) 330px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 32px)';

export function GalleryGrid({
  items,
  dictionary,
  onSelect,
}: {
  items: readonly GalleryMedia[];
  dictionary: GalleryDictionary;
  onSelect?: GallerySelectHandler;
}) {
  const [lead] = items;
  if (!lead) return null;
  const secondary = items.slice(1, 3);
  const regular = items.slice(3);

  return (
    <div className="space-y-8">
      <div
        className={cn(
          'grid items-start gap-x-6 gap-y-8',
          secondary.length === 2 && 'lg:grid-cols-[2fr_1fr]',
          secondary.length === 1 && 'sm:grid-cols-2',
        )}
      >
        <GalleryCard
          media={lead}
          dictionary={dictionary}
          featured
          eager
          sizes={
            secondary.length === 2
              ? leadSizes
              : secondary.length === 1
                ? halfWidthSizes
                : fullWidthSizes
          }
          onSelect={onSelect}
        />
        {secondary.length > 0 && (
          <div
            className={cn(
              'grid gap-x-6 gap-y-8',
              secondary.length === 2 && 'sm:grid-cols-2 lg:grid-cols-1',
            )}
          >
            {secondary.map((media) => (
              <GalleryCard
                key={media.id}
                media={media}
                dictionary={dictionary}
                sizes={secondary.length === 1 ? halfWidthSizes : secondarySizes}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
      {regular.length > 0 && (
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {regular.map((media) => (
            <GalleryCard
              key={media.id}
              media={media}
              dictionary={dictionary}
              sizes={regularSizes}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
