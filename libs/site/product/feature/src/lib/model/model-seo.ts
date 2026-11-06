import { LOCALES, localizedPath } from '@site/core/i18n';
import { productPath } from '@site/product/model';

import { variantHref } from './model-view';
import { productCrumbs } from '../detail/product-crumbs';
import { productSeoInput } from '../mapping/product-seo-input';

import type { Locale } from '@site/core/i18n';
import type { ProductDetails, SiteModel } from '@site/product/model';
import type { ProductGroupSeoInput, ProductSeoInput } from '@site/product/seo';

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

const GROUP_PROPERTIES = ['color', 'size'] as const;
type GroupProperty = (typeof GROUP_PROPERTIES)[number];
const isGroupProperty = (code: string): code is GroupProperty =>
  (GROUP_PROPERTIES as readonly string[]).includes(code);

/** Every product of the model as a ProductGroup variant with its color and size (spec site/product/002 stage 7). */
export function modelGroupSeoInput(
  locale: Locale,
  model: SiteModel,
  page: ProductSeoInput,
): ProductGroupSeoInput {
  const axes = model.axes.filter((axis) => isGroupProperty(axis.code));
  return {
    page,
    groupId: model.slug,
    variesBy: axes.map((axis) => axis.code as GroupProperty),
    variants: model.products.map((product) => {
      const properties: Partial<Record<GroupProperty, string>> = {};
      for (const axis of axes) {
        const value = axis.values.find((item) => item.key === product.selection[axis.slug]);
        if (value) properties[axis.code as GroupProperty] = value.name;
      }
      return {
        name: product.name,
        sku: product.sku,
        path: variantHref(locale, model, product),
        image: product.photoUrl,
        price: product.price,
        inStock: product.inStock,
        properties,
      };
    }),
  };
}
