import { CatalogHubPage } from '@site/catalog/feature';
import { buildCatalogHubMetadata } from '@site/catalog/seo';
import { isLocale } from '@site/core/i18n';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/catalog'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildCatalogHubMetadata(locale) : {};
}

export default async function Page({ params }: PageProps<'/[locale]/catalog'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CatalogHubPage locale={locale} />;
}
