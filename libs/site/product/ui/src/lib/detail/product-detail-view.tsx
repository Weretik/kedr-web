import { formatPrice } from '@site/core/i18n';
import { getProductPurchaseMode } from '@site/product/model';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { ProductGallery } from '../gallery/product-gallery';
import { getProductDictionary } from '../i18n/product-dictionary';
import { ProductIdentity } from '../identity/product-identity';
import { ProductPurchasePanel } from '../purchase/product-purchase-panel';
import { ProductStickyBar } from '../purchase/product-sticky-bar';
import {
  ProductHelp,
  ProductServiceLinks,
  ProductWholesaleCallout,
} from '../service/product-service-links';

import type { Locale } from '@site/core/i18n';
import type { ProductDetails } from '@site/product/model';
import type { ReactNode } from 'react';

export type ProductDetailViewProps = {
  locale: Locale;
  product: ProductDetails;
  /** Category destination is resolved by the feature through the catalog owner. */
  categoryHref: string | null;
  /** The feature supplies the visible trail, including the current product as its last item. */
  breadcrumbs: Array<{ name: string; href: string }>;
  purchaseAction?: ReactNode;
  /** One-tap add for the phone buy bar; the bar is omitted without it. */
  stickyPurchaseAction?: ReactNode;
};

const PURCHASE_PANEL_ID = 'product-purchase';

/**
 * Server composition: breadcrumbs, gallery, identity, price and cart, wholesale note, short policy links, and help.
 * Gallery, clipboard, and the phone buy bar are the only client leaves.
 */
export function ProductDetailView({
  locale,
  product,
  categoryHref,
  breadcrumbs,
  purchaseAction,
  stickyPurchaseAction,
}: ProductDetailViewProps) {
  const dictionary = getProductDictionary(locale);
  const showStickyBar =
    stickyPurchaseAction != null &&
    getProductPurchaseMode(product) === 'cart' &&
    product.price !== null;
  return (
    <article className={`min-w-0 pt-4 sm:pt-5 ${showStickyBar ? 'pb-24 lg:pb-8' : 'pb-8'}`}>
      <nav aria-label={dictionary.breadcrumbs} className="mb-5 text-xs text-muted-foreground">
        <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
          {breadcrumbs.map((crumb, index) => (
            <li
              key={`${crumb.href}-${index}`}
              className="flex min-w-0 items-center gap-2 [overflow-wrap:anywhere]"
            >
              {index > 0 && (
                <ChevronRightIcon aria-hidden className="size-3 shrink-0" strokeWidth={1.75} />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span aria-current="page" className="min-w-0 text-foreground">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="min-w-0 underline-offset-4 hover:text-foreground hover:underline"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-8">
        <ProductGallery
          key={product.slug}
          locale={locale}
          name={product.name}
          media={product.media}
        />
        <div className="min-w-0">
          <ProductIdentity locale={locale} product={product} categoryHref={categoryHref} />
          <ProductPurchasePanel
            id={PURCHASE_PANEL_ID}
            locale={locale}
            product={product}
            purchaseAction={purchaseAction}
          />
          <ProductWholesaleCallout locale={locale} />
          <ProductServiceLinks locale={locale} />
        </div>
      </div>
      <ProductHelp locale={locale} />
      {showStickyBar && (
        <ProductStickyBar
          targetId={PURCHASE_PANEL_ID}
          label={dictionary.buyBar}
          price={formatPrice(locale, product.price!)}
        >
          {stickyPurchaseAction}
        </ProductStickyBar>
      )}
    </article>
  );
}
