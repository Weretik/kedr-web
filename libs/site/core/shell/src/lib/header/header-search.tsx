import { localizedPath } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import { SearchIcon } from 'lucide-react';

import { SHELL_PATHS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

type HeaderSearchProps = { locale: Locale; dictionary: ShellDictionary; className?: string };

/**
 * Plain GET form to the catalog with `?search=`, the parameter the current storefront uses, so it works without
 * JavaScript. Suggestions and the `/` shortcut come with the search feature.
 */
export function HeaderSearch({ locale, dictionary, className }: HeaderSearchProps) {
  return (
    <form
      role="search"
      action={localizedPath(locale, SHELL_PATHS.catalog)}
      method="get"
      className={cn('relative', className)}
    >
      <label htmlFor={`site-search-${locale}`} className="sr-only">
        {dictionary.searchLabel}
      </label>
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.75}
      />
      <input
        id={`site-search-${locale}`}
        name="search"
        type="search"
        placeholder={dictionary.searchPlaceholder}
        autoComplete="off"
        className="h-10 w-full rounded-md border border-border bg-muted pr-24 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
      />
      <button
        type="submit"
        className="absolute top-1 right-1 h-8 rounded bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
      >
        {dictionary.searchSubmit}
      </button>
    </form>
  );
}
