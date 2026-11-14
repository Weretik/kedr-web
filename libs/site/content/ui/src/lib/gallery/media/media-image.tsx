'use client';

import { Button, cn } from '@site/shared/ui';
import { ImageOffIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import type { GalleryDictionary, GalleryImage } from '@site/content/model';

type MediaImageProps = {
  image: GalleryImage;
  dictionary: Pick<GalleryDictionary, 'imageLoading' | 'imageError' | 'retryImage'>;
  sizes: string;
  eager?: boolean;
  fit?: 'cover' | 'contain';
  className?: string;
};

/** Changing the asset resets its isolated loading/error lifecycle. */
export function MediaImage(props: MediaImageProps) {
  return <ImageContent key={props.image.src} {...props} />;
}

function ImageContent({
  image,
  dictionary,
  sizes,
  eager = false,
  fit = 'cover',
  className,
}: MediaImageProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);

  function retry() {
    setAttempt((value) => value + 1);
    setState('loading');
  }

  return (
    <div
      data-state={state}
      aria-busy={state === 'loading'}
      className={cn('relative aspect-video w-full overflow-hidden rounded-xl bg-muted', className)}
    >
      {state === 'error' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center text-muted-foreground">
          <ImageOffIcon aria-hidden size={24} strokeWidth={1.75} />
          <p role="status" className="text-sm">
            {dictionary.imageError}
          </p>
          <span className="sr-only">{image.alt}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={retry}
            className="relative z-20 h-auto min-h-9 max-w-full rounded-lg py-1 text-sm whitespace-normal motion-reduce:transition-none"
          >
            {dictionary.retryImage}
          </Button>
        </div>
      ) : (
        <>
          <Image
            key={attempt}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes={sizes}
            loading={eager ? 'eager' : 'lazy'}
            onLoad={() => setState('loaded')}
            onError={() => setState('error')}
            className={cn(
              'absolute inset-0 size-full',
              fit === 'contain' ? 'object-contain' : 'object-cover',
            )}
          />
          {state === 'loading' && <span className="sr-only">{dictionary.imageLoading}</span>}
        </>
      )}
    </div>
  );
}
