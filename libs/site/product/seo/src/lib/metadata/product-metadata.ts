import { COMPANY, siteConfig } from '@site/core/config';
import { LOCALES, LOCALE_LANGUAGE_TAGS, OPEN_GRAPH_LOCALES } from '@site/core/i18n';
import { DEFAULT_OG_IMAGE, buildPageMetadata } from '@site/core/seo';

import { absoluteProductUrl, canonicalProductUrl } from '../urls/product-seo-urls';

import type { ProductSeoInput } from '../inputs/product-seo-input';
import type { SiteConfig } from '@site/core/config';
import type { Metadata } from 'next';

/** Replace the core helper's unconditional language map with confirmed product versions. */
export function buildProductMetadata(
  input: ProductSeoInput,
  config: SiteConfig = siteConfig,
): Metadata {
  const title = input.title || `${input.name} — арт. ${input.sku}`;
  const description =
    input.description ||
    (input.locale === 'uk'
      ? `${input.name}. Артикул ${input.sku}. Інформація про товар, ціну та наявність у ${COMPANY.name}.`
      : `${input.name}. Артикул ${input.sku}. Информация о товаре, цене и наличии в ${COMPANY.name}.`);
  const base = buildPageMetadata(
    { locale: input.locale, path: input.path, title, description },
    config,
  );
  const canonical = canonicalProductUrl(input, config);
  const languages: Record<string, string> = { [LOCALE_LANGUAGE_TAGS[input.locale]]: canonical };
  for (const locale of LOCALES) {
    const path = input.languagePaths[locale];
    if (path) languages[LOCALE_LANGUAGE_TAGS[locale]] = absoluteProductUrl(path, config);
  }
  if (input.languagePaths.uk)
    languages['x-default'] = absoluteProductUrl(input.languagePaths.uk, config);
  const images = input.images.map((url) => ({ url }));
  return {
    ...base,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      siteName: COMPANY.name,
      title,
      description,
      url: canonical,
      locale: OPEN_GRAPH_LOCALES[input.locale],
      alternateLocale: LOCALES.filter(
        (locale) => locale !== input.locale && input.languagePaths[locale],
      ).map((locale) => OPEN_GRAPH_LOCALES[locale]),
      images: images.length ? images : [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: images.length ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(input.images.length ? { images: [...input.images] } : {}),
    },
  };
}
