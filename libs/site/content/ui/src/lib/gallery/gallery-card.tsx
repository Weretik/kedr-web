import { cn } from '@site/shared/ui';
import { PlayIcon } from 'lucide-react';

import { MediaImage } from './media/media-image';

import type { GalleryDictionary, GalleryMedia } from '@site/content/model';
import type { MouseEvent } from 'react';

export type GallerySelectHandler = (mediaId: string, trigger: HTMLAnchorElement) => void;

export function GalleryCard({
  media,
  dictionary,
  onSelect,
  featured = false,
  eager = false,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 32px)',
}: {
  media: GalleryMedia;
  dictionary: GalleryDictionary;
  onSelect?: GallerySelectHandler;
  featured?: boolean;
  eager?: boolean;
  sizes?: string;
}) {
  const video = media.kind === 'video';
  const image = video ? media.poster : media.image;
  const href = video
    ? `https://www.youtube.com/watch?v=${encodeURIComponent(media.youtubeId)}`
    : media.image.src;
  const accessibleName = (video ? dictionary.openVideo : dictionary.openPhoto).replace(
    '{title}',
    media.title,
  );

  function select(event: MouseEvent<HTMLAnchorElement>) {
    if (
      !onSelect ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    onSelect(media.id, event.currentTarget);
  }

  return (
    <article className="group relative min-w-0">
      <div className="relative">
        <MediaImage
          image={image}
          dictionary={dictionary}
          sizes={sizes}
          eager={eager}
          className="peer"
        />
        {video && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 grid place-items-center peer-data-[state=error]:hidden"
          >
            <span className="grid size-12 place-items-center rounded-full bg-background/95 text-foreground">
              <PlayIcon size={22} strokeWidth={1.75} />
            </span>
          </span>
        )}
      </div>
      <div className="pt-3">
        <p className="text-xs font-medium text-muted-foreground">
          {video ? dictionary.videoLabel : dictionary.photoLabel}
        </p>
        <h2
          className={cn(
            'mt-1 text-base font-semibold break-words text-foreground decoration-1 underline-offset-4 group-hover:underline',
            featured && 'text-lg sm:text-xl lg:text-2xl',
          )}
        >
          {media.title}
        </h2>
        {media.caption && (
          <p className="mt-2 text-sm leading-relaxed break-words text-muted-foreground">
            {media.caption}
          </p>
        )}
      </div>
      {/* The native link overlays the card; image recovery remains its sibling, never a nested control. */}
      <a
        href={href}
        aria-label={accessibleName}
        onClick={onSelect ? select : undefined}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      />
    </article>
  );
}
