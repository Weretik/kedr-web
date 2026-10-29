import { isLocale } from '@site/core/i18n';
import { JsonLd, buildPageMetadata, buildWebSiteJsonLd } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

// Shell placeholder: the home feature (step 2 of the migration plan) replaces this page body.
const HOME_TEXT: Record<
  Locale,
  { title: string; description: string; heading: string; note: string }
> = {
  uk: {
    title: 'Дверна фурнітура оптом і в роздріб — Class Kedr',
    description:
      'Class Kedr: завіси, замки, ручки, циліндри та міжкімнатні механізми оптом і в роздріб з доставкою по Україні.',
    heading: 'Дверна фурнітура оптом і в роздріб',
    note: 'Новий сайт у розробці: тут з’являться каталог, товари та кошик.',
  },
  ru: {
    title: 'Дверная фурнитура оптом и в розницу — Class Kedr',
    description:
      'Class Kedr: петли, замки, ручки, цилиндры и межкомнатные механизмы оптом и в розницу с доставкой по Украине.',
    heading: 'Дверная фурнитура оптом и в розницу',
    note: 'Новый сайт в разработке: здесь появятся каталог, товары и корзина.',
  },
};

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, description } = HOME_TEXT[locale];
  return buildPageMetadata({ locale, path: '/', title, description });
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const text = HOME_TEXT[locale];

  return (
    <section className="py-16">
      <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {text.heading}
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">{text.note}</p>
      <JsonLd data={buildWebSiteJsonLd(locale)} />
    </section>
  );
}
