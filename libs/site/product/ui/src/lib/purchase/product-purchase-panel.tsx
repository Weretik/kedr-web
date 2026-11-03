import { COMPANY } from '@site/core/config';
import { LOCALE_LANGUAGE_TAGS, localizedPath } from '@site/core/i18n';
import { getProductPurchaseMode } from '@site/product/model';
import { Button } from '@site/shared/ui';
import { MinusIcon, PackageIcon, PhoneIcon, PlusIcon, ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';

import { getProductDictionary } from '../i18n/product-dictionary';

import type { Locale } from '@site/core/i18n';
import type { ProductDetails } from '@site/product/model';
import type { ReactNode } from 'react';

type ProductPurchasePanelProps = {
  locale: Locale;
  product: ProductDetails;
  purchaseAction?: ReactNode;
};

/** Server-rendered price and pack; the real cart owner supplies its action separately. */
export function ProductPurchasePanel({
  locale,
  product,
  purchaseAction,
}: ProductPurchasePanelProps) {
  const dictionary = getProductDictionary(locale);
  const mode = getProductPurchaseMode(product);
  const price =
    product.price !== null && product.price > 0
      ? new Intl.NumberFormat(LOCALE_LANGUAGE_TAGS[locale], {
          minimumFractionDigits: Number.isInteger(product.price) ? 0 : 2,
          maximumFractionDigits: 2,
        }).format(product.price)
      : null;

  return (
    <section aria-label={dictionary.retailPrice} className="mt-6 border-t border-border pt-5">
      <p className="text-xs text-muted-foreground">{dictionary.retailPrice}</p>
      <p
        className={
          price
            ? 'mt-1 min-w-0 text-4xl leading-tight font-bold tracking-tight break-words tabular-nums [overflow-wrap:anywhere]'
            : 'mt-1 text-2xl font-semibold tracking-tight'
        }
      >
        {price === null ? (
          dictionary.priceOnRequest
        ) : (
          <>
            {price} <span className="text-2xl font-medium">₴</span>
          </>
        )}
      </p>
      {product.quantityInPack !== null && product.quantityInPack > 0 && (
        <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
          <PackageIcon aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>
            {dictionary.pack}: {product.quantityInPack} {dictionary.units}
          </span>
        </p>
      )}
      <div className="mt-5">
        {mode === 'cart' ? (
          (purchaseAction ?? (
            <div className="grid min-w-0 grid-cols-[6.5rem_minmax(0,1fr)] gap-2.5">
              <div
                role="group"
                aria-label={dictionary.quantity}
                className="grid h-12 grid-cols-[2rem_minmax(0,1fr)_2rem] items-center rounded-lg border border-border"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled
                  aria-label={dictionary.decrease}
                >
                  <MinusIcon aria-hidden strokeWidth={1.75} />
                </Button>
                <output className="text-center text-sm tabular-nums">1</output>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled
                  aria-label={dictionary.increase}
                >
                  <PlusIcon aria-hidden strokeWidth={1.75} />
                </Button>
              </div>
              <Button
                type="button"
                disabled
                className="h-12 min-w-0 rounded-lg px-3 whitespace-normal"
              >
                <ShoppingCartIcon aria-hidden strokeWidth={1.75} />
                {dictionary.addToCart}
              </Button>
            </div>
          ))
        ) : (
          <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-3">
            <Button
              asChild
              className="h-auto min-h-12 max-w-full rounded-lg py-3 whitespace-normal"
            >
              <Link href={localizedPath(locale, '/contacts')}>
                {mode === 'request-stock' ? dictionary.requestStock : dictionary.requestPrice}
              </Link>
            </Button>
            <a
              href={`tel:${COMPANY.phone.e164}`}
              className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <PhoneIcon aria-hidden className="size-4" strokeWidth={1.75} />
              {COMPANY.phone.display}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
