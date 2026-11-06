import { LOCALES, localizedPath } from '@site/core/i18n';
import { productPath } from '@site/product/model';

import { productCrumbs } from '../detail/product-crumbs';
import { productSeoInput } from '../mapping/product-seo-input';

import type { Locale } from '@site/core/i18n';
import type { ProductDetails, SiteModel } from '@site/product/model';
import type { ProductSeoInput } from '@site/product/seo';

/**
 * The model's canonical address has no query and one slug in both languages; the title and description come from
 * «Вітрина сайту», else the model name and its short text.
 */
export function modelSeoInput(
  locale: Locale,
  model: SiteModel,
  product: ProductDetails,
): ProductSeoInput {
  const path = productPath(model.slug);
  const crumbs = productCrumbs(locale, product).slice(0, -1);
  crumbs.push({ name: model.name, href: localizedPath(locale, path) });
  const languagePaths = Object.fromEntries(
    LOCALES.map((item) => [item, localizedPath(item, path)]),
  ) as Partial<Record<Locale, string>>;
  return {
    ...productSeoInput(locale, product, crumbs, languagePaths),
    path,
    name: model.name,
    title: model.texts.seoTitle || model.name,
    ...(model.texts.seoDescription || model.texts.shortDescription
      ? { description: model.texts.seoDescription || model.texts.shortDescription }
      : {}),
  };
}
