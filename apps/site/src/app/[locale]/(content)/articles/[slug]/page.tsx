import {
  ArticlePage,
  generateArticleMetadata,
  getArticleStaticParams,
} from '@site/content/feature';
import { isLocale } from '@site/core/i18n';
import { withSiteSharePicture } from '@site/shared/seo-settings';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return isLocale(params.locale) ? getArticleStaticParams(params.locale) : [];
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/articles/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  return isLocale(locale) ? withSiteSharePicture(generateArticleMetadata(locale, slug)) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/articles/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return <ArticlePage locale={locale} slug={slug} />;
}
