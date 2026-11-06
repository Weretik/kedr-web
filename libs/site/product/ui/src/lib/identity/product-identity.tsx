import { cn } from '@site/shared/ui';
import Link from 'next/link';

import { SkuCopyButton } from './sku-copy-button';
import { getProductDictionary } from '../i18n/product-dictionary';

import type { Locale } from '@site/core/i18n';
import type { ProductDetails } from '@site/product/model';

/** Product identity stays in the server HTML; only copying is interactive. */
export function ProductIdentity({
  locale,
  product,
  categoryHref,
  title,
}: {
  locale: Locale;
  product: ProductDetails;
  categoryHref: string | null;
  /** The model name; the chosen product's own name then follows the heading. */
  title?: string;
}) {
  const dictionary = getProductDictionary(locale);
  return (
    <div className="min-w-0">
      <div className="mb-2 flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <span>{dictionary.sku}</span>
          <span className="font-mono select-text [overflow-wrap:anywhere]">{product.sku}</span>
          <SkuCopyButton key={product.sku} locale={locale} sku={product.sku} />
        </div>
        <p
          className={cn(
            'inline-flex items-center gap-1.5 text-xs',
            product.inStock ? 'text-brand-text' : 'text-muted-foreground',
          )}
        >
          <span
            aria-hidden
            className={cn(
              'size-1.5 shrink-0 rounded-full',
              product.inStock ? 'bg-brand' : 'bg-muted-foreground/60',
            )}
          />
          {product.inStock ? dictionary.inStock : dictionary.outOfStock}
        </p>
      </div>
      <h1 className="text-[1.625rem] leading-[1.18] font-bold tracking-tight text-balance [overflow-wrap:anywhere] lg:text-[2rem]">
        {title ?? product.name}
      </h1>
      {title && title !== product.name && (
        <p className="mt-2 text-sm [overflow-wrap:anywhere]">
          <span className="sr-only">{dictionary.modelProduct}: </span>
          {product.name}
        </p>
      )}
      {product.categoryName && (
        <p className="mt-3 text-sm text-muted-foreground [overflow-wrap:anywhere]">
          {dictionary.category}:{' '}
          {categoryHref ? (
            <Link
              href={categoryHref}
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              {product.categoryName}
            </Link>
          ) : (
            product.categoryName
          )}
        </p>
      )}
    </div>
  );
}
