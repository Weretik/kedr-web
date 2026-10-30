import { SearchIcon } from 'lucide-react';

import type { HomeDictionary } from '../i18n/home-dictionary';
import type { Locale } from '@site/core/i18n';

type HomeHeroProps = {
  locale: Locale;
  dictionary: HomeDictionary;
  /** Localized all-products listing that receives `?search=`. */
  searchAction: string;
};

/** First screen: the page's only H1, a lead paragraph, and search that works without JavaScript. */
export function HomeHero({ locale, dictionary, searchAction }: HomeHeroProps) {
  const inputId = `home-search-${locale}`;

  return (
    <div className="flex flex-col justify-center gap-5">
      <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
        {dictionary.heading}
      </h1>
      <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{dictionary.lead}</p>
      <form
        role="search"
        aria-label={dictionary.searchLabel}
        action={searchAction}
        method="get"
        className="flex max-w-xl gap-2"
      >
        <label htmlFor={inputId} className="sr-only">
          {dictionary.searchLabel}
        </label>
        <div className="relative flex-1">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <input
            id={inputId}
            name="search"
            type="search"
            required
            placeholder={dictionary.searchPlaceholder}
            aria-describedby={`${inputId}-hint`}
            autoComplete="off"
            className="h-12 w-full rounded-lg border border-border bg-background pr-3 pl-10 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>
        <button
          type="submit"
          className="h-12 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {dictionary.searchSubmit}
        </button>
      </form>
      <p id={`${inputId}-hint`} className="-mt-2 text-sm text-muted-foreground">
        {dictionary.searchHint}
      </p>
    </div>
  );
}
