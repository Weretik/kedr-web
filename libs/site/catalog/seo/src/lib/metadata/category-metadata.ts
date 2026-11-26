import {
  LANDING_MIN_MODELS,
  categoryPath,
  isIndexableListing,
  landingHeading,
  landingPath,
} from '@site/catalog/model';
import { TITLE_MAX_LENGTH } from '@site/core/config';
import { pluralize } from '@site/core/i18n';
import { buildPageMetadata } from '@site/core/seo';

import { CATALOG_SEO_TEXT } from './catalog-seo-text';
import { categorySubject } from './category-subject';

import type { CategoryDetails, ListingLanding, ListingQuery } from '@site/catalog/model';
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

/** The selling tail («— купити оптом і в роздріб») only while the title stays within the length Google shows. */
const defaultTitle = (full: string, short: string) =>
  full.length <= TITLE_MAX_LENGTH ? full : short;

const formatMinPrice = (price: number | null, locale: Locale) =>
  price === null ? null : Math.floor(price).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-UA');

/** The admin share picture in place of the site default, with the page title as its text. */
function withSharePicture(metadata: Metadata, category: CategoryDetails, title: string): Metadata {
  if (!category.shareImageUrl || !metadata.openGraph) return metadata;
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: [{ url: category.shareImageUrl, alt: title }] },
  };
}

/**
 * Category metadata. Page 1 and `?page=N` are indexable with a self canonical; filters, sort, and view are
 * `noindex, follow` with the canonical of page 1. A category closed from search is `noindex, follow` on every
 * page. Admin SEO title, description, and share picture replace the defaults.
 */
export function buildCategoryMetadata(input: CategoryMetadataInput, config?: SiteConfig): Metadata {
  const { locale, category, query, pastEnd = false } = input;
  const text = CATALOG_SEO_TEXT[locale];
  const listable = isIndexableListing(query) && !pastEnd;
  const indexable = listable && !category.isClosedFromSearch;
  const page = listable ? query.page : 1;
  const suffix = page > 1 ? text.pageSuffix(page) : '';

  const subject = categorySubject(category);
  const title =
    category.content?.seoTitle != null
      ? category.content.seoTitle + suffix
      : defaultTitle(text.categoryTitle(subject) + suffix, subject + suffix);
  const description =
    category.content?.metaDescription ??
    text.categoryDescription(
      subject,
      pluralize(locale, category.productCount, text.products),
      formatMinPrice(category.minPrice, locale),
    );

  const metadata = buildPageMetadata(
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
  return withSharePicture(metadata, category, title);
}

export type LandingMetadataInput = CategoryMetadataInput & {
  landing: ListingLanding;
};

/**
 * A value page of a final category («Завіси хром», stage 7). Indexable with a self canonical when it has at least
 * two models and no other choice; any other filter, sort, or view is `noindex, follow` with the value page's
 * canonical, and so is every value page of a category closed from search. `query` holds only the choices beyond
 * the value in the path.
 */
export function buildLandingMetadata(input: LandingMetadataInput, config?: SiteConfig): Metadata {
  const { locale, category, query, landing, pastEnd = false } = input;
  const text = CATALOG_SEO_TEXT[locale];
  const listable = isIndexableListing(query) && !pastEnd && landing.count >= LANDING_MIN_MODELS;
  const indexable = listable && !category.isClosedFromSearch;
  const page = listable ? query.page : 1;
  const suffix = page > 1 ? text.pageSuffix(page) : '';
  const heading = landingHeading(categorySubject(category), landing);
  return buildPageMetadata(
    {
      locale,
      path: landingPath(category.slug, landing.value),
      search: page > 1 ? `?page=${page}` : '',
      title: defaultTitle(text.categoryTitle(heading) + suffix, heading + suffix),
      description: text.categoryDescription(
        heading,
        pluralize(locale, landing.count, text.models),
        null,
      ),
      indexable,
    },
    config,
  );
}
