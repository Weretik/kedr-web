import { ArticlesPage, generateArticlesMetadata } from '@site/content/feature';
import { isLocale } from '@site/core/i18n';
import { withSiteSharePicture } from '@site/shared/seo-settings';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<'/[locale]/articles'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? withSiteSharePicture(generateArticlesMetadata(locale, searchParams))
    : {};
}

export default async function Page({ params, searchParams }: PageProps<'/[locale]/articles'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ArticlesPage locale={locale} searchParams={searchParams} />;
}
