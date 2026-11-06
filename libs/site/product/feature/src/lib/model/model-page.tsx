import { getProductListPage } from '@site/catalog/data-access';
import { DEFAULT_LISTING_QUERY } from '@site/catalog/model';
import { ProductGrid } from '@site/catalog/ui';
import { JsonLd } from '@site/core/seo';
import { parseModelSelection, selectModelProduct } from '@site/product/model';
import {
  buildProductBreadcrumbJsonLd,
  buildProductGroupJsonLd,
  buildProductJsonLd,
} from '@site/product/seo';
import {
  ModelAlternatives,
  ModelLead,
  ModelTexts,
  ModelVariantPicker,
  ProductDetailView,
  ProductSection,
  getProductDictionary,
} from '@site/product/ui';
import { getCompanyContacts } from '@site/shared/company';

import { loadAcceptedModel } from './model-response';
import { modelGroupSeoInput, modelSeoInput } from './model-seo';
import { modelAlternativeLinks, modelVariantGroups, modelVariantRows } from './model-view';
import { ProductPage } from '../detail/product-page';
import { productPurchaseDescriptor } from '../detail/product-purchase-descriptor';
import { productCategoryHref } from '../mapping/product-category-href';
import { loadProductOrRespond } from '../routing/product-response';

import type { ModelVariantRow } from './model-view';
import type { ProductPageProps } from '../detail/product-page';
import type { Locale } from '@site/core/i18n';
import type { ModelSearchParams, SiteModel } from '@site/product/model';
import type { ReactNode } from 'react';

export type ModelPageProps = ProductPageProps & {
  searchParams: ModelSearchParams;
  /** The cart owner's variants table with a quantity per row. */
  renderVariantsAction?: (rows: ModelVariantRow[]) => ReactNode;
};

const OTHER_MODELS = 4;

/** Up to four in-stock models of the same category except this one (R-04); none when the list is unavailable. */
async function otherModels(locale: Locale, model: SiteModel) {
  const page = await getProductListPage(
    locale,
    { categorySlug: model.categorySlug },
    { ...DEFAULT_LISTING_QUERY, inStock: true },
  );
  return (page?.items ?? []).filter((item) => item.slug !== model.slug).slice(0, OTHER_MODELS);
}

/**
 * The model page on the product route (spec site/product/002): the chosen product's photo, price and cart under the
 * model name, switchers, in-stock alternatives, all variants, texts, and other models. A product that is not in an
 * accepted model keeps the product page.
 */
export async function ModelPage({
  locale,
  slug,
  searchParams,
  renderPurchaseAction,
  renderStickyPurchaseAction,
  renderVariantsAction,
}: ModelPageProps) {
  const model = await loadAcceptedModel(locale, slug);
  if (!model)
    return ProductPage({ locale, slug, renderPurchaseAction, renderStickyPurchaseAction });

  const chosen = selectModelProduct(model, parseModelSelection(model, searchParams))!;
  const product = await loadProductOrRespond(locale, chosen.slug);
  const descriptor = productPurchaseDescriptor(product);
  const dictionary = getProductDictionary(locale);
  const [{ phone }, others] = await Promise.all([getCompanyContacts(), otherModels(locale, model)]);
  const seo = modelSeoInput(locale, model, product);
  const crumbs = seo.breadcrumbs.map(({ name, path }) => ({ name, href: path }));
  const variants = renderVariantsAction?.(modelVariantRows(locale, model, chosen));
  return (
    <>
      <ProductDetailView
        locale={locale}
        product={product}
        title={model.name}
        categoryHref={productCategoryHref(locale, product)}
        breadcrumbs={crumbs}
        phone={phone}
        purchaseAction={renderPurchaseAction?.(descriptor)}
        stickyPurchaseAction={renderStickyPurchaseAction?.(descriptor)}
        options={
          <>
            <ModelLead text={model.texts.shortDescription} />
            <ModelVariantPicker
              locale={locale}
              groups={modelVariantGroups(locale, model, chosen)}
            />
          </>
        }
        notice={
          <ModelAlternatives
            locale={locale}
            items={product.inStock ? [] : modelAlternativeLinks(locale, model, chosen)}
          />
        }
        sections={
          <>
            {variants && <ProductSection title={dictionary.allVariants}>{variants}</ProductSection>}
            <ModelTexts
              locale={locale}
              description={model.texts.description}
              characteristics={model.characteristics}
            />
            {others.length > 0 && (
              <ProductSection title={dictionary.otherModels}>
                <ProductGrid locale={locale} products={others} />
              </ProductSection>
            )}
          </>
        }
      />
      <JsonLd
        data={[
          // A model of several products is one ProductGroup with a «від» price; a single product keeps its offer.
          model.products.length > 1
            ? buildProductGroupJsonLd(modelGroupSeoInput(locale, model, seo))
            : buildProductJsonLd(seo),
          buildProductBreadcrumbJsonLd(seo),
        ]}
      />
    </>
  );
}
