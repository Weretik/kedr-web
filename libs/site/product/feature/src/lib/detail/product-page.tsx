import { JsonLd } from '@site/core/seo';
import { buildProductBreadcrumbJsonLd, buildProductJsonLd } from '@site/product/seo';
import { ProductDetailView } from '@site/product/ui';

import { productCrumbs } from './product-crumbs';
import { productCategoryHref } from '../mapping/product-category-href';
import { productSeoInput } from '../mapping/product-seo-input';
import { getProductLanguagePaths } from '../routing/product-language-paths';
import { loadProductOrRespond } from '../routing/product-response';

import type { Locale } from '@site/core/i18n';

/** Resolve identity/status before rendering, preserving the existing public site shell. */
export async function ProductPage({ locale, slug }: { locale: Locale; slug: string }) {
  const product = await loadProductOrRespond(locale, slug);
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
      />
      <JsonLd data={[buildProductJsonLd(seo), buildProductBreadcrumbJsonLd(seo)]} />
    </>
  );
}
