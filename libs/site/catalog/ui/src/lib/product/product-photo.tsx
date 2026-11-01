'use client';

import { cn } from '@site/shared/ui';
import { PackageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type ProductPhotoProps = {
  src: string | null;
  alt: string;
  sizes: string;
  className?: string;
  iconClassName?: string;
};

/**
 * Product photo inside a positioned box, or a package icon when there is none. 1C often lists a photo the CDN does
 * not have, so a failed load also falls back to the icon. The CDN image is loaded as is, without the Next.js
 * optimizer, which would log every missing photo as a server error.
 */
export function ProductPhoto({ src, alt, sizes, className, iconClassName }: ProductPhotoProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <PackageIcon
        aria-hidden
        className={cn('absolute inset-0 m-auto text-muted-foreground/60', iconClassName)}
        strokeWidth={1.75}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized
      onError={() => setFailed(true)}
      className={cn('object-contain', className)}
    />
  );
}
