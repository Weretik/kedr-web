import { Button, Dialog, DialogContent, DialogDescription, DialogTitle } from '@site/shared/ui';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { MediaImage } from './media-image';
import { VideoFrame } from './video-frame';

import type { GalleryDictionary, GalleryMedia } from '@site/content/model';
import type { KeyboardEvent, RefObject } from 'react';

type MediaViewerProps = {
  items: readonly GalleryMedia[];
  activeId: string | null;
  dictionary: GalleryDictionary;
  onNavigate: (mediaId: string) => void;
  onClose: () => void;
  triggerRef: RefObject<HTMLAnchorElement | null>;
};

/** A controlled leaf of GalleryBrowser; the shared Dialog owns focus containment and scroll locking. */
export function MediaViewer({
  items,
  activeId,
  dictionary,
  onNavigate,
  onClose,
  triggerRef,
}: MediaViewerProps) {
  const index = items.findIndex((item) => item.id === activeId);
  const media = index >= 0 ? items[index] : undefined;
  const previous = index > 0 ? items[index - 1] : undefined;
  const next = index >= 0 ? items[index + 1] : undefined;

  function handleArrows(event: KeyboardEvent<HTMLDivElement>) {
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      !(event.target instanceof Element) ||
      event.target.closest('iframe, input, textarea, select, [contenteditable="true"]')
    ) {
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const destination = event.key === 'ArrowLeft' ? previous : next;
    if (destination) onNavigate(destination.id);
  }

  return (
    <Dialog
      open={media !== undefined}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {media && (
        <DialogContent
          closeLabel={dictionary.close}
          onKeyDown={handleArrows}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (triggerRef.current?.isConnected) triggerRef.current.focus();
          }}
          className="top-[env(safe-area-inset-top,0px)] right-[env(safe-area-inset-right,0px)] bottom-[env(safe-area-inset-bottom,0px)] left-[env(safe-area-inset-left,0px)] flex w-auto max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:max-h-[90dvh] sm:w-[calc(100%-3rem)] sm:max-w-6xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border"
        >
          <header className="shrink-0 border-b border-border p-4 pr-16 sm:px-6 sm:pr-20">
            <DialogTitle className="text-xl leading-snug break-words">{media.title}</DialogTitle>
            <p aria-live="polite" aria-atomic="true" className="mt-2 text-sm text-muted-foreground">
              {media.kind === 'photo' ? dictionary.photoLabel : dictionary.videoLabel}
              <span aria-hidden="true"> · </span>
              {dictionary.position
                .replace('{current}', String(index + 1))
                .replace('{total}', String(items.length))}
            </p>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            {media.kind === 'photo' ? (
              <MediaImage
                image={media.image}
                dictionary={dictionary}
                sizes="(min-width: 1280px) 1104px, calc(100vw - 32px)"
                eager
                fit="contain"
                className="aspect-auto h-[min(60dvh,44rem)] min-h-40 rounded-lg"
              />
            ) : (
              <VideoFrame key={media.id} video={media} dictionary={dictionary} />
            )}
            <DialogDescription
              className={media.caption ? 'mt-4 leading-relaxed break-words' : 'sr-only'}
            >
              {media.caption ?? dictionary.viewerLabel}
            </DialogDescription>
          </div>
          {items.length > 1 && (
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border p-4 sm:px-6">
              <Button
                type="button"
                variant="outline"
                aria-label={dictionary.previous}
                disabled={!previous}
                onClick={() => {
                  if (previous) onNavigate(previous.id);
                }}
                className="min-h-11 rounded-lg motion-reduce:transition-none"
              >
                <ChevronLeftIcon aria-hidden="true" strokeWidth={1.75} />
                <span className="hidden sm:inline">{dictionary.previous}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                aria-label={dictionary.next}
                disabled={!next}
                onClick={() => {
                  if (next) onNavigate(next.id);
                }}
                className="min-h-11 rounded-lg motion-reduce:transition-none"
              >
                <span className="hidden sm:inline">{dictionary.next}</span>
                <ChevronRightIcon aria-hidden="true" strokeWidth={1.75} />
              </Button>
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
