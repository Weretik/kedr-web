import { ContactsPage } from '@site/content/feature';
import { buildContactsMetadata } from '@site/content/seo';
import { isLocale } from '@site/core/i18n';
import { withPageSeo } from '@site/shared/page-seo';
import { withSiteSharePicture } from '@site/shared/seo-settings';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

type ContactsPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ContactsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return withSiteSharePicture(withPageSeo(locale, 'Contacts', buildContactsMetadata(locale)));
}

export default async function Page({ params }: ContactsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ContactsPage locale={locale} />;
}
