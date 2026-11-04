import { getArticles } from '@site/content/data-access';
import {
  ARTICLES_PATH,
  articlesHref,
  buildArticlesListing,
  parseArticlesQuery,
  serializeArticlesQuery,
} from '@site/content/model';
import { buildArticlesBreadcrumbJsonLd, buildArticlesMetadata } from '@site/content/seo';
import { ArticlesContent, ArticlesHeader, ArticlesLoading } from '@site/content/ui';
import { localizedPath } from '@site/core/i18n';
import { JsonLd } from '@site/core/seo';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import type { ArticlesSearchParams } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

type ArticlesPageProps = { locale: Locale; searchParams: Promise<ArticlesSearchParams> };

/** The static frame remains prerenderable; request query is read only under Suspense. */
export function ArticlesPage({ locale, searchParams }: ArticlesPageProps) {
  return (
    <div className="space-y-7 py-5 sm:py-8 lg:py-10">
      <ArticlesHeader locale={locale} />
      <JsonLd data={buildArticlesBreadcrumbJsonLd(locale)} />
      <Suspense fallback={<ArticlesLoading locale={locale} />}>
        <ArticlesResults locale={locale} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

/** Exported within the feature for focused server integration tests, not via public index. */
export async function ArticlesResults({ locale, searchParams }: ArticlesPageProps) {
  const requested = parseArticlesQuery(await searchParams);
  const articles = await getArticles(locale);
  // An unavailable API fails the page (500) instead of publishing an empty list.
  if (!articles) throw new Error('Content API is unavailable for the article list');
  const listing = buildArticlesListing(articles, requested);
  if (requested.page !== listing.query.page) {
    redirect(articlesHref(localizedPath(locale, ARTICLES_PATH), listing.query));
  }
  return <ArticlesContent locale={locale} listing={listing} />;
}

export async function generateArticlesMetadata(
  locale: Locale,
  searchParams: Promise<ArticlesSearchParams>,
) {
  const listing = buildArticlesListing(
    (await getArticles(locale)) ?? [],
    parseArticlesQuery(await searchParams),
  );
  const search = serializeArticlesQuery(listing.query);
  return buildArticlesMetadata(locale, { ...listing.query, search: search ? '?' + search : '' });
}
