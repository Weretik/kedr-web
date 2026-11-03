'use client';

import { cn } from '@site/shared/ui';
import Image from 'next/image';

import type { ProductDetails } from '@site/product/model';

type ProductMediaProps = {
  item: ProductDetails['media'][number];
  alt: string;
  onError: () => void;
  thumbnail?: boolean;
  preload?: boolean;
  zoomed?: boolean;
};

/** One real CDN image; the gallery owns per-URL failure and selection. */
export function ProductMedia({
  item,
  alt,
  onError,
  thumbnail = false,
  preload = false,
  zoomed = false,
}: ProductMediaProps) {
  return (
    <Image
      src={item.url}
      alt={alt}
      fill
      unoptimized
      preload={preload}
      sizes={thumbnail ? '60px' : '(min-width: 1440px) 650px, (min-width: 1024px) 48vw, 100vw'}
      onError={onError}
      className={cn(
        'object-contain transition-transform duration-200 ease-out motion-reduce:transition-none',
        thumbnail ? 'p-1.5' : 'p-5 sm:p-7',
        zoomed && 'scale-125',
      )}
    />
  );
}
