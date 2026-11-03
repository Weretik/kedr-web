'use client';

import { ARTICLE_PAGE_SIZES, articlesHref } from '@site/content/model';
import { Button } from '@site/shared/ui';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import type { ArticlesDictionary, ArticlesPageSize, ArticlesQuery } from '@site/content/model';

type PageSizeLabels = Pick<
  ArticlesDictionary,
  'pageSizeLabel' | 'pageSizeCaption' | 'applyPageSize' | 'updating'
>;

/** This island receives only query choices and strings, never article bodies. */
export function ArticlesPageSizeSelect({
  path,
  query,
  labels,
}: {
  path: string;
  query: ArticlesQuery;
  labels: PageSizeLabels;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={path}
      method="get"
      aria-label={labels.pageSizeLabel}
      className="flex items-center justify-end gap-2 md:col-start-2 md:row-start-1"
    >
      {query.q && <input type="hidden" name="q" value={query.q} />}
      <label className="flex items-center gap-2 text-xs sm:text-sm">
        <span aria-hidden className="whitespace-nowrap text-muted-foreground">
          {labels.pageSizeCaption}
        </span>
        <span className="sr-only">{labels.pageSizeLabel}</span>
        <select
          name="pageSize"
          value={query.pageSize}
          disabled={pending}
          aria-busy={pending}
          onChange={(event) => {
            const pageSize = Number(event.target.value) as ArticlesPageSize;
            startTransition(() =>
              router.push(articlesHref(path, { ...query, pageSize, page: 1 }), { scroll: false }),
            );
          }}
          className="h-11 min-w-17 rounded-md border border-border bg-background px-2 text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {ARTICLE_PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <noscript>
        <Button type="submit" variant="outline" size="sm">
          {labels.applyPageSize}
        </Button>
      </noscript>
      {pending && (
        <p role="status" aria-live="polite" className="sr-only">
          {labels.updating}
        </p>
      )}
    </form>
  );
}
