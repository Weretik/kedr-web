import { ReturnsPage } from '@site/content/feature';
import { buildReturnsMetadata } from '@site/content/seo';
import { isLocale } from '@site/core/i18n';
import { withPageSeo } from '@site/shared/page-seo';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

type ReturnsPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ReturnsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? withPageSeo(locale, 'ReturnsExchanges', buildReturnsMetadata(locale))
    : {};
}

export default async function Page({ params }: ReturnsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ReturnsPage locale={locale} />;
}
