import { JsonLd } from '@site/core/seo';
import { buildProductBreadcrumbJsonLd, buildProductJsonLd } from '@site/product/seo';
import { ProductDetailView } from '@site/product/ui';

import { productCrumbs } from './product-crumbs';
import { productPurchaseDescriptor } from './product-purchase-descriptor';
import { productCategoryHref } from '../mapping/product-category-href';
import { productSeoInput } from '../mapping/product-seo-input';
import { getProductLanguagePaths } from '../routing/product-language-paths';
import { loadProductOrRespond } from '../routing/product-response';

import type { ProductPurchaseDescriptor } from './product-purchase-descriptor';
import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

export type ProductPageProps = {
  locale: Locale;
  slug: string;
  /** Executed on the server; only the returned node reaches the detail view. */
  renderPurchaseAction?: (descriptor: ProductPurchaseDescriptor) => ReactNode;
};

/** Resolve identity/status before rendering, preserving the existing public site shell. */
export async function ProductPage({ locale, slug, renderPurchaseAction }: ProductPageProps) {
  const product = await loadProductOrRespond(locale, slug);
  const purchaseAction = renderPurchaseAction?.(productPurchaseDescriptor(product));
  const crumbs = productCrumbs(locale, product);
  const languagePaths = await getProductLanguagePaths(locale, product);
  const seo = productSeoInput(locale, product, crumbs, languagePaths);
  return (
    <>
      <ProductDetailView
        locale={locale}
        product={product}
        categoryHref={productCategoryHref(locale, product)}
        breadcrumbs={crumbs}
        purchaseAction={purchaseAction}
      />
      <JsonLd data={[buildProductJsonLd(seo), buildProductBreadcrumbJsonLd(seo)]} />
    </>
  );
}
