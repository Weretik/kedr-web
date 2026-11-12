import { PrivacyPage } from '@site/content/feature';
import { buildPrivacyMetadata } from '@site/content/seo';
import { isLocale } from '@site/core/i18n';
import { withPageSeo } from '@site/shared/page-seo';
import { withSiteSharePicture } from '@site/shared/seo-settings';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

type PrivacyPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? withSiteSharePicture(withPageSeo(locale, 'PrivacyPolicy', buildPrivacyMetadata(locale)))
    : {};
}

export default async function Page({ params }: PrivacyPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PrivacyPage locale={locale} />;
}
