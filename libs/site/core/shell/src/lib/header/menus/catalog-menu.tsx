import { localizedPath } from '@site/core/i18n';
import { LayoutGridIcon } from 'lucide-react';
import Link from 'next/link';

import { DropdownMenu } from './dropdown-menu';
import { SHELL_PATHS } from '../../navigation/site-navigation';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { ShellLink } from '../../navigation/catalog-navigation';
import type { Locale } from '@site/core/i18n';

type CatalogMenuProps = {
  locale: Locale;
  dictionary: ShellDictionary;
  links: readonly ShellLink[];
};

/** Fallback "Каталог" button with sections and the wholesale block, used when no catalog mega menu is passed. */
export function CatalogMenu({ locale, dictionary, links }: CatalogMenuProps) {
  return (
    <DropdownMenu
      label={
        <>
          <LayoutGridIcon className="size-4" strokeWidth={1.75} />
          {dictionary.catalog}
        </>
      }
      triggerClassName="h-10 bg-brand px-4 text-brand-foreground hover:bg-brand/90"
      panelClassName="grid w-[min(40rem,calc(100vw-2rem))] gap-3 sm:grid-cols-[1fr_14rem]"
    >
      <ul className="grid gap-1 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.key}>
            <Link
              href={localizedPath(locale, link.path)}
              className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li className="sm:col-span-2">
          <Link
            href={localizedPath(locale, SHELL_PATHS.catalog)}
            className="block rounded-md px-3 py-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            {dictionary.allCategories}
          </Link>
        </li>
      </ul>
      <Link
        href={localizedPath(locale, SHELL_PATHS.wholesale)}
        className="flex flex-col justify-end gap-1 rounded-lg bg-primary p-4 text-primary-foreground"
      >
        <span className="text-sm font-semibold">{dictionary.wholesale}</span>
        <span className="text-xs opacity-80">{dictionary.wholesaleNote}</span>
      </Link>
    </DropdownMenu>
  );
}
