import { renderCartPurchaseAction } from '@site/cart/feature';
import { isLocale } from '@site/core/i18n';
import { ProductPage, getProductMetadata, getProductStaticParams } from '@site/product/feature';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

type ProductRouteProps = { params: Promise<{ locale: string; slug: string }> };

// Resolve the product before streaming to preserve real 404/308/500 responses.
export const instant = false;
export const generateStaticParams = getProductStaticParams;

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return getProductMetadata(locale, slug);
}

export default async function Page({ params }: ProductRouteProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <ProductPage
      locale={locale}
      slug={slug}
      renderPurchaseAction={renderCartPurchaseAction.bind(null, locale)}
    />
  );
}
