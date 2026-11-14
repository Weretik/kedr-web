import { getArticlesDictionary } from '@site/content/model';
import { buttonVariants, cn } from '@site/shared/ui';
import { SearchIcon } from 'lucide-react';

import type { ArticlesQuery } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** Native GET commits a search over the full source, without retaining the old page. */
export function ArticlesSearchForm({
  locale,
  path,
  query,
}: {
  locale: Locale;
  path: string;
  query: ArticlesQuery;
}) {
  const dictionary = getArticlesDictionary(locale);
  const id = `articles-search-${locale}`;

  return (
    <form
      role="search"
      aria-label={dictionary.searchRegion}
      action={path}
      method="get"
      className="relative col-span-2 min-w-0 md:col-span-1 md:col-start-1 md:row-start-1"
    >
      <label htmlFor={id} className="sr-only">
        {dictionary.searchLabel}
      </label>
      {query.pageSize !== 10 && <input type="hidden" name="pageSize" value={query.pageSize} />}
      <input
        key={query.q}
        id={id}
        name="q"
        type="search"
        maxLength={200}
        defaultValue={query.q}
        placeholder={dictionary.searchPlaceholder}
        className="h-11 w-full min-w-0 rounded-md border border-border bg-background pr-14 pl-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
      />
      <button
        type="submit"
        aria-label={dictionary.searchSubmit}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'absolute top-0.5 right-0.5',
        )}
      >
        <SearchIcon aria-hidden className="size-4" strokeWidth={1.75} />
      </button>
    </form>
  );
}
