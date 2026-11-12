import { DeliveryPaymentPage } from '@site/content/feature';
import { buildDeliveryPaymentMetadata } from '@site/content/seo';
import { isLocale } from '@site/core/i18n';
import { withPageSeo } from '@site/shared/page-seo';
import { withSiteSharePicture } from '@site/shared/seo-settings';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/delivery-and-payment'>): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? withSiteSharePicture(
        withPageSeo(locale, 'DeliveryPayment', buildDeliveryPaymentMetadata(locale)),
      )
    : {};
}

export default async function Page({ params }: PageProps<'/[locale]/delivery-and-payment'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <DeliveryPaymentPage locale={locale} />;
}
