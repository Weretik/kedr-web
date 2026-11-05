import { RequisitesPage } from '@site/content/feature';
import { buildRequisitesMetadata } from '@site/content/seo';
import { isLocale } from '@site/core/i18n';
import { withPageSeo } from '@site/shared/page-seo';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

type RequisitesPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: RequisitesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return withPageSeo(locale, 'Requisites', buildRequisitesMetadata(locale));
}

export default async function Page({ params }: RequisitesPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <RequisitesPage locale={locale} />;
}
