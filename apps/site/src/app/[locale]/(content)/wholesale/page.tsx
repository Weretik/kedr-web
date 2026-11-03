import { WholesalePage } from '@site/content/feature';
import { buildWholesaleMetadata } from '@site/content/seo';
import { isLocale } from '@site/core/i18n';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

type WholesalePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: WholesalePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return buildWholesaleMetadata(locale);
}

export default async function Page({ params }: WholesalePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <WholesalePage locale={locale} />;
}
