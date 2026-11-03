import { ARTICLES_PATH, articlesHref, getArticlesDictionary } from '@site/content/model';
import { localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import { ArticleCard } from './article-card';
import { ArticlesPageSizeSelect } from './articles-page-size-select';
import { ArticlesPagination } from './articles-pagination';
import { ArticlesSearchForm } from './articles-search-form';

import type { ArticlesListing } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** Server list body; its feature renders ArticlesHeader outside the Suspense boundary. */
export function ArticlesContent({ locale, listing }: { locale: Locale; listing: ArticlesListing }) {
  const dictionary = getArticlesDictionary(locale);
  const path = localizedPath(locale, ARTICLES_PATH);
  const { query } = listing;

  return (
    <div className="min-w-0 space-y-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3">
        <ArticlesSearchForm locale={locale} path={path} query={query} />
        <p
          aria-live="polite"
          aria-atomic="true"
          className="min-w-0 text-xs text-muted-foreground sm:text-sm md:col-span-2 md:col-start-1 md:row-start-2"
        >
          {dictionary.found(listing.total)}
        </p>
        <ArticlesPageSizeSelect
          path={path}
          query={query}
          labels={{
            pageSizeLabel: dictionary.pageSizeLabel,
            pageSizeCaption: dictionary.pageSizeCaption,
            applyPageSize: dictionary.applyPageSize,
            updating: dictionary.updating,
          }}
        />
      </div>
      <div id="articles-results" className="scroll-mt-40 md:scroll-mt-20">
        {listing.items.length ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {listing.items.map((article, index) => (
              <ArticleCard key={article.id} locale={locale} article={article} eager={index === 0} />
            ))}
          </div>
        ) : (
          <section className="rounded-xl border border-border bg-muted/40 px-5 py-10 text-center sm:px-8">
            <h2 className="text-lg font-semibold">
              {query.q ? dictionary.noResultsTitle : dictionary.emptyTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {query.q ? dictionary.noResultsText : dictionary.emptyText}
            </p>
            {query.q && (
              <Link
                href={articlesHref(path, { ...query, q: '', page: 1 })}
                className="mt-5 inline-flex rounded font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {dictionary.clearSearch}
              </Link>
            )}
          </section>
        )}
      </div>
      <ArticlesPagination locale={locale} listing={listing} />
    </div>
  );
}
