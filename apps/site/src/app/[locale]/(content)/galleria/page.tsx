import { GalleryPage } from '@site/content/feature';
import { buildGalleryMetadata } from '@site/content/seo';
import { isLocale } from '@site/core/i18n';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

type GalleryPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return buildGalleryMetadata(locale);
}

export default async function Page({ params }: GalleryPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <GalleryPage locale={locale} />;
}
