import { PublicOfferPage } from '@site/content/feature';
import { buildPublicOfferMetadata } from '@site/content/seo';
import { isLocale } from '@site/core/i18n';
import { withPageSeo } from '@site/shared/page-seo';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

type PublicOfferPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PublicOfferPageProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? withPageSeo(locale, 'PublicOffer', buildPublicOfferMetadata(locale))
    : {};
}

export default async function Page({ params }: PublicOfferPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PublicOfferPage locale={locale} />;
}
