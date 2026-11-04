import { renderCartQuickAddAction } from '@site/cart/feature';
import { SearchPage, generateSearchMetadata } from '@site/catalog/feature';
import { isLocale } from '@site/core/i18n';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<'/[locale]/search'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? generateSearchMetadata(locale, searchParams) : {};
}

export default async function Page({ params, searchParams }: PageProps<'/[locale]/search'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <SearchPage
      locale={locale}
      searchParams={searchParams}
      renderPurchaseAction={renderCartQuickAddAction.bind(null, locale)}
    />
  );
}
