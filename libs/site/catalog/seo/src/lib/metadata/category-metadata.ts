import { categoryPath, isIndexableListing } from '@site/catalog/model';
import { pluralize } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import { CATALOG_SEO_TEXT } from './catalog-seo-text';
import { categorySubject } from './category-subject';

import type { CategoryDetails, ListingQuery } from '@site/catalog/model';
import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

export type CategoryMetadataInput = {
  locale: Locale;
  category: CategoryDetails;
  query: ListingQuery;
  /** The requested page is past the last one: `noindex`. */
  pastEnd?: boolean;
};

const formatMinPrice = (price: number | null, locale: Locale) =>
  price === null ? null : Math.floor(price).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-UA');

/**
 * Category metadata. Page 1 and `?page=N` are indexable with a self canonical; filters, sort, and view are
 * `noindex, follow` with the canonical of page 1. Admin SEO title and description replace the defaults.
 */
export function buildCategoryMetadata(input: CategoryMetadataInput, config?: SiteConfig): Metadata {
  const { locale, category, query, pastEnd = false } = input;
  const text = CATALOG_SEO_TEXT[locale];
  const indexable = isIndexableListing(query) && !pastEnd;
  const page = indexable ? query.page : 1;
  const suffix = page > 1 ? text.pageSuffix(page) : '';

  const subject = categorySubject(category);
  const title = (category.content?.seoTitle ?? text.categoryTitle(subject)) + suffix;
  const description =
    category.content?.metaDescription ??
    text.categoryDescription(
      subject,
      pluralize(locale, category.productCount, text.products),
      formatMinPrice(category.minPrice, locale),
    );

  return buildPageMetadata(
    {
      locale,
      path: categoryPath(category.slug),
      search: page > 1 ? `?page=${page}` : '',
      title,
      description,
      indexable,
    },
    config,
  );
}
