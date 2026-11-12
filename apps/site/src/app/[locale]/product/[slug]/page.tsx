import {
  renderCartBulkAddAction,
  renderCartPurchaseAction,
  renderCartQuickAddAction,
} from '@site/cart/feature';
import { isLocale } from '@site/core/i18n';
import { ModelPage, getModelMetadata, getProductStaticParams } from '@site/product/feature';
import { withSiteSharePicture } from '@site/shared/seo-settings';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

type ProductRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// Resolve the model or product before streaming to preserve real 404/308/500 responses.
export const generateStaticParams = getProductStaticParams;

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return withSiteSharePicture(getModelMetadata(locale, slug));
}

export default async function Page({ params, searchParams }: ProductRouteProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <ModelPage
      locale={locale}
      slug={slug}
      searchParams={await searchParams}
      renderPurchaseAction={renderCartPurchaseAction.bind(null, locale)}
      renderStickyPurchaseAction={renderCartQuickAddAction.bind(null, locale)}
      renderVariantsAction={renderCartBulkAddAction.bind(null, locale)}
    />
  );
}
