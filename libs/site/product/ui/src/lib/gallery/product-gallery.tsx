'use client';

import { Button, cn } from '@site/shared/ui';
import { ImageIcon, PackageIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { useState } from 'react';

import { ProductMedia } from './product-media';
import { getProductDictionary } from '../i18n/product-dictionary';

import type { Locale } from '@site/core/i18n';
import type { ProductDetails } from '@site/product/model';

export type ProductGalleryProps = {
  locale: Locale;
  name: string;
  media: ProductDetails['media'];
};

/** Media selection and failures are independent from price and purchase state. */
export function ProductGallery({ locale, name, media }: ProductGalleryProps) {
  const dictionary = getProductDictionary(locale);
  const [failedUrls, setFailedUrls] = useState<ReadonlySet<string>>(() => new Set());
  const [selectedUrl, setSelectedUrl] = useState(media[0]?.url);
  const [zoomed, setZoomed] = useState(false);
  const uniqueMedia = media.filter(
    (item, index) => item.url && media.findIndex((other) => other.url === item.url) === index,
  );
  const available = uniqueMedia.filter((item) => !failedUrls.has(item.url));
  const active = available.find((item) => item.url === selectedUrl) ?? available[0];
  const hasRail = available.length > 1;
  const failImage = (url: string) => {
    setFailedUrls((current) => new Set([...current, url]));
    setZoomed(false);
  };
  const mediaLabel = (kind: 'photo' | 'scheme') =>
    kind === 'scheme' ? dictionary.scheme : dictionary.photo;

  return (
    <section
      aria-label={dictionary.gallery}
      className={cn(
        'grid min-w-0 grid-cols-1 gap-3',
        hasRail && 'lg:grid-cols-[3.75rem_minmax(0,1fr)]',
      )}
    >
      {hasRail && (
        <div
          role="group"
          aria-label={dictionary.mediaChoices}
          className="row-start-2 flex gap-2 lg:col-start-1 lg:row-start-1 lg:flex-col"
        >
          {available.map((item) => (
            <button
              key={item.url}
              type="button"
              aria-label={mediaLabel(item.kind)}
              aria-pressed={active?.url === item.url}
              onClick={() => {
                setSelectedUrl(item.url);
                setZoomed(false);
              }}
              className={cn(
                'relative size-15 shrink-0 overflow-hidden rounded-lg border bg-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                active?.url === item.url
                  ? 'border-brand'
                  : 'border-border hover:border-muted-foreground',
              )}
            >
              <ProductMedia item={item} alt="" thumbnail onError={() => failImage(item.url)} />
            </button>
          ))}
        </div>
      )}
      <div
        className={cn(
          'relative col-start-1 row-start-1 aspect-[1.16] min-w-0 overflow-hidden rounded-xl border border-border bg-white lg:min-h-95',
          hasRail && 'lg:col-start-2',
        )}
      >
        {active ? (
          <>
            <ProductMedia
              key={active.url}
              item={active}
              alt={`${name} — ${mediaLabel(active.kind)}`}
              zoomed={zoomed}
              preload={active.url === uniqueMedia[0]?.url}
              onError={() => failImage(active.url)}
            />
            <span
              aria-live="polite"
              className="absolute bottom-4 left-4 rounded bg-white/90 px-1 text-xs tabular-nums text-[#5C6459]"
            >
              {available.findIndex((item) => item.url === active.url) + 1} / {available.length}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={zoomed ? dictionary.zoomOut : dictionary.zoomIn}
              aria-pressed={zoomed}
              onClick={() => setZoomed((value) => !value)}
              className="absolute right-3 bottom-3 border-[#E3E6DF] bg-white text-[#0F110F] hover:bg-[#F4F5F2]"
            >
              {zoomed ? (
                <ZoomOutIcon aria-hidden strokeWidth={1.75} />
              ) : (
                <ZoomInIcon aria-hidden strokeWidth={1.75} />
              )}
            </Button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-sm text-[#5C6459]">
            <PackageIcon aria-hidden className="size-14 opacity-60" strokeWidth={1.75} />
            <p>{uniqueMedia.length ? dictionary.unavailableImages : dictionary.noPhoto}</p>
          </div>
        )}
      </div>
      {active && (
        <p className="col-span-full flex items-center gap-1.5 text-xs text-muted-foreground">
          <ImageIcon aria-hidden className="size-3.5" strokeWidth={1.75} />
          {mediaLabel(active.kind)}
        </p>
      )}
    </section>
  );
}
