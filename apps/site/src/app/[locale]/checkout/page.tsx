import { CheckoutPage } from '@site/cart/feature';
import { buildCheckoutMetadata } from '@site/cart/seo';
import { isLocale } from '@site/core/i18n';
import { withSiteSharePicture } from '@site/shared/seo-settings';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

type CheckoutRouteProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: CheckoutRouteProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return withSiteSharePicture(buildCheckoutMetadata(locale));
}

export default async function Page({ params }: CheckoutRouteProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CheckoutPage locale={locale} />;
}
