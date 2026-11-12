import { renderCartQuickAddAction } from '@site/cart/feature';
import {
  CategoryPage,
  generateCategoryMetadata,
  getCategoryStaticParams,
} from '@site/catalog/feature';
import { LOCALES, isLocale } from '@site/core/i18n';
import { withSiteSharePicture } from '@site/shared/seo-settings';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

// The category is resolved before streaming so a missing slug answers 404 and an old slug 308.

export async function generateStaticParams() {
  const params = await Promise.all(
    LOCALES.map(async (locale) =>
      (await getCategoryStaticParams(locale)).map(({ slug }) => ({ locale, slug })),
    ),
  );
  return params.flat();
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<'/[locale]/catalog/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  return isLocale(locale)
    ? withSiteSharePicture(generateCategoryMetadata(locale, slug, searchParams))
    : {};
}

export default async function Page({
  params,
  searchParams,
}: PageProps<'/[locale]/catalog/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <CategoryPage
      locale={locale}
      slug={slug}
      searchParams={searchParams}
      renderPurchaseAction={renderCartQuickAddAction.bind(null, locale)}
    />
  );
}
