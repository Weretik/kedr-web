'use client';

import { localizedPath } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import { SearchIcon, ShoppingCartIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { useHeaderCondensed } from './collapsing-header';
import { HeaderSearch } from './header-search';
import { SHELL_PATHS } from '../navigation/site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { Locale } from '@site/core/i18n';

const iconButton = 'grid size-9 place-items-center rounded-md hover:bg-muted';

/**
 * Search and cart icons for the condensed desktop header. They fade in once the upper rows have scrolled away;
 * the search icon opens the search form under the bar.
 */
export function CompactActions({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
}) {
  const condensed = useHeaderCondensed();
  const [searchOpen, setSearchOpen] = useState(false);
  const open = condensed && searchOpen;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector('input')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div
        className={cn(
          'invisible flex translate-y-1 items-center gap-1 opacity-0 transition duration-300 ease-out',
          'group-data-[condensed]/header:visible group-data-[condensed]/header:translate-y-0 group-data-[condensed]/header:opacity-100',
        )}
      >
        <button
          type="button"
          onClick={() => setSearchOpen((value) => !value)}
          aria-label={open ? dictionary.closeSearch : dictionary.searchLabel}
          title={dictionary.searchLabel}
          aria-expanded={open}
          className={cn(iconButton, open && 'bg-muted')}
        >
          {open ? (
            <XIcon className="size-4" strokeWidth={1.75} />
          ) : (
            <SearchIcon className="size-4" strokeWidth={1.75} />
          )}
        </button>
        <Link
          href={localizedPath(locale, SHELL_PATHS.cart)}
          rel="nofollow"
          aria-label={dictionary.cart}
          title={dictionary.cart}
          className={iconButton}
        >
          <ShoppingCartIcon className="size-4" strokeWidth={1.75} />
        </Link>
      </div>
      {open && (
        <div
          ref={panelRef}
          className="absolute inset-x-0 top-full border-b border-border bg-background/95 backdrop-blur"
        >
          <div className="mx-auto max-w-[90rem] px-4 py-3 lg:px-6">
            <HeaderSearch locale={locale} dictionary={dictionary} idSuffix="compact" />
          </div>
        </div>
      )}
    </>
  );
}
