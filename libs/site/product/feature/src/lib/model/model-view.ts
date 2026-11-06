import { localizedPath } from '@site/core/i18n';
import {
  getProductPurchaseMode,
  inStockAlternatives,
  modelAxisOptions,
  modelSelectionQuery,
  productPath,
  selectionLabel,
} from '@site/product/model';

import type { Locale } from '@site/core/i18n';
import type { SiteModel, SiteModelProduct } from '@site/product/model';
import type { ModelVariantGroupView } from '@site/product/ui';

/** A variants-table row; the app hands it to the cart owner without a product import there. */
export type ModelVariantRow = {
  productId: string;
  title: string;
  unitPrice: number | null;
  currency: 'UAH';
  slug: string;
  imageUrl?: string;
  available: boolean;
  details: string;
  href: string;
  current: boolean;
};

const axisOrder = (model: SiteModel) => model.axes.map((axis) => axis.slug);

export const variantHref = (locale: Locale, model: SiteModel, product: SiteModelProduct) =>
  localizedPath(locale, productPath(model.slug)) +
  modelSelectionQuery(product.selection, axisOrder(model));

export function modelVariantGroups(
  locale: Locale,
  model: SiteModel,
  current: SiteModelProduct,
): ModelVariantGroupView[] {
  return modelAxisOptions(model, current).map(({ axis, options }) => ({
    slug: axis.slug,
    name: axis.name,
    display: axis.display,
    options: options.map(({ target, ...option }) => ({
      ...option,
      href: variantHref(locale, model, target),
    })),
  }));
}

export function modelAlternativeLinks(locale: Locale, model: SiteModel, current: SiteModelProduct) {
  return inStockAlternatives(model, current).map((product) => ({
    href: variantHref(locale, model, product),
    label: selectionLabel(model, product) || product.name,
  }));
}

export function modelVariantRows(
  locale: Locale,
  model: SiteModel,
  current: SiteModelProduct,
): ModelVariantRow[] {
  return model.products.map((product) => ({
    productId: product.sku,
    title: product.name,
    unitPrice: product.price,
    currency: 'UAH',
    slug: product.slug,
    ...(product.photoUrl ? { imageUrl: product.photoUrl } : {}),
    available: getProductPurchaseMode(product) === 'cart',
    details: selectionLabel(model, product),
    href: variantHref(locale, model, product),
    current: product.slug === current.slug,
  }));
}
