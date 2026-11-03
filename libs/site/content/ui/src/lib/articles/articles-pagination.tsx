import {
  ARTICLES_PATH,
  articlePageNumbers,
  articlesHref,
  getArticlesDictionary,
} from '@site/content/model';
import { localizedPath } from '@site/core/i18n';
import { buttonVariants, cn } from '@site/shared/ui';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import type { ArticlesListing } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

function PageArrow({
  direction,
  label,
  href,
}: {
  direction: 'previous' | 'next';
  label: string;
  href: string | null;
}) {
  const Icon = direction === 'previous' ? ChevronLeftIcon : ChevronRightIcon;
  const className = cn(buttonVariants({ variant: 'outline' }), 'h-11 min-w-11 px-3');
  const icon = <Icon aria-hidden className="size-4" strokeWidth={1.75} />;
  const text = <span className="hidden lg:inline">{label}</span>;
  const content =
    direction === 'previous' ? (
      <>
        {icon}
        {text}
      </>
    ) : (
      <>
        {text}
        {icon}
      </>
    );

  return href ? (
    <Link href={href} aria-label={label} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" disabled aria-label={label} className={className}>
      {content}
    </button>
  );
}

/** All page links exist in server HTML, including the single nonempty page. */
export function ArticlesPagination({
  locale,
  listing,
}: {
  locale: Locale;
  listing: ArticlesListing;
}) {
  const { query, total, pageCount, start, end } = listing;
  if (total === 0 || pageCount === 0) return null;
  const dictionary = getArticlesDictionary(locale);
  const path = localizedPath(locale, ARTICLES_PATH);
  const href = (page: number) => `${articlesHref(path, { ...query, page })}#articles-results`;

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground tabular-nums">
        {dictionary.range(start, end, total)}
      </p>
      <nav
        aria-label={dictionary.pagination}
        className="flex items-center justify-between gap-2 sm:justify-end"
      >
        <PageArrow
          direction="previous"
          label={dictionary.previous}
          href={query.page > 1 ? href(query.page - 1) : null}
        />
        <div className="hidden items-center gap-1 md:flex">
          {articlePageNumbers(query.page, pageCount).map((page, index) =>
            page === 'ellipsis' ? (
              <span key={`gap-${index}`} aria-hidden className="px-2 text-muted-foreground">
                …
              </span>
            ) : (
              <Link
                key={page}
                href={href(page)}
                aria-label={dictionary.page(page)}
                aria-current={page === query.page ? 'page' : undefined}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'icon' }),
                  'tabular-nums',
                  page === query.page &&
                    'border-brand bg-brand text-brand-foreground hover:bg-brand hover:text-brand-foreground',
                )}
              >
                {page}
              </Link>
            ),
          )}
        </div>
        <span
          aria-current="page"
          aria-label={`${dictionary.page(query.page)} / ${pageCount}`}
          className="min-w-20 rounded-md border border-border px-3 py-2 text-center text-sm tabular-nums md:hidden"
        >
          {dictionary.pagePosition(query.page, pageCount)}
        </span>
        <PageArrow
          direction="next"
          label={dictionary.next}
          href={query.page < pageCount ? href(query.page + 1) : null}
        />
      </nav>
    </div>
  );
}
