import { productPath } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import { PackageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '../format/price';
import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { ProductSummary } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

// Two columns on phones, three on tablets, four on desktops inside the 80rem container.
const PHOTO_SIZES = '(min-width: 1024px) 18rem, (min-width: 640px) 33vw, 50vw';

/** Product tile: photo or placeholder, badges, name link, and retail price. */
export function ProductCard({ locale, product }: { locale: Locale; product: ProductSummary }) {
  const dictionary = getCatalogDictionary(locale);
  const href = localizedPath(locale, productPath(product.slug));

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-border p-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {product.photoUrl ? (
          <Image
            src={product.photoUrl}
            alt={product.name}
            fill
            sizes={PHOTO_SIZES}
            className="object-contain p-3"
          />
        ) : (
          <PackageIcon
            aria-hidden
            className="absolute inset-0 m-auto size-10 text-muted-foreground/60"
            strokeWidth={1.75}
          />
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          {product.isNew && (
            <span className="rounded bg-brand px-1.5 py-0.5 text-xs font-medium text-brand-foreground">
              {dictionary.isNew}
            </span>
          )}
          {product.isSale && (
            <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
              {dictionary.isSale}
            </span>
          )}
        </div>
      </div>
      <h3 className="mt-3 line-clamp-3 text-sm font-medium">
        <Link href={href} className="after:absolute after:inset-0 group-hover:underline">
          {product.name}
        </Link>
      </h3>
      <p className="mt-auto pt-2 text-base font-semibold">
        {product.price === null ? (
          <span className="text-sm font-normal text-muted-foreground">
            {dictionary.priceOnRequest}
          </span>
        ) : (
          <>
            <span className="sr-only">{dictionary.retailPrice}: </span>
            {formatPrice(product.price, locale)}
          </>
        )}
      </p>
    </article>
  );
}
