import { productPath } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import { ProductPhoto } from './product-photo';
import { ProductPrice } from './product-price';
import { StockLabel } from './stock-label';
import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { ProductSummary } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

// Two columns on phones, three on tablets, four on desktops inside the 80rem container.
const PHOTO_SIZES = '(min-width: 1024px) 18rem, (min-width: 640px) 33vw, 50vw';

/** Product tile: photo or placeholder, badges, name link, SKU, stock state, and retail price. */
export function ProductCard({ locale, product }: { locale: Locale; product: ProductSummary }) {
  const dictionary = getCatalogDictionary(locale);
  const href = localizedPath(locale, productPath(product.slug));

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-border p-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <ProductPhoto
          src={product.photoUrl}
          alt={product.name}
          sizes={PHOTO_SIZES}
          className="p-3"
          iconClassName="size-10"
        />
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
      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>
          {dictionary.sku} {product.sku}
        </span>
        <StockLabel inStock={product.inStock} dictionary={dictionary} />
      </p>
      <p className="mt-auto pt-2 text-base font-semibold">
        <ProductPrice price={product.price} locale={locale} dictionary={dictionary} />
      </p>
    </article>
  );
}
