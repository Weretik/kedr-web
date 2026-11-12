import { renderCartQuickAddAction } from '@site/cart/feature';
import { CategoryValuePage, generateLandingMetadata } from '@site/catalog/feature';
import { isLocale } from '@site/core/i18n';
import { withSiteSharePicture } from '@site/shared/seo-settings';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

// A color or size page of a final category («Завіси хром»); rendered on the first request and kept.

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<'/[locale]/catalog/[slug]/[value]'>): Promise<Metadata> {
  const { locale, slug, value } = await params;
  return isLocale(locale)
    ? withSiteSharePicture(generateLandingMetadata(locale, slug, value, searchParams))
    : {};
}

export default async function Page({
  params,
  searchParams,
}: PageProps<'/[locale]/catalog/[slug]/[value]'>) {
  const { locale, slug, value } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <CategoryValuePage
      locale={locale}
      slug={slug}
      value={value}
      searchParams={searchParams}
      renderPurchaseAction={renderCartQuickAddAction.bind(null, locale)}
    />
  );
}
