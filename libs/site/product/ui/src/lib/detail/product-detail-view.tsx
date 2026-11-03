import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { ProductFacts } from '../details/product-facts';
import { ProductGallery } from '../gallery/product-gallery';
import { getProductDictionary } from '../i18n/product-dictionary';
import { ProductIdentity } from '../identity/product-identity';
import { ProductPurchasePanel } from '../purchase/product-purchase-panel';
import {
  ProductHelp,
  ProductServiceDetails,
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
};

/** Server composition; only gallery and clipboard are client leaves. */
export function ProductDetailView({
  locale,
  product,
  categoryHref,
  breadcrumbs,
  purchaseAction,
}: ProductDetailViewProps) {
  const dictionary = getProductDictionary(locale);
  return (
    <article className="min-w-0 pt-4 pb-8 sm:pt-5">
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
          <ProductPurchasePanel locale={locale} product={product} purchaseAction={purchaseAction} />
          <ProductWholesaleCallout locale={locale} />
          <ProductServiceLinks locale={locale} />
        </div>
      </div>
      <nav
        aria-label={dictionary.productInformation}
        className="mt-8 flex min-w-0 flex-wrap gap-x-6 gap-y-1 border-b border-border text-sm font-semibold"
      >
        <a
          href="#product-facts"
          className="border-b-2 border-brand py-3 underline-offset-4 hover:underline"
        >
          {dictionary.aboutProduct}
        </a>
        <a href="#product-delivery" className="py-3 underline-offset-4 hover:underline">
          {dictionary.deliveryAndPayment}
        </a>
        <a href="#product-returns" className="py-3 underline-offset-4 hover:underline">
          {dictionary.returns}
        </a>
      </nav>
      <div className="grid min-w-0 gap-7 pt-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-8">
        <ProductFacts locale={locale} product={product} />
        <ProductServiceDetails locale={locale} />
      </div>
      <ProductHelp locale={locale} />
    </article>
  );
}
